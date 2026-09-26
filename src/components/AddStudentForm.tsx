import React, { useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import { COURSES, SECTIONS } from '../types/attendance';

interface AddStudentFormProps {
  existingRolls: string[];
  onAddStudent: (data: { name: string; roll: string; course: string; section: string }) => void;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({
  existingRolls,
  onAddStudent,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    course: 'B.E. Computer',
    section: 'Section A',
  });
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const errors = {
    name: formData.name.trim().length < 3 ? 'Name must be at least 3 characters' : '',
    roll: !formData.roll.trim()
      ? 'Roll number is required'
      : existingRolls.includes(formData.roll.trim().toUpperCase())
      ? 'Roll number already exists'
      : '',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (errors.name || errors.roll) return;

    onAddStudent({
      name: formData.name.trim(),
      roll: formData.roll.trim().toUpperCase(),
      course: formData.course,
      section: formData.section,
    });

    setFormData({
      name: '',
      roll: '',
      course: formData.course,
      section: formData.section,
    });
    setHasSubmitted(false);
  };

  const inputClass =
    'h-9 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm no-print"
      noValidate
    >
      <div className="flex items-center gap-2 border-b border-border pb-2.5">
        <UserPlus className="size-4 text-primary" />
        <h2 className="font-display text-base font-bold text-foreground">
          Enroll New Student
        </h2>
      </div>

      {/* Name Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Neha Rao"
          className={inputClass}
        />
        {hasSubmitted && errors.name && (
          <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
            <AlertCircle className="size-3" />
            {errors.name}
          </span>
        )}
      </div>

      {/* Roll Number Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
          Roll Number
        </label>
        <input
          type="text"
          value={formData.roll}
          onChange={e => setFormData({ ...formData, roll: e.target.value })}
          placeholder="e.g. CS-015"
          className={`${inputClass} font-mono`}
        />
        {hasSubmitted && errors.roll && (
          <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
            <AlertCircle className="size-3" />
            {errors.roll}
          </span>
        )}
      </div>

      {/* Course Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
          Course
        </label>
        <select
          value={formData.course}
          onChange={e => setFormData({ ...formData, course: e.target.value })}
          className={inputClass}
        >
          {COURSES.filter(c => c !== 'All Courses').map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Section Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
          Section
        </label>
        <select
          value={formData.section}
          onChange={e => setFormData({ ...formData, section: e.target.value })}
          className={inputClass}
        >
          {SECTIONS.filter(s => s !== 'All Sections').map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="h-9 w-full rounded-md bg-accent text-sm font-bold text-accent-foreground hover:opacity-90 active:scale-[0.98] transition shadow-sm"
      >
        Add to Roster
      </button>
    </form>
  );
};
