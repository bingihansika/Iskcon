'use client';

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { formatDate } from '@/lib/utils';
import { ClipboardList, CheckCircle, XCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemApprovals, setItemApprovals] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApproveOrder = async (status: string) => {
    setSubmitting(true);
    setMsg({ error: '', success: '' });

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, itemApprovals }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');

      setMsg({ error: '', success: `Order ${status.toLowerCase().replace(/_/g, ' ')} and allocated successfully!` });
      fetchOrders();
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
            Allocation Workflows
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Volunteer Book Requests</h1>
          <p className="text-xs text-gray-500">Review requested book orders, verify inventory stock, and issue allocations.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-amber-900">Loading volunteer orders...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Volunteer</th>
                  <th className="p-4">Order Date</th>
                  <th className="p-4">Requested Items</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-amber-50/40">
                    <td className="p-4 font-mono font-bold text-amber-900">{ord.orderId}</td>
                    <td className="p-4 font-bold text-gray-900">
                      {ord.volunteer.fullName}
                      <span className="text-[11px] text-gray-400 block font-normal">{ord.volunteer.volunteerId}</span>
                    </td>
                    <td className="p-4 text-gray-500">{formatDate(ord.orderDate)}</td>
                    <td className="p-4">
                      <ul className="space-y-1">
                        {ord.items.map((it: any) => (
                          <li key={it.id} className="font-semibold text-gray-800">
                            • {it.bookEdition.book.name} ({it.bookEdition.language.name}): {it.requestedQuantity} copies
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          const initial: Record<string, number> = {};
                          ord.items.forEach((it: any) => {
                            initial[it.id] = it.requestedQuantity;
                          });
                          setItemApprovals(initial);
                          setModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold"
                      >
                        Review Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">No volunteer book orders requested.</div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Review Order - ${selectedOrder?.orderId}`}>
        {selectedOrder && (
          <div className="space-y-4 text-xs">
            {msg.error && <div className="bg-rose-50 text-rose-800 p-3 rounded-xl">{msg.error}</div>}
            {msg.success && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl">{msg.success}</div>}

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <span className="font-bold text-maroon-900 block font-serif">{selectedOrder.volunteer.fullName} ({selectedOrder.volunteer.volunteerId})</span>
              <span className="text-gray-500">Requested: {formatDate(selectedOrder.orderDate)}</span>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-gray-700 uppercase tracking-wider block">Modify / Approve Quantities:</span>
              {selectedOrder.items.map((it: any) => (
                <div key={it.id} className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100">
                  <div>
                    <span className="font-bold text-gray-900 block">{it.bookEdition.book.name}</span>
                    <span className="text-gray-500">{it.bookEdition.language.name} Edition • Requested: {it.requestedQuantity} copies</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={itemApprovals[it.id] !== undefined ? itemApprovals[it.id] : it.requestedQuantity}
                    onChange={(e) => setItemApprovals({ ...itemApprovals, [it.id]: parseInt(e.target.value, 10) || 0 })}
                    className="w-20 p-2 rounded-lg border border-gray-200 text-center font-bold"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                disabled={submitting}
                onClick={() => handleApproveOrder('APPROVED')}
                className="flex-1 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold shadow-md"
              >
                Approve & Issue Allocation
              </button>
              <button
                disabled={submitting}
                onClick={() => handleApproveOrder('REJECTED')}
                className="py-3 px-4 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
