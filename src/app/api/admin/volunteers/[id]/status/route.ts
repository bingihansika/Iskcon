import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { status } = await req.json();

    const volunteer = await prisma.volunteer.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    const userStatus = status === 'APPROVED' ? 'ACTIVE' : 'INACTIVE';

    await prisma.$transaction([
      prisma.volunteer.update({
        where: { id: params.id },
        data: { approvalStatus: status },
      }),
      prisma.user.update({
        where: { id: volunteer.userId },
        data: { status: userStatus },
      }),
      prisma.notification.create({
        data: {
          userId: volunteer.userId,
          type: 'VOLUNTEER_APPROVED',
          title: `Volunteer Account ${status}`,
          message:
            status === 'APPROVED'
              ? `Hare Krishna! Your volunteer registration has been approved. Your Volunteer ID is ${volunteer.volunteerId}.`
              : `Your volunteer account status has been updated to ${status}.`,
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: user.userId,
          role: user.role,
          action: 'VOLUNTEER_STATUS_UPDATE',
          entityType: 'VOLUNTEER',
          entityId: params.id,
          oldData: volunteer.approvalStatus,
          newData: status,
        },
      }),
    ]);

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
