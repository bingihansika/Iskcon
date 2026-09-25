'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BasketItem {
  bookEditionId: string;
  bookId: string;
  bookName: string;
  author: string;
  editionName: string;
  languageName: string;
  price: number;
  quantity: number;
  coverImage?: string;
  availableStock?: number;
}

interface BasketContextType {
  items: BasketItem[];
  isOpen: boolean;
  openBasket: () => void;
  closeBasket: () => void;
  addItem: (item: BasketItem) => void;
  removeItem: (bookEditionId: string) => void;
  updateQuantity: (bookEditionId: string, quantity: number) => void;
  clearBasket: () => void;
  totalItems: number;
  totalAmount: number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('iskcon_seva_basket');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load basket from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('iskcon_seva_basket', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save basket to localStorage', e);
      }
    }
  }, [items, isLoaded]);

  const openBasket = () => setIsOpen(true);
  const closeBasket = () => setIsOpen(false);

  const addItem = (newItem: BasketItem) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.bookEditionId === newItem.bookEditionId);
      if (existingIdx > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIdx].quantity;
        const addQty = newItem.quantity || 1;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: currentQty + addQty,
        };
        return updated;
      }
      return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (bookEditionId: string) => {
    setItems((prev) => prev.filter((i) => i.bookEditionId !== bookEditionId));
  };

  const updateQuantity = (bookEditionId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(bookEditionId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.bookEditionId === bookEditionId ? { ...i, quantity } : i))
    );
  };

  const clearBasket = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <BasketContext.Provider
      value={{
        items,
        isOpen,
        openBasket,
        closeBasket,
        addItem,
        removeItem,
        updateQuantity,
        clearBasket,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
};
