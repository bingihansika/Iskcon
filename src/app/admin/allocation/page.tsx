'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, UserCheck, CheckCircle2, Clock, Calendar, ShieldCheck, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminAllocationPage() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    volunteerId: '',
    bookEditionId: '',
    quantity: '50',
  });

  const loadData = () => {
    fetch('/api/admin/allocation')
      .then((res) => res.json())
      .then((data) => {
        setAllocations(data.allocations || []);
        setVolunteers(data.volunteers || []);
        setEditions(data.editions || []);
        if (data.volunteers?.[0]) setFormData((prev) => ({ ...prev, volunteerId: data.volunteers[0].id }));
        if (data.editions?.[0]) setFormData((prev) => ({ ...prev, bookEditionId: data.editions[0].id }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/allocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to record allocation');

      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Temple Inventory Dispatch
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Volunteer Book Allocations</h1>
          <p className="text-xs text-gray-500">
            Record physical book packages handed over to registered volunteers for campaign distribution.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold px-5 py-3 rounded-2xl shadow-md text-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Book Allocation</span>
        </button>
      </div>

      {/* Allocations History Table */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-amber-900 font-bold">Loading allocations...</div>
        ) : allocations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Allocation ID</th>
                  <th className="p-4">Volunteer</th>
                  <th className="p-4">Book Edition & Language</th>
                  <th className="p-4 text-center">Quantity Issued</th>
                  <th className="p-4">Issued By</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allocations.map((alc) => {
                  const vol = alc.volunteer || {};
                  const ed = alc.bookEdition || {};
                  const bk = ed.book || {};
                  return (
                    <tr key={alc.id} className="hover:bg-amber-50/40">
                      <td className="p-4 font-mono font-bold text-maroon-900">{alc.allocationId}</td>
                      <td className="p-4">
                        <span className="font-bold text-gray-900 block">{vol.fullName}</span>
                        <span className="text-[11px] text-gray-500 font-mono">{vol.volunteerId}</span>
                      </td>
                      <td className="p-4 font-serif font-bold text-maroon-900">
                        {bk.name || 'Spiritual Book'}
                        <span className="text-[11px] font-sans font-normal text-gray-500 block">
                          {ed.language?.name || 'English'} ({ed.editionName})
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-amber-100 text-amber-900 font-black px-3 py-1 rounded-full text-xs border border-amber-300">
                          {alc.quantity} copies
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{alc.issuedBy}</td>
                      <td className="p-4 text-gray-500">{formatDate(alc.issuedAt)}</td>
                      <td className="p-4 text-center">
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                          RECEIVED BY VOLUNTEER
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">No book allocations issued yet.</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-amber-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-maroon-900">Issue Book Allocation</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAllocate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Select Volunteer *</label>
                <select
                  value={formData.volunteerId}
                  onChange={(e) => setFormData({ ...formData, volunteerId: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs bg-white font-medium"
                >
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.fullName} ({v.volunteerId}) — {v.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Select Book Edition *</label>
                <select
                  value={formData.bookEditionId}
                  onChange={(e) => setFormData({ ...formData, bookEditionId: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs bg-white font-medium"
                >
                  {editions.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.book?.name} — {e.language?.name} Edition ({e.editionName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Quantity of Copies to Issue *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:border-saffron-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold shadow-sm"
                >
                  {submitting ? 'Recording...' : 'Record Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
