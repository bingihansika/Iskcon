import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const contents = await prisma.websiteContent.findMany();
    return NextResponse.json({ contents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { contents } = await req.json();

    if (Array.isArray(contents)) {
      for (const item of contents) {
        await prisma.websiteContent.upsert({
          where: { key: item.key },
          update: { title: item.title, content: item.content, updatedBy: user.name },
          create: { key: item.key, title: item.title, content: item.content, updatedBy: user.name },
        });
      }
    }

    // Log Audit
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        role: user.role,
        action: 'WEBSITE_CONTENT_UPDATED',
        entityType: 'WEBSITE_CONTENT',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
