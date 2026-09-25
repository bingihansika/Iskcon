'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  UserCheck,
  Shield,
  Menu,
  X,
  QrCode,
  LogOut,
  ShoppingBag,
  Bell,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { TokenPayload } from '@/lib/auth';
import { NotificationBell } from './NotificationBell';
import { useBasket } from '@/context/BasketContext';

export const Navbar: React.FC = () => {
  const [session, setSession] = useState<TokenPayload | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, openBasket } = useBasket();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSession(data?.user || null))
      .catch(() => setSession(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const isVolunteer = session?.role === 'VOLUNTEER';
  const isAdmin = session?.role === 'ADMIN' || session?.role === 'SUPER_ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      {/* Devotional Top Banner */}
      <div className="bg-gradient-to-r from-maroon-900 via-amber-900 to-maroon-950 text-amber-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-serif italic font-medium">
              "Hare Krishna Hare Krishna Krishna Krishna Hare Hare • Hare Rama Hare Rama Rama Rama Hare Hare"
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-[11px] font-sans">
            <span>Official ISKCON Book Distribution Portal</span>
            <span>•</span>
            <span className="text-amber-300 font-semibold">Active Campaign: Marathon 2026</span>
          </div>
        </div>
      </div>

      {/* Main Navbar Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-saffron-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-black font-serif tracking-tight text-maroon-900">
                  ISKCON
                </span>
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  Bookstore
                </span>
              </div>
              <p className="text-[11px] text-amber-800 font-medium">Volunteer & Distribution System</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 font-medium text-sm">
            <Link
              href="/bookstore"
              className={`px-3.5 py-2 rounded-xl transition ${
                pathname === '/bookstore' ? 'bg-amber-100/80 text-amber-900 font-semibold' : 'text-gray-700 hover:text-amber-900 hover:bg-amber-50'
              }`}
            >
              Bookstore
            </Link>
            <Link
              href="/categories"
              className={`px-3.5 py-2 rounded-xl transition ${
                pathname === '/categories' ? 'bg-amber-100/80 text-amber-900 font-semibold' : 'text-gray-700 hover:text-amber-900 hover:bg-amber-50'
              }`}
            >
              Categories
            </Link>
            <Link
              href="/languages"
              className={`px-3.5 py-2 rounded-xl transition ${
                pathname === '/languages' ? 'bg-amber-100/80 text-amber-900 font-semibold' : 'text-gray-700 hover:text-amber-900 hover:bg-amber-50'
              }`}
            >
              Languages
            </Link>
            <Link
              href="/about"
              className={`px-3.5 py-2 rounded-xl transition ${
                pathname === '/about' ? 'bg-amber-100/80 text-amber-900 font-semibold' : 'text-gray-700 hover:text-amber-900 hover:bg-amber-50'
              }`}
            >
              About
            </Link>
            <Link
              href="/faq"
              className={`px-3.5 py-2 rounded-xl transition ${
                pathname === '/faq' ? 'bg-amber-100/80 text-amber-900 font-semibold' : 'text-gray-700 hover:text-amber-900 hover:bg-amber-50'
              }`}
            >
              FAQs
            </Link>
            <Link
              href="/contact"
              className={`px-3.5 py-2 rounded-xl transition ${
                pathname === '/contact' ? 'bg-amber-100/80 text-amber-900 font-semibold' : 'text-gray-700 hover:text-amber-900 hover:bg-amber-50'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* User Role Actions & Basket Trigger */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Basket Drawer Trigger Button */}
            <button
              onClick={openBasket}
              className="relative p-2.5 text-maroon-900 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition flex items-center justify-center"
              title="Distribution Basket"
            >
              <ShoppingBag className="w-5 h-5 text-maroon-900" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-saffron-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {session ? (
              <div className="flex items-center space-x-2">
                <NotificationBell role={session.role} />

                {isVolunteer && (
                  <>
                    <Link
                      href="/volunteer/dashboard"
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-medium hover:bg-amber-100 transition"
                    >
                      <UserCheck className="w-4 h-4 text-amber-700" />
                      <span>Volunteer Portal</span>
                    </Link>
                    <Link
                      href="/volunteer/qr"
                      className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-saffron-50 text-saffron-800 border border-saffron-200 hover:bg-saffron-100 transition"
                      title="My Payment QR"
                    >
                      <QrCode className="w-4 h-4 text-saffron-600" />
                      <span className="text-xs font-semibold">{session.volunteerId}</span>
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-maroon-900 text-white font-medium hover:bg-maroon-950 transition shadow-sm"
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/volunteer/register"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-100 text-amber-900 font-semibold border border-amber-300 hover:bg-amber-200 transition"
                >
                  <UserCheck className="w-4 h-4 text-amber-800" />
                  <span>Become a Volunteer</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold transition shadow-md shadow-saffron-600/20"
                >
                  <span>Volunteer Login</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Basket Trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={openBasket}
              className="relative p-2.5 rounded-xl bg-amber-50 text-maroon-900 border border-amber-200 focus:outline-none"
              title="Distribution Basket"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-saffron-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link
              href="/bookstore"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-amber-50/70 text-amber-900 hover:bg-amber-100"
            >
              📚 Bookstore
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-amber-50/70 text-amber-900 hover:bg-amber-100"
            >
              🏷️ Categories
            </Link>
            <Link
              href="/languages"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-amber-50/70 text-amber-900 hover:bg-amber-100"
            >
              🌐 Languages
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-amber-50/70 text-amber-900 hover:bg-amber-100"
            >
              🪔 About
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-amber-50/70 text-amber-900 hover:bg-amber-100"
            >
              ❓ FAQs
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-amber-50/70 text-amber-900 hover:bg-amber-100"
            >
              📞 Contact
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-2">
            {session ? (
              <>
                {isVolunteer && (
                  <Link
                    href="/volunteer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-amber-600 text-white font-bold"
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>Go to Volunteer Portal</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-maroon-900 text-white font-bold"
                  >
                    <Shield className="w-5 h-5 text-amber-400" />
                    <span>Go to Admin Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 text-rose-600 text-sm font-semibold"
                >
                  Logout Account
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <Link
                  href="/volunteer/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-amber-100 text-amber-900 font-bold border border-amber-300"
                >
                  <span>Become a Volunteer</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-saffron-600 text-white font-bold"
                >
                  <span>Volunteer Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
