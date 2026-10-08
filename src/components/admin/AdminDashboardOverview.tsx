import React from 'react';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  TrendingUp,
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  Database,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboardOverview: React.FC = () => {
  const { bookings, reports, tests, setActiveAdminTab, websiteConfig } = useApp();

  // Metrics calculations from real database state
  const totalBookings = bookings.length;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.bookingDate === todayDateStr || b.createdAt.startsWith(todayDateStr));
  const pendingCollections = bookings.filter(b => b.status === 'NEW' || b.status === 'CONFIRMED' || b.status === 'COLLECTION_ASSIGNED');
  const sampleCollected = bookings.filter(b => b.status === 'SAMPLE_COLLECTED' || b.status === 'SAMPLE_RECEIVED' || b.status === 'PROCESSING');
  const reportsPending = bookings.filter(b => b.status === 'PROCESSING' || b.status === 'SAMPLE_RECEIVED');
  const reportsPublished = reports.filter(r => r.reportStatus === 'PUBLISHED').length;

  const totalRevenue = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + b.total, 0);

  const todayRevenue = todayBookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + b.total, 0);

  // Popular test metrics
  const testCounts: { [key: string]: number } = {};
  bookings.forEach(b => {
    b.items.forEach(i => {
      testCounts[i.nameSnapshot] = (testCounts[i.nameSnapshot] || 0) + 1;
    });
  });
  const popularTestsList = Object.entries(testCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded font-mono font-bold">
              ADMIN CONTROL PANEL · 9649183422
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Live Operations
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1.5 font-sans">
            {websiteConfig.centerName} Operational Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time management for appointments, phlebotomy home pickups, laboratory analyzers & verified reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveAdminTab('bookings')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <span>Manage Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Database Fast-Status Bar */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">PostgreSQL Database</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Manage database migrations, live schema verification, and order data synchronization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setActiveAdminTab('database')}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Database Setup & SQL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Bookings</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">{totalBookings}</span>
            <span className="text-xs text-blue-700 font-semibold">Today: {todayBookings.length}</span>
          </div>
          <p className="text-[11px] text-slate-500">Scheduled home sample collections</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Collections</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-600">{pendingCollections.length}</span>
            <span className="text-xs text-slate-500">In Field</span>
          </div>
          <p className="text-[11px] text-slate-500">Awaiting phlebotomist specimen draw</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Reports Published</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600">{reportsPublished}</span>
            <span className="text-xs text-amber-600 font-semibold">Pending: {reportsPending.length}</span>
          </div>
          <p className="text-[11px] text-slate-500">Verified by Pathologists</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-blue-700" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
            <span className="text-xs text-emerald-600 font-bold">Today: ₹{todayRevenue}</span>
          </div>
          <p className="text-[11px] text-slate-500">Cash & UPI verified receipts</p>
        </div>
      </div>

      {/* Operations Split: Today's Bookings & Popular Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's / Active Bookings */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Recent Appointments</h3>
              <p className="text-xs text-slate-500 mt-0.5">Live patient booking status</p>
            </div>
            <button
              onClick={() => setActiveAdminTab('bookings')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900"
            >
              View All Bookings
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 4).map(b => (
              <div
                key={b.id}
                className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg flex items-center justify-between text-xs transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-900">#{b.bookingNumber}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-white border border-slate-200 text-slate-700">
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900">{b.userName} · <span className="font-mono text-slate-500">{b.userPhone}</span></p>
                  <p className="text-[11px] text-slate-500">{b.items.map(i => i.nameSnapshot).join(', ')}</p>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 block">₹{b.total}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{b.bookingDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Tests & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Most Booked Tests</h3>
            <div className="space-y-2.5 text-xs">
              {popularTestsList.length === 0 ? (
                <p className="text-slate-400 text-xs">No booking activity yet.</p>
              ) : (
                popularTestsList.map(([name, count], idx) => (
                  <div key={name} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="font-medium text-slate-800 truncate max-w-[200px]">{name}</span>
                    <span className="font-mono font-bold text-blue-900">{count} booked</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Quick Administrative Actions</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setActiveAdminTab('reports')}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-blue-700 mb-1" />
                <span className="font-bold block text-slate-800">Upload Report</span>
                <span className="text-[10px] text-slate-500">Sign & publish PDF</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('tests')}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
              >
                <DollarSign className="w-4 h-4 text-emerald-700 mb-1" />
                <span className="font-bold block text-slate-800">Edit Test Rates</span>
                <span className="text-[10px] text-slate-500">Update general tariff</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
