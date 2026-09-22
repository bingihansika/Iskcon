import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { BookOpen, Globe, CheckCircle, Sparkles, ChevronLeft, ShieldCheck, Tag, Info } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await prisma.book.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      editions: {
        include: {
          language: true,
          inventories: true,
        },
      },
    },
  });

  if (!book) notFound();

  // Representative edition
  const defaultEdition = book.editions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Back Link */}
      <div>
        <Link
          href="/bookstore"
          className="inline-flex items-center space-x-1.5 text-xs text-amber-800 hover:text-maroon-900 font-bold bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Bookstore</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Book Cover Image */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full aspect-[3/4] bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl overflow-hidden border border-amber-200 shadow-md relative group">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-amber-800">
                <BookOpen className="w-20 h-20 text-amber-500 mb-3 opacity-60" />
                <span className="text-xl font-serif font-bold">{book.name}</span>
              </div>
            )}
            {book.featured && (
              <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md inline-flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Featured Publication
              </span>
            )}
          </div>
        </div>

        {/* Book Information */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
              {book.category?.name || 'Spiritual Literature'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-maroon-900 leading-tight">
              {book.name}
            </h1>
            <p className="text-sm font-medium text-amber-800">
              Author: <span className="font-semibold text-gray-900">{book.author}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
            <span className="text-xs text-gray-500">Starting Price</span>
            <p className="text-3xl font-serif font-black text-maroon-900">
              {formatCurrency(defaultEdition ? defaultEdition.price : 150)}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 font-serif">
              About This Literature
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed font-sans">{book.description}</p>
          </div>

          {/* Book Edition Details */}
          {defaultEdition && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div>
                <span className="text-gray-400 block font-medium">Pages</span>
                <span className="font-bold text-gray-800">{defaultEdition.pages} pages</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Book Size</span>
                <span className="font-bold text-gray-800">{defaultEdition.bookSize}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">ISBN</span>
                <span className="font-bold text-gray-800">{defaultEdition.isbn || 'N/A'}</span>
              </div>
            </div>
          )}

          {/* LANGUAGE EDITIONS INVENTORY MATRIX (Requirement 4.4) */}
          <div className="space-y-4 pt-4 border-t border-amber-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-serif text-maroon-900 flex items-center">
                <Globe className="w-5 h-5 text-saffron-600 mr-2" />
                Available Language Editions & Inventory
              </h3>
              <span className="text-xs text-amber-800 font-semibold bg-amber-100 px-2.5 py-0.5 rounded-full">
                Independent Stock Tracking
              </span>
            </div>

            <div className="divide-y divide-gray-100 border border-amber-200/80 rounded-2xl overflow-hidden bg-white">
              {book.editions.map((ed) => {
                const availStock = ed.inventories?.[0]?.availableStock || 150;
                const isLow = availStock < 50;

                return (
                  <div key={ed.id} className="p-4 flex items-center justify-between hover:bg-amber-50/50 transition">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold font-serif text-sm text-maroon-900">
                          {ed.language.name} Edition
                        </span>
                        <span className="text-xs text-gray-500">({ed.editionName})</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">ISBN: {ed.isbn || 'N/A'}</p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-sm font-extrabold text-amber-900 font-serif block">
                        {formatCurrency(ed.price)}
                      </span>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          availStock > 0
                            ? isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {availStock > 0 ? `${availStock} Available` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center space-x-4">
            <Link
              href="/volunteer/register"
              className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-white text-center py-3.5 rounded-2xl font-extrabold shadow-md transition"
            >
              Become a Volunteer to Request Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
