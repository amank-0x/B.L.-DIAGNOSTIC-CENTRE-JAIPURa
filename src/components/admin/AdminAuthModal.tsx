import React, { useState } from 'react';
import { X, ShieldAlert, KeyRound, Lock, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    loginAdmin,
    authSettings,
    currentUser,
    navigateToPortal
  } = useApp();

  const [adminPhone, setAdminPhone] = useState('9649183422');
  const [adminPin, setAdminPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const inputId = adminPhone.trim() || '9649183422';
    const result = loginAdmin(inputId, adminPin.trim());
    if (!result.success) {
      setErrorMsg(
        result.error ||
        'Incorrect administrator password. Master password is BLDiag@9649#Admin.'
      );
    } else {
      navigateToPortal('admin');
    }
  };

  const handleFillMasterPassword = () => {
    setAdminPin('BLDiag@9649#Admin');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">B.L. Diagnostics Admin</h3>
              <p className="text-[11px] text-slate-400">Restricted Laboratory Operations Terminal</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Patient Warning if signed in */}
          {currentUser && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Patient Session Active</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                You are currently signed in as Patient <strong>{currentUser.name}</strong> (+91 {currentUser.phone}). Patient accounts do not possess administrative permissions.
              </p>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">Administrator Credentials:</p>
            <p className="text-[11px] text-slate-600">
              Enter your administrator mobile number (default: <span className="font-mono font-bold text-blue-900">+91 9649183422</span>) and master password.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2 text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Admin Mobile Number / ID
              </label>
              <input
                type="text"
                required
                value={adminPhone}
                onChange={e => setAdminPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number or ID"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700">
                  Administrator Master Password
                </label>
                <button
                  type="button"
                  onClick={handleFillMasterPassword}
                  className="text-[10px] text-blue-600 hover:text-blue-800 underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span>Paste Master Password</span>
                </button>
              </div>
              <input
                type="password"
                required
                value={adminPin}
                onChange={e => setAdminPin(e.target.value)}
                placeholder="Enter master password (e.g. BLDiag@9649#Admin)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Master Password: <span className="font-mono font-semibold text-slate-800">BLDiag@9649#Admin</span> (or Admin@123)
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <KeyRound className="w-4 h-4 text-blue-400" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
