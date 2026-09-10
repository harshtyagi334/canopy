import React, { useState, useRef, useEffect } from 'react';
import { Language, UserProfile } from '../types';
import { translations } from '../translations';
import {
  Satellite,
  ShieldCheck,
  Upload,
  Compass,
  LayoutDashboard,
  Info,
  Menu,
  X,
  Globe,
  ChevronDown,
  Layers,
  KeyRound,
  User,
  LogOut,
  Shield,
  FileCheck2,
  Sliders,
  Lock
} from 'lucide-react';

export type NavTab = 'home' | 'dashboard' | 'explorer' | 'pipeline' | 'projects' | 'outcomes' | 'detail' | 'upload' | 'about' | 'auth' | 'settings';

interface NavbarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenUploadModal: () => void;
  onOpenAboutModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenUploadModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (tab: NavTab) => {
    if (tab === 'upload') {
      onOpenUploadModal();
    } else {
      setCurrentTab(tab);
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setLangDropdownOpen(false);
  };

  const languages: { code: Language; label: string; script: string }[] = [
    { code: 'en', label: 'English', script: 'EN' },
    { code: 'hi', label: 'हिन्दी', script: 'HI' },
    { code: 'mr', label: 'मराठी', script: 'MR' },
  ];

  return (
    <header className="no-print sticky top-0 z-40 backdrop-blur-md bg-[#12372A]/95 border-b border-white/10 text-white transition-all">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          
          {/* Brand Logo & Platform Seal */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white rounded-xl p-1 transition-transform active:scale-[0.98] cursor-pointer shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1b4e3c] via-[#163f31] to-[#0a231a] flex items-center justify-center text-white shadow-md border border-white/20 group-hover:border-[#74BDE0]/70 group-hover:shadow-[0_0_15px_rgba(116,189,224,0.3)] transition-all shrink-0">
              <Satellite className="w-5 h-5 text-[#A8C3A0] group-hover:text-[#74BDE0] transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#74BDE0] ring-2 ring-[#12372A] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight font-serif-display leading-none text-white whitespace-nowrap">
                  Canopy
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded font-mono bg-white/10 text-[#74BDE0] border border-white/15 whitespace-nowrap">
                  CA-AUDIT
                </span>
              </div>
              <span className="hidden sm:block text-[11px] tracking-wide font-medium mt-0.5 text-[#A8C3A0]/90 whitespace-nowrap truncate max-w-[210px] md:max-w-[280px]">
                Where Did the Compensatory Forest Go?
              </span>
            </div>
          </button>

          {/* Primary Navigation System (Arranged cleanly to eliminate clutter) */}
          <nav className="hidden xl:flex items-center gap-1 p-1 rounded-2xl border bg-black/35 border-white/15 shadow-inner shrink-0">
            {/* 1. Overview */}
            <button
              id="nav-home-btn"
              onClick={() => handleNav('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'home'
                  ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck size={14} className={currentTab === 'home' ? 'text-[#A8C3A0]' : 'text-white/70'} />
              <span>{lang === 'en' ? 'Overview' : lang === 'hi' ? 'अवलोकन' : 'आढावा'}</span>
            </button>

            {/* 2. Executive Dashboard */}
            <button
              id="nav-dashboard-btn"
              onClick={() => handleNav('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'dashboard'
                  ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard size={14} className={currentTab === 'dashboard' ? 'text-[#A8C3A0]' : 'text-white/70'} />
              <span>{lang === 'en' ? 'Dashboard' : lang === 'hi' ? 'डैशबोर्ड' : 'डॅशबोर्ड'}</span>
            </button>

            {/* 3. Evidence Pipeline */}
            <button
              id="nav-pipeline-btn"
              onClick={() => handleNav('pipeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'pipeline'
                  ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers size={14} className={currentTab === 'pipeline' ? 'text-[#A8C3A0]' : 'text-white/70'} />
              <span>{t.navPipeline}</span>
            </button>

            {/* 4. Explorer Projects */}
            <button
              id="nav-explore-btn"
              onClick={() => handleNav('projects')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'projects' || currentTab === 'detail'
                  ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass size={14} className={currentTab === 'projects' || currentTab === 'detail' ? 'text-[#A8C3A0]' : 'text-white/70'} />
              <span>{t.navExplore}</span>
            </button>

            {/* 5. Satellite Explorer */}
            <button
              id="nav-explorer-btn"
              onClick={() => handleNav('explorer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'explorer'
                  ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Satellite size={14} className={currentTab === 'explorer' ? 'text-[#A8C3A0]' : 'text-white/70'} />
              <span>{lang === 'en' ? 'Satellite Explorer' : lang === 'hi' ? 'उपग्रह' : 'उपग्रह'}</span>
            </button>

            {/* 6. Dedicated About Section (Requested by user) */}
            <button
              id="nav-about-btn"
              onClick={() => handleNav('about')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'about'
                  ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Info size={14} className={currentTab === 'about' ? 'text-[#A8C3A0]' : 'text-white/70'} />
              <span>{t.navAbout}</span>
            </button>
          </nav>

          {/* Right Action Utility Cluster (Spaced, non-overlapping, with login-gated upload) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Upload Document Button (Strictly gated by login as requested) */}
            <button
              id="nav-upload-btn"
              onClick={() => handleNav('upload')}
              className={`h-9 px-3 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                currentUser
                  ? 'bg-[#3E7C59]/30 hover:bg-[#3E7C59]/50 text-white border border-[#A8C3A0]/40'
                  : 'bg-white/10 hover:bg-white/15 text-white/90 border border-white/15'
              }`}
              title={currentUser ? 'Upload Statutory Clearance PDF or Shapefile' : 'Sign In required to upload clearance documents'}
            >
              <Upload size={13} className={currentUser ? 'text-[#A8C3A0]' : 'text-white/60'} />
              <span className="hidden sm:inline">{t.navUpload}</span>
              <span className="sm:hidden">Upload</span>
              {!currentUser && (
                <span className="flex items-center gap-0.5 text-[10px] font-mono text-[#FDE68A] bg-black/40 px-1 py-0.5 rounded border border-[#FDE68A]/30">
                  <Lock size={9} />
                </span>
              )}
            </button>

            {/* Settings Button */}
            <button
              id="nav-settings-btn"
              onClick={() => handleNav('settings')}
              className={`h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                currentTab === 'settings'
                  ? 'bg-[#3E7C59] text-white border-[#A8C3A0] shadow-sm'
                  : 'bg-white/10 hover:bg-white/15 text-white/90 border-white/20'
              }`}
              title="Workstation & Satellite Settings"
            >
              <Sliders size={13} className={currentTab === 'settings' ? 'text-[#A8C3A0]' : 'text-white/70'} />
              <span className="hidden md:inline">{lang === 'en' ? 'Settings' : lang === 'hi' ? 'सेटिंग्स' : 'सेटिंग्ज'}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative shrink-0" ref={langMenuRef}>
              <button
                id="lang-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="h-9 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer shrink-0"
                aria-label="Select Language"
              >
                <Globe size={13} className="text-[#A8C3A0]" />
                <span className="hidden sm:inline">{languages.find((l) => l.code === lang)?.label}</span>
                <span className="sm:hidden uppercase font-mono">{languages.find((l) => l.code === lang)?.script}</span>
                <ChevronDown size={11} className={`text-white/70 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 border border-white/20 rounded-2xl shadow-2xl py-1.5 z-50 bg-[#0e291e] backdrop-blur-xl text-white animate-in fade-in zoom-in-95 duration-100"
                  role="menu"
                >
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        lang === item.code
                          ? 'bg-[#3E7C59]/40 text-[#A8C3A0] font-bold'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                      role="menuitem"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] font-mono uppercase font-semibold text-[#A8C3A0]">{item.script}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Authentication: Clean, non-overlapping design */}
            {currentUser ? (
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`h-9 flex items-center gap-2 px-2.5 rounded-xl border transition-all cursor-pointer shadow-md shrink-0 ${
                    currentTab === 'auth'
                      ? 'bg-[#3E7C59] border-[#A8C3A0]'
                      : 'bg-black/40 hover:bg-black/60 border-white/20'
                  }`}
                  title={`${currentUser.name} (${currentUser.roleTitle})`}
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#3E7C59] to-[#12372A] flex items-center justify-center text-white font-bold text-[11px] border border-[#A8C3A0]/60 shrink-0">
                    {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="hidden lg:flex flex-col text-left leading-none">
                    <span className="text-xs font-bold text-white truncate max-w-[90px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-[#A8C3A0] font-mono mt-0.5 truncate max-w-[90px]">
                      {currentUser.clearanceLevel}
                    </span>
                  </div>
                  <ChevronDown size={11} className={`text-white/70 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Popup Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 border border-white/20 rounded-2xl shadow-2xl py-2 z-50 bg-[#0e291e] backdrop-blur-xl text-white space-y-2 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{currentUser.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#6EE7B7] text-[10px] font-mono font-semibold">
                          Active Officer
                        </span>
                      </div>
                      <span className="text-[11px] text-[#A8C3A0] block truncate mt-0.5">{currentUser.roleTitle}</span>
                      <span className="text-[10px] text-white/50 block font-mono truncate">{currentUser.email}</span>
                    </div>

                    <div className="px-2 space-y-1">
                      <button
                        onClick={() => {
                          setCurrentTab('auth');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-white/10 text-white transition-colors cursor-pointer"
                      >
                        <Shield size={14} className="text-[#A8C3A0]" />
                        <span>Workstation Credentials</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentTab('settings');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-white/10 text-white transition-colors cursor-pointer"
                      >
                        <Sliders size={14} className="text-[#A8C3A0]" />
                        <span>Platform Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-[#E5484D]/20 text-[#FFA8A8] transition-colors cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign Out Workstation</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Completely fixed, elegant Login / Sign Up buttons with ZERO text wrapping or boundary overflow */
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="h-9 px-3 sm:px-3.5 rounded-xl bg-[#3E7C59] hover:bg-[#478f66] active:scale-95 text-white text-xs font-semibold border border-[#A8C3A0]/40 flex items-center gap-1.5 shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0"
                  title="Sign In to Compliance Workstation"
                >
                  <KeyRound size={13} className="text-[#A8C3A0] shrink-0" />
                  <span className="whitespace-nowrap">Sign In</span>
                </button>

                <button
                  id="nav-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="hidden sm:flex h-9 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white/90 hover:text-white text-xs font-semibold border border-white/20 items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0"
                  title="Register Official Account"
                >
                  <span className="whitespace-nowrap">Register</span>
                </button>
              </div>
            )}

            {/* Mobile menu toggle button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden h-9 w-9 flex items-center justify-center rounded-xl text-white hover:bg-white/10 focus:outline-hidden transition-colors cursor-pointer border border-white/15 shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/10 px-4 pt-3 pb-5 space-y-1.5 bg-[#0e291e] text-white">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 cursor-pointer ${
              currentTab === 'home' ? 'bg-[#3E7C59] text-white' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <ShieldCheck size={18} className="text-[#A8C3A0]" />
            <span>{lang === 'en' ? 'Overview' : lang === 'hi' ? 'अवलोकन' : 'आढावा'}</span>
          </button>

          <button
            onClick={() => handleNav('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 cursor-pointer ${
              currentTab === 'dashboard' ? 'bg-[#3E7C59] text-white' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard size={18} className="text-[#A8C3A0]" />
            <span>{lang === 'en' ? 'Dashboard' : lang === 'hi' ? 'डैशबोर्ड' : 'डॅशबोर्ड'}</span>
          </button>

          <button
            onClick={() => handleNav('pipeline')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 cursor-pointer ${
              currentTab === 'pipeline' ? 'bg-[#3E7C59] text-white' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Layers size={18} className="text-[#A8C3A0]" />
            <span>{t.navPipeline}</span>
          </button>

          <button
            onClick={() => handleNav('projects')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 cursor-pointer ${
              currentTab === 'projects' || currentTab === 'detail' ? 'bg-[#3E7C59] text-white' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Compass size={18} className="text-[#A8C3A0]" />
            <span>{t.navExplore}</span>
          </button>

          <button
            onClick={() => handleNav('explorer')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 cursor-pointer ${
              currentTab === 'explorer' ? 'bg-[#3E7C59] text-white' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Satellite size={18} className="text-[#A8C3A0]" />
            <span>{lang === 'en' ? 'Satellite Explorer' : lang === 'hi' ? 'उपग्रह एक्सप्लोरर' : 'उपग्रह एक्सप्लोरर'}</span>
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 cursor-pointer ${
              currentTab === 'about' ? 'bg-[#3E7C59] text-white' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Info size={18} className="text-[#A8C3A0]" />
            <span>{t.navAbout} (Platform & Science)</span>
          </button>

          <button
            onClick={() => handleNav('settings')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 cursor-pointer ${
              currentTab === 'settings' ? 'bg-[#3E7C59] text-white' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Sliders size={18} className="text-[#A8C3A0]" />
            <span>{lang === 'en' ? 'Settings' : lang === 'hi' ? 'सेटिंग्स' : 'सेटिंग्ज'}</span>
          </button>

          <button
            onClick={() => handleNav('upload')}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-white/80 hover:bg-white/10 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Upload size={18} className="text-white/70" />
              <span>{t.navUpload}</span>
            </div>
            {!currentUser && (
              <span className="text-xs text-[#FDE68A] flex items-center gap-1 font-mono">
                <Lock size={12} />
                <span>Login Required</span>
              </span>
            )}
          </button>

          {/* Mobile Auth Area */}
          <div className="pt-3 border-t border-white/10">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNav('auth')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold bg-white/10 text-white flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[#A8C3A0]" />
                    <span>{currentUser.name}</span>
                  </div>
                  <span className="text-xs font-mono text-[#A8C3A0]">{currentUser.clearanceLevel}</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#E5484D]/20 text-[#FFA8A8] flex items-center gap-2"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="mobile-nav-login-btn"
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#3E7C59] hover:bg-[#478f66] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-[#A8C3A0]/40 shadow-sm"
                >
                  <KeyRound size={14} className="text-[#A8C3A0]" />
                  <span>Sign In</span>
                </button>
                <button
                  id="mobile-nav-signup-btn"
                  onClick={() => {
                    onOpenAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
                >
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
