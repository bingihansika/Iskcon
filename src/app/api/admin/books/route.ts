import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const books = await prisma.book.findMany({
      include: {
        category: true,
        editions: {
          include: { language: true, inventories: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.bookCategory.findMany();
    const languages = await prisma.language.findMany();

    return NextResponse.json({ books, categories, languages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const {
      name,
      author,
      description,
      categoryId,
      coverImage,
      featured,
      price,
      initialStock,
      languageId,
      editionName,
      isbn,
    } = await req.json();

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Book name and category are required' }, { status: 400 });
    }

    const bookIdCode = `BK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create Book
    const book = await prisma.book.create({
      data: {
        bookId: bookIdCode,
        name,
        author: author || 'Srila Prabhupada',
        description: description || 'Spiritual literature published by ISKCON BBT.',
        categoryId,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        featured: Boolean(featured),
        active: true,
      },
    });

    // Create default Book Edition & Inventory
    const langId = languageId || 'lang-1';
    const edPrice = parseFloat(price) || 200;
    const edition = await prisma.bookEdition.create({
      data: {
        bookId: book.id,
        languageId: langId,
        editionName: editionName || 'Standard Hardbound Edition',
        isbn: isbn || `978-81-89574-${Math.floor(100 + Math.random() * 900)}`,
        price: edPrice,
        pages: 500,
        bookSize: 'Medium (14x21 cm)',
        active: true,
      },
    });

    const activeCampaign = await prisma.campaign.findFirst({
      where: { status: 'ACTIVE' },
    });

    if (activeCampaign) {
      const stockVal = parseInt(initialStock, 10) || 500;
      await prisma.inventory.upsert({
        where: { id: `inv-${edition.id}` },
        update: { totalStock: stockVal, availableStock: stockVal },
        create: {
          bookEditionId: edition.id,
          campaignId: activeCampaign.id,
          totalStock: stockVal,
          availableStock: stockVal,
          reservedStock: 0,
          allocatedStock: 0,
          soldStock: 0,
          returnedStock: 0,
          damagedStock: 0,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        role: user.role,
        action: 'ADD_NEW_BOOK',
        entityType: 'BOOK',
        entityId: book.id,
        newData: `Created book: ${name}`,
      },
    });

    return NextResponse.json({ success: true, message: 'Book created successfully!', book });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
