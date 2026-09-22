import React from 'react';
import Link from 'next/link';
import { BookOpen, UserCheck, ShieldCheck, Heart, Sparkles, ArrowRight, Flame } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="bg-gradient-to-r from-maroon-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-saffron-500/30">
        <div className="max-w-3xl space-y-4">
          <span className="bg-saffron-500/30 text-saffron-300 text-xs px-3 py-1 rounded-full font-bold border border-saffron-500/30">
            Transcendental Book Distribution
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
            About ISKCON Book Distribution
          </h1>
          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-sans">
            "The printing of books and their distribution is our most important work. If you can sell books, that is the greatest service to Krishna." — His Divine Grace A.C. Bhaktivedanta Swami Prabhupada.
          </p>
        </div>
      </div>

      {/* Process Workflow Section */}
      <div className="bg-white rounded-3xl border border-amber-100 p-8 shadow-sm space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-serif font-bold text-maroon-900">
            Step-by-Step Distribution Process
          </h2>
          <p className="text-xs text-gray-600">
            How the digital platform handles campaign registration, book allocations, QR payments, returns, and settlements.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          {[
            { title: '1. Registration', sub: 'Volunteer registers and gets unique Volunteer ID' },
            { title: '2. Approval', sub: 'Temple Admin verifies registration' },
            { title: '3. Book Request', sub: 'Submit requested quantity for campaign' },
            { title: '4. Allocation', sub: 'Admin approves & issues book package' },
            { title: '5. Sales & QR', sub: 'Record sales & collect payments via QR' },
            { title: '6. Settlement', sub: 'Reconcile returns and settle campaign balance' },
          ].map((st, i) => (
            <div key={i} className="flex-1 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-1">
              <span className="text-xs font-bold text-saffron-700 block">Step 0{i + 1}</span>
              <h4 className="text-sm font-serif font-bold text-maroon-900">{st.title}</h4>
              <p className="text-[11px] text-gray-500 leading-tight">{st.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
