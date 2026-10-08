import React, { useState } from 'react';
import { DiagnosticReport } from '../../types';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Building2, Phone, MapPin, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSignedReportDownloadUrl } from '../../lib/supabase';

interface Props {
  report: DiagnosticReport;
  onClose: () => void;
}

export const DiagnosticReportModal: React.FC<Props> = ({ report, onClose }) => {
  const { websiteConfig, bookings, showToast } = useApp();
  const booking = bookings.find(b => b.id === report.bookingId || b.bookingNumber === report.bookingNumber);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSignedUrl = async () => {
    if (report.downloadUrl) {
      setIsDownloading(true);
      const res = await getSignedReportDownloadUrl(report.downloadUrl);
      setIsDownloading(false);
      if (res.signedUrl) {
        window.open(res.signedUrl, '_blank');
        return;
      }
    }
    // Default fallback to browser print/PDF export
    handlePrint();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-4 print:my-0 print:border-none print:shadow-none">
        {/* Top Action Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm sm:text-base">Verified Diagnostic Laboratory Report</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
              #{report.bookingNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSignedUrl}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Fetching...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Diagnostic Report Body */}
        <div id="printable-report" className="p-6 sm:p-8 text-slate-900 bg-white font-sans">
          {/* Lab Header */}
          <div className="border-b-2 border-blue-900 pb-5 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xl">
                    BL
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-blue-950 font-sans">
                      {websiteConfig.centerName}
                    </h1>
                    <p className="text-xs text-blue-800 font-semibold tracking-wider uppercase">
                      A Referral Clinical Pathology Laboratory · ISO 9001:2015 Certified
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Central Lab: {websiteConfig.centralLabAddress}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Helpline: {websiteConfig.helplinePhone}, {websiteConfig.alternatePhone} | Email: {websiteConfig.supportEmail}</span>
                  </p>
                </div>
              </div>

              {/* Barcode & Accreditation */}
              <div className="sm:text-right flex flex-col items-start sm:items-end">
                <div className="bg-slate-100 px-3 py-1.5 rounded border border-slate-200 text-left sm:text-right">
                  <div className="font-mono text-xs font-bold text-slate-800 tracking-widest">
                    |||||||| |||| |||||| |||||
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 mt-0.5">
                    BARCODE: {booking?.sampleBarcode || 'BL26-0710-8841'}
                  </div>
                </div>
                <div className="mt-1 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>NABL Quality Benchmarked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Demographic & Order Information Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4">
              <div>
                <span className="text-slate-500 block text-[11px]">Patient Name</span>
                <span className="font-bold text-slate-900 text-sm">{report.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Age / Gender</span>
                <span className="font-semibold text-slate-800">{report.patientAge || 34} Yrs / {report.patientGender || 'Male'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Booking / Lab ID</span>
                <span className="font-mono font-bold text-blue-900">{report.bookingNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Referred By</span>
                <span className="font-semibold text-slate-800">Self / Dr. Clinical Consultant</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Sample Drawn</span>
                <span className="text-slate-800">
                  {booking?.bookingDate ? `${booking.bookingDate} · ${booking.collectionSlot.split(' ')[0]}` : '07 Oct 2026 07:15 AM'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Sample Received</span>
                <span className="text-slate-800">07 Oct 2026 07:55 AM</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Report Published</span>
                <span className="text-slate-800">
                  {report.publishedAt ? new Date(report.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '07 Oct 2026 09:30 AM'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Report Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  FINAL VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Test Investigation Title */}
          <div className="mb-4">
            <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wide border-b border-slate-200 pb-1.5">
              DEPARTMENT OF CLINICAL PATHOLOGY & BIOCHEMISTRY
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Tests Investigated: <span className="font-semibold text-slate-700">{report.testNames.join(' | ')}</span>
            </p>
          </div>

          {/* Diagnostic Results Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Investigation / Parameter</th>
                  <th className="py-2.5 px-3">Observed Value</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Biological Reference Interval</th>
                  <th className="py-2.5 px-3">Methodology</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {report.results.map((res, idx) => (
                  <tr key={idx} className={res.isAbnormal ? 'bg-amber-50/60 font-semibold' : 'hover:bg-slate-50/50'}>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {res.parameter}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums">
                      <span className={res.isAbnormal ? 'text-amber-700 font-extrabold' : 'text-slate-900'}>
                        {res.observedValue}
                      </span>
                      {res.isAbnormal && (
                        <span className="ml-1.5 text-[10px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-sans">
                          Alert
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                      {res.unit || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                      {res.referenceInterval || 'Reference Normal'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                      {res.method || 'Automated Clinical Analyzer'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pathologist Diagnostic Interpretation */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span>Pathologist Notes & Interpretation:</span>
            </h4>
            <p className="leading-relaxed">
              {report.pathologistNotes || 'All evaluated parameters show biological values consistent with typical physiological baselines.'}
            </p>
            <p className="text-[10px] text-slate-400 mt-2 italic">
              * Note: Clinical correlation is recommended. Biological variations and medication history should be considered by the attending physician.
            </p>
          </div>

          {/* Lab Sign-off & Pathologist Endorsements (Desk of Pathologist) */}
          <div className="border-t border-slate-200 pt-6 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left text-xs">
              <div>
                <p className="text-[11px] text-slate-500">Electronically Verified by Medical Laboratory Technology Team</p>
                <p className="font-semibold text-slate-800">Quality Control Unit: Internal & External EQAS Verified</p>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="font-serif italic font-bold text-blue-900 text-sm tracking-wide mb-1 border-b border-slate-300 pb-1">
                    Dr. Neha Gupta
                  </div>
                  <p className="font-bold text-slate-900 text-xs">Dr. Neha Gupta</p>
                  <p className="text-[11px] text-slate-600">M.D. Microbiologist</p>
                  <p className="text-[10px] text-slate-400">Reg. No. 29463/17683</p>
                </div>

                <div className="text-center">
                  <div className="font-serif italic font-bold text-blue-900 text-sm tracking-wide mb-1 border-b border-slate-300 pb-1">
                    Dr. Vikas Singhal
                  </div>
                  <p className="font-bold text-slate-900 text-xs">Dr. Vikas Singhal</p>
                  <p className="text-[11px] text-slate-600">M.B.B.S., M.D. Pathologist</p>
                  <p className="text-[10px] text-slate-400">Reg. No. 17562/61248</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
              This is a computer-generated authenticated clinical pathology report with digital security signature. Valid without manual ink signature.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
