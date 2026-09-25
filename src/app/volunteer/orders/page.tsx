'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useBasket } from '@/context/BasketContext';
import { BookOpen, ShoppingBag, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function VolunteerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { openBasket } = useBasket();

  useEffect(() => {
    fetch('/api/volunteer/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Seva Book Requests
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">My Book Orders</h1>
          <p className="text-xs text-gray-500">
            Submit new book requests for field distribution or track the approval status of existing orders.
          </p>
        </div>

        <button
          onClick={openBasket}
          className="flex items-center space-x-2 bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold px-5 py-3 rounded-2xl shadow-md text-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Request New Books (Basket)</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden p-6 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-xs text-amber-900 font-bold">
            Loading book orders...
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-amber-100/90 rounded-2xl p-5 hover:border-amber-200 transition space-y-3 bg-amber-50/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-maroon-900">
                        {order.orderId}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          order.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'READY_FOR_PICKUP'
                            ? 'bg-amber-100 text-amber-900'
                            : order.status === 'PENDING'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      Submitted on: {formatDate(order.orderDate)}
                    </span>
                  </div>

                  {order.notes && (
                    <div className="text-xs text-gray-600 italic bg-white px-3 py-1.5 rounded-xl border border-gray-100 max-w-xs">
                      "{order.notes}"
                    </div>
                  )}
                </div>

                {/* Requested Items */}
                <div className="space-y-2">
                  {(order.items || []).map((it: any, idx: number) => {
                    const ed = it.bookEdition || {};
                    const bk = ed.book || {};
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-amber-100"
                      >
                        <div>
                          <span className="font-bold text-maroon-900 font-serif">
                            {bk.name || 'Spiritual Book'}
                          </span>
                          <span className="text-gray-500 block text-[11px]">
                            {ed.language?.name || 'English'} Edition ({ed.editionName || 'Standard'})
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-amber-900">
                            Requested: {it.requestedQuantity} copies
                          </span>
                          {it.approvedQuantity > 0 && (
                            <span className="text-emerald-700 block text-[11px] font-semibold">
                              Approved: {it.approvedQuantity} copies
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <BookOpen className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-base font-serif font-bold text-maroon-900">No Orders Submitted Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You haven't requested any book packages for this campaign. Browse the bookstore and add items to your Distribution Basket to submit your first order.
            </p>
            <button
              onClick={openBasket}
              className="inline-block px-5 py-2.5 rounded-xl bg-saffron-600 text-white font-bold text-xs shadow-sm"
            >
              Open Distribution Basket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
