import React, { useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, Banknote, Calendar, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminRevenueDashboard: React.FC = () => {
  const { bookings } = useApp();
  const [timeframe, setTimeframe] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');

  const validBookings = bookings.filter(b => b.status !== 'CANCELLED');
  const paidBookings = validBookings.filter(b => b.paymentStatus === 'PAID');
  const pendingPaymentBookings = validBookings.filter(b => b.paymentStatus === 'PENDING');

  const totalGrossRevenue = validBookings.reduce((sum, b) => sum + b.total, 0);
  const totalPaidRevenue = paidBookings.reduce((sum, b) => sum + b.total, 0);
  const totalPendingRevenue = pendingPaymentBookings.reduce((sum, b) => sum + b.total, 0);

  // Payment Mode breakdown
  const upiTotal = validBookings
    .filter(b => b.paymentMode === 'UPI_ONLINE')
    .reduce((sum, b) => sum + b.total, 0);

  const cashTotal = validBookings
    .filter(b => b.paymentMode === 'CASH_ON_COLLECTION')
    .reduce((sum, b) => sum + b.total, 0);

  // Revenue by item
  const itemRevenue: { [name: string]: { count: number; total: number; type: string } } = {};
  validBookings.forEach(b => {
    b.items.forEach(item => {
      if (!itemRevenue[item.nameSnapshot]) {
        itemRevenue[item.nameSnapshot] = { count: 0, total: 0, type: item.type };
      }
      itemRevenue[item.nameSnapshot].count += 1;
      itemRevenue[item.nameSnapshot].total += item.priceSnapshot;
    });
  });

  const topRevenueItems = Object.entries(itemRevenue)
    .sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Revenue & Financial Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Realized cash inflows, online UPI payments, and test profitability.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-lg text-xs font-semibold">
          {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                timeframe === t ? 'bg-blue-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Gross Booked Value
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 block tabular-nums">
            ₹{totalGrossRevenue.toLocaleString('en-IN')}
          </span>
          <p className="text-[11px] text-slate-500">{validBookings.length} total active bookings</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Realized Paid Receipts
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 block tabular-nums">
            ₹{totalPaidRevenue.toLocaleString('en-IN')}
          </span>
          <p className="text-[11px] text-emerald-700 font-semibold">{paidBookings.length} settlements verified</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Pending / On Collection
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 block tabular-nums">
            ₹{totalPendingRevenue.toLocaleString('en-IN')}
          </span>
          <p className="text-[11px] text-amber-700">Awaiting phlebotomist pickup</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Average Order Value
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-blue-900 block tabular-nums">
            ₹{validBookings.length > 0 ? Math.round(totalGrossRevenue / validBookings.length) : 0}
          </span>
          <p className="text-[11px] text-slate-500">Per patient appointment</p>
        </div>
      </div>

      {/* Payment Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Payment Modes Breakdown</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800">UPI / Online Gateway</span>
              </div>
              <span className="font-mono font-bold text-slate-900">₹{upiTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Cash on Collection</span>
              </div>
              <span className="font-mono font-bold text-slate-900">₹{cashTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Top Diagnostic Items by Revenue */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Catalogue Revenue Contribution</h3>
            <span className="text-[11px] text-slate-500">Based on booked volume</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-3">Investigation / Package</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-center">Bookings Count</th>
                  <th className="py-2.5 px-3 text-right">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {topRevenueItems.map(([name, data]) => (
                  <tr key={name} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 truncate max-w-[240px]">
                      {name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold">
                        {data.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                      {data.count}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-950">
                      ₹{data.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
