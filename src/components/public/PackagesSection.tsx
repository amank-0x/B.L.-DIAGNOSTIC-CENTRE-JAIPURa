import React, { useState } from 'react';
import { Check, Plus, ShieldCheck, Clock, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HealthPackage } from '../../types';

export const PackagesSection: React.FC = () => {
  const { packages, addToCart, cart, setIsCartOpen } = useApp();
  const [expandedPkgId, setExpandedPkgId] = useState<string | null>(null);

  const handleBook = (pkg: HealthPackage) => {
    addToCart({
      type: 'PACKAGE',
      itemId: pkg.id,
      name: pkg.name,
      price: pkg.generalPrice,
      sample: pkg.sampleInstructions,
      reportingTime: pkg.reportingTime
    });
    setIsCartOpen(true);
  };

  const toggleExpand = (id: string) => {
    setExpandedPkgId(prev => (prev === id ? null : id));
  };

  return (
    <section id="packages" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-blue-700 tracking-wider uppercase block mb-1">
              Preventive Healthcare & Full-Body Profiles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Curated Health Checkup Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Cost-effective diagnostic batteries designed by clinical pathologists.
              Save up to 70% compared to standalone tests with single-visit home sample collection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Free Phlebotomy Home Collection Included</span>
            </div>
          </div>
        </div>

        {/* Featured Showcase Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 relative bg-slate-100">
            <img
              src="/src/assets/images/wellness_packages_cover_1791379228192.jpg"
              alt="Health Checkup Package Diagnostic Overview"
              className="w-full h-64 lg:h-full object-cover object-center"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Flagship Full Body Profile</span>
              <h3 className="text-base font-bold">Royal - Wellness - D (84 Parameters)</h3>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-blue-700 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Master Health Checkup</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Royal - Wellness - D
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our most in-depth whole-body diagnostic investigation covering 84 parameters:
                Apolipoproteins (A1 & B), High Sensitivity CRP, Pancreatic Amylase & Lipase, LDH,
                Vitamins D & B12, Total Testosterone, HbA1c, Thyroid Panel, Complete Liver, Kidney with Electrolytes, and Complete Urine Routine.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Parameters</span>
                <span className="font-bold text-slate-900 font-mono text-sm">84 Tests</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Turnaround</span>
                <span className="font-bold text-blue-700">Same Day</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Standalone Value</span>
                <span className="font-mono text-slate-500 line-through">₹7,800</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Package Price</span>
                <span className="font-bold font-mono text-base text-slate-900">₹3,000</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> 12 Hours Overnight Fasting Required
              </span>
              <button
                onClick={() => {
                  const pkg = packages.find(p => p.id === 'pkg-wellness-d') || packages[3];
                  handleBook(pkg);
                }}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Book Royal Wellness D (₹3000)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Complete Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => {
            const inCart = cart.some(c => c.itemId === pkg.id);
            const isExpanded = expandedPkgId === pkg.id;

            return (
              <div
                key={pkg.id}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-medium">{pkg.code}</span>
                    <span className="font-bold text-blue-900">
                      {pkg.includedParametersCount} Parameters
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">
                    {pkg.name}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium line-clamp-1">
                    {pkg.tagline}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {pkg.description}
                  </p>

                  {/* Summary of tests */}
                  <div className="bg-slate-50 rounded-lg p-3 text-xs border border-slate-100 space-y-1.5">
                    <span className="font-bold text-slate-800 block text-[11px]">Key Inclusions:</span>
                    <p className="text-slate-600 text-[11px] leading-snug line-clamp-3">
                      {pkg.includedSummary}
                    </p>

                    {/* Toggle full list */}
                    {isExpanded && (
                      <div className="pt-2 mt-2 border-t border-slate-200 space-y-1">
                        <span className="font-bold text-slate-800 text-[11px] block">Complete Test Battery:</span>
                        <ul className="space-y-1 text-[11px] text-slate-700">
                          {pkg.includedTests.map((t, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-[10px] text-slate-500 pt-1">
                          Sample: {pkg.sampleInstructions}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleExpand(pkg.id)}
                      className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Test List' : `View All ${pkg.includedTests.length} Tests`}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-medium">Package Tariff</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                        ₹{pkg.generalPrice}
                      </span>
                      {pkg.corporatePrice && (
                        <span className="text-xs text-slate-400 font-mono line-through">
                          ₹{Math.round(pkg.generalPrice * 1.5)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBook(pkg)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      inCart
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-700 hover:bg-blue-800 text-white'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Book Package</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
