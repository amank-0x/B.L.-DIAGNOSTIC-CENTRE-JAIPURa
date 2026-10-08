import React from 'react';
import { ShieldCheck, Clock, FileText, UserCheck, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminActivityLogs: React.FC = () => {
  const { adminLogs, websiteConfig } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Immutable Administrative Activity Logs</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Complete audit trail of all staff operations, status transitions, report releases, and catalogue changes.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Authorized Admin</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Operational Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {adminLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    +91 {log.adminPhone || websiteConfig.adminPhone}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] bg-slate-100 text-slate-800 font-mono font-bold px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-bold text-blue-900">
                      {log.entity}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      #{log.entityId}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
