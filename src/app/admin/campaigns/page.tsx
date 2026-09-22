'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { formatDate } from '@/lib/utils';
import { Calendar, PlusCircle } from 'lucide-react';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Book Distribution Campaign 2027',
    startDate: '2027-10-01',
    endDate: '2027-11-30',
    registrationStart: '2027-09-01',
    registrationEnd: '2027-10-15',
    orderingStart: '2027-09-15',
    orderingEnd: '2027-11-15',
    returnDeadline: '2027-12-10',
    settlementDeadline: '2027-12-20',
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/admin/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ error: '', success: '' });

    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create campaign');

      setMsg({ error: '', success: 'Campaign created successfully!' });
      fetchCampaigns();
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
            Annual Marathon Planning
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Campaign Management</h1>
          <p className="text-xs text-gray-500">Define distribution campaign dates, registration windows, return deadlines, and settlement deadlines.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold px-5 py-2.5 rounded-2xl shadow-md text-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Campaign</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-amber-900">Loading campaigns...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Campaign ID</th>
                  <th className="p-4">Campaign Name</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Return Deadline</th>
                  <th className="p-4">Settlement Deadline</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-amber-50/40">
                    <td className="p-4 font-mono font-bold text-amber-900">{camp.campaignId}</td>
                    <td className="p-4 font-bold text-gray-900">{camp.name}</td>
                    <td className="p-4 text-gray-600">{formatDate(camp.startDate)} – {formatDate(camp.endDate)}</td>
                    <td className="p-4 font-semibold text-purple-700">{formatDate(camp.returnDeadline)}</td>
                    <td className="p-4 font-semibold text-rose-700">{formatDate(camp.settlementDeadline)}</td>
                    <td className="p-4">
                      <StatusBadge status={camp.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Book Distribution Campaign">
        <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
          {msg.error && <div className="bg-rose-50 text-rose-800 p-3 rounded-xl">{msg.error}</div>}
          {msg.success && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl">{msg.success}</div>}

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Campaign Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-200"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Return Deadline *</label>
              <input
                type="date"
                required
                value={formData.returnDeadline}
                onChange={(e) => setFormData({ ...formData, returnDeadline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-200"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Settlement Deadline *</label>
              <input
                type="date"
                required
                value={formData.settlementDeadline}
                onChange={(e) => setFormData({ ...formData, settlementDeadline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-200"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold shadow-md"
            >
              {submitting ? 'Creating Campaign...' : 'Save & Publish Campaign'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
