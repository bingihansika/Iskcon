import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const activeCampaign = await prisma.campaign.findFirst({
      where: { status: 'ACTIVE' },
    });

    const totalVolunteers = await prisma.volunteer.count();
    const activeVolunteers = await prisma.volunteer.count({
      where: { approvalStatus: 'APPROVED' },
    });
    const pendingApprovals = await prisma.volunteer.count({
      where: { approvalStatus: 'PENDING' },
    });

    const totalBooks = await prisma.book.count();

    // Inventory & Financial aggregations for active campaign
    let booksAllocated = 0;
    let booksSold = 0;
    let booksReturned = 0;
    let totalRevenue = 0;
    let amountCollected = 0;

    if (activeCampaign) {
      const alcAgg = await prisma.bookAllocation.aggregate({
        where: { campaignId: activeCampaign.id },
        _sum: { quantity: true },
      });
      booksAllocated = alcAgg._sum.quantity || 0;

      const salesAgg = await prisma.sale.aggregate({
        where: { campaignId: activeCampaign.id },
        _sum: { quantity: true, totalAmount: true },
      });
      booksSold = salesAgg._sum.quantity || 0;
      totalRevenue = salesAgg._sum.totalAmount || 0;

      const retAgg = await prisma.returnItem.aggregate({
        where: { returnOrder: { campaignId: activeCampaign.id } },
        _sum: { receivedQuantity: true, approvedQuantity: true },
      });
      booksReturned = retAgg._sum.receivedQuantity || retAgg._sum.approvedQuantity || 0;

      const payAgg = await prisma.payment.aggregate({
        where: { campaignId: activeCampaign.id, status: 'VERIFIED' },
        _sum: { amount: true },
      });
      amountCollected = payAgg._sum.amount || 0;
    }

    const pendingSettlement = Math.max(0, totalRevenue - amountCollected);

    // Language Inventory breakdown
    const languages = await prisma.language.findMany({
      include: {
        editions: {
          include: {
            inventories: true,
          },
        },
      },
    });

    const languageChart = languages.map((lang) => {
      let stock = 0;
      for (const ed of lang.editions) {
        for (const inv of ed.inventories) {
          stock += inv.availableStock;
        }
      }
      return { name: lang.name, stock };
    });

    // Recent Audit Logs
    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({
      activeCampaign,
      metrics: {
        totalVolunteers,
        activeVolunteers,
        pendingApprovals,
        totalBooks,
        booksAllocated,
        booksSold,
        booksReturned,
        booksRemaining: Math.max(0, booksAllocated - booksSold - booksReturned),
        totalRevenue,
        amountCollected,
        pendingSettlement,
      },
      languageChart,
      recentAuditLogs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
