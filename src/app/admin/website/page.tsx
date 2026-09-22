'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

export default function AdminWebsitePage() {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchContents = async () => {
    try {
      const res = await fetch('/api/admin/website');
      if (res.ok) {
        const data = await res.json();
        setContents(data.contents || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleChange = (key: string, newContent: string) => {
    setContents((prev) =>
      prev.map((item) => (item.key === key ? { ...item, content: newContent } : item))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/website', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (res.ok) {
        setMsg('Website content updated successfully!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            CMS Content Control
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Website Content Management</h1>
          <p className="text-xs text-gray-500">Edit public homepage text, hero banners, temple contact information, and FAQs dynamically.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-amber-900">Loading website contents...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {msg && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs">{msg}</div>}

            <div className="space-y-4">
              {contents.map((item) => (
                <div key={item.key} className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-1">
                  <label className="block text-xs font-bold font-serif text-maroon-900">{item.title}</label>
                  <textarea
                    rows={2}
                    value={item.content}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500 bg-white"
                  ></textarea>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Content...' : 'Save All Website Content'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
