'use client';

import React, { useState } from 'react';
import { QrCode, Download, Printer, Copy, Check, Share2, Sparkles, ShieldCheck } from 'lucide-react';

interface QRDisplayProps {
  volunteerName: string;
  volunteerId: string;
  qrReference: string;
  upiId?: string;
  amount?: number;
  className?: string;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({
  volunteerName,
  volunteerId,
  qrReference,
  upiId = 'temple.bookstore@upi',
  amount,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  // Construct standard Indian UPI payment URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('ISKCON Temple - ' + volunteerName)}&tr=${encodeURIComponent(qrReference)}&mc=5999${amount ? `&am=${amount}` : ''}&cu=INR`;

  // Fallback SVG QR pattern generation
  const qrMatrixUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment QR - ${volunteerId}</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 40px; }
              .card { border: 2px solid #d97706; padding: 30px; border-radius: 20px; max-width: 400px; margin: auto; }
              h2 { color: #7c2d12; margin-bottom: 5px; }
              p { color: #78350f; font-size: 14px; }
              img { width: 220px; height: 220px; margin: 20px 0; }
              .ref { background: #fffbe1; padding: 8px; border-radius: 8px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>ISKCON Book Distribution</h2>
              <p>Scan to Pay for Spiritual Books</p>
              <img src="${qrMatrixUrl}" alt="UPI QR" />
              <h3>${volunteerName}</h3>
              <div class="ref">Volunteer ID: ${volunteerId} | Ref: ${qrReference}</div>
              <p style="margin-top: 15px; font-size: 12px; color: #888;">All contributions directly support ISKCON temple book distribution.</p>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className={`bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 shadow-md max-w-sm mx-auto text-center ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/60 px-3 py-1 rounded-full border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-700" />
          Official Payment QR
        </span>
        <span className="inline-flex items-center text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified
        </span>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-inner border border-amber-100 inline-block mb-4 relative">
        <img
          src={qrMatrixUrl}
          alt={`UPI QR Code for ${volunteerName}`}
          className="w-52 h-52 mx-auto rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <QrCode className="w-32 h-32 text-amber-800" />
        </div>
      </div>

      <h3 className="text-xl font-bold font-serif text-maroon-900 mb-0.5">{volunteerName}</h3>
      <p className="text-sm font-semibold text-amber-800 bg-amber-100/70 inline-block px-3 py-0.5 rounded-full mb-3 border border-amber-200">
        ID: {volunteerId} • Ref: {qrReference}
      </p>

      {amount && (
        <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 mb-4">
          <p className="text-xs text-gray-500">Payable Quantity Amount</p>
          <p className="text-xl font-extrabold text-amber-900 font-serif">₹{amount}</p>
        </div>
      )}

      <p className="text-xs text-amber-900/80 mb-5 leading-relaxed">
        Scan with Google Pay, PhonePe, Paytm, or BHIM to pay instantly for spiritual books.
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center space-x-1.5 bg-white hover:bg-amber-100/50 text-amber-900 border border-amber-300 py-2 px-3 rounded-xl font-medium transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-700" />}
          <span>{copied ? 'Copied Link' : 'Copy UPI Link'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center space-x-1.5 bg-saffron-600 hover:bg-saffron-700 text-white py-2 px-3 rounded-xl font-medium shadow-sm transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print QR</span>
        </button>
      </div>
    </div>
  );
};
