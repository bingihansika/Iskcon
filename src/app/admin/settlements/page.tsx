'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, DollarSign } from 'lucide-react';

export default function AdminSettlementsPage() {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  const fetchSettlements = async () => {
    try {
      const res = await fetch('/api/admin/settlements');
      if (res.ok) {
        const data = await res.json();
        setSettlements(data.settlements || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ error: '', success: '' });

    try {
      const res = await fetch('/api/admin/settlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settlementId: selectedSettlement.id,
          paymentAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record settlement payment');

      setMsg({ error: '', success: 'Payment recorded and settlement status updated!' });
      fetchSettlements();
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
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Financial Reconciliation
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Campaign Settlements</h1>
          <p className="text-xs text-gray-500">Record cash/UPI payments from volunteers and close campaign financial accounts.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-amber-900">Loading campaign settlements...</div>
        ) : settlements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Settlement ID</th>
                  <th className="p-4">Volunteer</th>
                  <th className="p-4">Campaign</th>
                  <th className="p-4">Total Sales</th>
                  <th className="p-4">Total Paid</th>
                  <th className="p-4">Pending Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {settlements.map((set) => (
                  <tr key={set.id} className="hover:bg-amber-50/40">
                    <td className="p-4 font-mono font-bold text-amber-900">{set.settlementId}</td>
                    <td className="p-4 font-bold text-gray-900">
                      {set.volunteer.fullName}
                      <span className="text-[11px] text-gray-400 block font-normal">{set.volunteer.volunteerId}</span>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{set.campaign.name}</td>
                    <td className="p-4 font-extrabold text-maroon-900">{formatCurrency(set.totalSales)}</td>
                    <td className="p-4 font-extrabold text-emerald-700">{formatCurrency(set.totalPaid)}</td>
                    <td className="p-4 font-extrabold text-rose-700">{formatCurrency(set.pendingAmount)}</td>
                    <td className="p-4">
                      <StatusBadge status={set.status} />
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedSettlement(set);
                          setPaymentAmount(set.pendingAmount.toString());
                          setModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold"
                      >
                        Record Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">No settlement records found.</div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Record Settlement Payment - ${selectedSettlement?.volunteer?.fullName}`}>
        {selectedSettlement && (
          <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
            {msg.error && <div className="bg-rose-50 text-rose-800 p-3 rounded-xl">{msg.error}</div>}
            {msg.success && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl">{msg.success}</div>}

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-1">
              <span className="font-bold text-maroon-900 block font-serif">{selectedSettlement.volunteer.fullName} ({selectedSettlement.volunteer.volunteerId})</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-gray-700">
                <div>Total Sales: <span className="font-bold text-maroon-900">{formatCurrency(selectedSettlement.totalSales)}</span></div>
                <div>Already Paid: <span className="font-bold text-emerald-700">{formatCurrency(selectedSettlement.totalPaid)}</span></div>
                <div>Pending Balance: <span className="font-bold text-rose-700">{formatCurrency(selectedSettlement.pendingAmount)}</span></div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Enter Payment Amount Received (₹) *</label>
              <input
                type="number"
                step="1"
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:border-saffron-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold shadow-md"
              >
                {submitting ? 'Recording Payment...' : 'Confirm Payment & Update Settlement'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
