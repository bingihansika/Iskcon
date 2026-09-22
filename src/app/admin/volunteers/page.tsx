'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Users, Search, CheckCircle, XCircle, Eye, ShieldCheck } from 'lucide-react';

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVol, setSelectedVol] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchVolunteers = async () => {
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (statusFilter) query.append('status', statusFilter);

      const res = await fetch(`/api/admin/volunteers?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data.volunteers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (volId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/volunteers/${volId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchVolunteers();
        if (selectedVol?.id === volId) {
          setSelectedVol((prev: any) => ({ ...prev, approvalStatus: newStatus }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Admin Operations
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Volunteer Management</h1>
          <p className="text-xs text-gray-500">Approve registrations, manage account statuses, and review volunteer performance.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-amber-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by volunteer name, ID (e.g. VOL1001), mobile, city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2.5 px-4 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500 bg-white"
        >
          <option value="">All Approval Statuses</option>
          <option value="PENDING">Pending Approval</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-amber-900">Loading volunteers...</div>
        ) : volunteers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Volunteer ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Mobile & Email</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Language</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {volunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-amber-50/40">
                    <td className="p-4 font-mono font-bold text-maroon-900">{vol.volunteerId}</td>
                    <td className="p-4 font-bold text-gray-900">{vol.fullName}</td>
                    <td className="p-4 text-gray-600">
                      <div>{vol.mobile}</div>
                      <div className="text-[11px] text-gray-400">{vol.email}</div>
                    </td>
                    <td className="p-4 text-gray-700">{vol.city}</td>
                    <td className="p-4 font-semibold text-amber-900">{vol.preferredLanguage}</td>
                    <td className="p-4">
                      <StatusBadge status={vol.approvalStatus} />
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {vol.approvalStatus === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(vol.id, 'APPROVED')}
                              className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold"
                              title="Approve Volunteer"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(vol.id, 'REJECTED')}
                              className="p-1.5 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 font-bold"
                              title="Reject Volunteer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedVol(vol);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold"
                          title="View Volunteer Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">No volunteers found matching your query.</div>
        )}
      </div>

      {/* Volunteer Profile Detail Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Volunteer Profile - ${selectedVol?.volunteerId}`}>
        {selectedVol && (
          <div className="space-y-4 text-xs">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-1">
              <h3 className="text-lg font-serif font-bold text-maroon-900">{selectedVol.fullName}</h3>
              <p className="text-gray-600">ID: <span className="font-bold text-amber-900">{selectedVol.volunteerId}</span> • Registered: {formatDate(selectedVol.createdAt)}</p>
              <div className="pt-2">
                <StatusBadge status={selectedVol.approvalStatus} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl">
              <div>
                <span className="text-gray-400 block font-medium">Mobile Number</span>
                <span className="font-bold text-gray-900">{selectedVol.mobile}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Email Address</span>
                <span className="font-bold text-gray-900">{selectedVol.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">City & Age</span>
                <span className="font-bold text-gray-900">{selectedVol.city} (Age: {selectedVol.age})</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Preferred Language</span>
                <span className="font-bold text-gray-900">{selectedVol.preferredLanguage}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              {selectedVol.approvalStatus !== 'APPROVED' && (
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedVol.id, 'APPROVED');
                    setModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Approve Registration
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
