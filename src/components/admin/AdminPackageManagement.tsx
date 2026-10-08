import React, { useState } from 'react';
import { Plus, Edit, Check, X, Sparkles, Clock, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HealthPackage } from '../../types';

export const AdminPackageManagement: React.FC = () => {
  const { packages, updatePackage } = useApp();
  const [editingPkg, setEditingPkg] = useState<HealthPackage | null>(null);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    updatePackage(editingPkg.id, {
      name: editingPkg.name,
      tagline: editingPkg.tagline,
      generalPrice: Number(editingPkg.generalPrice),
      corporatePrice: Number(editingPkg.corporatePrice),
      reportingTime: editingPkg.reportingTime,
      active: editingPkg.active
    });
    setEditingPkg(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Health Packages & Profiles Manager</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure multi-test checkup packages, pricing, and turnaround.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-blue-900">{pkg.code}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  pkg.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {pkg.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{pkg.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{pkg.tagline}</p>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Parameters Count:</span>
                  <span className="font-bold text-slate-900">{pkg.includedParametersCount} Tests</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Turnaround:</span>
                  <span className="font-semibold text-blue-700">{pkg.reportingTime}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">General Tariff:</span>
                  <span className="font-mono font-bold text-slate-900">₹{pkg.generalPrice}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Corporate Tariff:</span>
                  <span className="font-mono text-slate-600">₹{pkg.corporatePrice}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 line-clamp-2">
                Inclusions: {pkg.includedSummary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => updatePackage(pkg.id, { active: !pkg.active })}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                {pkg.active ? 'Deactivate' : 'Activate'}
              </button>

              <button
                onClick={() => setEditingPkg(pkg)}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold rounded text-xs transition-colors cursor-pointer"
              >
                Edit Package
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Package Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Edit Package: {editingPkg.code}</h3>
              <button onClick={() => setEditingPkg(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={editingPkg.name}
                  onChange={e => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">General Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingPkg.generalPrice}
                    onChange={e => setEditingPkg({ ...editingPkg, generalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Corporate Price (₹)</label>
                  <input
                    type="number"
                    value={editingPkg.corporatePrice}
                    onChange={e => setEditingPkg({ ...editingPkg, corporatePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Reporting Turnaround</label>
                <input
                  type="text"
                  required
                  value={editingPkg.reportingTime}
                  onChange={e => setEditingPkg({ ...editingPkg, reportingTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pkgActiveCheck"
                  checked={editingPkg.active}
                  onChange={e => setEditingPkg({ ...editingPkg, active: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="pkgActiveCheck" className="text-xs font-semibold text-slate-800">
                  Active in Live Store
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="px-3 py-1.5 text-slate-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
