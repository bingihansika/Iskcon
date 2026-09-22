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

    const orders = await prisma.volunteerOrder.findMany({
      where: { volunteerId: volunteer.id },
      include: {
        items: {
          include: {
            bookEdition: {
              include: { book: true, language: true },
            },
          },
        },
      },
      orderBy: { orderDate: 'desc' },
    });

    return NextResponse.json({ orders });
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
      return NextResponse.json({ error: 'Book ordering is closed as there is no active campaign.' }, { status: 400 });
    }

    const { items, notes } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Please select at least one book edition to request.' }, { status: 400 });
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.volunteerOrder.create({
      data: {
        orderId,
        volunteerId: volunteer.id,
        campaignId: activeCampaign.id,
        notes,
        status: 'PENDING',
        items: {
          create: items.map((it: any) => ({
            bookEditionId: it.bookEditionId,
            requestedQuantity: parseInt(it.requestedQuantity, 10),
            approvedQuantity: 0,
          })),
        },
      },
      include: { items: true },
    });

    // Notify Admins
    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
    });

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: 'NEW_ORDER',
          title: 'New Volunteer Book Request',
          message: `${volunteer.fullName} (${volunteer.volunteerId}) submitted order ${orderId}.`,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Book order submitted successfully!', order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
