'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { UserCheck, QrCode, Mail, Phone, MapPin, Globe, ShieldCheck, Download, Printer, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function VolunteerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/volunteer/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-amber-900 font-bold text-xs">
        Loading volunteer profile...
      </div>
    );
  }

  const vol = profile?.volunteer || {};
  const stats = profile?.stats || {};
  const qrCode = profile?.qrCode || {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-maroon-900 via-amber-950 to-maroon-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-saffron-500 to-amber-400 flex items-center justify-center text-maroon-950 font-serif font-black text-2xl shadow-lg border border-saffron-300">
              {vol.fullName ? vol.fullName.charAt(0) : 'V'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-serif font-bold text-white">{vol.fullName}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{vol.approvalStatus || 'APPROVED'}</span>
                </span>
              </div>
              <p className="text-xs text-saffron-300 font-semibold font-mono mt-0.5">
                Volunteer ID: {vol.volunteerId || 'VOL1001'}
              </p>
              <p className="text-xs text-amber-200/80 mt-1">
                Active Campaign: <span className="text-white font-semibold">Prabhupada Book Marathon 2026</span>
              </p>
            </div>
          </div>

          <Link
            href="/volunteer/qr"
            className="flex items-center space-x-2 bg-saffron-500 hover:bg-saffron-600 text-maroon-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition"
          >
            <QrCode className="w-4 h-4" />
            <span>My Payment QR</span>
          </Link>
        </div>
      </div>

      {/* Live Distribution Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm text-center">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Received</span>
          <p className="text-2xl font-serif font-black text-maroon-900 mt-1">{stats.received || 0}</p>
          <span className="text-[10px] text-gray-400 block mt-0.5">Total copies</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm text-center">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Sold</span>
          <p className="text-2xl font-serif font-black text-emerald-700 mt-1">{stats.sold || 0}</p>
          <span className="text-[10px] text-gray-400 block mt-0.5">Distributed copies</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm text-center">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Remaining</span>
          <p className="text-2xl font-serif font-black text-amber-900 mt-1">{stats.remaining || 0}</p>
          <span className="text-[10px] text-amber-700 block mt-0.5">In possession</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm text-center">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Pending Settlement</span>
          <p className="text-2xl font-serif font-black text-maroon-900 mt-1">{formatCurrency(stats.pendingSettlement || 0)}</p>
          <span className="text-[10px] text-rose-600 block mt-0.5">To pay temple</span>
        </div>
      </div>

      {/* Volunteer Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact & Personal Information */}
        <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-serif font-bold text-maroon-900 border-b border-amber-100 pb-3 flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-saffron-600" />
            <span>Personal & Contact Information</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-gray-400 block font-medium">Email Address</span>
                <span className="font-bold text-gray-900">{vol.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-gray-400 block font-medium">Mobile Number</span>
                <span className="font-bold text-gray-900">{vol.mobile}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-gray-400 block font-medium">City & Address</span>
                <span className="font-bold text-gray-900">{vol.address}, {vol.city}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
              <Globe className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-gray-400 block font-medium">Preferred Book Language</span>
                <span className="font-bold text-gray-900">{vol.preferredLanguage || 'English'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <span className="text-gray-400 block font-medium">Emergency Contact</span>
                <span className="font-bold text-gray-900">{vol.emergencyContact || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unique Payment QR Code Panel */}
        <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-serif font-bold text-maroon-900 border-b border-amber-100 pb-3 flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-saffron-600" />
              <span>Assigned Payment QR Reference</span>
            </h3>
            <p className="text-xs text-gray-500 mt-2">
              Every volunteer has a unique UPI payment QR reference linked to their Volunteer ID. Customers scan this QR to make direct payments.
            </p>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 text-center space-y-3">
            <span className="font-mono text-xs font-bold text-maroon-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              {qrCode.qrReference || `QR-${vol.volunteerId}`}
            </span>
            <p className="text-[11px] text-amber-900/80">
              UPI Address: <span className="font-mono font-bold text-maroon-900">temple.bookstore@upi</span>
            </p>
            <div className="pt-2 flex justify-center space-x-2">
              <Link
                href="/volunteer/qr"
                className="px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-sm"
              >
                View Full Printable QR
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
