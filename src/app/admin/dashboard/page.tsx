'use client';

import React, { useState, useEffect } from 'react';
import { DashboardCard } from '@/components/DashboardCard';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Users,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  AlertCircle,
  RotateCcw,
  Layers,
  Activity,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-amber-900">Loading Admin Console...</div>;
  }

  const metrics = data?.metrics || {};
  const activeCampaign = data?.activeCampaign;
  const languageChart = data?.languageChart || [];
  const recentAuditLogs = data?.recentAuditLogs || [];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-maroon-900 via-amber-900 to-maroon-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-saffron-500 text-maroon-950 text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
            Temple Management System
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Admin Overview Dashboard
          </h1>
          <p className="text-xs text-amber-100/90 font-sans">
            Campaign: <span className="font-bold text-saffron-300">{activeCampaign?.name || 'Marathon 2026'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/volunteers"
            className="bg-saffron-600 hover:bg-saffron-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
          >
            Review Volunteers ({metrics.pendingApprovals || 0} Pending)
          </Link>
        </div>
      </div>

      {/* METRIC CARDS GRID (Requirement #20) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Volunteers"
          value={metrics.totalVolunteers}
          subtitle={`${metrics.activeVolunteers} Active • ${metrics.pendingApprovals} Pending`}
          icon={<Users className="w-6 h-6" />}
          color="saffron"
        />

        <DashboardCard
          title="Books Allocated"
          value={metrics.booksAllocated}
          subtitle="Issued to volunteers"
          icon={<BookOpen className="w-6 h-6" />}
          color="blue"
        />

        <DashboardCard
          title="Books Sold"
          value={metrics.booksSold}
          subtitle="Distributed in field"
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="emerald"
        />

        <DashboardCard
          title="Books Returned"
          value={metrics.booksReturned}
          subtitle="Unsold returns"
          icon={<RotateCcw className="w-6 h-6" />}
          color="purple"
        />

        <DashboardCard
          title="Total Sales Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          subtitle="Gross distribution value"
          icon={<TrendingUp className="w-6 h-6" />}
          color="emerald"
        />

        <DashboardCard
          title="Amount Collected"
          value={formatCurrency(metrics.amountCollected)}
          subtitle="Verified payments"
          icon={<DollarSign className="w-6 h-6" />}
          color="saffron"
        />

        <DashboardCard
          title="Pending Settlement"
          value={formatCurrency(metrics.pendingSettlement)}
          subtitle="Unsettled balance"
          icon={<AlertCircle className="w-6 h-6" />}
          color="rose"
        />

        <DashboardCard
          title="Books Remaining"
          value={metrics.booksRemaining}
          subtitle="In volunteers' hands"
          icon={<Layers className="w-6 h-6" />}
          color="amber"
        />
      </div>

      {/* CHARTS & RECENT AUDIT LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Language Stock Distribution Chart (SVG Bar Chart) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-amber-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-maroon-900">
              Temple Inventory by Language Edition
            </h3>
            <span className="text-xs text-gray-400">Available Stock</span>
          </div>

          <div className="space-y-3 pt-2">
            {languageChart.map((item: any, i: number) => {
              const maxStock = Math.max(...languageChart.map((l: any) => l.stock), 1);
              const percentage = Math.min(100, Math.round((item.stock / maxStock) * 100));

              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-800">{item.name}</span>
                    <span className="text-amber-900 font-bold">{item.stock} copies</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-saffron-500 to-amber-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Log Activity Feed */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-amber-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-maroon-900 flex items-center">
              <Activity className="w-5 h-5 text-saffron-600 mr-2" />
              Live Audit Log Trail
            </h3>
            <Link href="/admin/audit-logs" className="text-xs text-saffron-700 font-bold hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {recentAuditLogs.map((log: any) => (
              <div key={log.id} className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60 space-y-1">
                <div className="flex items-center justify-between font-bold text-maroon-900">
                  <span className="uppercase font-mono text-[10px] text-saffron-700 bg-amber-100 px-2 py-0.5 rounded">
                    {log.action?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-gray-400">{formatDate(log.createdAt)}</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  User: <span className="font-semibold text-gray-900">{log.user?.name || 'System Admin'}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
