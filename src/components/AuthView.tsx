import React, { useState } from 'react';
import { UserProfile, UserRole, Language } from '../types';
import { PRESET_USERS, saveNewRegisteredUser, getRegisteredUsers } from '../data/authData';
import { translations } from '../translations';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  ArrowRight,
  Shield,
  FileCheck2,
  Compass,
  Check,
  HelpCircle,
  Fingerprint,
  RefreshCw,
  LogOut,
  UserCheck,
  Satellite
} from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from '../context/ToastContext';

interface AuthViewProps {
  lang: Language;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthView: React.FC<AuthViewProps> = ({
  lang,
  currentUser,
  onLoginSuccess,
  onLogout,
  onNavigateHome,
  initialMode = 'login',
}) => {
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccessNotice, setLoginSuccessNotice] = useState<string | null>(null);

  // Forgot Password Modal State
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('moefcc_officer');
  const [signUpRoleTitle, setSignUpRoleTitle] = useState('Regulatory Compliance Officer');
  const [signUpOrg, setSignUpOrg] = useState('Ministry of Environment, Forest & Climate Change');
  const [signUpDept, setSignUpDept] = useState('Regional Forest Conservation Division');
  const [signUpBadge, setSignUpBadge] = useState('');
  const [signUpJurisdiction, setSignUpJurisdiction] = useState('Maharashtra & Central India');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  // Password strength calculation
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(signUpPassword);

  const handleRoleChange = (role: UserRole) => {
    setSignUpRole(role);
    if (role === 'moefcc_officer') {
      setSignUpRoleTitle('Senior Regulatory Inspector');
      setSignUpOrg('Ministry of Environment, Forest & Climate Change (MoEFCC)');
      setSignUpDept('Forest Conservation Division (IA-I)');
      setSignUpBadge('IND-IFS-2024-9102');
    } else if (role === 'state_campa_officer') {
      setSignUpRoleTitle('State CAMPA Nodal Officer');
      setSignUpOrg('State Forest Department');
      setSignUpDept('CAMPA Monitoring & Geo-Information Unit');
      setSignUpBadge('STATE-FD-CAMPA-104');
    } else if (role === 'proponent_esg') {
      setSignUpRoleTitle('Lead ESG & Compliance Manager');
      setSignUpOrg('Infrastructure / Mining User Agency');
      setSignUpDept('Sustainability & Regulatory Affairs');
      setSignUpBadge('CORP-ESG-882');
    } else if (role === 'independent_auditor') {
      setSignUpRoleTitle('Accredited Environmental Auditor');
      setSignUpOrg('NABET/QCI Accredited Geospatial Lab');
      setSignUpDept('Remote Sensing & Audit Cell');
      setSignUpBadge('NABET-EIA-AUD-771');
    } else {
      setSignUpRoleTitle('Independent Citizen Researcher');
      setSignUpOrg('Public Environmental Observatory');
      setSignUpDept('Open Data & Transparency Initiative');
      setSignUpBadge('PUB-RES-001');
    }
  };

  // Preset 1-Click Login Handler
  const handleQuickLogin = (preset: typeof PRESET_USERS[0]) => {
    setIsSubmitting(true);
    setLoginError(null);
    setTimeout(() => {
      onLoginSuccess(preset);
      setLoginSuccessNotice(`Authenticated as ${preset.name}`);
      setIsSubmitting(false);
    }, 400);
  };

  // Submit Login Form
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please provide both your official email and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Check registered users in storage
      const registered = getRegisteredUsers();
      const allUsers = [...registered, ...PRESET_USERS];

      const matchedUser = allUsers.find(
        (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
      );

      if (matchedUser) {
        onLoginSuccess(matchedUser);
        setLoginSuccessNotice(`Welcome back, ${matchedUser.name}`);
        setIsSubmitting(false);
      } else {
        // Allow fallback instant login for any email for smooth testing
        const fallbackUser: UserProfile = {
          id: `user-${Date.now()}`,
          name: loginEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: loginEmail.trim(),
          role: loginEmail.includes('gov.in') ? 'moefcc_officer' : 'independent_auditor',
          roleTitle: loginEmail.includes('gov.in') ? 'Statutory Forest Inspector' : 'Geospatial Compliance Specialist',
          organization: loginEmail.includes('gov.in') ? 'Ministry of Environment, Forest & Climate Change' : 'Environmental Audit Council',
          jurisdiction: 'Pan-India',
          clearanceLevel: loginEmail.includes('gov.in') ? 'Statutory Authority' : 'Accredited Auditor',
          joinedDate: new Date().toISOString().split('T')[0]
        };
        onLoginSuccess(fallbackUser);
        setLoginSuccessNotice(`Welcome, ${fallbackUser.name}`);
        setIsSubmitting(false);
      }
    }, 500);
  };

  // Submit Sign Up Form
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (!signUpName.trim() || !signUpEmail.trim()) {
      setSignUpError('Full name and official work email are required.');
      return;
    }

    if (!signUpEmail.includes('@') || !signUpEmail.includes('.')) {
      setSignUpError('Please enter a valid official email address.');
      return;
    }

    if (signUpPassword.length < 6) {
      setSignUpError('Password must contain at least 6 characters.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match.');
      return;
    }

    if (!termsAgreed) {
      setSignUpError('You must agree to the Statutory Data Access Terms & Evidence Act non-repudiation clauses.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let clearanceLevel: UserProfile['clearanceLevel'] = 'Public Inspector';
      if (signUpRole === 'moefcc_officer') clearanceLevel = 'Statutory Authority';
      else if (signUpRole === 'state_campa_officer') clearanceLevel = 'State Nodal';
      else if (signUpRole === 'proponent_esg') clearanceLevel = 'Proponent ESG';
      else if (signUpRole === 'independent_auditor') clearanceLevel = 'Accredited Auditor';

      const newUser: UserProfile = {
        id: `user-reg-${Date.now()}`,
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        role: signUpRole,
        roleTitle: signUpRoleTitle.trim() || 'Compliance Inspector',
        organization: signUpOrg.trim() || 'Regulatory Authority',
        department: signUpDept.trim(),
        badgeNumber: signUpBadge.trim() || `VAN-AI-${Math.floor(1000 + Math.random() * 9000)}`,
        jurisdiction: signUpJurisdiction.trim() || 'National Territory',
        clearanceLevel: clearanceLevel,
        joinedDate: new Date().toISOString().split('T')[0]
      };

      saveNewRegisteredUser(newUser);
      onLoginSuccess(newUser);
      setLoginSuccessNotice(`Official profile registered for ${newUser.name}`);
      setIsSubmitting(false);
    }, 600);
  };

  // If user is already logged in, show Profile & Credentials Overview
  if (currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#12372A]/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3E7C59] to-[#1b4e3c] flex items-center justify-center text-white text-2xl font-bold border-2 border-[#A8C3A0] shadow-xl">
                {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white font-serif-display">
                    {currentUser.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#6EE7B7] text-xs font-mono font-semibold border border-[#10B981]/40 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Verified Session</span>
                  </span>
                </div>
                <p className="text-sm text-[#A8C3A0] font-medium mt-0.5">
                  {currentUser.roleTitle} • {currentUser.organization}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#E5484D]/20 text-white hover:text-[#FFA8A8] border border-white/20 hover:border-[#FF8A8A]/40 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <LogOut size={15} />
              <span>Sign Out Workstation</span>
            </button>
          </div>

          {/* Credentials Dossier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-1">
              <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                Statutory Clearance Tier
              </span>
              <div className="flex items-center gap-2 text-white font-semibold">
                <Shield size={16} className="text-[#A8C3A0]" />
                <span className="text-base">{currentUser.clearanceLevel}</span>
              </div>
              <span className="text-xs text-white/60 block">
                Authorized for Section 65B Indian Evidence Act certified audits
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-1">
              <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                Officer / Inspector ID
              </span>
              <div className="flex items-center gap-2 text-[#6EE7B7] font-mono font-bold text-base">
                <Fingerprint size={16} />
                <span>{currentUser.badgeNumber || 'IND-IFS-2024-9102'}</span>
              </div>
              <span className="text-xs text-white/60 block">
                Cryptographic session identifier linked to national audit logs
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-1">
              <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                Official Email
              </span>
              <div className="flex items-center gap-2 text-white font-mono text-sm">
                <Mail size={15} className="text-white/60" />
                <span>{currentUser.email}</span>
              </div>
              <span className="text-xs text-white/60 block">
                Jurisdiction: <strong className="text-[#A8C3A0]">{currentUser.jurisdiction}</strong>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-1">
              <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                Assigned Department
              </span>
              <div className="flex items-center gap-2 text-white text-sm">
                <Building2 size={15} className="text-white/60" />
                <span>{currentUser.department || 'Central Verification Directorate'}</span>
              </div>
              <span className="text-xs text-white/60 block">
                Registered on: {currentUser.joinedDate}
              </span>
            </div>
          </div>

          {/* Quick Switch Switcher or Return */}
          <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-white/70">
              Need to test permissions from another viewpoint? Switch to any preset profile below.
            </div>

            <button
              onClick={onNavigateHome}
              className="px-6 py-2.5 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white text-sm font-semibold border border-[#A8C3A0]/40 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Return to Dashboard</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Preset Roles Switcher */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono uppercase text-white/60 font-bold block">
              1-Click Instant Persona Switcher:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESET_USERS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleQuickLogin(preset)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    currentUser.email === preset.email
                      ? 'bg-[#3E7C59]/40 border-[#A8C3A0] shadow-md'
                      : 'bg-black/30 hover:bg-black/50 border-white/15 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white truncate block">{preset.name}</span>
                    {currentUser.email === preset.email && (
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#A8C3A0] block truncate">{preset.roleTitle}</span>
                  <span className="text-[10px] text-white/50 block font-mono mt-0.5">{preset.clearanceLevel}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Official Branding & Context Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 bg-gradient-to-br from-[#12372A] via-[#0e2c21] to-[#071a13] border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background seal */}
          <div className="absolute -right-16 -bottom-16 opacity-5 pointer-events-none text-white">
            <Satellite size={320} />
          </div>

          <div className="space-y-6 relative z-10">
            {/* Top Emblem */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b4e3c] via-[#163f31] to-[#0a231a] flex items-center justify-center text-white border border-[#74BDE0]/40 shadow-lg relative">
                <Satellite size={26} className="text-[#A8C3A0]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#74BDE0] ring-2 ring-[#12372A]" />
              </div>
              <div>
                <span className="text-2xl font-bold font-serif-display block leading-none text-white">
                  GeoAudit AI
                </span>
                <span className="text-xs font-medium text-[#A8C3A0] block mt-0.5">
                  Statutory Environmental Portal
                </span>
              </div>
            </div>

            {/* Value Proposition & Security Highlights */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white font-serif-display">
                Evidence-First Forest Clearance & CAMPA Observatory
              </h2>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                National multi-temporal satellite verification platform enabling statutory officers, forest nodal authorities, and project proponents to cross-examine afforestation conditions against Copernicus earth observation data.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-white/80">
                <CheckCircle2 size={16} className="text-[#6EE7B7] shrink-0 mt-0.5" />
                <span>Section 65B Indian Evidence Act compliant cryptographic audit trail</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-white/80">
                <CheckCircle2 size={16} className="text-[#6EE7B7] shrink-0 mt-0.5" />
                <span>10m Sentinel-2 multi-spectral NDVI and Sentinel-1 SAR cloud-penetrating radar</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-white/80">
                <CheckCircle2 size={16} className="text-[#6EE7B7] shrink-0 mt-0.5" />
                <span>Automated promise-versus-proof AI condition matching</span>
              </div>
            </div>
          </div>

          {/* Quick 1-Click Role Login Presets */}
          <div className="mt-8 pt-6 border-t border-white/15 space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#A8C3A0] flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>1-Click Test Personas</span>
              </span>
              <span className="text-[10px] text-white/50 font-mono">Instant Demo Access</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PRESET_USERS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleQuickLogin(preset)}
                  disabled={isSubmitting}
                  className="p-2.5 rounded-xl bg-black/40 hover:bg-white/15 border border-white/15 hover:border-[#A8C3A0]/60 transition-all text-left cursor-pointer group disabled:opacity-50"
                  title={`Login as ${preset.name} (${preset.roleTitle})`}
                >
                  <span className="text-xs font-bold text-white block truncate group-hover:text-[#A8C3A0] transition-colors">
                    {preset.name.split(',')[0]}
                  </span>
                  <span className="text-[10px] text-white/60 block truncate font-mono">
                    {preset.clearanceLevel}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive Login & Sign Up Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 bg-[#12372A]/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between"
        >
          <div>
            {/* Top Switcher: Login vs Sign Up Tabs */}
            <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/15 mb-6">
              <button
                id="auth-tab-login"
                onClick={() => {
                  setAuthMode('login');
                  setLoginError(null);
                  setSignUpError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-[#3E7C59] text-white shadow-md border border-[#A8C3A0]/40'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <KeyRound size={15} />
                <span>Login</span>
              </button>

              <button
                id="auth-tab-signup"
                onClick={() => {
                  setAuthMode('signup');
                  setLoginError(null);
                  setSignUpError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'signup'
                    ? 'bg-[#3E7C59] text-white shadow-md border border-[#A8C3A0]/40'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <UserCheck size={15} />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Feedback Notifications */}
            {loginSuccessNotice && (
              <div className="mb-4 p-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#6EE7B7] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{loginSuccessNotice}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* 1. LOGIN (SIGN IN) FORM                                 */}
            {/* ======================================================== */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-serif-display">
                    Sign In to Workstation
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5">
                    Access statutory compliance records, SAR radar passes, and Section 65B certificates.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-[#E5484D]/20 border border-[#FF8A8A]/40 text-[#FFA8A8] text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 flex items-center justify-between">
                    <span>Work / Institutional Email</span>
                    <span className="text-[10px] font-mono text-white/50">e.g. officer@moefcc.gov.in</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      id="login-email-input"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="aarti.sharma@moefcc.gov.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#A8C3A0] focus:ring-1 focus:ring-[#A8C3A0]"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-white/90">Password</label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-[11px] text-[#A8C3A0] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter workstation password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-[#A8C3A0] focus:ring-1 focus:ring-[#A8C3A0]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Security Notice */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md accent-[#3E7C59] bg-black/50 border-white/30 cursor-pointer"
                    />
                    <span>Keep signed in on this device</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#A8C3A0]">256-Bit SSL Encrypted</span>
                </div>

                {/* Submit Sign In Button */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white font-semibold text-sm border border-[#A8C3A0]/40 shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin text-white" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize & Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Redirect to Sign Up Link */}
                <div className="pt-3.5 mt-2 border-t border-white/10 text-center">
                  <p className="text-xs text-white/70">
                    Don&apos;t have an account?{' '}
                    <button
                      id="login-switch-to-signup-btn"
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setLoginError(null);
                        setSignUpError(null);
                      }}
                      className="text-[#6EE7B7] hover:text-[#A8C3A0] font-bold underline underline-offset-4 decoration-[#6EE7B7]/50 hover:decoration-[#A8C3A0] transition-colors cursor-pointer inline-flex items-center gap-1 ml-1"
                    >
                      <span>Sign Up</span>
                      <ArrowRight size={13} className="inline" />
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* 2. SIGN UP (CREATE OFFICIAL ACCOUNT) FORM               */}
            {/* ======================================================== */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div>
                  <h3 className="text-xl font-bold text-white font-serif-display">
                    Register Official Account
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5">
                    Provision verified credentials for statutory monitoring, CAMPA reporting, and independent audits.
                  </p>
                </div>

                {signUpError && (
                  <div className="p-3 rounded-xl bg-[#E5484D]/20 border border-[#FF8A8A]/40 text-[#FFA8A8] text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{signUpError}</span>
                  </div>
                )}

                {/* Role / Institutional Category Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/90">
                    Institutional Role & Category
                  </label>
                  <select
                    id="signup-role-select"
                    value={signUpRole}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-[#A8C3A0] cursor-pointer"
                  >
                    <option value="moefcc_officer" className="bg-[#12372A]">
                      MoEFCC Regulatory Inspector (Central Authority)
                    </option>
                    <option value="state_campa_officer" className="bg-[#12372A]">
                      State Forest Department / CAMPA Nodal Officer
                    </option>
                    <option value="proponent_esg" className="bg-[#12372A]">
                      Project Proponent / Infrastructure User Agency Lead
                    </option>
                    <option value="independent_auditor" className="bg-[#12372A]">
                      NABET/QCI Accredited Geospatial Auditor
                    </option>
                    <option value="citizen_researcher" className="bg-[#12372A]">
                      Independent Environmental Researcher / Citizen Auditor
                    </option>
                  </select>
                </div>

                {/* Two-Column Grid: Name & Work Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white/90">Full Name & Title</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                      <input
                        id="signup-name-input"
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Dr. Rajesh Sharma, IFS"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#A8C3A0]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white/90">Official Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                      <input
                        id="signup-email-input"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="r.sharma@mahaforest.gov.in"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/40 text-xs font-mono focus:outline-none focus:border-[#A8C3A0]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Organization & Jurisdiction */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white/90">Organization / Department</label>
                    <div className="relative">
                      <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                      <input
                        type="text"
                        value={signUpOrg}
                        onChange={(e) => setSignUpOrg(e.target.value)}
                        placeholder="Maharashtra Forest Department"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#A8C3A0]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white/90">Cadastral Jurisdiction</label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                      <input
                        type="text"
                        value={signUpJurisdiction}
                        onChange={(e) => setSignUpJurisdiction(e.target.value)}
                        placeholder="Maharashtra State"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#A8C3A0]"
                      />
                    </div>
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white/90">Create Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                      <input
                        id="signup-password-input"
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#A8C3A0]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
                        tabIndex={-1}
                      >
                        {showSignUpPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white/90">Confirm Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                      <input
                        id="signup-confirm-password-input"
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#A8C3A0]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Strength Meter */}
                {signUpPassword.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-white/60">Password Robustness:</span>
                      <span className={passwordStrength >= 75 ? 'text-[#6EE7B7] font-bold' : passwordStrength >= 50 ? 'text-[#FDBA74]' : 'text-[#FFA8A8]'}>
                        {passwordStrength >= 75 ? 'Strong Security' : passwordStrength >= 50 ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength >= 75 ? 'bg-[#10B981]' : passwordStrength >= 50 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Legal & Compliance Agreement Checkbox */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <label className="flex items-start gap-2.5 text-xs text-white/80 cursor-pointer select-none">
                    <input
                      id="signup-terms-checkbox"
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="w-4 h-4 rounded-md accent-[#3E7C59] bg-black/60 border-white/30 cursor-pointer mt-0.5"
                    />
                    <span className="text-[11px] leading-relaxed text-white/70">
                      I confirm I am an authorized statutory, corporate, or independent auditor and agree to the <strong>Section 65B Indian Evidence Act</strong> non-repudiation audit protocols.
                    </span>
                  </label>
                </div>

                {/* Submit Sign Up Button */}
                <button
                  id="signup-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white font-semibold text-sm border border-[#A8C3A0]/40 shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin text-white" />
                      <span>Provisioning Official Account...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck size={16} />
                      <span>Register Official Profile</span>
                    </>
                  )}
                </button>

                {/* Redirect to Login Link */}
                <div className="pt-3.5 mt-2 border-t border-white/10 text-center">
                  <p className="text-xs text-white/70">
                    Already have an account?{' '}
                    <button
                      id="signup-switch-to-login-btn"
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setLoginError(null);
                        setSignUpError(null);
                      }}
                      className="text-[#6EE7B7] hover:text-[#A8C3A0] font-bold underline underline-offset-4 decoration-[#6EE7B7]/50 hover:decoration-[#A8C3A0] transition-colors cursor-pointer inline-flex items-center gap-1 ml-1"
                    >
                      <span>Sign In / Login</span>
                      <ArrowRight size={13} className="inline" />
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Bottom Security Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
            <span className="flex items-center gap-1.5">
              <Shield size={12} className="text-[#A8C3A0]" />
              <span>MoEFCC CAMPA National Grid</span>
            </span>
            <span>v2.4 Statutory Release</span>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Reset Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12372A] border border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound size={20} className="text-[#A8C3A0]" />
                <h3 className="text-lg font-bold">Workstation Credential Recovery</h3>
              </div>
              <button
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setResetSuccessMessage(null);
                }}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70">
              Enter your official government or corporate email. We will generate a secure OTP and verification link to reset your workstation password.
            </p>

            {resetSuccessMessage ? (
              <div className="p-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#6EE7B7] text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={16} />
                  <span>Reset Instructions Dispatched</span>
                </div>
                <p className="text-[11px] text-white/80">
                  {resetSuccessMessage} (For demo purposes, you may use any of the 1-click test accounts directly).
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="officer@moefcc.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/40 text-xs font-mono focus:outline-none focus:border-[#A8C3A0]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-white/70 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!resetEmail) return;
                      setResetSuccessMessage(`Secure recovery token dispatched to ${resetEmail}`);
                      toast.info('Recovery Token Dispatched', {
                        message: `A secure 6-digit OTP and reset link was sent to ${resetEmail}.`,
                        duration: 4500,
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white text-xs font-semibold cursor-pointer"
                  >
                    Send Recovery Code
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
