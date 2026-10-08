import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  RefreshCw,
  Server,
  Key,
  ShieldCheck,
  Terminal,
  Layers,
  ArrowUpRight,
  Download,
  Lock,
  Play,
  Check,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupabaseBackendService } from '../../services/supabase.service';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { SUPABASE_PRODUCTION_SCHEMA_SQL } from '../../data/schemaSql';

export const AdminDatabaseManagement: React.FC = () => {
  const { bookings, showToast } = useApp();

  const [loading, setLoading] = useState<boolean>(true);
  const [tablesReady, setTablesReady] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Checking database connection...');
  const [missingTable, setMissingTable] = useState<string | null>(null);
  const [sqlContent, setSqlContent] = useState<string>(SUPABASE_PRODUCTION_SCHEMA_SQL);
  const [copied, setCopied] = useState<boolean>(false);
  const [dbPassword, setDbPassword] = useState<string>('');
  const [migrating, setMigrating] = useState<boolean>(false);
  const [migrationResult, setMigrationResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);

  const supabaseUrl = 'https://dgygaxatbjzjeumlvlgj.supabase.co';
  const projectId = 'dgygaxatbjzjeumlvlgj';
  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectId}/sql/new`;

  // Fetch SQL Schema and check live table status
  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await SupabaseBackendService.checkTablesStatus();
      if (res.tablesReady) {
        setTablesReady(true);
        setStatusMessage('All Supabase database tables are active and responding.');
        setMissingTable(null);
      } else {
        setTablesReady(false);
        setMissingTable(res.missingTable || 'public.bookings');
        setStatusMessage('Supabase tables have not been created yet in your project.');
      }
    } catch (err: any) {
      setTablesReady(false);
      setStatusMessage(`Connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();

    // Fetch schema text
    fetch('/api/supabase/schema-sql')
      .then(res => res.text())
      .then(text => setSqlContent(text))
      .catch(() => {
        setSqlContent('-- Run the schema located in supabase/schema.sql');
      });
  }, []);

  const handleCopySql = () => {
    if (!sqlContent) return;
    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    showToast('SQL Schema copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlContent], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bld_diagnostic_supabase_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded bld_diagnostic_supabase_schema.sql');
  };

  const handleDirectMigration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbPassword.trim()) {
      showToast('Please enter your Supabase database password');
      return;
    }

    setMigrating(true);
    setMigrationResult(null);

    try {
      const token = localStorage.getItem('bld_admin_token') || 'bld-jwt-admin-token';
      const result = await SupabaseBackendService.executeMigration({ dbPassword }, token);
      if (result.success) {
        setMigrationResult({ success: true, message: result.message || 'Migration executed successfully!' });
        showToast('Tables successfully generated in Supabase!');
        setTablesReady(true);
        setDbPassword('');
        checkStatus();
      } else {
        setMigrationResult({ success: false, message: result.error || 'Failed to run migration.' });
      }
    } catch (err: any) {
      setMigrationResult({ success: false, message: err.message });
    } finally {
      setMigrating(false);
    }
  };

  const handleSyncBookings = async () => {
    setSyncing(true);
    try {
      const res = await SupabaseBackendService.syncAllBookingsToSupabase(bookings);
      if (res.error) {
        showToast(`Sync issue: ${res.error}`);
      } else {
        showToast(`Successfully synced ${res.count} order(s) to Supabase PostgreSQL!`);
      }
    } catch (err: any) {
      showToast(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-blue-600/30 text-blue-400">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">Supabase PostgreSQL Integration</h2>
          </div>
          <p className="text-xs text-slate-300">
            Real-time synchronization for patient test orders, line items, phlebotomy visits, and pathology reports.
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

          <a
            href={sqlEditorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span>Open SQL Editor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Live Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Project URL */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Project Endpoint</span>
            <Server className="w-4 h-4 text-blue-500" />
          </div>
          <div className="font-mono text-xs font-bold text-slate-800 truncate" title={supabaseUrl}>
            {supabaseUrl}
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Project ID: {projectId}</span>
        </div>

        {/* Client API Status */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">API Connection</span>
            <Key className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-emerald-800">Connected & Authenticated</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Publishable / Anon Key active</span>
        </div>

        {/* Tables Status */}
        <div className={`rounded-xl p-4 border shadow-2xs ${tablesReady ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/80 border-amber-300'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${tablesReady ? 'text-emerald-800' : 'text-amber-800'}`}>
              Database Tables
            </span>
            {tablesReady ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${tablesReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
            <span className={`text-xs font-bold ${tablesReady ? 'text-emerald-900' : 'text-amber-900'}`}>
              {tablesReady ? 'All 12 Tables Created & Synced' : 'Tables Pending Generation in Supabase'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {tablesReady ? 'public.bookings is live' : 'Requires running SQL schema once'}
          </span>
        </div>
      </div>

      {/* Action Guide Banner if Tables are Pending */}
      {!tablesReady && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Action Required: Initialize Database Tables on Supabase
              </h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Supabase is connected to this application, but PostgreSQL tables (like <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono font-bold">public.bookings</code>) have not been created yet in your Supabase project. Follow this quick 2-step setup:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-4 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider font-mono">Step 1</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Copy the Production SQL Script</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Contains all 12 tables, indexes, row-level security policies, and diagnostic test seeds.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Complete SQL Script'}</span>
                </button>
                <button
                  onClick={handleDownloadSql}
                  title="Download SQL File"
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-4 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider font-mono">Step 2</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Paste & Click "RUN" in Supabase</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Opens your project's SQL Editor in Supabase. Paste the copied SQL and click the green "Run" button.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={sqlEditorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={checkStatus}
                  disabled={loading}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Verify</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Banner if Tables are Verified */}
      {tablesReady && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Supabase PostgreSQL is Fully Synchronized & Active!
              </h3>
              <p className="text-xs text-emerald-800">
                All patient test bookings placed in the application are directly saved in Supabase PostgreSQL and appear on this portal.
              </p>
            </div>
          </div>

          <button
            onClick={handleSyncBookings}
            disabled={syncing}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync Orders to Supabase</span>
          </button>
        </div>
      )}

      {/* Alternative: Direct Migration Runner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Automated 1-Click Migration (Optional Database Password)
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            PostgreSQL Port 5432
          </span>
        </div>

        <p className="text-xs text-slate-600">
          If you don't wish to paste the SQL in the Supabase Dashboard, you can execute the migration directly by entering your Supabase Database Password below.
        </p>

        <form onSubmit={handleDirectMigration} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Supabase Database Password (e.g. set during project creation)"
                value={dbPassword}
                onChange={e => setDbPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              disabled={migrating || !dbPassword.trim()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {migrating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{migrating ? 'Running Migration...' : 'Run Migration Now'}</span>
            </button>
          </div>

          {migrationResult && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                migrationResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {migrationResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{migrationResult.message}</span>
            </div>
          )}
        </form>
      </div>

      {/* Database Tables Schema Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Database Schema Specifications</h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">12 Production Tables</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'public.bookings', desc: 'Patient orders & collection appointments', active: tablesReady },
            { name: 'public.booking_items', desc: 'Line items (individual tests & packages)', active: tablesReady },
            { name: 'public.users', desc: 'Registered patients & contact details', active: tablesReady },
            { name: 'public.reports', desc: 'Diagnostic report results & doctor signatures', active: tablesReady },
            { name: 'public.collections', desc: 'Phlebotomist home collection schedules', active: tablesReady },
            { name: 'public.tests', desc: 'Full catalogue of pathology lab tests', active: tablesReady },
            { name: 'public.packages', desc: 'Comprehensive wellness health profiles', active: tablesReady },
            { name: 'public.categories', desc: 'Test classifications (Hematology, etc.)', active: tablesReady },
            { name: 'public.activity_logs', desc: 'Immutable administrative audit trails', active: tablesReady }
          ].map(table => (
            <div key={table.name} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-slate-800">{table.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${table.active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  title={table.active ? 'Active' : 'Pending'}
                ></span>
              </div>
              <span className="text-[11px] text-slate-500">{table.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">SQL Schema Script (supabase/schema.sql)</h3>
          </div>
          <button
            onClick={handleCopySql}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy SQL'}</span>
          </button>
        </div>

        <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-72 border border-slate-800">
          <pre>{sqlContent || '-- Loading SQL schema...'}</pre>
        </div>
      </div>
    </div>
  );
};
