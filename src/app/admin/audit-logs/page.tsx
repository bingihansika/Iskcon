'use client';

import React, { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { FileText, Shield } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.auditLogs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Security & Accountability
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">System Audit Logs</h1>
          <p className="text-xs text-gray-500">Immutable trail of all stock adjustments, allocations, sales, approvals, and settlements.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-amber-900">Loading audit trail...</div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Entity Type</th>
                  <th className="p-4">New State / Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-amber-50/40">
                    <td className="p-4 text-gray-500 font-sans">{formatDate(log.createdAt)}</td>
                    <td className="p-4 font-bold text-gray-900 font-sans">{log.user?.name || 'System'}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-sans font-bold text-[10px]">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-saffron-700">{log.action}</td>
                    <td className="p-4 font-bold text-purple-700">{log.entityType}</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate font-mono">
                      {log.newData || log.oldData || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">No audit log entries recorded.</div>
        )}
      </div>
    </div>
  );
}
