import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (status) where.approvalStatus = status;

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { volunteerId: { contains: search } },
        { mobile: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const volunteers = await prisma.volunteer.findMany({
      where,
      include: {
        user: true,
        qrCode: true,
        allocations: true,
        sales: true,
        payments: true,
        returns: true,
        settlements: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ volunteers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
