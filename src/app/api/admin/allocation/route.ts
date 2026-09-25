import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const allocations = await prisma.bookAllocation.findMany({
      include: {
        volunteer: { include: { user: true } },
        bookEdition: { include: { book: true, language: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });

    const volunteers = await prisma.volunteer.findMany({
      where: { approvalStatus: 'APPROVED' },
    });

    const editions = await prisma.bookEdition.findMany({
      include: { book: true, language: true, inventories: true },
    });

    return NextResponse.json({ allocations, volunteers, editions });
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

    const { volunteerId, bookEditionId, quantity, notes } = await req.json();

    if (!volunteerId || !bookEditionId || !quantity) {
      return NextResponse.json({ error: 'Volunteer, book edition, and quantity are required' }, { status: 400 });
    }

    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    const volunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerId },
    });

    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    const edition = await prisma.bookEdition.findUnique({
      where: { id: bookEditionId },
      include: { book: true },
    });

    if (!edition) {
      return NextResponse.json({ error: 'Book edition not found' }, { status: 404 });
    }

    const activeCampaign = await prisma.campaign.findFirst({
      where: { status: 'ACTIVE' },
    });

    if (!activeCampaign) {
      return NextResponse.json({ error: 'No active campaign for book allocations' }, { status: 400 });
    }

    const allocationId = `ALC-${volunteer.volunteerId}-${Math.floor(10 + Math.random() * 90)}`;

    const allocation = await prisma.bookAllocation.create({
      data: {
        allocationId,
        volunteerId: volunteer.id,
        campaignId: activeCampaign.id,
        bookEditionId: edition.id,
        quantity: qtyNum,
        issuedBy: user.name || 'Temple Staff',
        issuedAt: new Date(),
        status: 'RECEIVED_BY_VOLUNTEER',
      },
    });

    // Send Notification to Volunteer
    await prisma.notification.create({
      data: {
        userId: volunteer.userId,
        type: 'BOOKS_ALLOCATED',
        title: 'New Books Allocated',
        message: `${qtyNum} copies of ${edition.book?.name || 'Book'} (${edition.editionName}) have been handed over to you.`,
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        role: user.role,
        action: 'BOOK_ALLOCATION_ISSUED',
        entityType: 'ALLOCATION',
        entityId: allocation.id,
        newData: `Issued ${qtyNum} copies to ${volunteer.fullName} (${volunteer.volunteerId})`,
      },
    });

    return NextResponse.json({ success: true, message: 'Book allocation recorded successfully!', allocation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
