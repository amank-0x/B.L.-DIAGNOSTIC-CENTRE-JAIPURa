import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DiagnosticTest,
  HealthPackage,
  Booking,
  BookingStatus,
  DiagnosticReport,
  CartItem,
  UserProfile,
  UserAddress,
  WebsiteConfig,
  AuthSettings,
  AppNotification,
  AdminActivityLog,
  Phlebotomist
} from '../types';
import {
  INITIAL_TESTS,
  INITIAL_PACKAGES,
  INITIAL_BOOKINGS,
  INITIAL_REPORT,
  INITIAL_USER,
  INITIAL_WEBSITE_CONFIG,
  INITIAL_AUTH_SETTINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_LOGS,
  INITIAL_PHLEBOTOMISTS
} from '../data/initialData';

interface AppContextType {
  // Navigation & View
  currentPortal: 'public' | 'user' | 'admin';
  setCurrentPortal: (portal: 'public' | 'user' | 'admin') => void;
  navigateToPortal: (portal: 'public' | 'user' | 'admin') => void;
  activePublicTab: string;
  setActivePublicTab: (tab: string) => void;
  activeUserTab: 'dashboard' | 'bookings' | 'reports' | 'addresses' | 'notifications' | 'profile';
  setActiveUserTab: (tab: 'dashboard' | 'bookings' | 'reports' | 'addresses' | 'notifications' | 'profile') => void;
  activeAdminTab: 'dashboard' | 'bookings' | 'collections' | 'reports' | 'tests' | 'packages' | 'users' | 'revenue' | 'activity_logs' | 'settings' | 'security_settings' | 'database';
  setActiveAdminTab: (tab: 'dashboard' | 'bookings' | 'collections' | 'reports' | 'tests' | 'packages' | 'users' | 'revenue' | 'activity_logs' | 'settings' | 'security_settings' | 'database') => void;

  // Authentication & Security Settings
  currentUser: UserProfile | null;
  isAdminAuthenticated: boolean;
  adminSessionToken: string | null;
  authSettings: AuthSettings;
  updateAuthSettings: (settings: Partial<AuthSettings>) => void;
  changeAdminPin: (oldPin: string, newPin: string) => { success: boolean; error?: string };
  loginUser: (phone: string, name?: string) => void;
  logoutUser: () => void;
  loginAdmin: (phone: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addUserAddress: (address: Omit<UserAddress, 'id' | 'userId'>) => void;
  deleteUserAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Catalogue
  tests: DiagnosticTest[];
  packages: HealthPackage[];
  updateTest: (id: string, updates: Partial<DiagnosticTest>) => void;
  addCustomTest: (test: Omit<DiagnosticTest, 'id'>) => void;
  updatePackage: (id: string, updates: Partial<HealthPackage>) => void;

  // Cart & Booking
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCollectionFee: number;
  cartDiscount: number;
  cartTotal: number;

  // Bookings
  bookings: Booking[];
  refreshBookingsFromDatabase: () => Promise<void>;
  createBooking: (details: {
    address: UserAddress;
    bookingDate: string;
    collectionSlot: string;
    paymentMode: 'CASH_ON_COLLECTION' | 'UPI_ONLINE' | 'CARD';
    notes?: string;
  }) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, note?: string) => void;
  assignPhlebotomist: (bookingId: string, phlebotomistId: string) => void;

  // Reports
  reports: DiagnosticReport[];
  viewingReport: DiagnosticReport | null;
  setViewingReport: (report: DiagnosticReport | null) => void;
  uploadAndPublishReport: (bookingId: string, reportData: Partial<DiagnosticReport>) => void;

  // Phlebotomists & Config
  phlebotomists: Phlebotomist[];
  websiteConfig: WebsiteConfig;
  updateWebsiteConfig: (updates: Partial<WebsiteConfig>) => void;

  // Notifications & Logs
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationsCount: number;
  adminLogs: AdminActivityLog[];

  // Modals & Active Viewers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isUserAuthModalOpen: boolean;
  setIsUserAuthModalOpen: (open: boolean) => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  selectedTestForDetail: DiagnosticTest | null;
  setSelectedTestForDetail: (test: DiagnosticTest | null) => void;
  selectedBookingForTrack: Booking | null;
  setSelectedBookingForTrack: (booking: Booking | null) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // URL-Aware Initial Portal
  const [currentPortal, setCurrentPortal] = useState<'public' | 'user' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') return 'admin';
      if (path === '/portal' || path === '/user' || hash === '#portal' || hash === '#user') return 'user';
    }
    return 'public';
  });

  const [activePublicTab, setActivePublicTab] = useState<string>('home');
  const [activeUserTab, setActiveUserTab] = useState<'dashboard' | 'bookings' | 'reports' | 'addresses' | 'notifications' | 'profile'>('dashboard');
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'bookings' | 'collections' | 'reports' | 'tests' | 'packages' | 'users' | 'revenue' | 'activity_logs' | 'settings' | 'security_settings' | 'database'>('dashboard');

  // Persistence Initializers (Fresh users are NOT auto-logged in)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bl_current_user');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bl_admin_auth') === 'true';
  });

  const [adminSessionToken, setAdminSessionToken] = useState<string | null>(() => {
    return localStorage.getItem('bl_admin_token') || null;
  });

  const [authSettings, setAuthSettings] = useState<AuthSettings>(() => {
    const saved = localStorage.getItem('bl_auth_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_WEBSITE_CONFIG.authSettings || INITIAL_AUTH_SETTINGS;
  });

  const [tests, setTests] = useState<DiagnosticTest[]>(() => {
    const saved = localStorage.getItem('bl_tests');
    return saved ? JSON.parse(saved) : INITIAL_TESTS;
  });

  const [packages, setPackages] = useState<HealthPackage[]>(() => {
    const saved = localStorage.getItem('bl_packages');
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bl_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reports, setReports] = useState<DiagnosticReport[]>(() => {
    const saved = localStorage.getItem('bl_reports');
    return saved ? JSON.parse(saved) : [INITIAL_REPORT];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bl_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(() => {
    const saved = localStorage.getItem('bl_config');
    return saved ? JSON.parse(saved) : INITIAL_WEBSITE_CONFIG;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('bl_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [adminLogs, setAdminLogs] = useState<AdminActivityLog[]>(() => {
    const saved = localStorage.getItem('bl_admin_logs');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_LOGS;
  });

  const [phlebotomists] = useState<Phlebotomist[]>(INITIAL_PHLEBOTOMISTS);

  // Modals & Popovers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserAuthModalOpen, setIsUserAuthModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [selectedTestForDetail, setSelectedTestForDetail] = useState<DiagnosticTest | null>(null);
  const [selectedBookingForTrack, setSelectedBookingForTrack] = useState<Booking | null>(null);
  const [viewingReport, setViewingReport] = useState<DiagnosticReport | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('bl_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bl_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem('bl_tests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('bl_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('bl_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('bl_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('bl_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bl_config', JSON.stringify(websiteConfig));
  }, [websiteConfig]);

  useEffect(() => {
    localStorage.setItem('bl_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('bl_admin_logs', JSON.stringify(adminLogs));
  }, [adminLogs]);

  const refreshBookingsFromDatabase = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/admin/bookings`, {
        headers: adminSessionToken ? { 'Authorization': `Bearer ${adminSessionToken}` } : {}
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setBookings(prev => {
            const remoteIds = new Set(json.data.map((b: Booking) => b.id));
            const localOnly = prev.filter(b => !remoteIds.has(b.id));
            return [...json.data, ...localOnly];
          });
        }
      }
    } catch (err) {
      console.warn('Failed to refresh bookings from database:', err);
    }
  };

  useEffect(() => {
    refreshBookingsFromDatabase();
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      refreshBookingsFromDatabase();
    }
  }, [isAdminAuthenticated]);

  // Auth Operations
  const loginUser = (phone: string, name?: string) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    // If phone matches demo user
    if (cleanPhone === INITIAL_USER.phone.replace(/\D/g, '').slice(-10)) {
      setCurrentUser(INITIAL_USER);
    } else {
      const patientName = name || 'Patient ' + cleanPhone.slice(-4);
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: patientName,
        phone: cleanPhone,
        mobileNumber: cleanPhone,
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        addresses: [
          {
            id: `addr-${Date.now()}`,
            userId: `usr-${Date.now()}`,
            label: 'Home',
            fullName: patientName,
            mobileNumber: cleanPhone,
            phone: cleanPhone,
            addressLine: 'House 14, Main Road, Near Post Office',
            addressLine1: 'House 14, Main Road',
            landmark: 'Near Post Office',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302033',
            isDefault: true
          }
        ]
      };
      setCurrentUser(newUser);

      // Register user in database (background)
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        fetch(`${apiUrl}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: patientName,
            phone: cleanPhone
          })
        }).then(async response => {
          if (!response.ok) return;
          const payload = await response.json();
          const savedUser = payload.data;
          if (savedUser) {
            // The database is the shared source of truth, so a login on a new
            // device receives the same user identity instead of a local ID.
            setCurrentUser(prev => prev ? {
              ...prev,
              id: savedUser.id,
              name: savedUser.name,
              phone: savedUser.phone,
              mobileNumber: savedUser.phone,
              email: savedUser.email || prev.email,
              age: savedUser.age || prev.age,
              gender: savedUser.gender || prev.gender
            } : prev);
          }
          const bookingsResponse = await fetch(`${apiUrl}/api/bookings?phone=${encodeURIComponent(cleanPhone)}`);
          if (bookingsResponse.ok) {
            const bookingsPayload = await bookingsResponse.json();
            if (Array.isArray(bookingsPayload.data)) setBookings(bookingsPayload.data);
          }
        }).catch(err => console.warn('User account sync:', err));
      } catch (err) {
        console.warn('User registration background save:', err);
      }
    }
    setIsUserAuthModalOpen(false);
    showToast(`Welcome back! Logged in as ${name || cleanPhone}`);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCurrentPortal('public');
    showToast('Signed out successfully.');
  };

  // Sync Auth Settings with LocalStorage
  useEffect(() => {
    localStorage.setItem('bl_auth_settings', JSON.stringify(authSettings));
  }, [authSettings]);

  // Handle Browser Navigation and URL PopState
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        setCurrentPortal('admin');
      } else if (path === '/portal' || path === '/user' || hash === '#portal' || hash === '#user') {
        setCurrentPortal('user');
      } else if (path === '/' || hash === '#' || hash === '') {
        setCurrentPortal('public');
      }
    };

    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  // Admin Auto-Lock Session Inactivity Timer
  useEffect(() => {
    if (!isAdminAuthenticated || !authSettings.sessionTimeoutMinutes || authSettings.sessionTimeoutMinutes <= 0) return;

    const timeoutMs = authSettings.sessionTimeoutMinutes * 60 * 1000;
    let timer = setTimeout(() => {
      setIsAdminAuthenticated(false);
      setAdminSessionToken(null);
      localStorage.removeItem('bl_admin_token');
      localStorage.setItem('bl_admin_auth', 'false');
      setCurrentPortal('public');
      showToast('Administrator session auto-locked due to inactivity.');
    }, timeoutMs);

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsAdminAuthenticated(false);
        setAdminSessionToken(null);
        localStorage.removeItem('bl_admin_token');
        localStorage.setItem('bl_admin_auth', 'false');
        setCurrentPortal('public');
        showToast('Administrator session auto-locked due to inactivity.');
      }, timeoutMs);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [isAdminAuthenticated, authSettings.sessionTimeoutMinutes]);

  const navigateToPortal = (portal: 'public' | 'user' | 'admin') => {
    setCurrentPortal(portal);
    if (portal === 'admin') {
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', '/admin');
      }
    } else if (portal === 'user') {
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', '/portal');
      }
    } else {
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', '/');
      }
    }
  };

  const updateAuthSettings = (updates: Partial<AuthSettings>) => {
    setAuthSettings(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('bl_auth_settings', JSON.stringify(updated));
      setWebsiteConfig(cfg => ({
        ...cfg,
        authSettings: updated,
        adminPhone: updated.adminAuthorizedPhone || cfg.adminPhone
      }));
      return updated;
    });
    logAdminAction('UPDATE', 'SETTINGS', 'auth-settings', 'Updated system authentication and security access policies');
    showToast('Security & Auth settings successfully updated.');
  };

  const changeAdminPin = (oldPin: string, newPin: string) => {
    if (oldPin !== authSettings.adminPin) {
      showToast('Incorrect current administrator password.');
      return { success: false, error: 'Current password is incorrect.' };
    }
    if (!newPin || newPin.length < 6) {
      showToast('New password must contain at least 6 characters.');
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    updateAuthSettings({ adminPin: newPin });
    logAdminAction('UPDATE', 'SETTINGS', 'admin-pin', 'Administrator master authorization password was changed');
    showToast('Administrator password updated successfully.');
    return { success: true };
  };

  const loginAdmin = async (phone: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    const inputIdentifier = phone?.trim() || authSettings.adminAuthorizedPhone || '9649183422';
    const inputPin = pin?.trim() || '';

    // Rate limiting: Track failed attempts
    const failedAttemptsKey = 'bl_admin_failed_attempts';
    const lastAttemptKey = 'bl_admin_last_attempt';
    const currentFailedAttempts = parseInt(localStorage.getItem(failedAttemptsKey) || '0', 10);
    const lastAttemptTime = parseInt(localStorage.getItem(lastAttemptKey) || '0', 10);
    const now = Date.now();

    // Lockout after 5 failed attempts for 5 minutes
    if (currentFailedAttempts >= 5 && now - lastAttemptTime < 5 * 60 * 1000) {
      const remainingTime = Math.ceil((5 * 60 * 1000 - (now - lastAttemptTime)) / 1000 / 60);
      logAdminAction('LOGIN_LOCKED', 'SETTINGS', 'admin-session', `Account locked for ${remainingTime} minutes due to multiple failed attempts`);
      return {
        success: false,
        error: `Account temporarily locked. Try again in ${remainingTime} minute(s).`
      };
    }

    // Reset failed attempts if lockout period has passed
    if (currentFailedAttempts >= 5 && now - lastAttemptTime >= 5 * 60 * 1000) {
      localStorage.setItem(failedAttemptsKey, '0');
    }

    // Verify against the backend so the same administrator password works on
    // every device and changed credentials are shared across browsers.
    let serverResult: { success: boolean; token?: string; admin?: { phone: string }; error?: string };
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: inputIdentifier, pin: inputPin })
      });
      serverResult = await response.json();
    } catch {
      serverResult = { success: false, error: 'Unable to reach the authentication server.' };
    }
    const isAuthorized = serverResult.success;

    if (isAuthorized) {
      const cleanDigits = String(inputIdentifier).replace(/\D/g, '').slice(-10);
      const effectivePhone = cleanDigits.length === 10 ? cleanDigits : (authSettings.adminAuthorizedPhone || '9649183422');
      const token = serverResult.token || `bld-jwt-${btoa(`${effectivePhone}-${Date.now()}`)}`;
      setIsAdminAuthenticated(true);
      setAdminSessionToken(token);
      localStorage.setItem('bl_admin_token', token);
      localStorage.setItem('bl_admin_auth', 'true');
      localStorage.removeItem(failedAttemptsKey);
      localStorage.removeItem(lastAttemptKey);
      setIsAdminAuthModalOpen(false);
      setCurrentPortal('admin');
      setActiveAdminTab('dashboard');
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', '/admin');
      }
      logAdminAction('LOGIN', 'SETTINGS', 'admin-session', `Admin authenticated with ${effectivePhone}`);
      showToast('Admin Access Granted. Welcome, Administrator!');
      return { success: true };
    }

    // Track failed attempt
    const newFailedAttempts = currentFailedAttempts + 1;
    localStorage.setItem(failedAttemptsKey, newFailedAttempts.toString());
    localStorage.setItem(lastAttemptKey, now.toString());
    const remainingAttempts = 5 - newFailedAttempts;

    logAdminAction('LOGIN_FAILED', 'SETTINGS', 'admin-session', `Failed login attempt with identifier ${inputIdentifier}. Attempts: ${newFailedAttempts}/5`);
    const errorMsg = serverResult.error || (remainingAttempts > 0
      ? `Invalid credentials. ${remainingAttempts} attempt(s) remaining.`
      : 'Account temporarily locked for 5 minutes due to multiple failed attempts.');
    showToast(errorMsg);
    return { success: false, error: errorMsg };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminSessionToken(null);
    localStorage.removeItem('bl_admin_token');
    localStorage.setItem('bl_admin_auth', 'false');
    setCurrentPortal('public');
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '/');
    }
    showToast('Admin session terminated and locked.');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    showToast('Profile updated successfully.');
  };

  const addUserAddress = (address: Omit<UserAddress, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newAddress: UserAddress = {
      ...address,
      id: `addr-${Date.now()}`,
      userId: currentUser.id
    };
    const updatedAddresses = address.isDefault
      ? currentUser.addresses.map(a => ({ ...a, isDefault: false })).concat(newAddress)
      : [...currentUser.addresses, newAddress];

    setCurrentUser({
      ...currentUser,
      addresses: updatedAddresses
    });

    // Save address to database (background)
    const cleanPhone = (currentUser.phone || currentUser.mobileNumber).replace(/\D/g, '').slice(-10);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      fetch(`${apiUrl}/api/users/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          address: {
            label: address.label,
            addressLine: address.addressLine,
            landmark: address.landmark,
            city: address.city,
            pincode: address.pincode,
            isDefault: address.isDefault
          }
        })
      }).catch(err => console.warn('Address background save:', err));
    } catch (err) {
      console.warn('Address background save:', err);
    }

    showToast('New address saved!');
  };

  const deleteUserAddress = (id: string) => {
    if (!currentUser) return;
    const remaining = currentUser.addresses.filter(a => a.id !== id);
    if (remaining.length > 0 && !remaining.some(a => a.isDefault)) {
      remaining[0].isDefault = true;
    }
    setCurrentUser({
      ...currentUser,
      addresses: remaining
    });
    showToast('Address removed.');
  };

  const setDefaultAddress = (id: string) => {
    if (!currentUser) return;
    const updated = currentUser.addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setCurrentUser({
      ...currentUser,
      addresses: updated
    });
    showToast('Default delivery address set.');
  };

  // Catalogue Management
  const updateTest = (id: string, updates: Partial<DiagnosticTest>) => {
    setTests(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
    logAdminAction('PRICE_UPDATE', 'TEST', id, `Updated test ${updates.name || id} properties`);
    showToast('Test updated in live catalogue.');
  };

  const addCustomTest = (testData: Omit<DiagnosticTest, 'id'>) => {
    const newTest: DiagnosticTest = {
      ...testData,
      id: `test-${Date.now()}`
    };
    setTests(prev => [newTest, ...prev]);
    logAdminAction('CREATE', 'TEST', newTest.id, `Created test ${newTest.name}`);
    showToast('New test successfully added to catalogue.');
  };

  const updatePackage = (id: string, updates: Partial<HealthPackage>) => {
    setPackages(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    logAdminAction('PRICE_UPDATE', 'PACKAGE', id, `Updated package ${updates.name || id}`);
    showToast('Package updated.');
  };

  // Cart
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const exists = cart.some(c => c.itemId === item.itemId);
    if (exists) {
      showToast(`${item.name} is already in your booking list.`);
      setIsCartOpen(true);
      return;
    }
    const newCartItem: CartItem = {
      ...item,
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setCart(prev => [...prev, newCartItem]);
    showToast(`Added ${item.name} to booking cart.`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
    showToast('Removed from cart.');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const cartCollectionFee = cartSubtotal >= websiteConfig.freeCollectionThreshold ? 0 : websiteConfig.standardCollectionFee;
  const cartDiscount = cartSubtotal > 2000 ? 150 : 0; // Courtesy wellness discount
  const cartTotal = Math.max(0, cartSubtotal + cartCollectionFee - cartDiscount);

  // Bookings
  const createBooking = (details: {
    address: UserAddress;
    bookingDate: string;
    collectionSlot: string;
    paymentMode: 'CASH_ON_COLLECTION' | 'UPI_ONLINE' | 'CARD';
    notes?: string;
  }): Booking => {
    const bookingNum = `BL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBookingId = `book-${Date.now()}`;
    const newItems = cart.map((c, idx) => ({
      id: `bi-${newBookingId}-${idx}`,
      bookingId: newBookingId,
      type: c.type,
      itemId: c.itemId,
      nameSnapshot: c.name,
      priceSnapshot: c.price,
      sampleSnapshot: c.sample
    }));

    const newBooking: Booking = {
      id: newBookingId,
      bookingNumber: bookingNum,
      userId: currentUser?.id || 'guest-user',
      userName: currentUser?.name || 'Walk-in Patient',
      userPhone: currentUser?.phone || '9828012345',
      userEmail: currentUser?.email,
      address: details.address,
      bookingDate: details.bookingDate,
      collectionSlot: details.collectionSlot,
      subtotal: cartSubtotal,
      collectionFee: cartCollectionFee,
      discount: cartDiscount,
      total: cartTotal,
      paymentMode: details.paymentMode,
      paymentStatus: details.paymentMode === 'UPI_ONLINE' ? 'PAID' : 'PENDING',
      status: 'NEW',
      statusHistory: [
        {
          status: 'NEW',
          timestamp: new Date().toISOString(),
          note: 'Booking submitted by patient'
        }
      ],
      items: newItems,
      createdAt: new Date().toISOString(),
      notes: details.notes
    };

    setBookings(prev => [newBooking, ...prev]);
    clearCart();
    setIsCartOpen(false);

    // Notify User
    addNotification({
      userId: newBooking.userId,
      bookingId: newBooking.id,
      title: `Booking Confirmed #${bookingNum}`,
      message: `Your booking for ${newBooking.items.length} item(s) has been booked for ${newBooking.bookingDate} (${newBooking.collectionSlot}).`,
      type: 'BOOKING'
    });

    // Directly sync to Express server in all environments
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBooking,
          patientPhone: newBooking.userPhone,
          patientName: newBooking.userName,
          address_snapshot: newBooking.address
        })
      }).catch(e => console.warn('Backend sync:', e));
    } catch (e) {
      // ignore in isolated environments
    }

    logAdminAction('CREATE', 'BOOKING', newBooking.id, `Patient booked order #${bookingNum} for ₹${newBooking.total}`);
    showToast(`Order Confirmed! Booking ID: ${bookingNum}`);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, newStatus: BookingStatus, note?: string) => {
    let updatedBookingRecord: Booking | null = null;
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        const updatedHistory = [
          ...b.statusHistory,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${newStatus}`
          }
        ];
        const updated: Booking = {
          ...b,
          status: newStatus,
          statusHistory: updatedHistory,
          paymentStatus: newStatus === 'COMPLETED' ? 'PAID' : b.paymentStatus
        };
        updatedBookingRecord = updated;
        return updated;
      })
    );

    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      addNotification({
        userId: booking.userId,
        bookingId: booking.id,
        title: `Booking #${booking.bookingNumber} Update`,
        message: `Status changed to: ${newStatus.replace(/_/g, ' ')}. ${note || ''}`,
        type: 'COLLECTION'
      });
    }

    logAdminAction('UPDATE_BOOKING_STATUS', 'BOOKING', bookingId, `Changed status to ${newStatus} for #${booking?.bookingNumber}`);
    showToast(`Status updated to ${newStatus}`);
  };

  const assignPhlebotomist = (bookingId: string, phlebotomistId: string) => {
    const phleb = phlebotomists.find(p => p.id === phlebotomistId);
    if (!phleb) return;

    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        const barcode = b.sampleBarcode || `BL26-${Math.floor(1000 + Math.random() * 9000)}`;
        const updatedHistory = [
          ...b.statusHistory,
          {
            status: 'COLLECTION_ASSIGNED' as BookingStatus,
            timestamp: new Date().toISOString(),
            note: `Phlebotomist ${phleb.name} assigned. Vacutainer barcode: ${barcode}`
          }
        ];
        return {
          ...b,
          status: 'COLLECTION_ASSIGNED',
          assignedPhlebotomist: phleb,
          sampleBarcode: barcode,
          statusHistory: updatedHistory
        };
      })
    );

    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      addNotification({
        userId: booking.userId,
        bookingId: booking.id,
        title: `Phlebotomist Assigned #${booking.bookingNumber}`,
        message: `Phlebotomist ${phleb.name} (Ph: ${phleb.phone}) is scheduled for your home sample collection.`,
        type: 'COLLECTION'
      });
    }

    logAdminAction('ASSIGN_PHLEBOTOMIST', 'BOOKING', bookingId, `Assigned ${phleb.name} to #${booking?.bookingNumber}`);
    showToast(`Assigned phlebotomist ${phleb.name}`);
  };

  // Reports
  const uploadAndPublishReport = (bookingId: string, reportData: Partial<DiagnosticReport>) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const reportId = `rep-${booking.bookingNumber.toLowerCase()}`;
    const newReport: DiagnosticReport = {
      id: reportId,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      userId: booking.userId,
      patientName: booking.userName,
      patientAge: currentUser?.age || 36,
      patientGender: currentUser?.gender || 'Male',
      testNames: booking.items.map(i => i.nameSnapshot),
      reportStatus: 'PUBLISHED',
      uploadedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      version: 1,
      results: reportData.results && reportData.results.length > 0 ? reportData.results : [
        {
          parameter: 'Observed Diagnostic Panel',
          observedValue: 'Clinically Normal / Reference Match',
          unit: 'Units',
          referenceInterval: 'Normal biological range',
          isAbnormal: false
        }
      ],
      pathologistNotes: reportData.pathologistNotes || 'All evaluated parameters conform to clinical reference benchmarks.',
      approvedBy: reportData.approvedBy || 'Dr. Vikas Singhal (M.D. Pathologist) & Dr. Neha Gupta (M.D. Microbiologist)'
    };

    setReports(prev => [newReport, ...prev.filter(r => r.bookingId !== bookingId)]);

    // Update booking status to REPORT_PUBLISHED
    updateBookingStatus(bookingId, 'REPORT_PUBLISHED', 'Laboratory test report published and approved by pathologist.');

    addNotification({
      userId: booking.userId,
      bookingId: booking.id,
      title: `Diagnostic Report Ready for #${booking.bookingNumber}`,
      message: `Your verified diagnostic test report is now available for download.`,
      type: 'REPORT'
    });

    logAdminAction('PUBLISH_REPORT', 'REPORT', newReport.id, `Uploaded & published clinical report for #${booking.bookingNumber}`);
    showToast(`Report published for #${booking.bookingNumber}!`);
  };

  // Notifications & Logging
  const addNotification = (notif: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter(
    n => !n.read && (n.userId === 'all' || n.userId === currentUser?.id)
  ).length;

  const logAdminAction = (
    action: string,
    entity: 'BOOKING' | 'TEST' | 'PACKAGE' | 'REPORT' | 'USER' | 'SETTINGS',
    entityId: string,
    details: string
  ) => {
    const log: AdminActivityLog = {
      id: `log-${Date.now()}`,
      adminId: 'admin-primary',
      adminPhone: websiteConfig.adminPhone,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString()
    };
    setAdminLogs(prev => [log, ...prev]);
  };

  const updateWebsiteConfig = (updates: Partial<WebsiteConfig>) => {
    setWebsiteConfig(prev => ({ ...prev, ...updates }));
    logAdminAction('UPDATE', 'SETTINGS', 'site-config', 'Updated lab website configuration');
    showToast('Center details saved.');
  };

  return (
    <AppContext.Provider
      value={{
        currentPortal,
        setCurrentPortal,
        navigateToPortal,
        activePublicTab,
        setActivePublicTab,
        activeUserTab,
        setActiveUserTab,
        activeAdminTab,
        setActiveAdminTab,

        currentUser,
        isAdminAuthenticated,
        adminSessionToken,
        authSettings,
        updateAuthSettings,
        changeAdminPin,
        loginUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
        updateUserProfile,
        addUserAddress,
        deleteUserAddress,
        setDefaultAddress,

        tests,
        packages,
        updateTest,
        addCustomTest,
        updatePackage,

        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCollectionFee,
        cartDiscount,
        cartTotal,

        bookings,
        refreshBookingsFromDatabase,
        createBooking,
        updateBookingStatus,
        assignPhlebotomist,

        reports,
        viewingReport,
        setViewingReport,
        uploadAndPublishReport,

        phlebotomists,
        websiteConfig,
        updateWebsiteConfig,

        notifications,
        markNotificationAsRead,
        unreadNotificationsCount,
        adminLogs,

        isCartOpen,
        setIsCartOpen,
        isUserAuthModalOpen,
        setIsUserAuthModalOpen,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        selectedTestForDetail,
        setSelectedTestForDetail,
        selectedBookingForTrack,
        setSelectedBookingForTrack,

        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
