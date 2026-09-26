import React, { useState } from 'react';
import { UserProfile } from '../types/attendance';
import { CheckCircle2, ShieldCheck, Mail, Lock } from 'lucide-react';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('prof.aarya@institution.edu');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Prof. Aarya Ingavale');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    onLogin({
      email: email.trim(),
      name: name.trim() || 'Staff Faculty',
      role: 'teacher',
    });
  };

  const handleDemoSignIn = (demoEmail: string, demoName: string) => {
    onLogin({
      email: demoEmail,
      name: demoName,
      role: 'teacher',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-card p-8 shadow-2xl border border-border">
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground font-display font-black text-xl shadow-md mb-2">
            <CheckCircle2 className="size-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Attendance<span className="text-primary ml-1">ERP</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Institutional Live Attendance & Physical Roll-Call Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Faculty / Staff Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                value={password}
                onChange={e => setPassword(e.target.value)}
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
            Sign in to Staff Portal
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="border-t border-border pt-4">
          <p className="text-center text-xs font-semibold text-muted-foreground mb-3">
            Or quick sign-in as:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoSignIn('prof.aarya@institution.edu', 'Prof. Aarya Ingavale')}
              className="rounded-lg border border-border bg-muted/40 p-2 text-xs font-medium text-left hover:bg-muted transition"
            >
              <p className="font-bold text-foreground">Prof. Aarya</p>
              <p className="text-[10px] text-muted-foreground">Lead Faculty</p>
            </button>
            <button
              onClick={() => handleDemoSignIn('dr.deshmukh@institution.edu', 'Dr. S. Deshmukh')}
              className="rounded-lg border border-border bg-muted/40 p-2 text-xs font-medium text-left hover:bg-muted transition"
            >
              <p className="font-bold text-foreground">Dr. Deshmukh</p>
              <p className="text-[10px] text-muted-foreground">Department HOD</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
