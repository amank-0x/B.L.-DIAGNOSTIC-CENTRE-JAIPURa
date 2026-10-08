import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  KeyRound,
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLoginGate: React.FC = () => {
  const {
    loginAdmin,
    authSettings,
    currentUser,
    navigateToPortal,
    websiteConfig
  } = useApp();

  const [phone, setPhone] = useState('9649183422');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const inputId = phone.trim() || '9649183422';
    const result = loginAdmin(inputId, pin.trim());
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(
        result.error ||
        'Access denied. Please check your credentials and try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg">
        {/* Back navigation header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigateToPortal('public')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900/60 hover:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </button>

          <span className="text-[11px] font-mono text-blue-400 flex items-center gap-1.5 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/50">
            <Lock className="w-3 h-3 text-blue-400" />
            <span>Protected Endpoint: /admin</span>
          </span>
        </div>

        {/* Main Security Card */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Header Bar */}
          <div className="bg-slate-950 px-6 py-5 border-b border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-inner">
              BL
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-base sm:text-lg text-white leading-tight">
                {websiteConfig.centerName}
              </h1>
              <p className="text-xs text-blue-400 font-medium">
                Restricted Laboratory Administrative Terminal
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-800/70 text-rose-300 text-[10px] font-mono font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>RBAC Tier 4</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Warning if a Patient is currently signed in on this device */}
            {currentUser && (
              <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-800/80 text-amber-200 space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-300">
                      Active Patient Session Detected
                    </p>
                    <p className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">
                      You are currently signed in as Patient{' '}
                      <span className="font-semibold text-white">
                        {currentUser.name}
                      </span>{' '}
                      (+91 {currentUser.phone}). Regular patient accounts do not possess administrative access privileges.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-amber-900/40">
                  <button
                    onClick={() => navigateToPortal('user')}
                    className="px-3 py-1 bg-amber-900/60 hover:bg-amber-900 text-amber-100 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Go to Patient Portal
                  </button>
                  <button
                    onClick={() => navigateToPortal('public')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Go to Lab Home
                  </button>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* Authorization Instructions */}
            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Administrator Access:</span>
                <span className="font-mono font-bold text-blue-300">
                  +91 {authSettings.adminAuthorizedPhone || '9649183422'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Log in using your administrator phone number (e.g. <span className="text-slate-200 font-mono">9649183422</span> or any authorized admin mobile) and master password.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  Administrator Mobile Number / Admin ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Enter mobile number (e.g. 9649183422) or admin ID"
                    className="w-full bg-slate-950 pl-9 pr-3 py-2.5 text-xs text-white font-mono rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                {phone.trim() !== '9649183422' && (
                  <div className="mt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setPhone('9649183422')}
                      className="text-[10px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
                    >
                      Use default center number (+91 9649183422)
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  Administrator Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    placeholder="Enter administrator password"
                    className="w-full bg-slate-950 px-3 py-2.5 text-xs text-white font-mono rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/30 active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isSubmitting ? 'Verifying Credentials...' : 'Unlock Administrative Console'}</span>
              </button>
            </form>
          </div>

          {/* Footer Security Badge */}
          <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>TLS / Role-Based Protection</span>
            </span>
            <span>Reg. No. 17562/61248</span>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-6">
          © {new Date().getFullYear()} {websiteConfig.centerName}. All administrative sessions are cryptographically logged.
        </p>
      </div>
    </div>
  );
};
