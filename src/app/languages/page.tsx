import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Globe, ChevronRight } from 'lucide-react';

export const revalidate = 0;

export default async function LanguagesPage() {
  const languages = await prisma.language.findMany({
    where: { active: true },
    include: {
      _count: { select: { editions: true } },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-8 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          Multilingual Distribution
        </span>
        <h1 className="text-3xl font-serif font-bold text-maroon-900 mt-2">Available Languages</h1>
        <p className="text-xs text-amber-900/80 mt-1">
          Srila Prabhupada's books are published in over 80 global languages. Below are supported Indian regional editions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {languages.map((lang) => (
          <Link
            key={lang.id}
            href={`/bookstore?language=${lang.id}`}
            className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm hover:shadow-lg hover:border-saffron-400 transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-saffron-50 border border-saffron-200 flex items-center justify-center text-saffron-600 group-hover:bg-saffron-600 group-hover:text-white transition">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-maroon-900 group-hover:text-saffron-700 transition">
                {lang.name}
              </h3>
              <p className="text-xs text-gray-500">Language Code: {lang.code.toUpperCase()}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs font-semibold text-amber-800">
              <span>{lang._count.editions} Book Editions</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
