'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  User,
  ShoppingCart,
  BookOpen,
  IndianRupee,
  CreditCard,
  ArrowLeftRight,
  History,
  Bell,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { TokenPayload } from '@/lib/auth';

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<TokenPayload | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If on the registration page, render without the sidebar
  const isRegisterPage = pathname === '/volunteer/register';

  useEffect(() => {
    if (!isRegisterPage) {
      fetch('/api/auth/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setSession(data?.user || null))
        .catch(() => setSession(null));
    }
  }, [pathname, isRegisterPage]);

  if (isRegisterPage) {
    return <>{children}</>;
  }

  const volunteerName = session?.name ? session.name.split(' ')[0] : 'Devotee';

  const navItems = [
    { label: 'Dashboard', href: '/volunteer/dashboard', icon: LayoutGrid },
    { label: 'My Profile', href: '/volunteer/profile', icon: User },
    { label: 'Book Orders', href: '/volunteer/orders', icon: ShoppingCart },
    { label: 'Allocated Books', href: '/volunteer/books', icon: BookOpen },
    { label: 'Sales Tracking', href: '/volunteer/sales', icon: IndianRupee },
    { label: 'Payments', href: '/volunteer/qr', icon: CreditCard },
    { label: 'Returns & Settlement', href: '/volunteer/returns', icon: ArrowLeftRight },
    { label: 'History', href: '/volunteer/history', icon: History },
    { label: 'Notifications', href: '/volunteer/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#FDFBF7] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-amber-100 p-4 shrink-0 shadow-sm transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64 p-6'
        }`}
      >
        {/* Top Header & Toggle Button */}
        <div>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-serif font-extrabold text-maroon-900 tracking-tight">
                  Volunteer Portal
                </h2>
                <p className="text-xs text-amber-800/90 font-sans font-medium mt-0.5">
                  Hare Krishna, {volunteerName}!
                </p>
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-2xl text-amber-900 bg-amber-50 hover:bg-amber-100/90 border border-amber-200/80 transition ${
                isCollapsed ? 'mx-auto' : ''
              }`}
              title={isCollapsed ? 'Open Side Panel' : 'Close Side Panel'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-saffron-700" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-saffron-700" />
              )}
            </button>
          </div>

          {!isCollapsed && <div className="border-b border-amber-100/80 mt-4" />}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1 text-sm font-medium mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center space-x-3 rounded-2xl transition duration-150 ${
                  isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'
                } ${
                  active
                    ? 'bg-amber-100/70 text-saffron-700 font-bold shadow-xs border border-amber-200/50'
                    : 'text-gray-700 hover:text-maroon-900 hover:bg-amber-50/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-saffron-600' : 'text-amber-800/70'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile / Quick Info */}
        {!isCollapsed && (
          <div className="pt-4 border-t border-amber-100 space-y-2">
            {session?.volunteerId && (
              <div className="flex items-center justify-between text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80 font-mono">
                <span className="font-sans font-semibold text-[11px] text-gray-500">ID:</span>
                <span className="font-bold">{session.volunteerId}</span>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Mobile Top Navigation Header */}
      <div className="md:hidden bg-white border-b border-amber-100 p-4 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-base font-serif font-bold text-maroon-900">Volunteer Portal</h2>
          <p className="text-[11px] text-amber-800">Hare Krishna, {volunteerName}!</p>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 focus:outline-none"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-white border-b border-amber-100 p-4 space-y-1 text-sm shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium ${
                  active ? 'bg-amber-100 text-saffron-700 font-bold' : 'text-gray-700 hover:bg-amber-50'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-800" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
