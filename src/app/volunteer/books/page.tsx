'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { BookOpen, CheckCircle, RotateCcw, Clock } from 'lucide-react';

export default function VolunteerBooksPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/volunteer/books')
      .then((res) => res.json())
      .then((data) => {
        setInventory(data.inventory || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Volunteer Inventory
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">My Allocated Books</h1>
          <p className="text-xs text-gray-500">
            Real-time accounting formula: <span className="font-bold text-amber-900">Remaining = Received - Sold - Returned</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-amber-900 font-bold">Loading allocated books...</div>
        ) : inventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Language</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4 text-center">Received</th>
                  <th className="p-4 text-center">Sold</th>
                  <th className="p-4 text-center">Returned</th>
                  <th className="p-4 text-center">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40">
                    <td className="p-4 font-bold font-serif text-maroon-900 text-sm">
                      {item.bookName}
                      <span className="text-[11px] text-gray-500 block font-sans font-normal">{item.editionName}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-semibold">
                        {item.language}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-gray-900">{formatCurrency(item.price)}</td>
                    <td className="p-4 text-center font-bold text-gray-800 text-sm">{item.received}</td>
                    <td className="p-4 text-center font-bold text-emerald-700 text-sm">{item.sold}</td>
                    <td className="p-4 text-center font-bold text-purple-700 text-sm">{item.returned}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full font-black text-sm ${item.remaining > 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-gray-100 text-gray-500'}`}>
                        {item.remaining} copies
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">
            No books currently allocated. Submit a book order request to receive packages from the temple.
          </div>
        )}
      </div>
    </div>
  );
}
