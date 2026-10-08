import React, { useState } from 'react';
import { Users, Search, Phone, Mail, MapPin, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminUserManagement: React.FC = () => {
  const { currentUser, bookings, reports } = useApp();
  const [search, setSearch] = useState('');

  // Collect all known unique patients from currentUser and bookings
  const usersList = [
    currentUser,
    {
      id: 'usr-102',
      name: 'Priya Meena',
      phone: '9414123890',
      email: 'priya.m@example.com',
      age: 29,
      gender: 'Female',
      createdAt: '2026-10-01T09:00:00Z',
      addresses: [
        {
          id: 'addr-3',
          userId: 'usr-102',
          label: 'Home',
          addressLine: 'House 88, Lane 4, Mansarovar Sector 5',
          landmark: 'Behind Swarn Path Park',
          city: 'Jaipur',
          pincode: '302020',
          isDefault: true
        }
      ]
    },
    {
      id: 'usr-103',
      name: 'Amit Singhania',
      phone: '9829988776',
      email: 'amit.s@example.com',
      age: 45,
      gender: 'Male',
      createdAt: '2026-10-04T11:20:00Z',
      addresses: [
        {
          id: 'addr-4',
          userId: 'usr-103',
          label: 'Home',
          addressLine: 'Villa 12, Golden Enclave, Sirsi Road',
          landmark: 'Near Bindayaka',
          city: 'Jaipur',
          pincode: '302012',
          isDefault: true
        }
      ]
    }
  ].filter(Boolean);

  const filteredUsers = usersList.filter(u => {
    if (!u) return false;
    const q = search.toLowerCase().trim();
    return !q || u.name.toLowerCase().includes(q) || u.phone.includes(q) || (u.email && u.email.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Registered Patients & Customer Accounts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Profiles, saved delivery addresses, and patient diagnostics history.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patients by name, mobile..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map(u => {
          if (!u) return null;
          const userBookings = bookings.filter(b => b.userId === u.id || b.userPhone === u.phone);
          const userReps = reports.filter(r => r.userId === u.id || userBookings.some(b => b.id === r.bookingId));

          return (
            <div
              key={u.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                      {u.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{u.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {u.id}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    Active
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-1">
                  <p className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>+91 {u.phone}</span>
                  </p>
                  {u.email && (
                    <p className="flex items-center gap-1.5 text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{u.email}</span>
                    </p>
                  )}
                  <p className="flex items-start gap-1.5 text-[11px] text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{u.addresses?.[0]?.addressLine || 'Jaipur Central'}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">{userBookings.length} Bookings</span>
                <span className="text-blue-700 font-semibold font-mono">{userReps.length} Reports</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
