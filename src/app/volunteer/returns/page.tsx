'use client';

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';
import { RotateCcw, PlusCircle, CheckCircle } from 'lucide-react';
import { Modal } from '@/components/Modal';

export default function VolunteerReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [returnItems, setReturnItems] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  const fetchReturns = async () => {
    try {
      const res = await fetch('/api/volunteer/returns');
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

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/volunteer/books');
      if (res.ok) {
        const data = await res.json();
        setInventory(data.inventory || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReturns();
    fetchInventory();
  }, []);

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ error: '', success: '' });

    try {
      const itemsPayload = Object.entries(returnItems)
        .filter(([_, qty]) => qty > 0)
        .map(([edId, qty]) => ({ bookEditionId: edId, quantity: qty }));

      if (itemsPayload.length === 0) {
        throw new Error('Please enter a returning quantity for at least one book.');
      }

      const res = await fetch('/api/volunteer/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsPayload, notes }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit return');

      setMsg({ error: '', success: 'Return request submitted to temple admin!' });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Campaign Reconciliation
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Book Return Requests</h1>
          <p className="text-xs text-gray-500">Return unsold books at the end of campaign for admin verification.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold px-5 py-2.5 rounded-2xl shadow-md text-xs transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Request Book Return</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-amber-900 font-bold">Loading return requests...</div>
        ) : returns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Return ID</th>
                  <th className="p-4">Requested Date</th>
                  <th className="p-4">Items Summary</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {returns.map((r) => (
                  <tr key={r.id} className="hover:bg-amber-50/40">
                    <td className="p-4 font-mono font-bold text-amber-900">{r.returnId}</td>
                    <td className="p-4 text-gray-500">{formatDate(r.requestedDate)}</td>
                    <td className="p-4">
                      <ul className="space-y-1">
                        {r.items.map((it: any) => (
                          <li key={it.id} className="font-semibold text-gray-800">
                            • {it.bookEdition.book.name} ({it.bookEdition.language.name}): Req: {it.requestedQuantity} | Rec: {it.receivedQuantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="p-4 text-gray-500">{r.notes || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">No return requests submitted yet.</div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Return Unsold Books">
        <form onSubmit={handleReturnSubmit} className="space-y-4">
          {msg.error && <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-xs">{msg.error}</div>}
          {msg.success && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs">{msg.success}</div>}

          <p className="text-xs text-gray-600">Enter the quantity of unsold copies you wish to return for each book edition:</p>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {inventory.filter((inv) => inv.remaining > 0).map((inv) => (
              <div key={inv.bookEditionId} className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold font-serif text-maroon-900 block">{inv.bookName}</span>
                  <span className="text-gray-500">{inv.language} • Available: {inv.remaining} copies</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max={inv.remaining}
                  value={returnItems[inv.bookEditionId] || 0}
                  onChange={(e) => setReturnItems({ ...returnItems, [inv.bookEditionId]: parseInt(e.target.value, 10) || 0 })}
                  className="w-20 p-2 rounded-lg border border-gray-200 text-center font-bold text-xs"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Return Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Campaign end return of unsold Gita copies"
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold text-xs shadow-md transition"
            >
              {submitting ? 'Submitting Return...' : 'Submit Return Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
