import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, setSessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, mobile, password, otp } = await req.json();

    let user: any = null;

    if (email) {
      const cleanEmail = String(email).trim().toLowerCase();
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: { volunteer: true },
      });

      if (!user) {
        // Auto-create user & volunteer on the fly for seamless demo testing
        const emailPrefix = cleanEmail.split('@')[0];
        const formattedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
        const isDemoAdmin = cleanEmail.includes('admin');
        const role = isDemoAdmin ? 'ADMIN' : 'VOLUNTEER';

        // Calculate next Volunteer ID
        const volunteers = await prisma.volunteer.findMany();
        let maxNum = 1004;
        for (const v of volunteers) {
          if (v.volunteerId && v.volunteerId.startsWith('VOL')) {
            const parsed = parseInt(v.volunteerId.replace('VOL', ''), 10);
            if (!isNaN(parsed) && parsed > maxNum) maxNum = parsed;
          }
        }
        const volunteerId = `VOL${maxNum + 1}`;

        const passwordHash = password ? await bcrypt.hash(password, 10) : 'iskcon123';

        user = await prisma.user.create({
          data: {
            name: formattedName,
            email: cleanEmail,
            mobile: mobile || `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
            passwordHash,
            role,
            status: 'ACTIVE',
          },
        });

        if (role === 'VOLUNTEER') {
          const volunteer = await prisma.volunteer.create({
            data: {
              volunteerId,
              userId: user.id,
              fullName: formattedName,
              email: cleanEmail,
              mobile: user.mobile,
              city: 'Hyderabad',
              address: 'Temple Road, ISKCON Centre',
              age: 25,
              preferredLanguage: 'English',
              emergencyContact: user.mobile,
              approvalStatus: 'APPROVED',
            },
          });

          const qrRef = `QR-${volunteerId}`;
          await prisma.volunteerQR.create({
            data: {
              volunteerId: volunteer.id,
              qrReference: qrRef,
              qrData: `upi://pay?pa=temple.bookstore@upi&pn=ISKCON+Temple&tr=${qrRef}&cu=INR`,
            },
          });

          user.volunteer = volunteer;
        }
      } else {
        // If user exists, ensure status is ACTIVE for demo purposes
        if (user.status !== 'ACTIVE') {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { status: 'ACTIVE' },
          });
        }
      }
    } else if (mobile) {
      const cleanMobile = String(mobile).trim();
      user = await prisma.user.findFirst({
        where: { mobile: cleanMobile },
        include: { volunteer: true },
      });

      if (!user) {
        // Auto-create user & volunteer for new mobile numbers
        const volunteers = await prisma.volunteer.findMany();
        let maxNum = 1004;
        for (const v of volunteers) {
          if (v.volunteerId && v.volunteerId.startsWith('VOL')) {
            const parsed = parseInt(v.volunteerId.replace('VOL', ''), 10);
            if (!isNaN(parsed) && parsed > maxNum) maxNum = parsed;
          }
        }
        const volunteerId = `VOL${maxNum + 1}`;
        const formattedName = `Devotee (${cleanMobile.slice(-4)})`;

        user = await prisma.user.create({
          data: {
            name: formattedName,
            email: `volunteer${volunteerId.toLowerCase()}@iskcon.org`,
            mobile: cleanMobile,
            passwordHash: 'iskcon123',
            role: 'VOLUNTEER',
            status: 'ACTIVE',
          },
        });

        const volunteer = await prisma.volunteer.create({
          data: {
            volunteerId,
            userId: user.id,
            fullName: formattedName,
            email: user.email,
            mobile: cleanMobile,
            city: 'Hyderabad',
            address: 'Temple Road',
            age: 25,
            preferredLanguage: 'English',
            approvalStatus: 'APPROVED',
          },
        });

        const qrRef = `QR-${volunteerId}`;
        await prisma.volunteerQR.create({
          data: {
            volunteerId: volunteer.id,
            qrReference: qrRef,
            qrData: `upi://pay?pa=temple.bookstore@upi&pn=ISKCON+Temple&tr=${qrRef}&cu=INR`,
          },
        });

        user.volunteer = volunteer;
      }
    } else {
      return NextResponse.json({ error: 'Please enter an email/password or mobile number' }, { status: 400 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      volunteerId: user.volunteer?.volunteerId || (user.role === 'VOLUNTEER' ? 'VOL1001' : undefined),
    });

    await setSessionToken(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        volunteerId: user.volunteer?.volunteerId || (user.role === 'VOLUNTEER' ? 'VOL1001' : undefined),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
