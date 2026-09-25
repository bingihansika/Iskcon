import React from 'react';
import { prisma } from '@/lib/prisma';
import { BookCard } from '@/components/BookCard';
import { Search, Filter, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

interface BookstorePageProps {
  searchParams: {
    search?: string;
    category?: string;
    language?: string;
    sort?: string;
  };
}

export default async function BookstorePage({ searchParams }: BookstorePageProps) {
  const search = searchParams.search || '';
  const categoryId = searchParams.category || '';
  const languageId = searchParams.language || '';
  const sort = searchParams.sort || 'newest';

  // Build prisma query
  const where: any = { active: true };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { author: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (languageId) {
    where.editions = {
      some: { languageId },
    };
  }

  const orderBy = sort === 'price_asc' ? { editions: { _count: 'asc' } } : { createdAt: 'desc' };

  const books = await prisma.book.findMany({
    where,
    include: {
      category: true,
      editions: {
        include: { language: true, inventories: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.bookCategory.findMany({ where: { active: true } });
  const languages = await prisma.language.findMany({ where: { active: true } });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-8 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            ISKCON Literature Collection
          </span>
          <h1 className="text-3xl font-serif font-bold text-maroon-900">Public Bookstore</h1>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            Browse our complete catalog of spiritual books by Srila Prabhupada and ISKCON BBT publications across 12 languages.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by book title, author, or keyword..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-saffron-500 text-sm"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              name="category"
              defaultValue={categoryId}
              className="w-full py-3 px-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-saffron-500 text-sm bg-white"
            >
              <option value="">All Categories</option>
              {(categories || []).map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <select
              name="language"
              defaultValue={languageId}
              className="w-full py-3 px-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-saffron-500 text-sm bg-white"
            >
              <option value="">All Languages</option>
              {(languages || []).map((lang: any) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Link
              href="/bookstore"
              className="px-4 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              Reset Filters
            </Link>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-sm transition"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(books || []).map((book: any) => (
            <BookCard key={book.id} book={book as any} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-amber-100 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-maroon-900">No Books Found</h3>
          <p className="text-xs text-gray-500">
            No spiritual literature matched your current search filters. Try adjusting your category or language selection.
          </p>
          <Link
            href="/bookstore"
            className="inline-block px-5 py-2.5 rounded-xl bg-saffron-600 text-white font-bold text-xs shadow-sm"
          >
            Clear Search
          </Link>
        </div>
      )}
    </div>
  );
}
