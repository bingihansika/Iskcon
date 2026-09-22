'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { formatCurrency } from '@/lib/utils';
import { Layers, Edit3, ShieldAlert } from 'lucide-react';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState<any>(null);

  const [newTotalStock, setNewTotalStock] = useState<number>(0);
  const [reservedStock, setReservedStock] = useState<number>(0);
  const [damagedStock, setDamagedStock] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory');
      if (res.ok) {
        const data = await res.json();
        setInventory(data.inventory || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ error: '', success: '' });

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventoryId: selectedInv.id,
          newTotalStock,
          reservedStock,
          damagedStock,
          adjustmentReason: reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update stock');

      setMsg({ error: '', success: 'Stock updated and logged to audit trail!' });
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
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Temple Inventory Control
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Multi-Language Stock Management</h1>
          <p className="text-xs text-gray-500">Track total, available, allocated, sold, returned, reserved, and damaged stock per edition.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-amber-900">Loading temple inventory...</div>
        ) : inventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Language</th>
                  <th className="p-4 text-center">Total Stock</th>
                  <th className="p-4 text-center">Available</th>
                  <th className="p-4 text-center">Allocated</th>
                  <th className="p-4 text-center">Sold</th>
                  <th className="p-4 text-center">Returned</th>
                  <th className="p-4 text-center">Reserved</th>
                  <th className="p-4 text-center">Damaged</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.map((inv) => (
                  <tr key={inv.id} className="hover:bg-amber-50/40">
                    <td className="p-4 font-bold font-serif text-maroon-900">
                      {inv.bookEdition.book.name}
                      <span className="text-[11px] text-gray-500 block font-sans font-normal">{inv.bookEdition.editionName}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-semibold">
                        {inv.bookEdition.language.name}
                      </span>
                    </td>
                    <td className="p-4 text-center font-extrabold text-gray-900">{inv.totalStock}</td>
                    <td className="p-4 text-center font-bold text-emerald-700">{inv.availableStock}</td>
                    <td className="p-4 text-center font-bold text-sky-700">{inv.allocatedStock}</td>
                    <td className="p-4 text-center font-bold text-saffron-700">{inv.soldStock}</td>
                    <td className="p-4 text-center font-bold text-purple-700">{inv.returnedStock}</td>
                    <td className="p-4 text-center font-bold text-amber-800">{inv.reservedStock}</td>
                    <td className="p-4 text-center font-bold text-rose-700">{inv.damagedStock}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedInv(inv);
                          setNewTotalStock(inv.totalStock);
                          setReservedStock(inv.reservedStock);
                          setDamagedStock(inv.damagedStock);
                          setModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold flex items-center space-x-1 mx-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Adjust</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">No inventory entries recorded.</div>
        )}
      </div>

      {/* Manual Adjustment Modal with Mandatory Audit Log */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Manual Stock Adjustment">
        {selectedInv && (
          <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
            {msg.error && <div className="bg-rose-50 text-rose-800 p-3 rounded-xl">{msg.error}</div>}
            {msg.success && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl">{msg.success}</div>}

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <span className="font-bold text-maroon-900 block font-serif">{selectedInv.bookEdition.book.name}</span>
              <span className="text-gray-500">{selectedInv.bookEdition.language.name} Edition • Current Total: {selectedInv.totalStock}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">New Total Stock *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newTotalStock}
                  onChange={(e) => setNewTotalStock(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-bold focus:outline-none focus:border-saffron-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Reserved Stock</label>
                <input
                  type="number"
                  min="0"
                  value={reservedStock}
                  onChange={(e) => setReservedStock(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-bold focus:outline-none focus:border-saffron-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Damaged Stock</label>
                <input
                  type="number"
                  min="0"
                  value={damagedStock}
                  onChange={(e) => setDamagedStock(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-bold focus:outline-none focus:border-saffron-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Mandatory Adjustment Reason *</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Received new printer batch / Damaged copies during transit"
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold shadow-md"
              >
                {submitting ? 'Updating & Logging Audit...' : 'Confirm Stock Adjustment'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
