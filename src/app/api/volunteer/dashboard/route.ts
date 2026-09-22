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
      include: { qrCode: true },
    });

    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer profile not found' }, { status: 404 });
    }

    // Active Campaign
    const activeCampaign = await prisma.campaign.findFirst({
      where: { status: 'ACTIVE' },
    });

    if (!activeCampaign) {
      return NextResponse.json({
        volunteer,
        activeCampaign: null,
        metrics: {
          booksReceived: 0,
          booksSold: 0,
          booksReturned: 0,
          booksRemaining: 0,
          totalSalesAmount: 0,
          amountCollected: 0,
          amountSettled: 0,
          pendingSettlement: 0,
          booksToReturn: 0,
        },
      });
    }

    // Calculate Allocations Total
    const allocations = await prisma.bookAllocation.aggregate({
      where: {
        volunteerId: volunteer.id,
        campaignId: activeCampaign.id,
      },
      _sum: { quantity: true },
    });
    const booksReceived = allocations._sum.quantity || 0;

    // Calculate Sales Total
    const salesAgg = await prisma.sale.aggregate({
      where: {
        volunteerId: volunteer.id,
        campaignId: activeCampaign.id,
      },
      _sum: { quantity: true, totalAmount: true },
    });
    const booksSold = salesAgg._sum.quantity || 0;
    const totalSalesAmount = salesAgg._sum.totalAmount || 0;

    // Calculate Returns Total
    const returnItems = await prisma.returnItem.aggregate({
      where: {
        returnOrder: {
          volunteerId: volunteer.id,
          campaignId: activeCampaign.id,
          status: { in: ['APPROVED', 'RECEIVED_BY_TEMPLE', 'COMPLETED'] },
        },
      },
      _sum: { receivedQuantity: true, approvedQuantity: true },
    });
    const booksReturned = returnItems._sum.receivedQuantity || returnItems._sum.approvedQuantity || 0;

    // Formula: Remaining = Received - Sold - Returned
    const booksRemaining = Math.max(0, booksReceived - booksSold - booksReturned);

    // Payments & Settlement
    const paymentsAgg = await prisma.payment.aggregate({
      where: {
        volunteerId: volunteer.id,
        campaignId: activeCampaign.id,
        status: { in: ['VERIFIED', 'SUCCESSFUL'] },
      },
      _sum: { amount: true },
    });
    const amountSettled = paymentsAgg._sum.amount || 0;
    const pendingSettlement = Math.max(0, totalSalesAmount - amountSettled);

    // Recent Sales
    const recentSales = await prisma.sale.findMany({
      where: { volunteerId: volunteer.id, campaignId: activeCampaign.id },
      include: { bookEdition: { include: { book: true, language: true } } },
      orderBy: { saleDate: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      volunteer,
      activeCampaign,
      metrics: {
        booksReceived,
        booksSold,
        booksReturned,
        booksRemaining,
        totalSalesAmount,
        amountCollected: totalSalesAmount,
        amountSettled,
        pendingSettlement,
        booksToReturn: booksRemaining,
      },
      recentSales,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
