import React from 'react';
import { AttendanceStats } from '../types/attendance';
import { Users, CheckCircle, XCircle, Clock, PieChart, ShieldAlert, Award } from 'lucide-react';

interface StatsOverviewProps {
  stats: AttendanceStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="space-y-4 no-print">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {/* Total Students */}
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total</span>
            <Users className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
            {stats.total}
          </p>
          <span className="text-[10px] text-muted-foreground">Enrolled</span>
        </div>

        {/* Present */}
        <div className="rounded-xl border border-emerald-200/60 bg-card p-3.5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-present">
            <span className="text-[11px] font-bold uppercase tracking-wider">Present</span>
            <CheckCircle className="size-4" />
          </div>
          <p className="mt-1 font-display text-2xl font-extrabold text-present">
            {stats.present}
          </p>
          <span className="text-[10px] text-muted-foreground">In Class</span>
        </div>

        {/* Absent */}
        <div className="rounded-xl border border-rose-200/60 bg-card p-3.5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-absent">
            <span className="text-[11px] font-bold uppercase tracking-wider">Absent</span>
            <XCircle className="size-4" />
          </div>
          <p className="mt-1 font-display text-2xl font-extrabold text-absent">
            {stats.absent}
          </p>
          <span className="text-[10px] text-muted-foreground">Unexcused</span>
        </div>

        {/* Late */}
        <div className="rounded-xl border border-amber-200/60 bg-card p-3.5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-late">
            <span className="text-[11px] font-bold uppercase tracking-wider">Late</span>
            <Clock className="size-4" />
          </div>
          <p className="mt-1 font-display text-2xl font-extrabold text-late">
            {stats.late}
          </p>
          <span className="text-[10px] text-muted-foreground">Delayed</span>
        </div>

        {/* Half-Day */}
        <div className="rounded-xl border border-blue-200/60 bg-card p-3.5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-halfday">
            <span className="text-[11px] font-bold uppercase tracking-wider">Half-Day</span>
            <PieChart className="size-4" />
          </div>
          <p className="mt-1 font-display text-2xl font-extrabold text-halfday">
            {stats.halfday}
          </p>
          <span className="text-[10px] text-muted-foreground">Partial Session</span>
        </div>

        {/* Excused Leave */}
        <div className="rounded-xl border border-purple-200/60 bg-card p-3.5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-excused">
            <span className="text-[11px] font-bold uppercase tracking-wider">Excused</span>
            <ShieldAlert className="size-4" />
          </div>
          <p className="mt-1 font-display text-2xl font-extrabold text-excused">
            {stats.excused}
          </p>
          <span className="text-[10px] text-muted-foreground">Permitted Leave</span>
        </div>

        {/* Overall Percentage */}
        <div className="col-span-2 sm:col-span-1 rounded-xl border border-primary/20 bg-primary/5 p-3.5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-primary">
            <span className="text-[11px] font-bold uppercase tracking-wider">Attendance Rate</span>
            <Award className="size-4" />
          </div>
          <p className="mt-1 font-display text-2xl font-extrabold text-primary">
            {stats.pct}%
          </p>
          <span className="text-[10px] text-primary/80">Full Session Rate</span>
        </div>
      </div>

      {/* Progress Bar & Unmarked Notification */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Overall Present & Attended Ratio</span>
          <span className="font-mono font-medium">{stats.pct}% Complete</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/80 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 ease-out"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
        {stats.unmarked > 0 && (
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            ⚠️ {stats.unmarked} student{stats.unmarked > 1 ? 's' : ''} not marked yet for this session.
          </p>
        )}
      </div>
    </div>
  );
};
