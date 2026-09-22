'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { Bell, CheckCheck } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    fetchNotifications();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Admin System Alerts
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Admin Notification Center</h1>
          <p className="text-xs text-gray-500">Real-time alerts for new volunteer registrations, order requests, and return submissions.</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition"
        >
          <CheckCheck className="w-4 h-4 text-saffron-700" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden divide-y divide-gray-100">
        {loading ? (
          <div className="p-8 text-center text-xs text-amber-900 font-bold">Loading system alerts...</div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} className={`p-5 flex items-start space-x-4 ${n.read ? 'bg-white' : 'bg-amber-50/50'}`}>
              <div className="p-2.5 rounded-2xl bg-saffron-100 text-saffron-700 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-serif font-bold text-maroon-900">{n.title}</h3>
                  <span className="text-xs text-gray-400">{formatDate(n.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">No admin notifications found.</div>
        )}
      </div>
    </div>
  );
}
