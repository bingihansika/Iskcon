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

    const activeCampaign = await prisma.campaign.findFirst({
      where: { status: 'ACTIVE' },
    });

    if (!activeCampaign) {
      return NextResponse.json({ inventory: [] });
    }

    // Get all allocations for this volunteer
    const allocations = await prisma.bookAllocation.findMany({
      where: { volunteerId: volunteer.id, campaignId: activeCampaign.id },
      include: {
        bookEdition: {
          include: { book: true, language: true },
        },
      },
    });

    // Group by bookEditionId
    const map = new Map<string, any>();

    for (const alc of allocations) {
      const edId = alc.bookEditionId;
      if (!map.has(edId)) {
        map.set(edId, {
          bookEditionId: edId,
          bookName: alc.bookEdition.book.name,
          language: alc.bookEdition.language.name,
          editionName: alc.bookEdition.editionName,
          price: alc.bookEdition.price,
          received: 0,
          sold: 0,
          returned: 0,
          remaining: 0,
        });
      }
      map.get(edId).received += alc.quantity;
    }

    // Add Sales counts
    const sales = await prisma.sale.findMany({
      where: { volunteerId: volunteer.id, campaignId: activeCampaign.id },
    });

    for (const s of sales) {
      if (map.has(s.bookEditionId)) {
        map.get(s.bookEditionId).sold += s.quantity;
      }
    }

    // Add Returns counts
    const returnItems = await prisma.returnItem.findMany({
      where: {
        returnOrder: {
          volunteerId: volunteer.id,
          campaignId: activeCampaign.id,
          status: { in: ['APPROVED', 'RECEIVED_BY_TEMPLE', 'COMPLETED'] },
        },
      },
    });

    for (const r of returnItems) {
      if (map.has(r.bookEditionId)) {
        map.get(r.bookEditionId).returned += r.receivedQuantity || r.approvedQuantity;
      }
    }

    // Calculate Remaining = Received - Sold - Returned
    const inventoryList = Array.from(map.values()).map((item) => ({
      ...item,
      remaining: Math.max(0, item.received - item.sold - item.returned),
    }));

    return NextResponse.json({ inventory: inventoryList });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
