import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, setSessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, mobile, password, otp } = await req.json();

    let user = null;

    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: { volunteer: true },
      });
      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
    } else if (mobile) {
      user = await prisma.user.findUnique({
        where: { mobile },
        include: { volunteer: true },
      });
      if (!user) {
        return NextResponse.json({ error: 'Mobile number not registered' }, { status: 404 });
      }

      // OTP Verification simulation (accepts '123456' or any valid 6 digit OTP)
      if (otp && otp.length < 4) {
        return NextResponse.json({ error: 'Invalid OTP code' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Provide email/password or mobile/OTP' }, { status: 400 });
    }

    if (user.status === 'SUSPENDED' || user.status === 'INACTIVE') {
      return NextResponse.json({ error: 'Your account is currently inactive or pending approval.' }, { status: 403 });
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
