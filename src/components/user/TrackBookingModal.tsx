import React from 'react';
import { Booking, BookingStatus } from '../../types';
import {
  X,
  CheckCircle2,
  Clock,
  UserCheck,
  FlaskConical,
  FileText,
  AlertCircle,
  Phone,
  ShieldCheck,
  Truck,
  Building2,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  booking: Booking;
  onClose: () => void;
}

const LIFECYCLE_STEPS: { status: BookingStatus; label: string; desc: string; icon: any }[] = [
  { status: 'NEW', label: 'Booking Placed', desc: 'Order received and logged in system', icon: Clock },
  { status: 'CONFIRMED', label: 'Confirmed', desc: 'Home collection slot reserved', icon: CheckCircle2 },
  { status: 'COLLECTION_ASSIGNED', label: 'Phlebotomist Assigned', desc: 'Field technician assigned with sterile kit', icon: UserCheck },
  { status: 'SAMPLE_COLLECTED', label: 'Sample Collected', desc: 'Blood/specimen drawn in barcoded vacutainer', icon: Truck },
  { status: 'SAMPLE_RECEIVED', label: 'Received at Lab', desc: 'Accessioned at Central Pathology Lab', icon: Building2 },
  { status: 'PROCESSING', label: 'Analysis in Progress', desc: 'Running on automated clinical analyzers', icon: FlaskConical },
  { status: 'REPORT_READY', label: 'Report Ready', desc: 'Reviewed by M.D. Pathologist', icon: ShieldCheck },
  { status: 'REPORT_PUBLISHED', label: 'Report Published', desc: 'Available for digital download', icon: FileText }
];

export const TrackBookingModal: React.FC<Props> = ({ booking, onClose }) => {
  const { reports, setViewingReport } = useApp();

  const getStepIndex = (status: BookingStatus) => {
    if (status === 'COMPLETED') return LIFECYCLE_STEPS.length - 1;
    if (status === 'CANCELLED' || status === 'SAMPLE_RECOLLECTION_REQUIRED') return -1;
    const idx = LIFECYCLE_STEPS.findIndex(s => s.status === status);
    return idx === -1 ? 0 : idx;
  };

  const currentStepIdx = getStepIndex(booking.status);
  const matchingReport = reports.find(r => r.bookingId === booking.id || r.bookingNumber === booking.bookingNumber);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg text-blue-300">#{booking.bookingNumber}</span>
              <span className="text-xs px-2 py-0.5 rounded font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30">
                {booking.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live Diagnostic Sample Collection & Processing Tracker
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Key Appointment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Scheduled Date & Time:</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                {booking.bookingDate} · {booking.collectionSlot}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Collection Address:</span>
              <span className="font-semibold text-slate-900 block mt-0.5 line-clamp-1">
                {booking.address.addressLine}, {booking.address.city} ({booking.address.pincode})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Ordered Tests / Package:</span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                {booking.items.map(i => i.nameSnapshot).join(', ')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Total Paid / Mode:</span>
              <span className="font-semibold text-slate-900 block mt-0.5 font-mono">
                ₹{booking.total} ({booking.paymentMode.replace(/_/g, ' ')})
              </span>
            </div>
          </div>

          {/* Special alerts for cancelled or recollection */}
          {booking.status === 'SAMPLE_RECOLLECTION_REQUIRED' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Sample Recollection Scheduled</p>
                <p className="mt-0.5">
                  Due to specimen hemolyzation or volume requirement, our lab supervisor has initiated a complimentary fresh redraw at no extra cost.
                </p>
              </div>
            </div>
          )}

          {booking.status === 'CANCELLED' && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Booking Cancelled</p>
                <p className="mt-0.5">This appointment was cancelled. Any online payment will be refunded within 24-48 hours.</p>
              </div>
            </div>
          )}

          {/* Phlebotomist Card if Assigned */}
          {booking.assignedPhlebotomist && (
            <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {booking.assignedPhlebotomist.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{booking.assignedPhlebotomist.name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                      Certified Phlebotomist
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {booking.assignedPhlebotomist.vaccinationStatus}
                  </p>
                  {booking.sampleBarcode && (
                    <p className="text-[11px] font-mono text-blue-900 mt-1 font-semibold">
                      Sample Barcode: {booking.sampleBarcode}
                    </p>
                  )}
                </div>
              </div>

              <a
                href={`tel:${booking.assignedPhlebotomist.phone}`}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {booking.assignedPhlebotomist.phone}</span>
              </a>
            </div>
          )}

          {/* Lifecycle Progress Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Diagnostic Sample Lifecycle
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {LIFECYCLE_STEPS.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                const StepIcon = step.icon;

                // Match with timestamp from booking status history if available
                const hist = booking.statusHistory.find(h => h.status === step.status);

                return (
                  <div key={step.status} className="relative group">
                    {/* Dot / Icon */}
                    <div
                      className={`absolute -left-[19px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                        isPassed
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-200 text-slate-500'
                      } ${isCurrent ? 'ring-4 ring-blue-100 bg-blue-600' : ''}`}
                    >
                      <StepIcon className="w-3 h-3" />
                    </div>

                    <div className="pl-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-blue-950 font-extrabold'
                              : isPassed
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                        {hist && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(hist.timestamp).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: 'short'
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                      {hist?.note && (
                        <p className="text-[11px] text-blue-700 bg-blue-50/70 p-1.5 rounded mt-1.5 font-medium">
                          {hist.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action when report is published */}
          {(booking.status === 'REPORT_PUBLISHED' || booking.status === 'COMPLETED' || matchingReport) && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="font-bold text-xs text-emerald-900">Your Diagnostic Report is Ready!</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Verified by Dr. Vikas Singhal & Dr. Neha Gupta.
                </p>
              </div>
              <button
                onClick={() => {
                  if (matchingReport) {
                    setViewingReport(matchingReport);
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>View & Download Report</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
