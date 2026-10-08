import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  MapPin,
  Bell,
  User,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Phone,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAddress } from '../../types';

export const UserPortal: React.FC = () => {
  const {
    currentUser,
    logoutUser,
    activeUserTab,
    setActiveUserTab,
    bookings,
    reports,
    notifications,
    markNotificationAsRead,
    unreadNotificationsCount,
    setViewingReport,
    setSelectedBookingForTrack,
    updateUserProfile,
    addUserAddress,
    deleteUserAddress,
    setDefaultAddress,
    setCurrentPortal,
    navigateToPortal,
    setIsUserAuthModalOpen
  } = useApp();

  // Profile edit state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editAge, setEditAge] = useState(currentUser?.age || 34);
  const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Other'>(currentUser?.gender || 'Male');

  // Address add state
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newLine, setNewLine] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPincode, setNewPincode] = useState('302021');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-5">
        <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <User className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900">Sign In to Your Patient Portal</h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            View upcoming sample collections, track phlebotomists, manage home addresses, and download pathologist-verified PDF reports.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsUserAuthModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Sign In with Mobile OTP
          </button>
          <button
            onClick={() => navigateToPortal('public')}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Return to Diagnostic Home
          </button>
        </div>
      </div>
    );
  }

  // Filter bookings and reports for this user
  const userBookings = bookings.filter(b => b.userId === currentUser.id || b.userPhone === currentUser.phone);
  const userReports = reports.filter(r => r.userId === currentUser.id || userBookings.some(b => b.id === r.bookingId || b.bookingNumber === r.bookingNumber));
  const userNotifs = notifications.filter(n => n.userId === 'all' || n.userId === currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      email: editEmail,
      age: Number(editAge),
      gender: editGender
    });
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLine || !newPincode) return;
    addUserAddress({
      label: newLabel,
      addressLine: newLine,
      landmark: newLandmark,
      city: 'Jaipur',
      pincode: newPincode,
      isDefault: false
    });
    setShowAddAddr(false);
    setNewLine('');
    setNewLandmark('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Welcome Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-lg">
            {currentUser.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Verified Patient
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              +91 {currentUser.phone} · {currentUser.email || 'No email attached'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPortal('public')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Book More Tests
          </button>
          <button
            onClick={logoutUser}
            className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Tabs & Right Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-2 shadow-xs space-y-1">
          <button
            onClick={() => setActiveUserTab('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeUserTab === 'dashboard'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </button>

          <button
            onClick={() => setActiveUserTab('bookings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeUserTab === 'bookings'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4" />
              <span>My Bookings</span>
            </div>
            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-black/10">
              {userBookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveUserTab('reports')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeUserTab === 'reports'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>My Reports</span>
            </div>
            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-black/10">
              {userReports.length}
            </span>
          </button>

          <button
            onClick={() => setActiveUserTab('addresses')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeUserTab === 'addresses'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </div>
            <span className="font-mono text-[11px]">
              {currentUser.addresses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveUserTab('notifications')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeUserTab === 'notifications'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-mono">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveUserTab('profile')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeUserTab === 'profile'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </div>
          </button>
        </div>

        {/* Tab Content Stage */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeUserTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
                  <p className="text-2xl font-bold font-mono text-slate-900">{userBookings.length}</p>
                  <p className="text-[11px] text-slate-500">Scheduled home sample collections</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Diagnostic Reports</span>
                  <p className="text-2xl font-bold font-mono text-blue-900">{userReports.length}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Available for digital download</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Saved Addresses</span>
                  <p className="text-2xl font-bold font-mono text-slate-900">{currentUser.addresses.length}</p>
                  <p className="text-[11px] text-slate-500">Quick checkout configured</p>
                </div>
              </div>

              {/* Latest Active Booking Widget */}
              {userBookings.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Latest Appointment</span>
                      <h3 className="font-bold text-base text-slate-900 mt-0.5">
                        Booking #{userBookings[0].bookingNumber}
                      </h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded font-bold bg-blue-100 text-blue-900 self-start sm:self-auto">
                      {userBookings[0].status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Date & Time Slot:</span>
                      <span className="font-semibold text-slate-800">
                        {userBookings[0].bookingDate} · {userBookings[0].collectionSlot}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Collection Address:</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {userBookings[0].address.addressLine}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Tests Included:</span>
                      <span className="font-semibold text-slate-800">
                        {userBookings[0].items.map(i => i.nameSnapshot).join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Bill Total:</span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{userBookings[0].total} ({userBookings[0].paymentMode.replace(/_/g, ' ')})
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setSelectedBookingForTrack(userBookings[0])}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Track Live Collection Progress</span>
                    </button>

                    {userReports.find(r => r.bookingNumber === userBookings[0].bookingNumber) && (
                      <button
                        onClick={() => {
                          const rep = userReports.find(r => r.bookingNumber === userBookings[0].bookingNumber);
                          if (rep) setViewingReport(rep);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Verified Report</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY BOOKINGS */}
          {activeUserTab === 'bookings' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div>
                <h3 className="font-bold text-base text-slate-900">All Diagnostic Bookings</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track phlebotomist arrival, lab processing, and report releases.
                </p>
              </div>

              <div className="space-y-4">
                {userBookings.map(b => {
                  const hasRep = reports.find(r => r.bookingId === b.id || r.bookingNumber === b.bookingNumber);
                  return (
                    <div
                      key={b.id}
                      className="p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white space-y-4 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-blue-900">
                            #{b.bookingNumber}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                            {b.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Booked on: {new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Scheduled Pickup</span>
                          <span className="font-semibold text-slate-800">
                            {b.bookingDate}
                          </span>
                          <span className="text-[11px] text-slate-500 block">{b.collectionSlot}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Tests / Package</span>
                          <span className="font-semibold text-slate-800">
                            {b.items.map(i => i.nameSnapshot).join(', ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Amount & Mode</span>
                          <span className="font-mono font-bold text-slate-900">
                            ₹{b.total}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {b.paymentMode.replace(/_/g, ' ')} ({b.paymentStatus})
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-50">
                        <div className="text-[11px] text-slate-500 truncate max-w-sm">
                          Address: {b.address.addressLine}, {b.address.city}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedBookingForTrack(b)}
                            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Track Live Progress
                          </button>

                          {hasRep && (
                            <button
                              onClick={() => setViewingReport(hasRep)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Download Report
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MY REPORTS */}
          {activeUserTab === 'reports' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div>
                <h3 className="font-bold text-base text-slate-900">Verified Diagnostic Reports</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pathology test results certified by Dr. Vikas Singhal & Dr. Neha Gupta.
                </p>
              </div>

              {userReports.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">No published reports found yet.</p>
                  <p className="text-[11px] text-slate-500">Reports appear here immediately once verified by our lab pathologist.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userReports.map(rep => (
                    <div
                      key={rep.id}
                      className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-blue-900">
                            #{rep.bookingNumber}
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            {rep.reportStatus}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {rep.testNames.join(' + ')}
                        </h4>
                        <p className="text-slate-500 text-[11px]">
                          Reported on: {new Date(rep.publishedAt || rep.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => setViewingReport(rep)}
                          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View & Print PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {activeUserTab === 'addresses' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Saved Home Collection Addresses</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Save multiple delivery addresses for your family members.
                  </p>
                </div>
                {!showAddAddr && (
                  <button
                    onClick={() => setShowAddAddr(true)}
                    className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Address</span>
                  </button>
                )}
              </div>

              {showAddAddr && (
                <form onSubmit={handleCreateAddress} className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900">New Address Details</h4>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Address Line *</label>
                    <input
                      type="text"
                      required
                      value={newLine}
                      onChange={e => setNewLine(e.target.value)}
                      placeholder="e.g. Flat 304, Sunshine Residency, Queens Road"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Landmark</label>
                      <input
                        type="text"
                        value={newLandmark}
                        onChange={e => setNewLandmark(e.target.value)}
                        placeholder="Near City Mall"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={newPincode}
                        onChange={e => setNewPincode(e.target.value)}
                        placeholder="302021"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      {(['Home', 'Work', 'Other'] as const).map(lbl => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setNewLabel(lbl)}
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            newLabel === lbl ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddr(false)}
                        className="px-3 py-1.5 text-slate-600 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-blue-700 text-white text-xs font-bold rounded-lg"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentUser.addresses.map(addr => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 flex flex-col justify-between ${
                      addr.isDefault ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-sm">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{addr.addressLine}</p>
                      <p className="text-slate-500 text-[11px] mt-1">
                        Landmark: {addr.landmark || 'None'} · {addr.city} ({addr.pincode})
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Primary delivery</span>
                      )}

                      {currentUser.addresses.length > 1 && (
                        <button
                          onClick={() => deleteUserAddress(addr.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeUserTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Appointment & Report Alerts</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time updates on home visits, sample receipt, and lab test results.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {userNotifs.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-4 rounded-xl border text-xs transition-colors cursor-pointer flex items-start gap-3 ${
                      !n.read ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE SETTINGS */}
          {activeUserTab === 'profile' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div>
                <h3 className="font-bold text-base text-slate-900">Patient Profile Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Used for diagnostic report identification and age/gender specific reference intervals.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs max-w-lg">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Age (Years)</label>
                    <input
                      type="number"
                      value={editAge}
                      onChange={e => setEditAge(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Biological Gender</label>
                    <select
                      value={editGender}
                      onChange={e => setEditGender(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
