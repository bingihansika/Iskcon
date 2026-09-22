import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const settlements = await prisma.settlement.findMany({
      include: {
        volunteer: true,
        campaign: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ settlements });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { settlementId, paymentAmount } = await req.json();

    const settlement = await prisma.settlement.findUnique({
      where: { id: settlementId },
      include: { volunteer: true },
    });

    if (!settlement) {
      return NextResponse.json({ error: 'Settlement record not found' }, { status: 404 });
    }

    const payVal = parseFloat(paymentAmount);
    if (isNaN(payVal) || payVal <= 0) {
      return NextResponse.json({ error: 'Enter a valid payment amount.' }, { status: 400 });
    }

    const newPaid = settlement.totalPaid + payVal;
    const newPending = Math.max(0, settlement.totalSales - newPaid);
    const newStatus = newPending === 0 ? 'COMPLETED' : 'PARTIALLY_SETTLED';

    const updated = await prisma.$transaction(async (tx) => {
      const set = await tx.settlement.update({
        where: { id: settlementId },
        data: {
          totalPaid: newPaid,
          pendingAmount: newPending,
          status: newStatus,
          settlementDate: newStatus === 'COMPLETED' ? new Date() : settlement.settlementDate,
          verifiedBy: user.name,
        },
      });

      // Notify Volunteer
      await tx.notification.create({
        data: {
          userId: settlement.volunteer.userId,
          type: 'SETTLEMENT_UPDATED',
          title: 'Settlement Payment Recorded',
          message: `Payment of ₹${payVal} received. Pending settlement balance: ₹${newPending}.`,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.userId,
          role: user.role,
          action: 'SETTLEMENT_PAYMENT_RECORDED',
          entityType: 'SETTLEMENT',
          entityId: settlementId,
          newData: JSON.stringify({ addedPaid: payVal, newPaid, newPending, status: newStatus }),
        },
      });

      return set;
    });

    return NextResponse.json({ success: true, settlement: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
