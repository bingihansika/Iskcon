import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, setSessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, mobile, password, otp } = await req.json();

    let user: any = null;

    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: { volunteer: true },
      });

      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      let valid = (user.passwordHash === password);
      if (!valid) {
        try {
          valid = await bcrypt.compare(password, user.passwordHash);
        } catch {
          valid = false;
        }
      }

      if (!valid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
    } else if (mobile) {
      user = await prisma.user.findFirst({
        where: { mobile },
        include: { volunteer: true },
      });

      if (!user) {
        return NextResponse.json({ error: 'Mobile number not registered' }, { status: 404 });
      }

      // OTP Verification simulation
      if (otp && (otp.length < 4 || (otp !== '123456' && !/^\d{6}$/.test(otp)))) {
        return NextResponse.json({ error: 'Invalid OTP code. Use 123456' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Provide email/password or mobile/OTP' }, { status: 400 });
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'Your account is suspended. Please contact temple administration.' }, { status: 403 });
    }

    if (user.status === 'INACTIVE') {
      return NextResponse.json({ error: 'Your account is pending admin approval. Please contact temple admin to activate.' }, { status: 403 });
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
