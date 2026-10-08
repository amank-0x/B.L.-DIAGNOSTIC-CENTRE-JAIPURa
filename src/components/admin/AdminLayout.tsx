import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Settings,
  Users,
  Shield,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Truck,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminBookingManagement } from './AdminBookingManagement';
import { AdminTestManagement } from './AdminTestManagement';
import { AdminPackageManagement } from './AdminPackageManagement';
import { AdminReportManagement } from './AdminReportManagement';
import { AdminHomeCollectionManagement } from './AdminHomeCollectionManagement';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminRevenueDashboard } from './AdminRevenueDashboard';
import { AdminActivityLogs } from './AdminActivityLogs';
import { AdminSettingsContent } from './AdminSettingsContent';
import { AdminSecuritySettings } from './AdminSecuritySettings';
import { AdminLoginGate } from './AdminLoginGate';

export const AdminLayout: React.FC = () => {
  const {
    activeAdminTab,
    setActiveAdminTab,
    isAdminAuthenticated,
    logoutAdmin,
    navigateToPortal,
    websiteConfig,
    authSettings,
    bookings,
    reports
  } = useApp();

  // Strict Security Guard: If unauthenticated, render the dedicated AdminLoginGate
  if (!isAdminAuthenticated) {
    return <AdminLoginGate />;
  }

  const pendingReportsCount = bookings.filter(b => !reports.some(r => r.bookingId === b.id)).length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'NEW' || b.status === 'CONFIRMED').length;

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateToPortal('public')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                BL
              </span>
              <div>
                <h1 className="font-bold text-sm sm:text-base leading-none">
                  {websiteConfig.centerName}
                </h1>
                <span className="text-[10px] text-blue-400 font-mono">
                  Administrative Suite · +91 {authSettings.adminAuthorizedPhone || websiteConfig.adminPhone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>SUPER ADMIN ACTIVE</span>
            </span>
            <button
              onClick={() => navigateToPortal('public')}
              className="hidden sm:inline-flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Public Website
            </button>
            <button
              onClick={logoutAdmin}
              className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1">
            <button
              onClick={() => setActiveAdminTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeAdminTab === 'dashboard'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveAdminTab('bookings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeAdminTab === 'bookings'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Bookings & Orders</span>
              </div>
              {pendingBookingsCount > 0 && (
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminTab('reports')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeAdminTab === 'reports'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Diagnostic Reports</span>
              </div>
              {pendingReportsCount > 0 && (
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-600 text-white">
                  {pendingReportsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminTab('tests')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeAdminTab === 'tests'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Test Catalogue</span>
              </div>
            </button>

            <button
              onClick={() => setActiveAdminTab('packages')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeAdminTab === 'packages'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Health Packages</span>
              </div>
            </button>

            <button
              onClick={() => setActiveAdminTab('revenue')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeAdminTab === 'revenue'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Revenue & Analytics</span>
              </div>
            </button>

            <button
              onClick={() => setActiveAdminTab('collections')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeAdminTab === 'collections'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Home Collections</span>
              </div>
            </button>

            <button
              onClick={() => setActiveAdminTab('users')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeAdminTab === 'users'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Registered Patients</span>
              </div>
            </button>

            <button
              onClick={() => setActiveAdminTab('activity_logs')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeAdminTab === 'activity_logs'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                <span>Activity Audit Logs</span>
              </div>
            </button>

            <button
              onClick={() => setActiveAdminTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeAdminTab === 'settings'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Center Settings</span>
              </div>
            </button>

            <button
              onClick={() => setActiveAdminTab('security_settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeAdminTab === 'security_settings'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Auth & Security</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>
          </div>

          {/* Main Stage */}
          <div className="lg:col-span-9">
            {activeAdminTab === 'dashboard' && <AdminDashboardOverview />}
            {activeAdminTab === 'bookings' && <AdminBookingManagement />}
            {activeAdminTab === 'tests' && <AdminTestManagement />}
            {activeAdminTab === 'packages' && <AdminPackageManagement />}
            {activeAdminTab === 'reports' && <AdminReportManagement />}
            {activeAdminTab === 'collections' && <AdminHomeCollectionManagement />}
            {activeAdminTab === 'users' && <AdminUserManagement />}
            {activeAdminTab === 'revenue' && <AdminRevenueDashboard />}
            {activeAdminTab === 'activity_logs' && <AdminActivityLogs />}
            {activeAdminTab === 'settings' && <AdminSettingsContent />}
            {activeAdminTab === 'security_settings' && <AdminSecuritySettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

