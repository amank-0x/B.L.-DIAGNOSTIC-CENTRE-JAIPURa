import React, { useState } from 'react';
import { Search, Plus, Edit, Check, X, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TEST_CATEGORIES } from '../../data/initialData';
import { DiagnosticTest } from '../../types';

export const AdminTestManagement: React.FC = () => {
  const { tests, updateTest, addCustomTest } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Tests');

  // Edit test inline / modal
  const [editingTest, setEditingTest] = useState<DiagnosticTest | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New test form state
  const [newTest, setNewTest] = useState({
    code: '',
    name: '',
    category: 'Hematology',
    method: 'Automated Analyzer',
    sample: '2 ml Plain Blood (Serum)',
    instructions: 'Fasting sample preferred.',
    description: 'Routine diagnostic investigation.',
    reportingTime: 'Same Day',
    generalPrice: 300,
    corporatePrice: 120,
    homeCollectionAvailable: true,
    active: true
  });

  const filteredTests = tests.filter(t => {
    const matchesCat = categoryFilter === 'All Tests' || t.category === categoryFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      t.method.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;
    updateTest(editingTest.id, {
      name: editingTest.name,
      generalPrice: Number(editingTest.generalPrice),
      corporatePrice: Number(editingTest.corporatePrice),
      reportingTime: editingTest.reportingTime,
      instructions: editingTest.instructions,
      active: editingTest.active
    });
    setEditingTest(null);
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTest.name || !newTest.code) return;
    addCustomTest({
      ...newTest,
      generalPrice: Number(newTest.generalPrice),
      corporatePrice: Number(newTest.corporatePrice)
    });
    setShowAddModal(false);
    setNewTest({
      code: '',
      name: '',
      category: 'Hematology',
      method: 'Automated Analyzer',
      sample: '2 ml Plain Blood (Serum)',
      instructions: 'Fasting sample preferred.',
      description: 'Routine diagnostic investigation.',
      reportingTime: 'Same Day',
      generalPrice: 300,
      corporatePrice: 120,
      homeCollectionAvailable: true,
      active: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Diagnostic Test Catalogue Manager</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total active tests in database: {tests.filter(t => t.active).length} / {tests.length}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Test</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search catalogue by test name, code, method..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="w-full sm:w-56 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
        >
          {TEST_CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Test Name & Category</th>
                <th className="py-3 px-4">Sample Required</th>
                <th className="py-3 px-4">Turnaround</th>
                <th className="py-3 px-4">General Rate</th>
                <th className="py-3 px-4">Corporate Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTests.map(test => (
                <tr key={test.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-900">
                    {test.code}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{test.name}</span>
                    <span className="text-[11px] text-slate-500">{test.category} · {test.method}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[160px]">
                    {test.sample}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {test.reportingTime}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    ₹{test.generalPrice}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    ₹{test.corporatePrice}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => updateTest(test.id, { active: !test.active })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        test.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {test.active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setEditingTest(test)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Test Modal */}
      {editingTest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Update Test Properties & Price</h3>
                <p className="text-[11px] text-slate-400 font-mono">{editingTest.code}</p>
              </div>
              <button
                onClick={() => setEditingTest(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Test Name</label>
                <input
                  type="text"
                  required
                  value={editingTest.name}
                  onChange={e => setEditingTest({ ...editingTest, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">General Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingTest.generalPrice}
                    onChange={e => setEditingTest({ ...editingTest, generalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Corporate Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingTest.corporatePrice}
                    onChange={e => setEditingTest({ ...editingTest, corporatePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Reporting Turnaround</label>
                <input
                  type="text"
                  required
                  value={editingTest.reportingTime}
                  onChange={e => setEditingTest({ ...editingTest, reportingTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Preparation Instructions</label>
                <textarea
                  rows={2}
                  value={editingTest.instructions}
                  onChange={e => setEditingTest({ ...editingTest, instructions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editingTest.active}
                  onChange={e => setEditingTest({ ...editingTest, active: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="activeCheck" className="text-xs font-semibold text-slate-800">
                  Visible & Bookable in Live Catalogue
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTest(null)}
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

      {/* Add New Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Diagnostic Test to Catalogue</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Test Code *</label>
                  <input
                    type="text"
                    required
                    value={newTest.code}
                    onChange={e => setNewTest({ ...newTest, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. BL-LFT"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newTest.category}
                    onChange={e => setNewTest({ ...newTest, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    {TEST_CATEGORIES.filter(c => c !== 'All Tests').map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Test Name *</label>
                <input
                  type="text"
                  required
                  value={newTest.name}
                  onChange={e => setNewTest({ ...newTest, name: e.target.value })}
                  placeholder="e.g. Liver Function Test Complete"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">General Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newTest.generalPrice}
                    onChange={e => setNewTest({ ...newTest, generalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Corporate Price (₹)</label>
                  <input
                    type="number"
                    value={newTest.corporatePrice}
                    onChange={e => setNewTest({ ...newTest, corporatePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Sample Required</label>
                  <input
                    type="text"
                    value={newTest.sample}
                    onChange={e => setNewTest({ ...newTest, sample: e.target.value })}
                    placeholder="2 ml Serum / EDTA Blood"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    value={newTest.reportingTime}
                    onChange={e => setNewTest({ ...newTest, reportingTime: e.target.value })}
                    placeholder="Same Day / 24 Hours"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Preparation Instructions</label>
                <input
                  type="text"
                  value={newTest.instructions}
                  onChange={e => setNewTest({ ...newTest, instructions: e.target.value })}
                  placeholder="Fasting 10-12 hours required"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Add Test to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
