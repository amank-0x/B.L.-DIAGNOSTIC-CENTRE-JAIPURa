import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertCircle,
  Truck,
  FlaskConical,
  FileText,
  MapPin,
  Phone,
  ChevronDown,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus } from '../../types';

export const AdminBookingManagement: React.FC = () => {
  const {
    bookings,
    updateBookingStatus,
    assignPhlebotomist,
    phlebotomists,
    setSelectedBookingForTrack,
    setViewingReport,
    reports,
    setActiveAdminTab
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<Booking | null>(null);
  const [assignModalBooking, setAssignModalBooking] = useState<Booking | null>(null);
  const [selectedPhlebId, setSelectedPhlebId] = useState(phlebotomists[0]?.id || '');

  const statuses: { label: string; value: string }[] = [
    { label: 'All Bookings', value: 'ALL' },
    { label: 'New', value: 'NEW' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Assigned', value: 'COLLECTION_ASSIGNED' },
    { label: 'Sample Collected', value: 'SAMPLE_COLLECTED' },
    { label: 'At Lab (Received)', value: 'SAMPLE_RECEIVED' },
    { label: 'Processing', value: 'PROCESSING' },
    { label: 'Report Published', value: 'REPORT_PUBLISHED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.bookingNumber.toLowerCase().includes(q) ||
      b.userName.toLowerCase().includes(q) ||
      b.userPhone.includes(q) ||
      b.items.some(i => i.nameSnapshot.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (bookingId: string, status: BookingStatus) => {
    updateBookingStatus(bookingId, status);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignModalBooking && selectedPhlebId) {
      assignPhlebotomist(assignModalBooking.id, selectedPhlebId);
      setAssignModalBooking(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Diagnostic Bookings & Order Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee phlebotomy home visits, specimen reception, and test progress.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search booking #, phone, patient..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {statuses.map(st => (
          <button
            key={st.value}
            onClick={() => setSelectedStatus(st.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              selectedStatus === st.value
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Booking #</th>
                <th className="py-3 px-4">Patient & Phone</th>
                <th className="py-3 px-4">Schedule & Address</th>
                <th className="py-3 px-4">Tests / Package</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.map(b => {
                const rep = reports.find(r => r.bookingId === b.id || r.bookingNumber === b.bookingNumber);
                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Booking number */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-900 block text-xs">
                        #{b.bookingNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{b.userName}</span>
                      <span className="font-mono text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {b.userPhone}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {b.bookingDate}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                        {b.collectionSlot.split(' ')[0]} {b.collectionSlot.split(' ')[1]} · {b.address.landmark || b.address.city}
                      </span>
                    </td>

                    {/* Tests */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 line-clamp-1 max-w-[190px]">
                        {b.items.map(i => i.nameSnapshot).join(', ')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {b.items.length} item(s)
                      </span>
                    </td>

                    {/* Amount & Payment */}
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-slate-900 block">₹{b.total}</span>
                      <span
                        className={`text-[10px] font-bold ${
                          b.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={b.status}
                        onChange={e => handleStatusChange(b.id, e.target.value as BookingStatus)}
                        className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COLLECTION_ASSIGNED">COLLECTION_ASSIGNED</option>
                        <option value="SAMPLE_COLLECTED">SAMPLE_COLLECTED</option>
                        <option value="SAMPLE_RECEIVED">SAMPLE_RECEIVED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="REPORT_READY">REPORT_READY</option>
                        <option value="REPORT_PUBLISHED">REPORT_PUBLISHED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="SAMPLE_RECOLLECTION_REQUIRED">RECOLLECTION_REQUIRED</option>
                      </select>

                      {b.assignedPhlebotomist && (
                        <span className="text-[10px] text-blue-700 font-medium block mt-1">
                          Staff: {b.assignedPhlebotomist.name.split(' ')[0]}
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setAssignModalBooking(b)}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold rounded text-[11px] transition-colors cursor-pointer"
                          title="Assign Staff"
                        >
                          Assign Staff
                        </button>

                        <button
                          onClick={() => setSelectedBookingForTrack(b)}
                          className="p-1 text-slate-400 hover:text-slate-800 transition-colors"
                          title="View Timeline"
                        >
                          <Clock className="w-4 h-4" />
                        </button>

                        {rep && (
                          <button
                            onClick={() => setViewingReport(rep)}
                            className="p-1 text-emerald-600 hover:text-emerald-800 transition-colors"
                            title="View Report"
                          >
                            <FileText className="w-4 h-4" />
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

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs">
            No bookings found for the selected filter.
          </div>
        )}
      </div>

      {/* Assign Phlebotomist Modal */}
      {assignModalBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Assign Phlebotomist for Home Pickup</h3>
                <p className="text-[11px] text-slate-400">
                  Booking #{assignModalBooking.bookingNumber} · {assignModalBooking.userName}
                </p>
              </div>
              <button
                onClick={() => setAssignModalBooking(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Select Certified Phlebotomist
                </label>
                <select
                  value={selectedPhlebId}
                  onChange={e => setSelectedPhlebId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  {phlebotomists.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Ph: {p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 space-y-1 text-[11px]">
                <p>
                  <span className="font-bold">Address:</span> {assignModalBooking.address.addressLine}
                </p>
                <p>
                  <span className="font-bold">Slot:</span> {assignModalBooking.bookingDate} ({assignModalBooking.collectionSlot})
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalBooking(null)}
                  className="px-3 py-1.5 text-slate-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
