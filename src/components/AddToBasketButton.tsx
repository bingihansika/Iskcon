'use client';

import React from 'react';
import { useBasket } from '@/context/BasketContext';
import { ShoppingBag } from 'lucide-react';

interface AddToBasketButtonProps {
  bookEditionId: string;
  bookId: string;
  bookName: string;
  author: string;
  editionName: string;
  languageName: string;
  price: number;
  coverImage?: string;
  className?: string;
  children?: React.ReactNode;
}

export const AddToBasketButton: React.FC<AddToBasketButtonProps> = ({
  bookEditionId,
  bookId,
  bookName,
  author,
  editionName,
  languageName,
  price,
  coverImage,
  className,
  children,
}) => {
  const { addItem } = useBasket();

  const handleClick = () => {
    addItem({
      bookEditionId,
      bookId,
      bookName,
      author,
      editionName,
      languageName,
      price,
      quantity: 1,
      coverImage,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        'flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-sm transition'
      }
    >
      <ShoppingBag className="w-3.5 h-3.5" />
      <span>{children || 'Add to Basket'}</span>
    </button>
  );
};
