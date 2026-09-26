import React, { useState } from 'react';
import { UserProfile } from '../types/attendance';
import { StorageService } from '../lib/storage';
import { CheckCircle2, ShieldCheck, Mail, Lock, User, Building, AlertCircle, UserPlus, KeyRound } from 'lucide-react';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  // Sign In State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regFacultyId, setRegFacultyId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('Department of Computer Engineering');
  const [regPassword, setRegPassword] = useState('');

  // Status & Error
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both your Faculty ID / Email and Password.');
      return;
    }

    const res = StorageService.authenticateFaculty(loginIdentifier.trim(), loginPassword.trim());
    if (res.success && res.user) {
      onLogin(res.user);
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regFacultyId.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const res = StorageService.registerFaculty({
      name: regName.trim(),
      facultyId: regFacultyId.trim().toUpperCase(),
      email: regEmail.trim(),
      department: regDepartment,
      password: regPassword,
      role: 'teacher',
    });

    if (res.success && res.user) {
      setSuccessMessage('Faculty account registered successfully! Entering portal...');
      setTimeout(() => {
        if (res.user) onLogin(res.user);
      }, 500);
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-card p-8 shadow-2xl border border-border">
        {/* Institutional Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground font-display font-black text-xl shadow-md mb-2">
            <CheckCircle2 className="size-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Attendance<span className="text-primary ml-1">ERP</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Faculty & Staff Attendance Management Portal
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg border border-border bg-muted/60 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${
              mode === 'signin'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Faculty Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${
              mode === 'register'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Register Faculty ID
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Faculty ID or Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. FAC-101 or teacher@college.edu"
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 h-10 w-full rounded-md bg-primary text-sm font-bold text-primary-foreground hover:opacity-95 shadow-md active:scale-[0.99] transition"
            >
              <ShieldCheck className="size-4" />
              Sign In to Faculty Portal
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                }}
                className="text-xs text-primary hover:underline font-semibold"
              >
                First time here? Register your Faculty Account →
              </button>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Full Name with Title
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Faculty ID
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="FAC-201"
                    value={regFacultyId}
                    onChange={e => setRegFacultyId(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-card pl-8 pr-2.5 text-xs font-mono font-semibold uppercase outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Department
                </label>
                <select
                  value={regDepartment}
                  onChange={e => setRegDepartment(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Computer Engineering</option>
                  <option>Information Technology</option>
                  <option>Computer Applications</option>
                  <option>Data Science</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="e.g. rajesh.sharma@institution.edu"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Create Password (Min 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 h-10 w-full rounded-md bg-accent text-sm font-bold text-accent-foreground hover:opacity-95 shadow-md active:scale-[0.99] transition mt-2"
            >
              <UserPlus className="size-4" />
              Register & Enter Portal
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                }}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold"
              >
                Already have a faculty account? Sign In →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
