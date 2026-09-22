import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Super Admin role required.' }, { status: 403 });
    }

    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ admins });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Super Admin required.' }, { status: 403 });
    }

    const { name, email, mobile, password, role } = await req.json();

    if (!name || !email || !mobile || !password) {
      return NextResponse.json({ error: 'Fill in all required fields.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        passwordHash,
        role: role || 'ADMIN',
        status: 'ACTIVE',
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        role: user.role,
        action: 'ADMIN_USER_CREATED',
        entityType: 'USER',
        entityId: newAdmin.id,
        newData: JSON.stringify({ email, role: newAdmin.role }),
      },
    });

    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
