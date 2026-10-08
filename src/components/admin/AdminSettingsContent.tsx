import React, { useState } from 'react';
import { Settings, Save, Building2, Phone, Mail, MapPin, DollarSign, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettingsContent: React.FC = () => {
  const { websiteConfig, updateWebsiteConfig, setActiveAdminTab, authSettings } = useApp();
  const [formData, setFormData] = useState(websiteConfig);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Website Content & Operational Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure laboratory contact numbers, helpline, addresses, and fees.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveAdminTab('security_settings')}
          className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Configure Auth & Security</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5 text-xs max-w-3xl">
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">Settings saved successfully!</span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Center Identification
          </h3>
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Diagnostic Center Name</label>
            <input
              type="text"
              required
              value={formData.centerName}
              onChange={e => setFormData({ ...formData, centerName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Admin Authorized Phone</label>
              <input
                type="text"
                required
                value={formData.adminPhone}
                onChange={e => setFormData({ ...formData, adminPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Central Helpline Phone</label>
              <input
                type="text"
                required
                value={formData.helplinePhone}
                onChange={e => setFormData({ ...formData, helplinePhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Alternate Phone</label>
              <input
                type="text"
                value={formData.alternatePhone}
                onChange={e => setFormData({ ...formData, alternatePhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={e => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Facility Physical Locations
          </h3>
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Central Referral Lab Address</label>
            <input
              type="text"
              required
              value={formData.centralLabAddress}
              onChange={e => setFormData({ ...formData, centralLabAddress: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Vidhyadhar Nagar Branch Address</label>
            <input
              type="text"
              value={formData.branchAddress}
              onChange={e => setFormData({ ...formData, branchAddress: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Operating Hours</label>
            <input
              type="text"
              value={formData.operatingHours}
              onChange={e => setFormData({ ...formData, operatingHours: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Home Sample Collection Fee Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Free Collection Threshold (₹)</label>
              <input
                type="number"
                value={formData.freeCollectionThreshold}
                onChange={e => setFormData({ ...formData, freeCollectionThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Free home pickup above this amount</span>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Standard Collection Charge (₹)</label>
              <input
                type="number"
                value={formData.standardCollectionFee}
                onChange={e => setFormData({ ...formData, standardCollectionFee: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Applied when order below threshold</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Center Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
