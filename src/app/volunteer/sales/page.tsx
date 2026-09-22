'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PlusCircle, ShoppingBag, CheckCircle } from 'lucide-react';
import { Modal } from '@/components/Modal';

export default function VolunteerSalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [inventoryList, setInventoryList] = useState<any[]>([]);

  const [selectedEdition, setSelectedEdition] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [customerRef, setCustomerRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  const fetchSales = async () => {
    try {
      const res = await fetch('/api/volunteer/sales');
      if (res.ok) {
        const json = await res.json();
        setSales(json.sales || []);
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
    fetchSales();
    fetchInventory();
  }, []);

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ error: '', success: '' });

    try {
      const edObj = inventoryList.find((i) => i.bookEditionId === selectedEdition);
      if (!edObj) throw new Error('Select a valid book edition.');

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

      setMsg({ error: '', success: 'Sale logged successfully!' });
      fetchSales();
      fetchInventory();
      setTimeout(() => {
        setModalOpen(false);
        setMsg({ error: '', success: '' });
      }, 1500);
    } catch (err: any) {
      setMsg({ error: err.message, success: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Field Distribution Log
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Sales Tracking & History</h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold px-5 py-2.5 rounded-2xl shadow-md text-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record New Sale</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-amber-900 font-bold">Loading sales history...</div>
        ) : sales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Sale ID</th>
                  <th className="p-4">Book Edition</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Customer Reference</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sales.map((s) => (
                  <tr key={s.id} className="hover:bg-amber-50/40">
                    <td className="p-4 font-mono font-bold text-amber-900">{s.saleId}</td>
                    <td className="p-4 font-bold text-gray-900">
                      {s.bookEdition.book.name} ({s.bookEdition.language.name})
                    </td>
                    <td className="p-4 font-bold text-maroon-900">{s.quantity} copies</td>
                    <td className="p-4 font-medium text-gray-700">{formatCurrency(s.sellingPrice)}</td>
                    <td className="p-4 font-extrabold text-emerald-700">{formatCurrency(s.totalAmount)}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded font-mono text-[10px] font-bold">
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{s.customerReference || 'N/A'}</td>
                    <td className="p-4 text-gray-500">{formatDate(s.saleDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">No sales recorded yet. Click "Record New Sale" to log your first field transaction.</div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Field Book Sale">
        <form onSubmit={handleRecordSale} className="space-y-4">
          {msg.error && <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-xs">{msg.error}</div>}
          {msg.success && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs">{msg.success}</div>}

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
                Quantity *
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
                <option value="CASH">Cash</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Customer Reference
            </label>
            <input
              type="text"
              value={customerRef}
              onChange={(e) => setCustomerRef(e.target.value)}
              placeholder="Reference / Notes"
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold text-xs shadow-md transition"
            >
              {submitting ? 'Recording...' : 'Record Sale'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
