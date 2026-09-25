import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { status, itemApprovals } = await req.json();

    const order = await prisma.volunteerOrder.findUnique({
      where: { id: params.id },
      include: { volunteer: true, items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (status === 'APPROVED' || status === 'READY_FOR_PICKUP') {
      // Validate inventory availability for all items before allocation
      for (const item of order.items) {
        const approvedQty = itemApprovals?.[item.id] !== undefined ? parseInt(itemApprovals[item.id], 10) : item.requestedQuantity;
        if (approvedQty > 0) {
          const inv = await prisma.inventory.findUnique({
            where: {
              bookEditionId_campaignId: {
                bookEditionId: item.bookEditionId,
                campaignId: order.campaignId,
              },
            },
          });
          if (!inv || inv.availableStock < approvedQty) {
            return NextResponse.json(
              {
                error: `Insufficient inventory for book edition ${item.bookEditionId}. Available: ${inv?.availableStock || 0}, Requested/Approved: ${approvedQty}. Allocation aborted.`,
              },
              { status: 400 }
            );
          }
        }
      }

      // Perform atomic transaction
      await prisma.$transaction(async (tx: any) => {
        for (const item of order.items) {
          const approvedQty = itemApprovals?.[item.id] !== undefined ? parseInt(itemApprovals[item.id], 10) : item.requestedQuantity;

          // Update order item approved quantity
          await tx.volunteerOrderItem.update({
            where: { id: item.id },
            data: { approvedQuantity: approvedQty },
          });

          if (approvedQty > 0) {
            // Deduct available stock & increment allocated stock
            await tx.inventory.update({
              where: {
                bookEditionId_campaignId: {
                  bookEditionId: item.bookEditionId,
                  campaignId: order.campaignId,
                },
              },
              data: {
                availableStock: { decrement: approvedQty },
                allocatedStock: { increment: approvedQty },
              },
            });

            // Create Book Allocation
            await tx.bookAllocation.create({
              data: {
                allocationId: `ALC-${Math.floor(1000 + Math.random() * 9000)}`,
                volunteerId: order.volunteerId,
                campaignId: order.campaignId,
                bookEditionId: item.bookEditionId,
                quantity: approvedQty,
                issuedBy: user.name,
                status: 'RECEIVED_BY_VOLUNTEER',
              },
            });
          }
        }

        // Update Order Status
        await tx.volunteerOrder.update({
          where: { id: params.id },
          data: { status },
        });

        // Notify Volunteer
        await tx.notification.create({
          data: {
            userId: order.volunteer.userId,
            type: 'ORDER_APPROVED',
            title: `Book Request ${status}`,
            message: `Your book order ${order.orderId} has been ${status.toLowerCase().replace(/_/g, ' ')} and allocated to your portal inventory!`,
          },
        });

        // Log Audit
        await tx.auditLog.create({
          data: {
            userId: user.userId,
            role: user.role,
            action: 'ORDER_APPROVED_ALLOCATED',
            entityType: 'VOLUNTEER_ORDER',
            entityId: params.id,
            newData: JSON.stringify({ orderId: order.orderId, status }),
          },
        });
      });
    } else {
      // Rejection or Status Update only
      await prisma.volunteerOrder.update({
        where: { id: params.id },
        data: { status },
      });
    }

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
