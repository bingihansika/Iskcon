'use client';

import React, { useState, useEffect } from 'react';
import { DashboardCard } from '@/components/DashboardCard';
import { QRDisplay } from '@/components/QRDisplay';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  QrCode,
  PlusCircle,
  RotateCcw,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function VolunteerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [inventoryList, setInventoryList] = useState<any[]>([]);

  // Sale Form state
  const [selectedEdition, setSelectedEdition] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [customerRef, setCustomerRef] = useState('');
  const [saleSubmitting, setSaleSubmitting] = useState(false);
  const [saleMsg, setSaleMsg] = useState({ error: '', success: '' });

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/volunteer/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/volunteer/books');
      if (res.ok) {
        const json = await res.json();
        setInventoryList(json.inventory || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchInventory();
  }, []);

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaleSubmitting(true);
    setSaleMsg({ error: '', success: '' });

    try {
      const edObj = inventoryList.find((i) => i.bookEditionId === selectedEdition);
      if (!edObj) throw new Error('Please select a valid book edition.');

      const res = await fetch('/api/volunteer/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookEditionId: selectedEdition,
          quantity: saleQty,
          sellingPrice: edObj.price,
          paymentMethod,
          customerReference: customerRef,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to record sale');

      setSaleMsg({ error: '', success: 'Sale recorded successfully! Inventory updated.' });
      fetchDashboard();
      fetchInventory();
      setTimeout(() => {
        setSaleModalOpen(false);
        setSaleMsg({ error: '', success: '' });
      }, 1500);
    } catch (err: any) {
      setSaleMsg({ error: err.message, success: '' });
    } finally {
      setSaleSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-12 h-12 border-4 border-saffron-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-amber-900">Loading Volunteer Portal Dashboard...</p>
      </div>
    );
  }

  const volunteer = data?.volunteer;
  const metrics = data?.metrics || {};
  const activeCampaign = data?.activeCampaign;
  const qrCode = volunteer?.qrCode;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-maroon-900 via-amber-900 to-maroon-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-saffron-500 text-maroon-950 text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
              Volunteer Dashboard
            </span>
            <span className="text-xs text-amber-300 font-serif font-bold">
              ID: {volunteer?.volunteerId}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Hare Krishna, {volunteer?.fullName}!
          </h1>
          <p className="text-xs text-amber-100/90 font-sans">
            Campaign: <span className="font-bold text-saffron-300">{activeCampaign?.name || 'Annual Marathon 2026'}</span> • Preferred Language: {volunteer?.preferredLanguage}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSaleModalOpen(true)}
            className="flex items-center space-x-2 bg-saffron-500 hover:bg-saffron-600 text-maroon-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Record Book Sale</span>
          </button>

          <Link
            href="/volunteer/qr"
            className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white border border-amber-400/30 px-4 py-3 rounded-2xl text-xs font-bold transition"
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>Payment QR</span>
          </Link>
        </div>
      </div>

      {/* DASHBOARD METRIC CARDS (Requirement #8 & #49) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard
          title="Books Received"
          value={metrics.booksReceived}
          subtitle="Allocated copies"
          icon={<BookOpen className="w-6 h-6" />}
          color="saffron"
        />

        <DashboardCard
          title="Books Sold"
          value={metrics.booksSold}
          subtitle="Distributed in field"
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="emerald"
        />

        <DashboardCard
          title="Books Remaining"
          value={metrics.booksRemaining}
          subtitle="Received - Sold - Returned"
          icon={<Clock className="w-6 h-6" />}
          color="amber"
        />

        <DashboardCard
          title="Total Sales"
          value={formatCurrency(metrics.totalSalesAmount)}
          subtitle="Gross sales value"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />

        <DashboardCard
          title="Amount Collected"
          value={formatCurrency(metrics.amountCollected)}
          subtitle="Customer receipts"
          icon={<DollarSign className="w-6 h-6" />}
          color="emerald"
        />

        <DashboardCard
          title="Amount Settled"
          value={formatCurrency(metrics.amountSettled)}
          subtitle="Paid to temple"
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="saffron"
        />

        <DashboardCard
          title="Pending Settlement"
          value={formatCurrency(metrics.pendingSettlement)}
          subtitle="Sales - Settled"
          icon={<AlertCircle className="w-6 h-6" />}
          color="rose"
        />

        <DashboardCard
          title="Books to Return"
          value={metrics.booksToReturn}
          subtitle="Unsold inventory"
          icon={<RotateCcw className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* PORTAL MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick QR Card */}
        <div className="lg:col-span-5">
          <QRDisplay
            volunteerName={volunteer?.fullName || 'Volunteer'}
            volunteerId={volunteer?.volunteerId || 'VOL1001'}
            qrReference={qrCode?.qrReference || 'QR-VOL1001'}
          />
        </div>

        {/* Recent Sales History */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-amber-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-maroon-900">Recent Field Sales</h3>
            <Link href="/volunteer/sales" className="text-xs text-saffron-700 font-bold hover:underline">
              View All Sales →
            </Link>
          </div>

          {data?.recentSales?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold">
                  <tr>
                    <th className="p-3">Book Edition</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.recentSales.map((s: any) => (
                    <tr key={s.id} className="hover:bg-amber-50/30">
                      <td className="p-3 font-semibold text-gray-900">
                        {s.bookEdition.book.name} ({s.bookEdition.language.name})
                      </td>
                      <td className="p-3 font-bold text-maroon-900">{s.quantity}</td>
                      <td className="p-3 font-bold text-emerald-700">{formatCurrency(s.totalAmount)}</td>
                      <td className="p-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono text-[10px]">
                          {s.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">{formatDate(s.saleDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-500 p-4 text-center">No sales recorded yet. Click "Record Book Sale" to log your first sale.</p>
          )}
        </div>
      </div>

      {/* RECORD SALE MODAL */}
      <Modal isOpen={saleModalOpen} onClose={() => setSaleModalOpen(false)} title="Record Field Book Sale">
        <form onSubmit={handleRecordSale} className="space-y-4">
          {saleMsg.error && (
            <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-xs border border-rose-200">
              {saleMsg.error}
            </div>
          )}
          {saleMsg.success && (
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs border border-emerald-200">
              {saleMsg.success}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Select Book Edition *
            </label>
            <select
              required
              value={selectedEdition}
              onChange={(e) => setSelectedEdition(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500 bg-white"
            >
              <option value="">-- Choose Allocated Book --</option>
              {inventoryList.map((inv) => (
                <option key={inv.bookEditionId} value={inv.bookEditionId} disabled={inv.remaining <= 0}>
                  {inv.bookName} ({inv.language}) — {formatCurrency(inv.price)} [Available: {inv.remaining} copies]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Selling Quantity *
              </label>
              <input
                type="number"
                min="1"
                required
                value={saleQty}
                onChange={(e) => setSaleQty(parseInt(e.target.value, 10) || 1)}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500 bg-white"
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="CASH">Cash Collection</option>
                <option value="OTHER">Other Method</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Customer / Order Reference (Optional)
            </label>
            <input
              type="text"
              value={customerRef}
              onChange={(e) => setCustomerRef(e.target.value)}
              placeholder="e.g. City Mall Stall / Corporate Donor"
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={saleSubmitting}
              className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold text-xs shadow-md transition"
            >
              {saleSubmitting ? 'Recording Sale...' : 'Confirm & Record Sale'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
