import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Smartphone,
  Clock,
  ShieldAlert,
  Save,
  CheckCircle2,
  RefreshCw,
  Database,
  Server,
  Eye,
  EyeOff,
  LogOut,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSecuritySettings: React.FC = () => {
  const {
    authSettings,
    updateAuthSettings,
    changeAdminPin,
    logoutAdmin,
    adminLogs,
    adminSessionToken
  } = useApp();

  // Settings form state
  const [adminPhone, setAdminPhone] = useState(authSettings.adminAuthorizedPhone || '9649183422');
  const [sessionTimeout, setSessionTimeout] = useState(authSettings.sessionTimeoutMinutes ?? 30);
  const [requireOtp, setRequireOtp] = useState(authSettings.requireOtpForAdmin ?? false);
  const [allowDemoLogin, setAllowDemoLogin] = useState(authSettings.allowPatientDemoLogin ?? true);
  const [otpLength, setOtpLength] = useState<4 | 6>(authSettings.otpLength ?? 4);

  // PIN change state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPinFields, setShowPinFields] = useState(false);
  const [pinStatus, setPinStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Policy save status
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    updateAuthSettings({
      adminAuthorizedPhone: adminPhone.trim(),
      sessionTimeoutMinutes: Number(sessionTimeout),
      requireOtpForAdmin: requireOtp,
      allowPatientDemoLogin: allowDemoLogin,
      otpLength: otpLength
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinStatus(null);

    if (newPin !== confirmPin) {
      setPinStatus({ success: false, message: 'New PIN and Confirmation PIN do not match.' });
      return;
    }

    if (newPin.length < 6) {
      setPinStatus({ success: false, message: 'Password must be at least 6 characters.' });
      return;
    }

    const result = changeAdminPin(currentPin, newPin);
    if (result.success) {
      setPinStatus({ success: true, message: 'Administrator Master Password successfully changed!' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinStatus({ success: false, message: result.error || 'Failed to update password.' });
    }
  };

  // Auth-related activity logs
  const authActivityLogs = adminLogs.filter(
    log => log.entity === 'SETTINGS' || log.action.includes('LOGIN') || log.action.includes('AUTH')
  ).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span>Authentication, RBAC & Security Settings</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage administrator credentials, session policies, patient authentication rules, and API security.
          </p>
        </div>

        <button
          onClick={logoutAdmin}
          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Lock Admin Session</span>
        </button>
      </div>

      {/* Grid: Credentials & Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: General Auth Policies */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Auth Form */}
          <form
            onSubmit={handleSavePolicies}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Access Control & Session Policies</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono font-bold">
                Role-Based Access
              </span>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Authentication policies updated and synchronized with backend API!</span>
              </div>
            )}

            {/* Admin Phone */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Authorized Administrator Mobile Number
              </label>
              <div className="flex rounded-lg overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="bg-slate-100 px-3 py-2 text-slate-600 font-mono text-xs border-r border-slate-300">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={adminPhone}
                  onChange={e => setAdminPhone(e.target.value)}
                  placeholder="9649183422"
                  className="flex-1 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Primary laboratory administrator contact number. Authorized operators can log in using this number, their registered mobile, or administrator email with master password.
              </p>
            </div>

            {/* Session Timeout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Inactivity Auto-Lock Timeout
                </label>
                <select
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={60}>1 Hour</option>
                  <option value={240}>4 Hours</option>
                  <option value={0}>Disabled (Never Auto-Lock)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Automatically terminates the administrative session after idle duration.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Patient Mobile OTP Length
                </label>
                <select
                  value={otpLength}
                  onChange={e => setOtpLength(Number(e.target.value) as 4 | 6)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white"
                >
                  <option value={4}>4 Digits (Quick Access)</option>
                  <option value={6}>6 Digits (Standard Security)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Length of SMS verification codes for patient account login.
                </p>
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowDemoLogin}
                  onChange={e => setAllowDemoLogin(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Allow Demo Quick-Login Buttons in Preview Mode
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Enables 1-click test login for administrator and demo patient (Rahul Sharma). Uncheck when launching in production.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireOtp}
                  onChange={e => setRequireOtp(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Require Two-Factor (2FA) SMS Verification for Admin
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Dispatches an SMS verification OTP to the administrator mobile upon PIN validation.
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Authentication Policies</span>
              </button>
            </div>
          </form>

          {/* Change Password Card */}
          <form
            onSubmit={handleChangePin}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Change Administrator Master Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPinFields(!showPinFields)}
                className="text-slate-500 hover:text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                {showPinFields ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPinFields ? 'Hide Passwords' : 'Show Passwords'}</span>
              </button>
            </div>

            {pinStatus && (
              <div
                className={`p-3 rounded-lg flex items-center gap-2 ${
                  pinStatus.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {pinStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-semibold">{pinStatus.message}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Current Master Password
                </label>
                <input
                  type={showPinFields ? 'text' : 'password'}
                  required
                  value={currentPin}
                  onChange={e => setCurrentPin(e.target.value)}
                  placeholder="Enter current master password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    New Master Password
                  </label>
                  <input
                    type={showPinFields ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    placeholder="Min 6 characters (e.g. BLDiag@9649#Admin)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Confirm New Master Password
                  </label>
                  <input
                    type={showPinFields ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Update Master Password</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Architecture & Audit Logs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Endpoint Isolation Card */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Server className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-sm">Endpoint Separation Status</h3>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-300 block">/ (Public Site)</span>
                  <span className="text-[11px] text-slate-500">Test catalogue, booking, reports lookup</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Public
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-300 block">/portal (Patient Portal)</span>
                  <span className="text-[11px] text-slate-500">Personal bookings, addresses, medical reports</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                  Patient Auth
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-white block">/admin (Admin Console)</span>
                  <span className="text-[11px] text-slate-400">Restricted laboratory management terminal</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                  RBAC Tier 4
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Backend Express Token Guard Active</span>
              </p>
              <p className="text-slate-500">
                Patient sessions cannot call administrative endpoints or query unowned bookings.
              </p>
            </div>
          </div>

          {/* Cloud Database & Storage Health */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Database className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Supabase & Cloud Security</h3>
            </div>

            <div className="space-y-2 text-slate-700">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Database Driver:</span>
                <span className="font-mono font-bold text-slate-900">PostgreSQL (Supabase)</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Auth Token Type:</span>
                <span className="font-mono font-bold text-blue-700">Bearer JWT (HMAC-SHA256)</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Diagnostic Reports Storage:</span>
                <span className="font-mono text-emerald-700 font-bold">Private Bucket / Signed URLs</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Active Admin Session:</span>
                <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                  {adminSessionToken ? `${adminSessionToken.slice(0, 16)}...` : 'Local Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Security Logs */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900 text-sm">Recent Authentication Audit Logs</h3>
              <span className="text-[10px] text-slate-400 font-mono">Live Logs</span>
            </div>

            {authActivityLogs.length === 0 ? (
              <p className="text-slate-400 text-xs py-2">No security events recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {authActivityLogs.map(log => (
                  <div key={log.id} className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px]">
                    <div className="flex items-center justify-between text-slate-500 mb-0.5 font-mono text-[10px]">
                      <span className="font-bold text-slate-700">{log.action}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{log.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
