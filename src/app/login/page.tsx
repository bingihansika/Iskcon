'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Smartphone, Mail, AlertCircle, UserCheck, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [tab, setTab] = useState<'email' | 'mobile'>('email');
  const [email, setEmail] = useState('volunteer@iskcon.org');
  const [password, setPassword] = useState('iskcon123');
  const [mobile, setMobile] = useState('+91 9876543212');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = tab === 'email' ? { email, password } : { mobile, otp };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data.user.role === 'VOLUNTEER') {
        router.push('/volunteer/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (!mobile) {
      setError('Please enter a valid mobile number.');
      return;
    }
    setOtpSent(true);
    setOtp('123456');
    setError('');
  };

  const loginDemoAccount = async (demoEmail: string, rolePath: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');
      router.push(rolePath);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-amber-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-maroon-900 to-amber-950 p-6 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-saffron-500 mx-auto flex items-center justify-center text-maroon-950 mb-2 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">Portal Sign In</h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Access your Volunteer or Administrator account
          </p>
        </div>

        {/* Demo Mode Info Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 p-3 px-4 text-center">
          <div className="flex items-center justify-center space-x-1 text-amber-900 text-[11px] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
            <span>
              <strong className="font-bold">Demo Mode:</strong> Type any email/password or mobile number to log in instantly!
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-100 bg-amber-50/50 p-1">
          <button
            onClick={() => { setTab('email'); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              tab === 'email' ? 'bg-white text-maroon-900 shadow-sm border border-amber-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Email & Password
          </button>
          <button
            onClick={() => { setTab('mobile'); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              tab === 'mobile' ? 'bg-white text-maroon-900 shadow-sm border border-amber-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Mobile OTP Login
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {tab === 'email' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. volunteer@iskcon.org"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-saffron-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-saffron-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Registered Mobile Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 9876543212"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-saffron-500"
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs hover:bg-amber-200 transition"
                  >
                    Send One-Time Password (OTP)
                  </button>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Enter 6-Digit OTP (Pre-filled: 123456)
                    </label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-mono tracking-widest text-center focus:outline-none focus:border-saffron-500"
                    />
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold text-sm shadow-md transition"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Quick Demo Login Shortcuts */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-center">
              1-Click Demo Login Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => loginDemoAccount('volunteer@iskcon.org', '/volunteer/dashboard')}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Volunteer (VOL1001)</span>
              </button>

              <button
                onClick={() => loginDemoAccount('admin@iskcon.org', '/admin/dashboard')}
                className="p-2.5 rounded-xl bg-maroon-50 hover:bg-maroon-100 border border-maroon-200 text-maroon-900 font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <Shield className="w-3.5 h-3.5 text-maroon-700" />
                <span>Temple Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
