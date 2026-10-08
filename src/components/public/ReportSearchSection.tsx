import React, { useState } from 'react';
import { FileText, Search, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DiagnosticReport } from '../../types';

export const ReportSearchSection: React.FC = () => {
  const { reports, bookings, setViewingReport, showToast } = useApp();
  const [searchBookingNum, setSearchBookingNum] = useState('BL-10241');
  const [searchPhone, setSearchPhone] = useState('9828012345');
  const [searchedReport, setSearchedReport] = useState<DiagnosticReport | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanBookingNum = searchBookingNum.trim().toUpperCase();
    const cleanPhone = searchPhone.trim().replace(/\D/g, '');

    // Look for matching report
    const match = reports.find(r => {
      const matchNum = r.bookingNumber.toUpperCase() === cleanBookingNum;
      // Match phone via booking
      const book = bookings.find(b => b.id === r.bookingId || b.bookingNumber === r.bookingNumber);
      const matchPhone = !cleanPhone || (book && book.userPhone.replace(/\D/g, '').endsWith(cleanPhone.slice(-4)));
      return matchNum && matchPhone;
    });

    if (match) {
      setSearchedReport(match);
      showToast(`Found verified report for #${match.bookingNumber}`);
    } else {
      setSearchedReport(null);
    }
  };

  return (
    <section id="reports_search" className="py-12 sm:py-16 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Context */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
              Digital Pathology Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Instant Online Report Access
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Retrieve your laboratory test results anytime without visiting the center.
              Every digital report is secured with a QR code and certified by M.D. Pathologists.
            </p>
            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NABL compliant biological reference intervals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>High / Low pathology flags clearly demarcated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% printable high-resolution PDF download</span>
              </div>
            </div>
          </div>

          {/* Right Column: Search Box & Result Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-5">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Download Report by Booking ID</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your Booking ID (e.g. <span className="font-mono text-blue-300">BL-10241</span>) and registered mobile number.
                </p>
              </div>

              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-6">
                  <label className="text-[11px] text-slate-300 block mb-1 font-medium">Booking Number</label>
                  <input
                    type="text"
                    required
                    value={searchBookingNum}
                    onChange={e => setSearchBookingNum(e.target.value)}
                    placeholder="e.g. BL-10241"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="text-[11px] text-slate-300 block mb-1 font-medium">Registered Mobile</label>
                  <input
                    type="tel"
                    required
                    value={searchPhone}
                    onChange={e => setSearchPhone(e.target.value)}
                    placeholder="9828012345"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="sm:col-span-12 pt-1">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Diagnostic Report</span>
                  </button>
                </div>
              </form>

              {/* Result Preview */}
              {hasSearched && (
                <div className="pt-2 border-t border-slate-700/80">
                  {searchedReport ? (
                    <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white font-mono">
                            #{searchedReport.bookingNumber}
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                            VERIFIED & PUBLISHED
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Patient: <span className="font-bold text-white">{searchedReport.patientName}</span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Tests: {searchedReport.testNames.join(', ')}
                        </p>
                      </div>

                      <button
                        onClick={() => setViewingReport(searchedReport)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View / Print PDF</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg flex items-start gap-2.5 text-xs text-amber-200">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">No Published Report Found</span>
                        <p className="text-[11px] text-amber-300/80 mt-0.5">
                          The booking might still be in sample collection or lab analysis stage. Try sample booking <span className="font-mono text-white font-bold">BL-10241</span> (Phone: 9828012345).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
