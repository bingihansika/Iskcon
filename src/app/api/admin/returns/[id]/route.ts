import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { status, itemReceivedCounts } = await req.json();

    const returnObj = await prisma.return.findUnique({
      where: { id: params.id },
      include: { volunteer: true, items: true },
    });

    if (!returnObj) {
      return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of returnObj.items) {
        const receivedQty = itemReceivedCounts?.[item.id] !== undefined
          ? parseInt(itemReceivedCounts[item.id], 10)
          : item.requestedQuantity;

        await tx.returnItem.update({
          where: { id: item.id },
          data: {
            approvedQuantity: item.requestedQuantity,
            receivedQuantity: receivedQty,
          },
        });

        if (receivedQty > 0) {
          // Increment returnedStock and availableStock in temple inventory
          await tx.inventory.update({
            where: {
              bookEditionId_campaignId: {
                bookEditionId: item.bookEditionId,
                campaignId: returnObj.campaignId,
              },
            },
            data: {
              returnedStock: { increment: receivedQty },
              availableStock: { increment: receivedQty },
              allocatedStock: { decrement: receivedQty },
            },
          });
        }
      }

      // Update Return Status
      await tx.return.update({
        where: { id: params.id },
        data: {
          status: status || 'COMPLETED',
          approvedDate: new Date(),
          receivedDate: new Date(),
        },
      });

      // Notify Volunteer
      await tx.notification.create({
        data: {
          userId: returnObj.volunteer.userId,
          type: 'RETURN_VERIFIED',
          title: 'Return Request Reconciled',
          message: `Your return request ${returnObj.returnId} has been verified by the temple administration.`,
        },
      });

      // Log Audit
      await tx.auditLog.create({
        data: {
          userId: user.userId,
          role: user.role,
          action: 'RETURN_RECONCILED',
          entityType: 'RETURN',
          entityId: params.id,
          newData: JSON.stringify({ returnId: returnObj.returnId, status }),
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
