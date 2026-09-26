import React from 'react';
import { StatusFilter, COURSES, SECTIONS, SUBJECTS, AttendanceStats } from '../types/attendance';
import { Calendar, ChevronLeft, ChevronRight, Search, BookOpen, Layers, GraduationCap } from 'lucide-react';

interface FilterBarProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  selectedCourse: string;
  onCourseChange: (course: string) => void;
  selectedSection: string;
  onSectionChange: (section: string) => void;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  stats: AttendanceStats;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentDate,
  onDateChange,
  selectedCourse,
  onCourseChange,
  selectedSection,
  onSectionChange,
  selectedSubject,
  onSubjectChange,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  stats,
}) => {
  // Calendar navigation shortcuts
  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().slice(0, 10));
  };

  const handleToday = () => {
    const now = new Date();
    const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    onDateChange(localToday);
  };

  const isToday = () => {
    const now = new Date();
    const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    return currentDate === localToday;
  };

  // Status Filter chips configuration
  const filterChips: Array<{ key: StatusFilter; label: string; count: number; colorClass: string }> = [
    { key: 'all', label: 'All Students', count: stats.total, colorClass: 'hover:border-foreground/40' },
    { key: 'unmarked', label: 'Unmarked', count: stats.unmarked, colorClass: 'hover:border-amber-400 text-amber-700' },
    { key: 'present', label: 'Present', count: stats.present, colorClass: 'hover:border-emerald-500 text-present' },
    { key: 'absent', label: 'Absent', count: stats.absent, colorClass: 'hover:border-rose-500 text-absent' },
    { key: 'late', label: 'Late', count: stats.late, colorClass: 'hover:border-amber-500 text-late' },
    { key: 'halfday', label: 'Half-Day', count: stats.halfday, colorClass: 'hover:border-blue-500 text-halfday' },
    { key: 'excused', label: 'Excused', count: stats.excused, colorClass: 'hover:border-purple-500 text-excused' },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm no-print">
      {/* Top Row: Date Navigation & Class/Subject/Section Selectors */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Date Navigator */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Calendar className="size-3.5 text-primary" />
            Attendance Date
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevDay}
              className="flex h-9 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition"
              title="Previous Day"
            >
              <ChevronLeft className="size-4" />
            </button>
            <input
              type="date"
              value={currentDate}
              onChange={e => onDateChange(e.target.value)}
              className="h-9 flex-1 rounded-md border border-border bg-card px-2.5 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleNextDay}
              className="flex h-9 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition"
              title="Next Day"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              onClick={handleToday}
              disabled={isToday()}
              className={`h-9 px-2.5 text-xs font-bold rounded-md border transition ${
                isToday()
                  ? 'border-transparent bg-muted/60 text-muted-foreground cursor-default'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              Today
            </button>
          </div>
        </div>

        {/* Course / Class Selector */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <GraduationCap className="size-3.5 text-primary" />
            Course / Class
          </label>
          <select
            value={selectedCourse}
            onChange={e => onCourseChange(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
          >
            {COURSES.map(course => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        {/* Section Selector */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Layers className="size-3.5 text-primary" />
            Section
          </label>
          <select
            value={selectedSection}
            onChange={e => onSectionChange(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
          >
            {SECTIONS.map(sec => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        {/* Subject / Period Selector */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="size-3.5 text-primary" />
            Subject / Period
          </label>
          <select
            value={selectedSubject}
            onChange={e => onSubjectChange(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
          >
            {SUBJECTS.map(subj => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Row: Search Bar & Status Filter Chips */}
      <div className="pt-2 border-t border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students by name, roll no..."
            value={searchQuery}
            onChange={e => onSearchQueryChange(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="absolute right-2.5 top-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1 hidden lg:inline">
            Filter:
          </span>
          {filterChips.map(chip => {
            const isActive = statusFilter === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => onStatusFilterChange(chip.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition border ${
                  isActive
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : `bg-muted/50 border-border text-foreground/80 ${chip.colorClass}`
                }`}
              >
                <span>{chip.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive
                      ? 'bg-background text-foreground'
                      : 'bg-card border border-border text-foreground'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
