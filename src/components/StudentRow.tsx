import React from 'react';
import { Student, AttendanceRecord, AttendanceStatus, STATUS_CONFIG } from '../types/attendance';
import { MessageSquare, Plus, Trash2, Clock } from 'lucide-react';

interface StudentRowProps {
  student: Student;
  record?: AttendanceRecord;
  currentUserEmail: string;
  isRecentlyUpdated: boolean;
  onStatusChange: (status: AttendanceStatus) => void;
  onOpenRemarkModal: () => void;
  onDeleteStudent: () => void;
}

const STATUS_KEYS: AttendanceStatus[] = ['present', 'absent', 'late', 'halfday', 'excused'];

export const StudentRow: React.FC<StudentRowProps> = ({
  student,
  record,
  currentUserEmail,
  isRecentlyUpdated,
  onStatusChange,
  onOpenRemarkModal,
  onDeleteStudent,
}) => {
  const currentStatus = record?.status;

  return (
    <li
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-colors duration-500 border-b border-border last:border-b-0 ${
        isRecentlyUpdated ? 'bg-accent/25' : 'hover:bg-muted/40'
      }`}
    >
      {/* Student Identity info & Notes */}
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        {/* Roll number pill */}
        <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-muted/80 text-foreground/80 shrink-0">
          {student.roll}
        </span>

        {/* Name and Meta */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground text-sm tracking-tight">
              {student.name}
            </span>

            {/* Recently updated flash tag */}
            {isRecentlyUpdated && (
              <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent-foreground animate-pulse">
                Updated
              </span>
            )}

            {/* Note / Remark Badge or Add Note button */}
            {record?.remarks ? (
              <button
                onClick={onOpenRemarkModal}
                className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-medium text-amber-900 dark:text-amber-200 hover:bg-amber-500/25 transition max-w-[200px] truncate"
                title={`Note: "${record.remarks}" (Click to edit)`}
              >
                <MessageSquare className="size-3 text-amber-600 shrink-0" />
                <span className="truncate">{record.remarks}</span>
              </button>
            ) : (
              <button
                onClick={onOpenRemarkModal}
                className="inline-flex items-center gap-1 rounded-md border border-border/80 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition opacity-60 hover:opacity-100"
                title="Add a remark / note for this student"
              >
                <Plus className="size-2.5" />
                <span>Note</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <span>{student.course}</span>
            <span>·</span>
            <span>{student.section || 'Sec A'}</span>
            {record && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="size-2.5 opacity-60" />
                  {record.updated_by_email === currentUserEmail ? 'you' : record.updated_by_email}{' '}
                  {new Date(record.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 5-Status Segmented Button Group & Delete Action */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <div
          className="inline-flex flex-wrap rounded-lg border border-border bg-muted/60 p-1 gap-1"
          role="radiogroup"
          aria-label={`Status for ${student.name}`}
        >
          {STATUS_KEYS.map(status => {
            const isSelected = currentStatus === status;
            const config = STATUS_CONFIG[status];

            return (
              <button
                key={status}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onStatusChange(status)}
                className={`rounded-md px-2.5 py-1 text-xs font-bold capitalize transition-all duration-150 ${
                  isSelected
                    ? `${config.bgClass} shadow-sm scale-100`
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/70'
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Delete Student */}
        <button
          onClick={onDeleteStudent}
          aria-label={`Remove ${student.name}`}
          className="rounded p-1 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition"
          title="Remove student from roster"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  );
};
