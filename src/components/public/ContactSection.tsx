import React from 'react';
import { MapPin, Phone, Mail, Clock, Building2, CreditCard, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactSection: React.FC = () => {
  const { websiteConfig } = useApp();

  return (
    <section id="contact" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase block mb-1">
            Locations & Communication
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Connect With B.L. Diagnostic Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Visit our central referral facility or schedule home specimen collection anywhere across the city.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Central Lab Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Main Diagnostic Facility</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {websiteConfig.centralLabAddress}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>7:00 AM – 9:00 PM (Mon-Sat)</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>7:00 AM – 2:00 PM (Sunday)</span>
              </p>
            </div>
          </div>

          {/* Home Sample Collection Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Home Collection Service</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Home Collection Available across all sectors of Jaipur. Professional phlebotomists with sterile cold-chain transport.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">Helpline: 9649183422</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">Direct: 9649183422</span>
              </p>
            </div>
          </div>

          {/* Official Bank Details & Helplines */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Payment & Invoicing</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Account for Online & Phlebotomy Collection
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-[11px] font-mono">
              <p className="text-slate-800">
                <span className="text-slate-500 font-sans">A/C Name:</span> {websiteConfig.bankDetails.accountName}
              </p>
              <p className="text-slate-800">
                <span className="text-slate-500 font-sans">A/C No:</span> {websiteConfig.bankDetails.accountNumber}
              </p>
              <p className="text-slate-800">
                <span className="text-slate-500 font-sans">Bank:</span> {websiteConfig.bankDetails.bank} ({websiteConfig.bankDetails.ifsc})
              </p>
              <p className="text-emerald-800 font-bold">
                <span className="text-slate-500 font-sans font-normal">UPI:</span> 9649183422@upi
              </p>
            </div>

            <div className="pt-1 text-xs">
              <span className="text-slate-500 text-[11px] block">Booking & Support Desk:</span>
              <a
                href="tel:9649183422"
                className="font-mono font-bold text-blue-900 text-sm hover:underline"
              >
                +91 9649183422
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
