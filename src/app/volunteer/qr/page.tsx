'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { QRDisplay } from '@/components/QRDisplay';

export default function VolunteerQRPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/volunteer/dashboard')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-amber-900">Loading Payment QR...</div>;
  }

  const volunteer = data?.volunteer;
  const qrCode = volunteer?.qrCode;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
          Unique Payment QR Code
        </span>
        <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-2">
          Volunteer Payment QR
        </h1>
        <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
          Display or print this QR code when distributing books in the field. Customers can scan directly to pay via UPI (GPay, PhonePe, Paytm).
        </p>
      </div>

      <QRDisplay
        volunteerName={volunteer?.fullName || 'Volunteer'}
        volunteerId={volunteer?.volunteerId || 'VOL1001'}
        qrReference={qrCode?.qrReference || 'QR-VOL1001'}
      />
    </div>
  );
}
