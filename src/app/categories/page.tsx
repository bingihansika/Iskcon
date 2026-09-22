import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Tag, BookOpen, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await prisma.bookCategory.findMany({
    where: { active: true },
    include: {
      _count: { select: { books: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-8 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          Catalog Navigation
        </span>
        <h1 className="text-3xl font-serif font-bold text-maroon-900 mt-2">Book Categories</h1>
        <p className="text-xs text-amber-900/80 mt-1">
          Explore ISKCON publications organized by philosophical and devotional categories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/bookstore?category=${cat.id}`}
            className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm hover:shadow-lg hover:border-saffron-400 transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-saffron-600 group-hover:bg-saffron-600 group-hover:text-white transition">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-maroon-900 group-hover:text-saffron-700 transition">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {cat.description || 'Transcendental literature and commentary.'}
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-4 flex items-center justify-between text-xs font-semibold text-amber-800">
              <span>{cat._count.books} Books Available</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
