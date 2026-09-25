import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'VOLUNTEER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const volunteer = await prisma.volunteer.findFirst({
      where: { userId: user.userId },
    });

    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer profile not found' }, { status: 404 });
    }

    const sales = await prisma.sale.findMany({
      where: { volunteerId: volunteer.id },
      include: {
        bookEdition: {
          include: { book: true, language: true },
        },
      },
      orderBy: { saleDate: 'desc' },
    });

    return NextResponse.json({ sales });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'VOLUNTEER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const volunteer = await prisma.volunteer.findFirst({
      where: { userId: user.userId },
    });

    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    const activeCampaign = await prisma.campaign.findFirst({
      where: { status: 'ACTIVE' },
    });

    if (!activeCampaign) {
      return NextResponse.json(
        { error: 'No active campaign available for sales recording.' },
        { status: 400 }
      );
    }

    const { bookEditionId, quantity, sellingPrice, paymentMethod, customerReference } = await req.json();

    const saleQty = parseInt(quantity, 10);
    const price = parseFloat(sellingPrice);

    if (isNaN(saleQty) || saleQty <= 0) {
      return NextResponse.json({ error: 'Please enter a valid positive quantity.' }, { status: 400 });
    }

    // Server-side Rule Check: Verify Volunteer's allocated stock remaining
    const totalAllocatedAgg = await prisma.bookAllocation.aggregate({
      where: {
        volunteerId: volunteer.id,
        campaignId: activeCampaign.id,
        bookEditionId,
      },
      _sum: { quantity: true },
    });
    const totalAllocated = totalAllocatedAgg._sum.quantity || 0;

    const alreadySoldAgg = await prisma.sale.aggregate({
      where: {
        volunteerId: volunteer.id,
        campaignId: activeCampaign.id,
        bookEditionId,
      },
      _sum: { quantity: true },
    });
    const alreadySold = alreadySoldAgg._sum.quantity || 0;

    const returnedAgg = await prisma.returnItem.aggregate({
      where: {
        returnOrder: {
          volunteerId: volunteer.id,
          campaignId: activeCampaign.id,
          status: { in: ['APPROVED', 'RECEIVED_BY_TEMPLE', 'COMPLETED'] },
        },
        bookEditionId,
      },
      _sum: { receivedQuantity: true, approvedQuantity: true },
    });
    const returnedQty = returnedAgg._sum.receivedQuantity || returnedAgg._sum.approvedQuantity || 0;

    const availableToSell = Math.max(0, totalAllocated - alreadySold - returnedQty);

    if (saleQty > availableToSell) {
      return NextResponse.json(
        {
          error: `Insufficient allocated stock. You have only ${availableToSell} copies available to sell for this book edition.`,
        },
        { status: 400 }
      );
    }

    const totalAmount = saleQty * price;
    const saleId = `SAL-${Math.floor(1000 + Math.random() * 9000)}`;

    // Perform atomic transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const sale = await tx.sale.create({
        data: {
          saleId,
          volunteerId: volunteer.id,
          campaignId: activeCampaign.id,
          bookEditionId,
          quantity: saleQty,
          sellingPrice: price,
          totalAmount,
          paymentMethod: paymentMethod || 'UPI',
          customerReference,
        },
      });

      // Create linked payment record
      const txnId = `${paymentMethod || 'UPI'}-TXN-${Date.now()}`;
      await tx.payment.create({
        data: {
          paymentId: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
          transactionId: txnId,
          volunteerId: volunteer.id,
          campaignId: activeCampaign.id,
          saleId: sale.id,
          amount: totalAmount,
          paymentMethod: paymentMethod || 'UPI',
          status: 'VERIFIED',
          verifiedBy: 'System Auto-Verify',
        },
      });

      // Update Campaign Inventory
      await tx.inventory.updateMany({
        where: { bookEditionId, campaignId: activeCampaign.id },
        data: {
          soldStock: { increment: saleQty },
        },
      });

      // Update or Upsert Settlement record
      const currentSettlement = await tx.settlement.findUnique({
        where: {
          volunteerId_campaignId: {
            volunteerId: volunteer.id,
            campaignId: activeCampaign.id,
          },
        },
      });

      if (currentSettlement) {
        const newTotalSales = currentSettlement.totalSales + totalAmount;
        const newCollected = currentSettlement.amountCollected + totalAmount;
        const newPending = Math.max(0, newTotalSales - currentSettlement.totalPaid);
        await tx.settlement.update({
          where: { id: currentSettlement.id },
          data: {
            totalSales: newTotalSales,
            amountCollected: newCollected,
            pendingAmount: newPending,
          },
        });
      } else {
        await tx.settlement.create({
          data: {
            settlementId: `SET-${volunteer.volunteerId}`,
            volunteerId: volunteer.id,
            campaignId: activeCampaign.id,
            totalSales: totalAmount,
            amountCollected: totalAmount,
            totalPaid: totalAmount,
            pendingAmount: 0,
            status: 'COMPLETED',
          },
        });
      }

      // Log Audit
      await tx.auditLog.create({
        data: {
          userId: user.userId,
          role: 'VOLUNTEER',
          action: 'SALE_RECORDED',
          entityType: 'SALE',
          entityId: sale.id,
          newData: JSON.stringify({ saleId, quantity: saleQty, totalAmount }),
        },
      });

      return sale;
    });

    return NextResponse.json({
      success: true,
      message: 'Sale recorded successfully!',
      sale: result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
