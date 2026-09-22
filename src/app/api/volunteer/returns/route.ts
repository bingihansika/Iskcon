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

    const returns = await prisma.return.findMany({
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
      orderBy: { requestedDate: 'desc' },
    });

    return NextResponse.json({ returns });
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
      return NextResponse.json({ error: 'No active campaign available.' }, { status: 400 });
    }

    const { items, notes } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Please select at least one book to return.' }, { status: 400 });
    }

    const returnId = `RET-${Math.floor(1000 + Math.random() * 9000)}`;

    const returnRecord = await prisma.return.create({
      data: {
        returnId,
        volunteerId: volunteer.id,
        campaignId: activeCampaign.id,
        status: 'REQUESTED',
        notes,
        items: {
          create: items.map((it: any) => ({
            bookEditionId: it.bookEditionId,
            requestedQuantity: parseInt(it.quantity, 10),
            approvedQuantity: 0,
            receivedQuantity: 0,
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
          type: 'RETURN_REQUEST',
          title: 'Book Return Request Submitted',
          message: `${volunteer.fullName} requested return order ${returnId}.`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Book return request submitted to temple admin for verification!',
      returnRecord,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
