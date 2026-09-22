import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, setSessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { volunteer: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      volunteerId: user.volunteer?.volunteerId,
    });

    await setSessionToken(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        volunteerId: user.volunteer?.volunteerId,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
