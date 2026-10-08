import React from 'react';
import {
  Calendar,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ThermometerSnowflake,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { COLLECTION_SLOTS } from '../../data/initialData';

export const HomeCollectionSection: React.FC = () => {
  const { websiteConfig, setIsCartOpen, setActivePublicTab } = useApp();

  const STEPS = [
    {
      step: '01',
      title: 'Select Tests & Time Slot',
      desc: 'Pick your preferred date and slot (starting as early as 6:30 AM for morning fasting tests).'
    },
    {
      step: '02',
      title: 'Certified Phlebotomist Visits',
      desc: 'A background-verified, double-vaccinated phlebotomist arrives at your doorstep in sterile attire.'
    },
    {
      step: '03',
      title: 'Sterile Vacuum Blood Draw',
      desc: 'Single-use sealed BD Vacutainer® tubes and disposable sterile butterfly needles used for every patient.'
    },
    {
      step: '04',
      title: 'Barcoding & Cold-Chain Transport',
      desc: 'Samples are instantly barcoded in your presence and transported in monitored cold-chain insulated gel containers.'
    },
    {
      step: '05',
      title: 'Same-Day Verified Digital Report',
      desc: 'Tested on automated analyzers, signed by M.D. Pathologists, and sent straight to your portal & phone.'
    }
  ];

  return (
    <section id="home_collection" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Split Grid: Narrative & Phlebotomy Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-blue-700 tracking-wider uppercase block">
              At-Home Pathology Diagnostics
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-950 tracking-tight">
              Hospital-Grade Sample Collection at Your Doorstep
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No need to wait in clinic queues or step out early morning while fasting.
              B.L. Diagnostic Center brings licensed phlebotomists directly to your home or office
              with zero compromise on pre-analytical sample integrity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <ThermometerSnowflake className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Temperature Controlled</span>
                  <span className="text-slate-500 text-[11px]">2°C - 8°C gel pack transport</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <QrCode className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Unique Barcode Tagging</span>
                  <span className="text-slate-500 text-[11px]">Zero chance of sample swap</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Single-Use Consumables</span>
                  <span className="text-slate-500 text-[11px]">Unsealed right in front of you</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Punctual Morning Slots</span>
                  <span className="text-slate-500 text-[11px]">30-minute arrival window</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('tests');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Book Home Sample Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
              <img
                src="/src/assets/images/home_collection_service_1791379206111.jpg"
                alt="Professional Home Sample Collection by B.L. Diagnostic Center"
                className="w-full h-80 sm:h-96 object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-100 block">Available Daily across Jaipur</span>
                  <span className="text-slate-400 text-[11px]">Vaishali Nagar · Vidhyadhar Nagar · Mansarovar · Malviya Nagar · C-Scheme</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">7:00 AM - 9:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works 5-Step Process */}
        <div id="how_it_works" className="pt-6 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
              Transparent Diagnostic Flow
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              How Home Diagnostic Booking Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {STEPS.map(item => (
              <div
                key={item.step}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className="font-mono text-xs font-bold text-blue-700 block">
                    {item.step}.
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
