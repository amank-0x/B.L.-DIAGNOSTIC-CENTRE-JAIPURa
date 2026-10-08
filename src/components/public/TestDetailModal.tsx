import React from 'react';
import { DiagnosticTest } from '../../types';
import { X, Clock, Check, Plus, AlertCircle, Sparkles, Building } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  test: DiagnosticTest;
  onClose: () => void;
}

export const TestDetailModal: React.FC<Props> = ({ test, onClose }) => {
  const { addToCart, cart, setIsCartOpen } = useApp();
  const isInCart = cart.some(c => c.itemId === test.id);

  const handleBook = () => {
    addToCart({
      type: 'TEST',
      itemId: test.id,
      name: test.name,
      price: test.generalPrice,
      sample: test.sample,
      reportingTime: test.reportingTime
    });
    setIsCartOpen(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded">
                {test.code}
              </span>
              <span className="text-xs text-slate-300">{test.category}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight mt-1.5 text-white">
              {test.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Price & Turnaround Summary Bar */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 block">General Rate</span>
              <span className="font-mono text-xl font-bold text-slate-900">₹{test.generalPrice}</span>
              {test.corporatePrice && (
                <span className="text-[10px] text-slate-500 block">
                  Corporate Tariff: <span className="font-mono font-semibold">₹{test.corporatePrice}</span>
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Report Turnaround</span>
              <span className="font-semibold text-blue-700 flex items-center gap-1 justify-end mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{test.reportingTime}</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">Home Pickup Available</span>
            </div>
          </div>

          {/* Clinical Uses */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
              Clinical Use & Analytical Significance
            </h4>
            <p className="leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-200/60 text-slate-700">
              {test.description || 'Routine diagnostic and clinical monitoring parameter.'}
            </p>
          </div>

          {/* Specimen and Method Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px] block">Specimen / Sample Required</span>
              <span className="font-semibold text-slate-900 text-xs block mt-0.5">
                {test.sample}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px] block">Test Technology / Method</span>
              <span className="font-semibold text-slate-900 text-xs block mt-0.5">
                {test.method}
              </span>
            </div>
          </div>

          {/* Patient Instructions */}
          {test.instructions && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[11px]">Patient Preparation Instructions:</span>
                <p className="text-xs mt-0.5 text-amber-800">{test.instructions}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
          >
            Close
          </button>
          <button
            onClick={handleBook}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added in Cart · Open Cart</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Book This Test (₹{test.generalPrice})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
