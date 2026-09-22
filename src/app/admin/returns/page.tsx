'use client';

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { formatDate } from '@/lib/utils';
import { RotateCcw, CheckCircle } from 'lucide-react';

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemReceivedCounts, setItemReceivedCounts] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  const fetchReturns = async () => {
    try {
      const res = await fetch('/api/admin/returns');
      if (res.ok) {
        const data = await res.json();
        setReturns(data.returns || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleReconcileReturn = async () => {
    setSubmitting(true);
    setMsg({ error: '', success: '' });

    try {
      const res = await fetch(`/api/admin/returns/${selectedReturn.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED', itemReceivedCounts }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reconcile return');

      setMsg({ error: '', success: 'Return reconciled and temple inventory updated!' });
      fetchReturns();
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
            Inventory Reconciliation
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Book Return Verification</h1>
          <p className="text-xs text-gray-500">Verify physically received unsold book quantities and adjust campaign inventory.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-amber-900">Loading return requests...</div>
        ) : returns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Return ID</th>
                  <th className="p-4">Volunteer</th>
                  <th className="p-4">Requested Date</th>
                  <th className="p-4">Requested vs Received Items</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {returns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-amber-50/40">
                    <td className="p-4 font-mono font-bold text-amber-900">{ret.returnId}</td>
                    <td className="p-4 font-bold text-gray-900">
                      {ret.volunteer.fullName}
                      <span className="text-[11px] text-gray-400 block font-normal">{ret.volunteer.volunteerId}</span>
                    </td>
                    <td className="p-4 text-gray-500">{formatDate(ret.requestedDate)}</td>
                    <td className="p-4">
                      <ul className="space-y-1">
                        {ret.items.map((it: any) => (
                          <li key={it.id} className="font-semibold text-gray-800">
                            • {it.bookEdition.book.name} ({it.bookEdition.language.name}): Req: {it.requestedQuantity} | Rec: {it.receivedQuantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={ret.status} />
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedReturn(ret);
                          const initial: Record<string, number> = {};
                          ret.items.forEach((it: any) => {
                            initial[it.id] = it.receivedQuantity || it.requestedQuantity;
                          });
                          setItemReceivedCounts(initial);
                          setModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold"
                      >
                        Verify & Reconcile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">No return requests submitted.</div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Reconcile Return - ${selectedReturn?.returnId}`}>
        {selectedReturn && (
          <div className="space-y-4 text-xs">
            {msg.error && <div className="bg-rose-50 text-rose-800 p-3 rounded-xl">{msg.error}</div>}
            {msg.success && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl">{msg.success}</div>}

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <span className="font-bold text-maroon-900 block font-serif">{selectedReturn.volunteer.fullName} ({selectedReturn.volunteer.volunteerId})</span>
              <span className="text-gray-500">Notes: {selectedReturn.notes || 'None'}</span>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-gray-700 uppercase tracking-wider block">Confirm Physically Received Quantities:</span>
              {selectedReturn.items.map((it: any) => (
                <div key={it.id} className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100">
                  <div>
                    <span className="font-bold text-gray-900 block">{it.bookEdition.book.name}</span>
                    <span className="text-gray-500">{it.bookEdition.language.name} Edition • Requested Return: {it.requestedQuantity} copies</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={it.requestedQuantity}
                    value={itemReceivedCounts[it.id] !== undefined ? itemReceivedCounts[it.id] : it.requestedQuantity}
                    onChange={(e) => setItemReceivedCounts({ ...itemReceivedCounts, [it.id]: parseInt(e.target.value, 10) || 0 })}
                    className="w-20 p-2 rounded-lg border border-gray-200 text-center font-bold"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                disabled={submitting}
                onClick={handleReconcileReturn}
                className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold shadow-md"
              >
                Complete Return Reconciliation & Update Stock
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
