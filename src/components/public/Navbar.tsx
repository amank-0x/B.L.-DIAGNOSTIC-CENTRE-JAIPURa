import React, { useState } from 'react';
import {
  ShoppingBag,
  User,
  Shield,
  Menu,
  X,
  PhoneCall,
  Bell,
  FileText,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentPortal,
    setCurrentPortal,
    navigateToPortal,
    activePublicTab,
    setActivePublicTab,
    cart,
    setIsCartOpen,
    currentUser,
    setIsUserAuthModalOpen,
    setIsAdminAuthModalOpen,
    isAdminAuthenticated,
    unreadNotificationsCount,
    websiteConfig
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'tests', label: 'Tests' },
    { id: 'packages', label: 'Health Packages' },
    { id: 'home_collection', label: 'Home Collection' },
    { id: 'how_it_works', label: 'How It Works' },
    { id: 'reports_search', label: 'Find Report' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    setCurrentPortal('public');
    setActivePublicTab(id);
    setMobileMenuOpen(false);

    // Smooth scroll to section if on page
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Strict 1-Row 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title wordmark (single line text element) */}
        <button
          onClick={() => {
            setCurrentPortal('public');
            setActivePublicTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left font-extrabold text-base sm:text-lg tracking-tight text-blue-950 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-black text-sm">
            BL
          </span>
          <span className="font-sans font-bold">B.L. DIAGNOSTIC CENTER</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap cursor-pointer ${
                activePublicTab === link.id && currentPortal === 'public'
                  ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5'
                  : ''
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="View booking cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                {cart.length}
              </span>
            )}
          </button>

          {/* User Portal / Patient Sign in */}
          {currentUser ? (
            <button
              onClick={() => navigateToPortal(currentPortal === 'user' ? 'public' : 'user')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentPortal === 'user'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
              <span className="sm:hidden">Portal</span>
              {unreadNotificationsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              )}
            </button>
          ) : (
            <button
              onClick={() => setIsUserAuthModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Login</span>
            </button>
          )}

          {/* Admin Switch (Rendered ONLY if an active authenticated admin session exists) */}
          {isAdminAuthenticated && (
            <button
              onClick={() => navigateToPortal(currentPortal === 'admin' ? 'public' : 'admin')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                currentPortal === 'admin'
                  ? 'bg-slate-900 text-white'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
              }`}
              title="Return to Administrative Suite"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Admin Suite</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="w-full text-left py-2 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              navigateToPortal('admin');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2 px-3 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
              isAdminAuthenticated
                ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {isAdminAuthenticated ? (
              <Shield className="w-4 h-4 text-emerald-600" />
            ) : (
              <Lock className="w-4 h-4 text-slate-500" />
            )}
            <span>{isAdminAuthenticated ? 'Enter Administrative Suite' : 'Staff / Admin Portal'}</span>
          </button>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
            <span>Helpline: {websiteConfig.helplinePhone}</span>
            <span className="text-[11px] text-slate-400">Jaipur, Rajasthan</span>
          </div>
        </div>
      )}
    </header>
  );
};
