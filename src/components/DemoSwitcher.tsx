'use client';

import React, { useState } from 'react';
import { Shield, UserCheck, Crown, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const DemoSwitcher: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDemoLogin = async (email: string, rolePath: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        router.push(rolePath);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-all duration-300">
      <div className="bg-gradient-to-r from-maroon-900 to-amber-950 text-white rounded-2xl shadow-2xl border border-amber-500/40 p-3 max-w-xs backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 mb-2">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Demo Role Switcher</span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-amber-300 hover:text-white p-1"
          >
            {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="space-y-1.5 text-xs">
            <p className="text-gray-300 text-[11px] mb-2 leading-tight">
              Test drive the ISKCON Bookstore roles in 1-click:
            </p>

            <button
              disabled={loading}
              onClick={() => handleDemoLogin('volunteer@iskcon.org', '/volunteer/dashboard')}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition text-left"
            >
              <div className="flex items-center space-x-2">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">Volunteer (VOL1001)</span>
              </div>
              <span className="text-[10px] bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300">Portal</span>
            </button>

            <button
              disabled={loading}
              onClick={() => handleDemoLogin('admin@iskcon.org', '/admin/dashboard')}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-saffron-600/30 hover:bg-saffron-600/40 text-saffron-200 border border-saffron-500/40 transition text-left"
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-3.5 h-3.5 text-saffron-400" />
                <span className="font-semibold">Temple Admin</span>
              </div>
              <span className="text-[10px] bg-saffron-400/20 px-1.5 py-0.5 rounded text-saffron-300">Admin</span>
            </button>

            <button
              disabled={loading}
              onClick={() => handleDemoLogin('superadmin@iskcon.org', '/admin/dashboard')}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 transition text-left"
            >
              <div className="flex items-center space-x-2">
                <Crown className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-semibold">Super Admin</span>
              </div>
              <span className="text-[10px] bg-purple-400/20 px-1.5 py-0.5 rounded text-purple-300">Full</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
