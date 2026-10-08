import React from 'react';
import {
  ShieldCheck,
  Clock,
  Home,
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  Award,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroSection: React.FC = () => {
  const { setActivePublicTab, setIsCartOpen, websiteConfig } = useApp();

  const scrollTo = (id: string) => {
    setActivePublicTab(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Accreditation trust kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-xs font-semibold text-blue-900">
              <Award className="w-3.5 h-3.5 text-blue-700" />
              <span>ISO 9001:2015 Certified Pathology Laboratory · Jaipur</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-blue-950 font-sans leading-[1.15]">
                Accurate Diagnosis. <br className="hidden sm:inline" />
                <span className="text-blue-700">Better Health.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Book clinical diagnostic tests and preventive health packages from the comfort of your home.
                Trained phlebotomists with temperature-controlled sample collection & verified same-day digital reports.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => scrollTo('tests')}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Book a Test</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={() => scrollTo('packages')}
                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>View Health Packages</span>
              </button>

              <button
                onClick={() => scrollTo('reports_search')}
                className="px-4 py-3 text-blue-800 hover:text-blue-950 hover:bg-blue-50 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Download Report</span>
              </button>
            </div>

            {/* 4 Core Clinical Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div>
                <span className="font-bold text-slate-900 text-xs block">FREE Home Pickup</span>
                <span className="text-[11px] text-slate-500">On bookings ₹500+</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block">Same Day Reports</span>
                <span className="text-[11px] text-slate-500">Routine & hormone tests</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block">100% Barcoded</span>
                <span className="text-[11px] text-slate-500">Zero sample mix-up</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block">M.D. Pathologists</span>
                <span className="text-[11px] text-slate-500">Dual doctor validation</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Laboratory Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 group">
              <img
                src="/src/assets/images/lab_hero_banner_1791379190699.jpg"
                alt="B.L. Diagnostic Center Clinical Pathology Laboratory"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback styled container if image loading fails
                  e.currentTarget.style.display = 'none';
                }}
              />

              {/* In-image Trust Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/90 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Direct Home Collection Available</h4>
                    <p className="text-[11px] text-slate-500">Slots open tomorrow from 6:30 AM</p>
                  </div>
                </div>
                <button
                  onClick={() => scrollTo('home_collection')}
                  className="px-2.5 py-1.5 bg-blue-50 text-blue-900 hover:bg-blue-100 text-[11px] font-bold rounded-lg transition-colors shrink-0"
                >
                  View Slots
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
