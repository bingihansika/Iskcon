'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, ChevronRight, ShoppingBag } from 'lucide-react';
import { Book } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useBasket } from '@/context/BasketContext';

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addItem } = useBasket();

  const defaultEdition = book.editions?.[0];
  const price = defaultEdition ? defaultEdition.price : 150;
  const languagesCount = book.editions ? new Set(book.editions.map((e) => e.language?.name || 'English')).size : 1;

  const handleAddToBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultEdition) return;
    addItem({
      bookEditionId: defaultEdition.id,
      bookId: book.id,
      bookName: book.name,
      author: book.author,
      editionName: defaultEdition.editionName || 'Standard Edition',
      languageName: defaultEdition.language?.name || 'English',
      price: defaultEdition.price,
      quantity: 1,
      coverImage: book.coverImage,
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-100/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Cover Image Header */}
        <div className="relative aspect-[3/4] bg-gradient-to-b from-amber-50 to-orange-100 overflow-hidden">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-amber-800 p-6 text-center">
              <BookOpen className="w-16 h-16 text-amber-500 mb-2 opacity-60" />
              <span className="text-sm font-serif font-bold">{book.name}</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {book.featured && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-md">
                <Sparkles className="w-3 h-3 mr-1" /> Featured
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-maroon-900/90 text-amber-100 backdrop-blur-sm">
              {book.category?.name || 'Spiritual Literature'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-amber-800 font-medium">
            <span className="bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              {languagesCount} {languagesCount === 1 ? 'Language' : 'Languages'} Available
            </span>
            <span className="text-gray-500">Srila Prabhupada</span>
          </div>

          <h3 className="text-base font-bold font-serif text-maroon-900 line-clamp-1 group-hover:text-saffron-700 transition">
            {book.name}
          </h3>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0 border-t border-gray-50 mt-2 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-gray-400 block font-medium">Starting from</span>
          <span className="text-lg font-extrabold text-amber-900 font-serif">
            {formatCurrency(price)}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleAddToBasket}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-saffron-600 text-white font-bold text-xs hover:bg-saffron-700 transition shadow-sm"
            title="Add to Seva Basket"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          <Link
            href={`/books/${book.id}`}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 font-semibold text-xs border border-amber-200 hover:bg-amber-100 transition"
          >
            <span>View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
