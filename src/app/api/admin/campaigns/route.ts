import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { startDate: 'desc' },
    });
    return NextResponse.json({ campaigns });
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

    const {
      name,
      startDate,
      endDate,
      registrationStart,
      registrationEnd,
      orderingStart,
      orderingEnd,
      returnDeadline,
      settlementDeadline,
    } = await req.json();

    const campaignId = `CAMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const campaign = await prisma.campaign.create({
      data: {
        campaignId,
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'ACTIVE',
        registrationStart: new Date(registrationStart || startDate),
        registrationEnd: new Date(registrationEnd || endDate),
        orderingStart: new Date(orderingStart || startDate),
        orderingEnd: new Date(orderingEnd || endDate),
        returnDeadline: new Date(returnDeadline || endDate),
        settlementDeadline: new Date(settlementDeadline || endDate),
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        role: user.role,
        action: 'CAMPAIGN_CREATED',
        entityType: 'CAMPAIGN',
        entityId: campaign.id,
        newData: JSON.stringify({ name, campaignId }),
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
