'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { QRDisplay } from '@/components/QRDisplay';
import { Modal } from '@/components/Modal';
import { QrCode, Search, Printer, Eye } from 'lucide-react';

export default function AdminQRPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedVol, setSelectedVol] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchQRs = async () => {
    try {
      const res = await fetch(`/api/admin/qr?search=${encodeURIComponent(search)}`);
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
    fetchQRs();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            UPI QR Infrastructure
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">QR Code Management</h1>
          <p className="text-xs text-gray-500">View, search, print, and audit unique volunteer payment QR references across field campaigns.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-amber-100 shadow-sm flex items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search QR by volunteer name or Volunteer ID (e.g. VOL1001)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-amber-900">Loading QR entries...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Volunteer ID</th>
                  <th className="p-4">Volunteer Name</th>
                  <th className="p-4">QR Reference</th>
                  <th className="p-4">UPI Data String</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {volunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-amber-50/40">
                    <td className="p-4 font-mono font-bold text-amber-900">{vol.volunteerId}</td>
                    <td className="p-4 font-bold text-gray-900">{vol.fullName}</td>
                    <td className="p-4">
                      <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-mono font-bold">
                        {vol.qrCode?.qrReference || `QR-${vol.volunteerId}`}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 font-mono text-[10px] truncate max-w-xs">
                      {vol.qrCode?.qrData}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedVol(vol);
                          setModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold flex items-center space-x-1 mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View / Print QR</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Payment QR - ${selectedVol?.volunteerId}`}>
        {selectedVol && (
          <QRDisplay
            volunteerName={selectedVol.fullName}
            volunteerId={selectedVol.volunteerId}
            qrReference={selectedVol.qrCode?.qrReference || `QR-${selectedVol.volunteerId}`}
          />
        )}
      </Modal>
    </div>
  );
}
