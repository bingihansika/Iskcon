import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const returns = await prisma.return.findMany({
      include: {
        volunteer: true,
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
