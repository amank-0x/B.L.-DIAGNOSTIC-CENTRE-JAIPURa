import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/public/Navbar';
import { HeroSection } from './components/public/HeroSection';
import { TestsSection } from './components/public/TestsSection';
import { PackagesSection } from './components/public/PackagesSection';
import { HomeCollectionSection } from './components/public/HomeCollectionSection';
import { ReportSearchSection } from './components/public/ReportSearchSection';
import { PathologyLabSection } from './components/public/PathologyLabSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { CartDrawer } from './components/public/CartDrawer';
import { TestDetailModal } from './components/public/TestDetailModal';
import { UserAuthModal } from './components/user/UserAuthModal';
import { UserPortal } from './components/user/UserPortal';
import { TrackBookingModal } from './components/user/TrackBookingModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginGate } from './components/admin/AdminLoginGate';
import { DiagnosticReportModal } from './components/report/DiagnosticReportModal';
import { Phone, ShieldCheck, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentPortal,
    setCurrentPortal,
    navigateToPortal,
    isAdminAuthenticated,
    selectedTestForDetail,
    setSelectedTestForDetail,
    selectedBookingForTrack,
    setSelectedBookingForTrack,
    viewingReport,
    setViewingReport,
    toastMessage,
    websiteConfig
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Laboratory Bar (hidden on Admin portal to give max administrative canvas) */}
      {currentPortal !== 'admin' && (
        <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4 flex-wrap text-[11px] sm:text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>NABL Quality Pathology Network · High Precision Diagnostics</span>
              </span>
              <span className="hidden md:inline text-slate-600">|</span>
              <span className="hidden md:flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Free Home Collection above ₹{websiteConfig.freeCollectionThreshold}</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] sm:text-xs">
              <a
                href={`tel:${websiteConfig.helplinePhone}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-blue-400" />
                <span>Helpline: {websiteConfig.helplinePhone}</span>
              </a>

              <span className="text-slate-600">|</span>
              <button
                onClick={() => navigateToPortal('admin')}
                className={`transition-colors text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                  isAdminAuthenticated
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Authorized Laboratory Administrator Terminal"
              >
                <Lock className="w-3 h-3" />
                <span>{isAdminAuthenticated ? 'Admin Suite (Active)' : 'Staff / Admin Portal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation (for Public & User portal) */}
      {currentPortal !== 'admin' && <Navbar />}

      {/* Portal Router: Isolated Endpoints */}
      <main className="flex-1">
        {currentPortal === 'public' && (
          <div className="flex flex-col">
            <HeroSection />
            <TestsSection />
            <PackagesSection />
            <HomeCollectionSection />
            <ReportSearchSection />
            <PathologyLabSection />
            <ContactSection />
            <Footer />
          </div>
        )}

        {currentPortal === 'user' && (
          <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <UserPortal />
            <Footer />
          </div>
        )}

        {currentPortal === 'admin' && (
          isAdminAuthenticated ? <AdminLayout /> : <AdminLoginGate />
        )}
      </main>

      {/* Modals & Global Overlays */}
      <CartDrawer />
      <UserAuthModal />
      <AdminAuthModal />

      {selectedTestForDetail && (
        <TestDetailModal
          test={selectedTestForDetail}
          onClose={() => setSelectedTestForDetail(null)}
        />
      )}

      {selectedBookingForTrack && (
        <TrackBookingModal
          booking={selectedBookingForTrack}
          onClose={() => setSelectedBookingForTrack(null)}
        />
      )}

      {viewingReport && (
        <DiagnosticReportModal
          report={viewingReport}
          onClose={() => setViewingReport(null)}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-sm max-w-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-medium text-xs sm:text-sm">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
