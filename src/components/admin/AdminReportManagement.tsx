import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Plus,
  Trash2,
  ShieldCheck,
  Building2,
  AlertCircle,
  FileUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking, DiagnosticReport, LabReportResultItem } from '../../types';
import { uploadReportPdfToSupabase } from '../../lib/supabase';

export const AdminReportManagement: React.FC = () => {
  const { bookings, reports, uploadAndPublishReport, setViewingReport } = useApp();
  const [filter, setFilter] = useState<'PENDING' | 'PUBLISHED' | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  // Upload/Generate Report Modal
  const [selectedBookingForUpload, setSelectedBookingForUpload] = useState<Booking | null>(null);
  const [resultsList, setResultsList] = useState<LabReportResultItem[]>([]);
  const [pathologistNotes, setPathologistNotes] = useState('All biological parameters tested within reference intervals.');
  const [approvedBy, setApprovedBy] = useState('Dr. Vikas Singhal (M.D. Pathologist) & Dr. Neha Gupta (M.D. Microbiologist)');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleOpenUploadModal = (booking: Booking) => {
    setSelectedBookingForUpload(booking);

    // Auto-generate sensible default parameter items based on booked tests
    const defaultParams: LabReportResultItem[] = [];
    booking.items.forEach(item => {
      if (item.nameSnapshot.includes('CBC')) {
        defaultParams.push(
          { parameter: 'Hemoglobin (Hb)', observedValue: '14.2', unit: 'g/dL', referenceInterval: '13.0 - 17.0', isAbnormal: false, method: 'Cyanmethemoglobin' },
          { parameter: 'Total WBC Count', observedValue: '6,800', unit: 'cells/cu.mm', referenceInterval: '4,000 - 11,000', isAbnormal: false, method: 'Cell Counter' },
          { parameter: 'Platelet Count', observedValue: '2,40,000', unit: '/cu.mm', referenceInterval: '1,50,000 - 4,50,000', isAbnormal: false, method: 'Impedance' }
        );
      } else if (item.nameSnapshot.includes('TSH') || item.nameSnapshot.includes('Thyroid')) {
        defaultParams.push(
          { parameter: 'TSH (Thyroid Stimulating Hormone)', observedValue: '2.18', unit: 'uIU/mL', referenceInterval: '0.35 - 4.94', isAbnormal: false, method: 'CLIA' }
        );
      } else if (item.nameSnapshot.includes('Vitamin D')) {
        defaultParams.push(
          { parameter: 'Vitamin D 25-Hydroxy', observedValue: '32.4', unit: 'ng/mL', referenceInterval: '30.0 - 100.0 (Sufficient)', isAbnormal: false, method: 'CLIA' }
        );
      } else if (item.nameSnapshot.includes('Vitamin B12')) {
        defaultParams.push(
          { parameter: 'Vitamin B12', observedValue: '385', unit: 'pg/mL', referenceInterval: '211 - 911', isAbnormal: false, method: 'CLIA' }
        );
      } else if (item.nameSnapshot.includes('HbA1c')) {
        defaultParams.push(
          { parameter: 'HbA1c (Glycosylated Hemoglobin)', observedValue: '5.6', unit: '%', referenceInterval: '< 5.7 Normal', isAbnormal: false, method: 'HPLC' }
        );
      } else {
        defaultParams.push(
          { parameter: item.nameSnapshot, observedValue: 'Normal / Verified', unit: 'Index', referenceInterval: 'Normal Clinical Range', isAbnormal: false, method: 'Automated Analyzer' }
        );
      }
    });

    setResultsList(defaultParams);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForUpload) return;
    setIsUploading(true);

    let storagePath: string | undefined = undefined;
    if (pdfFile) {
      const res = await uploadReportPdfToSupabase(selectedBookingForUpload.bookingNumber, pdfFile);
      storagePath = res.path;
    }

    uploadAndPublishReport(selectedBookingForUpload.id, {
      results: resultsList,
      pathologistNotes,
      approvedBy,
      downloadUrl: storagePath
    });
    setIsUploading(false);
    setPdfFile(null);
    setSelectedBookingForUpload(null);
  };

  const handleAddParam = () => {
    setResultsList([
      ...resultsList,
      { parameter: 'New Parameter', observedValue: '0', unit: 'mg/dL', referenceInterval: 'Normal', isAbnormal: false, method: 'Automated' }
    ]);
  };

  const handleRemoveParam = (index: number) => {
    setResultsList(resultsList.filter((_, idx) => idx !== index));
  };

  const handleUpdateParam = (index: number, field: keyof LabReportResultItem, val: any) => {
    const updated = [...resultsList];
    updated[index] = { ...updated[index], [field]: val };
    setResultsList(updated);
  };

  const filteredBookings = bookings.filter(b => {
    const hasReport = reports.some(r => r.bookingId === b.id || r.bookingNumber === b.bookingNumber);
    if (filter === 'PENDING' && hasReport) return false;
    if (filter === 'PUBLISHED' && !hasReport) return false;

    const q = search.toLowerCase().trim();
    return (
      !q ||
      b.bookingNumber.toLowerCase().includes(q) ||
      b.userName.toLowerCase().includes(q) ||
      b.userPhone.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Diagnostic Reports Management & Publishing</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pathologist verification, computerized report entry, and instant patient delivery.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search booking #, patient..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {(['ALL', 'PENDING', 'PUBLISHED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === f
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f === 'ALL' && `All Records (${bookings.length})`}
            {f === 'PENDING' && `Pending Upload (${bookings.filter(b => !reports.some(r => r.bookingId === b.id)).length})`}
            {f === 'PUBLISHED' && `Published Reports (${reports.length})`}
          </button>
        ))}
      </div>

      {/* Bookings & Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Booking #</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Tests Ordered</th>
                <th className="py-3 px-4">Sample Collection Status</th>
                <th className="py-3 px-4">Report Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.map(b => {
                const report = reports.find(r => r.bookingId === b.id || r.bookingNumber === b.bookingNumber);
                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">
                      #{b.bookingNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{b.userName}</span>
                      <span className="text-[11px] font-mono text-slate-500">{b.userPhone}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate">
                      {b.items.map(i => i.nameSnapshot).join(', ')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {report ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PUBLISHED (v{report.version})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" />
                          <span>AWAITING REPORT</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {report ? (
                          <>
                            <button
                              onClick={() => setViewingReport(report)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View PDF</span>
                            </button>
                            <button
                              onClick={() => handleOpenUploadModal(b)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded text-[11px] transition-colors cursor-pointer"
                              title="Replace / New Version"
                            >
                              Revise
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenUploadModal(b)}
                            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload / Generate</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate & Publish Clinical Report Modal */}
      {selectedBookingForUpload && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Pathology Laboratory Report Generator & Publisher</h3>
                <p className="text-[11px] text-slate-400">
                  Booking #{selectedBookingForUpload.bookingNumber} · Patient: {selectedBookingForUpload.userName}
                </p>
              </div>
              <button
                onClick={() => setSelectedBookingForUpload(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">Investigations Covered:</span>
                  <p className="text-slate-600 mt-0.5">
                    {selectedBookingForUpload.items.map(i => i.nameSnapshot).join(' | ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddParam}
                  className="px-2.5 py-1 bg-blue-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Parameter</span>
                </button>
              </div>

              {/* Observed Test Results Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="py-2 px-3">Parameter Name</th>
                      <th className="py-2 px-3">Observed Value</th>
                      <th className="py-2 px-3">Unit</th>
                      <th className="py-2 px-3">Biological Ref Range</th>
                      <th className="py-2 px-3 text-center">Alert?</th>
                      <th className="py-2 px-3 text-right">Del</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {resultsList.map((res, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            required
                            value={res.parameter}
                            onChange={e => handleUpdateParam(idx, 'parameter', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            required
                            value={res.observedValue}
                            onChange={e => handleUpdateParam(idx, 'observedValue', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={res.unit}
                            onChange={e => handleUpdateParam(idx, 'unit', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={res.referenceInterval}
                            onChange={e => handleUpdateParam(idx, 'referenceInterval', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={res.isAbnormal || false}
                            onChange={e => handleUpdateParam(idx, 'isAbnormal', e.target.checked)}
                            className="rounded text-amber-600"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveParam(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pathologist Notes */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Pathologist Clinical Findings & Interpretation
                </label>
                <textarea
                  rows={2}
                  value={pathologistNotes}
                  onChange={e => setPathologistNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Doctors Approval */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Pathologist Sign-Off Endorsement
                </label>
                <input
                  type="text"
                  value={approvedBy}
                  onChange={e => setApprovedBy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>

              {/* Supabase Storage PDF Upload Option */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <FileUp className="w-4 h-4 text-blue-700" />
                  <label className="text-[11px] font-bold text-slate-800">
                    Upload Signed PDF Document (Supabase Storage 'reports' bucket)
                  </label>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setPdfFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  Optional: If uploaded, the binary PDF is archived in private Supabase Storage and served via signed URLs.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setPdfFile(null);
                    setSelectedBookingForUpload(null);
                  }}
                  className="px-3 py-1.5 text-slate-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading to Supabase Storage...' : 'Publish Report to Patient Portal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
