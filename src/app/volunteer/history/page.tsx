'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { Calendar, History } from 'lucide-react';

export default function VolunteerHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/volunteer/history')
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Historical Records
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Campaign Distribution History</h1>
          <p className="text-xs text-gray-500">View campaign-by-campaign past performance, allocations, sales, returns, and settlements.</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-amber-900 font-bold">Loading campaign history...</div>
        ) : history.length > 0 ? (
          history.map((h, i) => (
            <div key={i} className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                <div>
                  <h3 className="text-lg font-serif font-bold text-maroon-900">{h.campaignName}</h3>
                  <p className="text-xs text-gray-400">Duration: {formatDate(h.startDate)} – {formatDate(h.endDate)}</p>
                </div>
                <StatusBadge status={h.settlementStatus} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60">
                  <span className="text-gray-500 block">Received</span>
                  <span className="text-lg font-extrabold text-maroon-900 font-serif">{h.received} copies</span>
                </div>

                <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-200/60">
                  <span className="text-gray-500 block">Sold</span>
                  <span className="text-lg font-extrabold text-emerald-800 font-serif">{h.sold} copies</span>
                </div>

                <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-200/60">
                  <span className="text-gray-500 block">Returned</span>
                  <span className="text-lg font-extrabold text-purple-800 font-serif">{h.returned} copies</span>
                </div>

                <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-200/60">
                  <span className="text-gray-500 block">Total Sales</span>
                  <span className="text-lg font-extrabold text-blue-900 font-serif">{formatCurrency(h.totalSales)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-gray-500 bg-white rounded-3xl border border-amber-100">
            No historical campaign records found.
          </div>
        )}
      </div>
    </div>
  );
}
