import React from 'react';
import { Truck, Clock, MapPin, Phone, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { COLLECTION_SLOTS } from '../../data/initialData';

export const AdminHomeCollectionManagement: React.FC = () => {
  const { bookings, phlebotomists, websiteConfig, updateWebsiteConfig, setSelectedBookingForTrack } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const homeCollectionBookings = bookings.filter(b => b.status !== 'CANCELLED');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Home Sample Collection Operations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Field phlebotomist logistics, route planning, and time-slot capacity.
          </p>
        </div>
      </div>

      {/* Field Staff Roster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phlebotomists.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{p.name}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Active On Field
              </span>
            </div>
            <p className="text-xs text-slate-600 font-mono flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>+91 {p.phone}</span>
            </p>
            <p className="text-[11px] text-slate-500">
              {p.vaccinationStatus}
            </p>
          </div>
        ))}
      </div>

      {/* Today's Collections Queue */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">Scheduled Home Pickup Visits</h3>

        <div className="space-y-3">
          {homeCollectionBookings.map(b => (
            <div
              key={b.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-900 text-sm">#{b.bookingNumber}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    {b.status.replace(/_/g, ' ')}
                  </span>
                  {b.sampleBarcode && (
                    <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                      Barcode: {b.sampleBarcode}
                    </span>
                  )}
                </div>

                <p className="font-bold text-slate-900">
                  {b.userName} · <span className="font-mono text-slate-600">+91 {b.userPhone}</span>
                </p>

                <p className="text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{b.address.addressLine}, {b.address.landmark || ''} ({b.address.pincode})</span>
                </p>

                <p className="text-slate-500 text-[11px]">
                  Slot: <span className="font-semibold text-slate-800">{b.bookingDate} · {b.collectionSlot}</span>
                </p>
              </div>

              <div className="flex flex-col md:items-end justify-between gap-2">
                <span className="font-mono font-bold text-slate-900 text-sm">₹{b.total}</span>
                <button
                  onClick={() => setSelectedBookingForTrack(b)}
                  className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  Track Lifecycle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
