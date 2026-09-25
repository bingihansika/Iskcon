'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  PackageCheck,
  Layers,
  ClipboardList,
  RotateCcw,
  CheckCircle2,
  Calendar,
  QrCode,
  BarChart3,
  Bell,
  Globe,
  Crown,
  FileText,
  Shield,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Volunteers Management', href: '/admin/volunteers', icon: Users },
    { label: 'Book Catalog', href: '/admin/books', icon: BookOpen },
    { label: 'Book Allocation', href: '/admin/allocation', icon: PackageCheck },
    { label: 'Inventory Management', href: '/admin/inventory', icon: Layers },
    { label: 'Volunteer Orders', href: '/admin/orders', icon: ClipboardList },
    { label: 'Returns Reconciliation', href: '/admin/returns', icon: RotateCcw },
    { label: 'Campaign Settlements', href: '/admin/settlements', icon: CheckCircle2 },
    { label: 'Campaign Management', href: '/admin/campaigns', icon: Calendar },
    { label: 'QR Management', href: '/admin/qr', icon: QrCode },
    { label: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
    { label: 'Notifications Center', href: '/admin/notifications', icon: Bell },
    { label: 'Website Content', href: '/admin/website', icon: Globe },
    { label: 'Admin Users & Roles', href: '/admin/users', icon: Crown },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-maroon-950 text-amber-100 border-r border-amber-900/40 p-4 space-y-6">
        <div className="px-3 py-2 flex items-center space-x-2.5 border-b border-amber-900/40 pb-4">
          <div className="w-9 h-9 rounded-xl bg-saffron-500 flex items-center justify-center text-maroon-950 font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-serif font-bold text-white leading-tight">Admin Console</h2>
            <p className="text-[10px] text-amber-300 font-medium">ISKCON Book Distribution</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 text-xs overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
                  active
                    ? 'bg-saffron-600 text-white font-bold shadow-md'
                    : 'text-amber-200/80 hover:bg-amber-900/40 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-saffron-400 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-amber-900/40 text-[11px] text-amber-300/70 text-center">
          Role: <span className="font-bold text-white">Temple Administrator</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-maroon-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-saffron-400" />
            <span className="font-serif font-bold text-sm">Admin Portal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded bg-amber-900/50 text-amber-200"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Sidebar Dropdown */}
        {sidebarOpen && (
          <div className="lg:hidden bg-maroon-950 text-amber-100 p-4 space-y-2 border-b border-amber-900/40">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="block py-2 px-3 rounded-lg text-xs font-semibold hover:bg-amber-900/40"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
