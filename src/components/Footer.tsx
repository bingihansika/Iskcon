import React from 'react';
import Link from 'next/link';
import { BookOpen, Heart, Shield, Sparkles, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-maroon-950 to-stone-950 text-amber-100 border-t-4 border-saffron-600 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-amber-900/40">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-saffron-600 flex items-center justify-center text-white shadow-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-serif text-white tracking-wide">
                ISKCON Bookstore
              </span>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed font-sans">
              Dedicated to digitizing and facilitating the global distribution of transcendental literature by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-saffron-400 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>International Society for Krishna Consciousness</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-saffron-400 font-serif">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-amber-200/80">
              <li>
                <Link href="/bookstore" className="hover:text-amber-400 transition flex items-center">
                  <span>Browse Bookstore</span>
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-amber-400 transition">
                  Book Categories
                </Link>
              </li>
              <li>
                <Link href="/languages" className="hover:text-amber-400 transition">
                  Available Languages
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition">
                  About Book Distribution
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-400 transition">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Volunteer Portal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-saffron-400 font-serif">
              Volunteer & Operations
            </h4>
            <ul className="space-y-2 text-xs text-amber-200/80">
              <li>
                <Link href="/volunteer/register" className="hover:text-amber-400 transition text-saffron-300 font-semibold">
                  Register as Volunteer
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition">
                  Volunteer Portal Login
                </Link>
              </li>
              <li>
                <Link href="/volunteer/dashboard" className="hover:text-amber-400 transition">
                  My Orders & Allocations
                </Link>
              </li>
              <li>
                <Link href="/volunteer/sales" className="hover:text-amber-400 transition">
                  Record Sales & Payment Tracking
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 transition text-amber-400 font-semibold">
                  Admin System Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Temple Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-saffron-400 font-serif">
              Temple Distribution Desk
            </h4>
            <div className="space-y-2.5 text-xs text-amber-200/80">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-saffron-400 shrink-0 mt-0.5" />
                <span>ISKCON Temple Campus, Hare Krishna Hill, Main Sankirtan Department</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-saffron-400 shrink-0" />
                <span>+91 80 2347 1000 / +91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-saffron-400 shrink-0" />
                <span>books@iskcon.org</span>
              </div>
              <div className="pt-2">
                <span className="inline-block bg-amber-900/60 border border-amber-700/50 text-amber-300 text-[11px] px-3 py-1 rounded-full font-medium">
                  Hours: 8:00 AM – 8:00 PM IST
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-amber-300/60 space-y-4 md:space-y-0">
          <p>© 2026 ISKCON Book Distribution Department. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Built with Devotion & Modern Tech</span>
            <span>•</span>
            <Link href="/contact" className="hover:underline">
              Temple Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
