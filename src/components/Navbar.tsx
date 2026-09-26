import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types/attendance';
import { Users, Clock, Printer, FileText, CheckCircle2, LogOut } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  activeTab: 'attendance' | 'forms';
  onTabChange: (tab: 'attendance' | 'forms') => void;
  onOpenPrintReport: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onTabChange,
  onOpenPrintReport,
  onSignOut,
}) => {
  const [time, setTime] = useState<string>('');
  const [onlineCount] = useState<number>(4);

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItemClass = (tab: 'attendance' | 'forms') =>
    `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
      activeTab === tab
        ? 'bg-sidebar-foreground/15 text-white shadow-sm'
        : 'text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-30 bg-sidebar text-sidebar-foreground shadow-md no-print border-b border-sidebar-foreground/10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand & Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('attendance')}>
            <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground font-display font-black text-lg shadow-sm">
              <CheckCircle2 className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-white leading-none">
                Attendance<span className="text-accent ml-0.5">ERP</span>
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-widest text-sidebar-foreground/60">
                Staff Portal
              </span>
            </div>
          </div>

          <nav className="flex gap-1.5 bg-sidebar-foreground/5 p-1 rounded-lg">
            <button
              onClick={() => onTabChange('attendance')}
              className={navItemClass('attendance')}
            >
              <Users className="size-4" />
              Attendance
            </button>
            <button
              onClick={() => onTabChange('forms')}
              className={navItemClass('forms')}
            >
              <FileText className="size-4" />
              Forms
            </button>
          </nav>
        </div>

        {/* Live presence, Clock, Quick Print, User Profile */}
        <div className="flex items-center gap-3 text-sm">
          {/* Live presence badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-sidebar-foreground/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <span className="live-dot inline-block size-2 rounded-full bg-present" />
            <span>{onlineCount} faculty online</span>
          </div>

          {/* Clock */}
          <div className="hidden md:flex items-center gap-1.5 font-mono text-xs tabular-nums text-sidebar-foreground/80 bg-sidebar-foreground/10 px-2.5 py-1 rounded-md">
            <Clock className="size-3.5 text-accent" />
            <span>{time || '--:--:--'}</span>
          </div>

          {/* Quick Print Button */}
          <button
            onClick={onOpenPrintReport}
            className="flex items-center gap-1.5 rounded-md bg-accent/90 px-3 py-1.5 text-xs font-bold text-accent-foreground hover:bg-accent transition-colors shadow-sm"
            title="Open physical print-friendly roll call report"
          >
            <Printer className="size-3.5" />
            <span className="hidden sm:inline">Print Report</span>
          </button>

          {/* Staff Info */}
          <div className="flex items-center gap-2 border-l border-sidebar-foreground/20 pl-3">
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-xs font-semibold text-white">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground/60 font-mono truncate max-w-[140px]">
                {user.email}
              </p>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-foreground/10 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
