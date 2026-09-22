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
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    const campaigns = await prisma.campaign.findMany({
      orderBy: { startDate: 'desc' },
    });

    const historyList = [];

    for (const camp of campaigns) {
      const alcAgg = await prisma.bookAllocation.aggregate({
        where: { volunteerId: volunteer.id, campaignId: camp.id },
        _sum: { quantity: true },
      });
      const received = alcAgg._sum.quantity || 0;

      const salesAgg = await prisma.sale.aggregate({
        where: { volunteerId: volunteer.id, campaignId: camp.id },
        _sum: { quantity: true, totalAmount: true },
      });
      const sold = salesAgg._sum.quantity || 0;
      const totalSales = salesAgg._sum.totalAmount || 0;

      const retAgg = await prisma.returnItem.aggregate({
        where: { returnOrder: { volunteerId: volunteer.id, campaignId: camp.id, status: { in: ['APPROVED', 'RECEIVED_BY_TEMPLE', 'COMPLETED'] } } },
        _sum: { receivedQuantity: true, approvedQuantity: true },
      });
      const returned = retAgg._sum.receivedQuantity || retAgg._sum.approvedQuantity || 0;

      const settlement = await prisma.settlement.findUnique({
        where: { volunteerId_campaignId: { volunteerId: volunteer.id, campaignId: camp.id } },
      });

      if (received > 0 || sold > 0 || settlement) {
        historyList.push({
          campaignId: camp.id,
          campaignName: camp.name,
          startDate: camp.startDate,
          endDate: camp.endDate,
          status: camp.status,
          received,
          sold,
          returned,
          remaining: Math.max(0, received - sold - returned),
          totalSales,
          settled: settlement ? settlement.totalPaid : 0,
          settlementStatus: settlement ? settlement.status : 'PENDING',
        });
      }
    }

    return NextResponse.json({ history: historyList });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
