import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('category') || '';
    const languageId = searchParams.get('language') || '';
    const featured = searchParams.get('featured') === 'true';

    const whereClause: any = {
      active: true,
    };

    if (featured) {
      whereClause.featured = true;
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { author: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (languageId) {
      whereClause.editions = {
        some: {
          languageId: languageId,
        },
      };
    }

    const books = await prisma.book.findMany({
      where: whereClause,
      include: {
        category: true,
        editions: {
          include: {
            language: true,
            inventories: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ books });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
