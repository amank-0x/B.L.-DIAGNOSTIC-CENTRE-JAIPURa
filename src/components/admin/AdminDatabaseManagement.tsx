import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  RefreshCw,
  Server
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDatabaseManagement: React.FC = () => {
  const { showToast } = useApp();

  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('Checking database connection...');

  // Check database status
  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/health');
      if (res.ok) {
        setStatusMessage('PostgreSQL database connected via Prisma');
      } else {
        setStatusMessage('Database connection failed');
      }
    } catch (err: any) {
      setStatusMessage(`Connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-blue-600/30 text-blue-400">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">PostgreSQL Database</h2>
          </div>
          <p className="text-xs text-slate-300">
            Database connection via Prisma ORM with Neon PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={checkStatus}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>
      </div>

      {/* Connection Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${statusMessage.includes('connected') ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            {statusMessage.includes('connected') ? <CheckCircle2 className="w-6 h-6" /> : <Server className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Database Status</h3>
            <p className="text-xs text-slate-600">{statusMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
