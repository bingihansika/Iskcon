'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Sparkles, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const NotificationBell: React.FC<{ role: string }> = ({ role }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id?: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? { id } : { markAll: true }),
      });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-gray-600 hover:text-amber-900 hover:bg-amber-50 transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-amber-800" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-amber-200 z-50 overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-saffron-600" />
              <h4 className="text-xs font-serif font-bold text-maroon-900 uppercase tracking-wider">
                Notifications ({unreadCount} Unread)
              </h4>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => handleMarkRead()}
                className="text-[11px] font-semibold text-saffron-700 hover:underline flex items-center space-x-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 text-xs">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  className={`p-3.5 transition cursor-pointer ${
                    n.read ? 'bg-white text-gray-600' : 'bg-amber-50/50 text-gray-900 font-semibold'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-maroon-900 font-serif font-bold text-[11px]">{n.title}</span>
                    <span className="text-[10px] text-gray-400">{formatDate(n.createdAt)}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-600">{n.message}</p>
                </div>
              ))
            ) : (
              <p className="p-6 text-center text-gray-400 text-xs">No notifications yet.</p>
            )}
          </div>

          <div className="p-2.5 bg-gray-50 text-center border-t border-gray-100">
            <Link
              href={role === 'VOLUNTEER' ? '/volunteer/notifications' : '/admin/notifications'}
              onClick={() => setOpen(false)}
              className="text-[11px] font-bold text-saffron-700 hover:underline"
            >
              View All Notifications Center →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
