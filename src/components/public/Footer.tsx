import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Phone, Mail, MapPin, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { websiteConfig, navigateToPortal, setCurrentPortal, authSettings } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-xs font-black">
                BL
              </span>
              <span>{websiteConfig.centerName}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Fully automated computerized clinical pathology & diagnostic referral laboratory. Accurate diagnosis with minimal turnaround time.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>ISO 9001:2015 Certified Laboratory</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Quick Services</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setCurrentPortal('public');
                    const el = document.getElementById('tests');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Diagnostic Blood Tests
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPortal('public');
                    const el = document.getElementById('packages');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Preventive Health Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPortal('public');
                    const el = document.getElementById('home_collection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Home Sample Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPortal('public');
                    const el = document.getElementById('reports_search');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Download Patient Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Top Tests */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Routine Tests</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Complete Blood Count (CBC) - ₹250</li>
              <li>Thyroid Panel (T3, T4, TSH) - ₹400</li>
              <li>Vitamin D 25-Hydroxy - ₹1200</li>
              <li>Vitamin B12 Level - ₹600</li>
              <li>HbA1c Glycosylated - ₹400</li>
              <li>Lipid Profile Full - ₹500</li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Helplines & Support</h4>
            <div className="space-y-1 text-xs">
              <p className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="font-mono">📞 9649183422</span>
              </p>
              <p className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-[11px] text-slate-300 leading-tight">
                  Near Post Office, Kumbha Marg, Sector 11, Pratap Nagar, Jaipur - 302033
                </span>
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold pt-0.5">
                🏠 Home Collection Available
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigateToPortal('admin')}
                className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-slate-500" />
                <span>Authorized Staff & Admin Console (+91 {authSettings?.adminAuthorizedPhone || websiteConfig.adminPhone})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Baseline */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {websiteConfig.centerName}. All Rights Reserved. Jaipur, Rajasthan.</p>
          <div className="flex items-center gap-4">
            <span>Accuracy & Precision Guaranteed</span>
            <span aria-hidden="true">·</span>
            <span>Reg. No. 17562/61248</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
