'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { formatDate } from '@/lib/utils';
import { Shield, PlusCircle, UserCheck, Crown } from 'lucide-react';

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'ADMIN',
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ error: '', success: '' });

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create admin user');

      setMsg({ error: '', success: 'Admin user created successfully!' });
      fetchAdmins();
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
            Super Admin Control
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Admin Users & Permissions</h1>
          <p className="text-xs text-gray-500">Manage administrator accounts, assign roles (Temple Admin vs Super Admin), and grant system privileges.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold px-5 py-2.5 rounded-2xl shadow-md text-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Admin User</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-amber-900">Loading administrator accounts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Admin Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-amber-50/40">
                    <td className="p-4 font-bold text-gray-900 flex items-center space-x-2">
                      {adm.role === 'SUPER_ADMIN' ? <Crown className="w-4 h-4 text-purple-600" /> : <Shield className="w-4 h-4 text-saffron-600" />}
                      <span>{adm.name}</span>
                    </td>
                    <td className="p-4 text-gray-700">{adm.email}</td>
                    <td className="p-4 text-gray-700">{adm.mobile}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${adm.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-saffron-100 text-saffron-900 border border-saffron-300'}`}>
                        {adm.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={adm.status} />
                    </td>
                    <td className="p-4 text-gray-500">{formatDate(adm.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Administrator Account">
        <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
          {msg.error && <div className="bg-rose-50 text-rose-800 p-3 rounded-xl">{msg.error}</div>}
          {msg.success && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl">{msg.success}</div>}

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Radheshyam Das"
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. admin2@iskcon.org"
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Mobile Number *</label>
            <input
              type="text"
              required
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="+91 9876543219"
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Password *</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Set initial password"
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Role & Permissions Level</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500 bg-white"
            >
              <option value="ADMIN">Temple Admin (Standard Management)</option>
              <option value="SUPER_ADMIN">Super Admin (Full System & User Control)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold shadow-md"
            >
              {submitting ? 'Creating Admin Account...' : 'Create Admin User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
