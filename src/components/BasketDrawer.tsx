'use client';

import React, { useState, useEffect } from 'react';
import { useBasket } from '@/context/BasketContext';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const BasketDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeBasket,
    removeItem,
    updateQuantity,
    clearBasket,
    totalItems,
    totalAmount,
  } = useBasket();

  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [sessionUser, setSessionUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      fetch('/api/auth/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setSessionUser(data?.user || null))
        .catch(() => setSessionUser(null));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!sessionUser) {
      setErrorMsg('Please log in as a registered volunteer to request book distributions.');
      setTimeout(() => {
        closeBasket();
        router.push('/login');
      }, 1500);
      return;
    }

    if (sessionUser.role !== 'VOLUNTEER') {
      setErrorMsg('Only registered volunteers can submit book order requests. Log in with a volunteer account.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          bookEditionId: i.bookEditionId,
          requestedQuantity: i.quantity,
        })),
        notes,
      };

      const res = await fetch('/api/volunteer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit book order.');

      setSuccessMsg('Book Seva Request submitted successfully!');
      clearBasket();
      setNotes('');
      setTimeout(() => {
        closeBasket();
        router.push('/volunteer/dashboard');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeBasket}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="bg-gradient-to-r from-maroon-900 via-amber-950 to-maroon-950 px-6 py-5 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-saffron-500/20 border border-saffron-400/40 flex items-center justify-center text-saffron-400">
                <ShoppingBag className="w-5 h-5 text-saffron-400" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-white tracking-tight">
                  Distribution Basket
                </h2>
                <p className="text-xs text-amber-200/90 font-sans">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} selected for seva
                </p>
              </div>
            </div>

            <button
              onClick={closeBasket}
              className="p-2 rounded-xl text-amber-200 hover:text-white hover:bg-white/10 transition"
              title="Close Basket"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-serif font-bold text-sm">{successMsg}</p>
                <p className="text-[11px] text-emerald-700">Redirecting to Volunteer Portal...</p>
              </div>
            )}

            {items.length === 0 ? (
              /* EMPTY BASKET STATE (Matches user screenshot) */
              <div className="h-full flex flex-col items-center justify-center py-12 text-center px-4 space-y-4">
                <div className="w-20 h-20 rounded-full bg-amber-100/90 border border-amber-200/80 flex items-center justify-center text-saffron-600 shadow-sm">
                  <ShoppingBag className="w-10 h-10 text-saffron-600" />
                </div>

                <div className="space-y-2 max-w-xs">
                  <h3 className="text-xl font-serif font-bold text-maroon-900">
                    Your Basket is Empty
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Explore our sacred literature across 12 languages and select books for your personal reading or distribution seva.
                  </p>
                </div>

                <button
                  onClick={() => {
                    closeBasket();
                    router.push('/bookstore');
                  }}
                  className="mt-2 inline-flex items-center space-x-2 bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-md shadow-saffron-600/20 transition transform active:scale-95"
                >
                  <span>Browse Bookstore</span>
                </button>
              </div>
            ) : (
              /* POPULATED BASKET ITEMS LIST */
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.bookEditionId}
                    className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm hover:border-amber-200 transition flex items-center space-x-4"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-18 bg-amber-50 rounded-xl overflow-hidden border border-amber-200 shrink-0">
                      {item.coverImage ? (
                        <img
                          src={item.coverImage}
                          alt={item.bookName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-600 font-serif font-bold text-xs p-1 text-center">
                          {item.bookName.slice(0, 10)}
                        </div>
                      )}
                    </div>

                    {/* Info & Quantity controls */}
                    <div className="flex-grow space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-maroon-900 line-clamp-1">
                            {item.bookName}
                          </h4>
                          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 inline-block mt-0.5">
                            {item.languageName} • {item.editionName}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.bookEditionId)}
                          className="p-1 text-gray-400 hover:text-rose-600 transition"
                          title="Remove from basket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="text-xs font-serif font-extrabold text-maroon-900">
                          {formatCurrency(item.price)} <span className="text-[10px] text-gray-400 font-normal">/ copy</span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-2 bg-amber-50/80 rounded-xl p-1 border border-amber-200/80">
                          <button
                            onClick={() => updateQuantity(item.bookEditionId, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-700 hover:bg-amber-100 font-bold transition text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-maroon-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.bookEditionId, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-700 hover:bg-amber-100 font-bold transition text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer (Summary & Checkout) */}
          {items.length > 0 && (
            <div className="bg-gradient-to-b from-white to-amber-50/50 p-6 border-t border-amber-100 space-y-4 shadow-lg">
              {/* Optional Notes */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Request Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes for temple administration regarding pickup or seva..."
                  className="w-full text-xs p-3 rounded-xl border border-amber-200 focus:outline-none focus:border-saffron-500 resize-none h-16 bg-white"
                />
              </div>

              {/* Cost Summary */}
              <div className="bg-amber-100/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex justify-between text-xs text-amber-900 font-semibold">
                  <span>Total Seva Copies:</span>
                  <span className="font-bold text-maroon-900">{totalItems} copies</span>
                </div>
                <div className="flex justify-between items-baseline pt-1 border-t border-amber-200/60">
                  <span className="text-xs font-bold text-maroon-900">Total Seva Amount:</span>
                  <span className="text-xl font-serif font-black text-maroon-900">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-md shadow-saffron-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{submitting ? 'Submitting Request...' : 'Submit Book Distribution Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
