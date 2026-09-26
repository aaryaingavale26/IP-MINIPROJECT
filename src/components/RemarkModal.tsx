import React, { useState, useEffect } from 'react';
import { Student, AttendanceRecord } from '../types/attendance';
import { MessageSquare, X, Check, Trash2, Sparkles } from 'lucide-react';

interface RemarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  attendanceRecord?: AttendanceRecord;
  onSaveRemark: (remarks: string) => void;
}

const QUICK_REMARKS = [
  "Excused - Doctor's appointment",
  "Arrived 20 mins late - Traffic delay",
  "Medical leave approved",
  "Family emergency",
  "College sports / Culturals duty",
  "Left early - Approved by HOD",
  "Parent informed in advance via phone",
  "Attending campus placement drive",
];

export const RemarkModal: React.FC<RemarkModalProps> = ({
  isOpen,
  onClose,
  student,
  attendanceRecord,
  onSaveRemark,
}) => {
  const [remarkText, setRemarkText] = useState<string>('');

  useEffect(() => {
    if (attendanceRecord?.remarks) {
      setRemarkText(attendanceRecord.remarks);
    } else {
      setRemarkText('');
    }
  }, [attendanceRecord, isOpen]);

  if (!isOpen || !student) return null;

  const handleSave = () => {
    onSaveRemark(remarkText.trim());
    onClose();
  };

  const handleClear = () => {
    setRemarkText('');
    onSaveRemark('');
    onClose();
  };

  const handleChipClick = (preset: string) => {
    setRemarkText(preset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print animate-tick">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquare className="size-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight text-foreground">
                Attendance Remarks / Note
              </h3>
              <p className="text-xs text-muted-foreground">
                Attach reason or notes for <span className="font-semibold text-foreground">{student.name}</span> ({student.roll})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="size-3 text-accent" />
            <span>Quick Reason Presets:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {QUICK_REMARKS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(preset)}
                className={`rounded-lg border px-2.5 py-1 text-xs text-left transition ${
                  remarkText === preset
                    ? 'bg-primary text-primary-foreground border-primary font-semibold'
                    : 'bg-muted/50 border-border text-foreground/80 hover:bg-muted hover:border-foreground/30'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Textarea */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Custom Remark Note:
          </label>
          <textarea
            rows={3}
            value={remarkText}
            onChange={e => setRemarkText(e.target.value)}
            placeholder="e.g. Excused - Doctor's appointment, submitted medical certificate to office..."
            className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          {attendanceRecord?.remarks ? (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            >
              <Trash2 className="size-3.5" />
              Remove Note
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-xs font-semibold hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 shadow-sm transition"
            >
              <Check className="size-4" />
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
