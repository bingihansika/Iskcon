import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const {
      fullName,
      email,
      mobile,
      password,
      city,
      address,
      age,
      preferredLanguage,
      emergencyContact,
      verificationDetails,
    } = await req.json();

    if (!fullName || !email || !mobile || !password) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    // Check existing email or mobile
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { mobile }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or Mobile number is already registered' },
        { status: 400 }
      );
    }

    // Generate Next Volunteer ID (e.g. VOL1004)
    const lastVolunteer = await prisma.volunteer.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let nextNum = 1004;
    if (lastVolunteer && lastVolunteer.volunteerId.startsWith('VOL')) {
      const parsed = parseInt(lastVolunteer.volunteerId.replace('VOL', ''), 10);
      if (!isNaN(parsed)) nextNum = parsed + 1;
    }
    const volunteerId = `VOL${nextNum}`;

    const passwordHash = await bcrypt.hash(password, 10);

    // Create User & Volunteer record inside transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          name: fullName,
          email,
          mobile,
          passwordHash,
          role: 'VOLUNTEER',
          status: 'INACTIVE', // Activated upon Admin approval
        },
      });

      const volunteer = await tx.volunteer.create({
        data: {
          volunteerId,
          userId: user.id,
          fullName,
          email,
          mobile,
          city: city || 'City',
          address: address || 'Address',
          age: parseInt(age, 10) || 25,
          preferredLanguage: preferredLanguage || 'English',
          emergencyContact: emergencyContact || mobile,
          verificationDetails,
          approvalStatus: 'PENDING',
        },
      });

      // Generate static payment QR entry
      const qrRef = `QR-${volunteerId}`;
      await tx.volunteerQR.create({
        data: {
          volunteerId: volunteer.id,
          qrReference: qrRef,
          qrData: `upi://pay?pa=temple.bookstore@upi&pn=ISKCON+Temple&tr=${qrRef}&cu=INR`,
        },
      });

      // Send Admin Notification
      const admins = await tx.user.findMany({
        where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      });

      for (const admin of admins) {
        await tx.notification.create({
          data: {
            userId: admin.id,
            type: 'VOLUNTEER_REGISTRATION',
            title: 'New Volunteer Pending Approval',
            message: `${fullName} (${volunteerId}) has registered as a volunteer in ${city}.`,
          },
        });
      }

      return { user, volunteer };
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Your account is pending admin approval.',
      volunteerId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
