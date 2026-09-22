'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VolunteerSettlementPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/volunteer/dashboard')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-amber-900">Loading Campaign Settlement...</div>;
  }

  const metrics = data?.metrics || {};
  const activeCampaign = data?.activeCampaign;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-gradient-to-r from-maroon-900 via-amber-900 to-maroon-950 text-white rounded-3xl p-8 shadow-xl">
        <span className="bg-saffron-500/30 text-saffron-300 text-xs px-3 py-1 rounded-full font-bold border border-saffron-500/30">
          Campaign Financial Reconciliation
        </span>
        <h1 className="text-3xl font-serif font-bold text-white mt-2">
          Final Campaign Settlement
        </h1>
        <p className="text-xs text-amber-100/90 mt-1">
          Campaign: <span className="font-bold text-saffron-300">{activeCampaign?.name || 'Marathon 2026'}</span>
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200">
            <span className="text-xs text-gray-500 font-semibold block">Total Sales Revenue</span>
            <span className="text-3xl font-serif font-black text-maroon-900">{formatCurrency(metrics.totalSalesAmount || 0)}</span>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold block">Amount Paid & Settled</span>
            <span className="text-3xl font-serif font-black text-emerald-800">{formatCurrency(metrics.amountSettled || 0)}</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Pending Settlement Balance</span>
            <span className="text-3xl font-serif font-black text-maroon-900">{formatCurrency(metrics.pendingSettlement || 0)}</span>
          </div>

          <StatusBadge status={metrics.pendingSettlement === 0 ? 'COMPLETED' : 'PARTIALLY_SETTLED'} />
        </div>

        <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded-xl space-y-1">
          <p className="font-bold text-gray-800">Settlement Rules:</p>
          <p>• All financial settlements are strictly tied to specific distribution campaigns.</p>
          <p>• Verified online QR payments automatically count toward your settled total.</p>
          <p>• Cash collections can be deposited directly at the temple sankirtan desk.</p>
        </div>
      </div>
    </div>
  );
}
