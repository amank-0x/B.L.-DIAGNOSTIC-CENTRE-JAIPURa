import React from 'react';
import { Microscope, Award, CheckCircle2, ShieldCheck, Stethoscope } from 'lucide-react';

export const PathologyLabSection: React.FC = () => {
  const facilities = [
    'Chemiluminescence Immunoassay (CLIA)',
    'Automated Clinical Biochemistry',
    'Haematology 6-Part Cell Counters',
    'Clinical Microbiology & Culture Bactec',
    'Flow Cytometry & Leukaemia Panels',
    'Molecular Biology & Real Time PCR',
    'Histopathology & IHC Cytology',
    'High Performance Liquid Chromatography (HPLC)'
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Desk of Pathologist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
              <img
                src="/src/assets/images/pathology_analyzers_1791379216950.jpg"
                alt="Automated Clinical Analyzers at B.L. Diagnostic Center"
                className="w-full h-80 sm:h-96 object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-100 block">Robotic High-Throughput Analyzers</span>
                  <span className="text-slate-400 text-[11px]">Daily 3-level quality calibration</span>
                </div>
                <span className="text-emerald-400 font-bold font-mono">99.8% Accuracy</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-900">
              <Microscope className="w-3.5 h-3.5 text-blue-700" />
              <span>From The Desk of Pathologist</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Clinical Excellence & Precision You Can Trust
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-2 border-blue-600 pl-4 py-1">
              "Our mission is to provide the most accurate laboratory services to patients at most economical costs with maximum precision and minimum turnaround time. B.L. Diagnostic Center operates automated computerized pathology analyzers operated by knowledgeable, qualified, and dedicated specialists."
            </p>

            {/* Doctors Profile Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Chief Pathologist</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">Dr. Vikas Singhal</h4>
                <p className="text-xs text-slate-600">M.B.B.S., M.D. Pathologist</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Reg. No. 17562/61248</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Consultant Microbiologist</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">Dr. Neha Gupta</h4>
                <p className="text-xs text-slate-600">M.D. Microbiologist</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Reg. No. 29463/17683</p>
              </div>
            </div>

            {/* Core Laboratory Capabilities */}
            <div className="pt-2">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider block mb-2.5">
                Diagnostic Infrastructure & Methodologies
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="text-[11px] font-medium">{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
