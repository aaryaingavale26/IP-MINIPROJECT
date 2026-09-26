import React from 'react';
import { CheckCheck, UserX, RotateCcw, FileSpreadsheet, Printer } from 'lucide-react';

interface BatchActionsProps {
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
  onResetAttendance: () => void;
  onExportCSV: () => void;
  onOpenPrintReport: () => void;
  filteredCount: number;
}

export const BatchActions: React.FC<BatchActionsProps> = ({
  onMarkAllPresent,
  onMarkAllAbsent,
  onResetAttendance,
  onExportCSV,
  onOpenPrintReport,
  filteredCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-border bg-card p-3 shadow-sm no-print">
      {/* Batch Attendance Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
          Batch Actions ({filteredCount}):
        </span>

        {/* Mark All Present */}
        <button
          onClick={onMarkAllPresent}
          disabled={filteredCount === 0}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98] transition disabled:opacity-50"
          title="Mark all displayed students as Present"
        >
          <CheckCheck className="size-3.5" />
          Mark All Present
        </button>

        {/* Mark All Absent */}
        <button
          onClick={onMarkAllAbsent}
          disabled={filteredCount === 0}
          className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 active:scale-[0.98] transition disabled:opacity-50"
          title="Mark all displayed students as Absent"
        >
          <UserX className="size-3.5" />
          Mark All Absent
        </button>

        {/* Reset Attendance */}
        <button
          onClick={onResetAttendance}
          disabled={filteredCount === 0}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:bg-muted active:scale-[0.98] transition disabled:opacity-50"
          title="Clear attendance status for displayed students"
        >
          <RotateCcw className="size-3.5 text-muted-foreground" />
          Reset Attendance
        </button>
      </div>

      {/* Export & Print Report Buttons */}
      <div className="flex items-center gap-2">
        {/* Export to CSV */}
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted active:scale-[0.98] transition shadow-sm"
          title="Export daily attendance sheet to Excel-compatible CSV"
        >
          <FileSpreadsheet className="size-3.5 text-emerald-600" />
          <span>Export CSV</span>
        </button>

        {/* Print Daily Report */}
        <button
          onClick={onOpenPrintReport}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98] transition"
          title="Generate printable physical roll-call document"
        >
          <Printer className="size-3.5" />
          <span>Print Report</span>
        </button>
      </div>
    </div>
  );
};
