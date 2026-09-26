import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Copy, FileText, Send } from 'lucide-react';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  options?: string[];
}

interface AttendanceForm {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
}

const INITIAL_FORMS: AttendanceForm[] = [
  {
    id: 'form-1',
    title: 'Excused Absence & Medical Certificate Submission',
    description: 'Form for students to submit leave applications, medical prescriptions, and event duty slips.',
    createdAt: '2026-09-20',
    fields: [
      { id: 'f-1', label: 'Roll Number', type: 'text', required: true },
      { id: 'f-2', label: 'Leave Reason Category', type: 'select', required: true, options: ['Medical', 'Family Emergency', 'College Sports Duty', 'Other'] },
      { id: 'f-3', label: 'Doctor / Hospital Note Details', type: 'textarea', required: false },
      { id: 'f-4', label: 'Parent Acknowledgement Verified', type: 'checkbox', required: true },
    ]
  },
  {
    id: 'form-2',
    title: 'Late Arrival Reason Slip',
    description: 'Used for students arriving more than 15 minutes after session commencement.',
    createdAt: '2026-09-22',
    fields: [
      { id: 'f-5', label: 'Roll Number', type: 'text', required: true },
      { id: 'f-6', label: 'Minutes Late', type: 'number', required: true },
      { id: 'f-7', label: 'Reason for Delay', type: 'textarea', required: true },
    ]
  }
];

export const Forms: React.FC = () => {
  const [forms, setForms] = useState<AttendanceForm[]>(() => {
    try {
      const saved = localStorage.getItem('attendance_erp_forms');
      return saved ? JSON.parse(saved) : INITIAL_FORMS;
    } catch {
      return INITIAL_FORMS;
    }
  });

  const [activeForm, setActiveForm] = useState<AttendanceForm>(forms[0]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const saveForms = (updated: AttendanceForm[]) => {
    setForms(updated);
    localStorage.setItem('attendance_erp_forms', JSON.stringify(updated));
  };

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newForm: AttendanceForm = {
      id: `form-${Date.now().toString(36)}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom Attendance ERP Data Collection Form',
      createdAt: new Date().toISOString().slice(0, 10),
      fields: [
        { id: `f-${Date.now()}-1`, label: 'Student Roll No', type: 'text', required: true },
        { id: `f-${Date.now()}-2`, label: 'Comments / Reason', type: 'textarea', required: false },
      ],
    };

    const updated = [newForm, ...forms];
    saveForms(updated);
    setActiveForm(newForm);
    setNewTitle('');
    setNewDesc('');
    setIsCreating(false);
  };

  const handleDeleteForm = (id: string) => {
    if (window.confirm('Delete this attendance form?')) {
      const updated = forms.filter(f => f.id !== id);
      saveForms(updated);
      if (activeForm.id === id && updated.length > 0) {
        setActiveForm(updated[0]);
      }
    }
  };

  const handleCopyLink = (id: string) => {
    setCopiedId(id);
    navigator.clipboard?.writeText(window.location.origin + `/#form-${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Attendance & Excuse Forms
          </h2>
          <p className="text-sm text-muted-foreground">
            Create, share, and manage customized leave verification and late entry slips
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 shadow-sm transition"
        >
          <Plus className="size-4" />
          {isCreating ? 'Cancel' : 'Create New Form'}
        </button>
      </div>

      {/* New Form Creator */}
      {isCreating && (
        <form onSubmit={handleCreateForm} className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h3 className="font-display font-bold text-base">New Attendance Form</h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Form Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Field Trip Permission & Attendance Log"
              className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Description
            </label>
            <input
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Brief instructions for students or parents"
              className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition"
          >
            Save & Publish Form
          </button>
        </form>
      )}

      {/* Forms Layout */}
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Forms Sidebar List */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Available Templates ({forms.length})
          </span>
          <div className="space-y-2">
            {forms.map(form => (
              <div
                key={form.id}
                onClick={() => setActiveForm(form)}
                className={`cursor-pointer rounded-xl border p-3.5 transition ${
                  activeForm.id === form.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:bg-muted/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm leading-snug">{form.title}</h4>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteForm(form.id);
                    }}
                    className="text-muted-foreground hover:text-destructive p-1 rounded"
                    title="Delete form"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{form.description}</p>
                <span className="mt-2 inline-block font-mono text-[10px] text-muted-foreground">
                  Created {form.createdAt} · {form.fields.length} fields
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Preview & Test Panel */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                <h3 className="font-display text-xl font-bold">{activeForm.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{activeForm.description}</p>
            </div>
            <button
              onClick={() => handleCopyLink(activeForm.id)}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition"
            >
              {copiedId === activeForm.id ? (
                <>
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-muted-foreground" />
                  <span>Share Form Link</span>
                </>
              )}
            </button>
          </div>

          {/* Form Interactive Preview */}
          <div className="max-w-lg space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Student Submission Preview
            </h4>
            {activeForm.fields.map(field => (
              <div key={field.id} className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    placeholder="Enter response..."
                    className="w-full rounded-md border border-border bg-card p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                ) : field.type === 'select' ? (
                  <select className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select an option...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input type="checkbox" id={field.id} className="size-4 rounded border-border" />
                    <label htmlFor={field.id} className="text-xs text-muted-foreground">
                      Confirm verification requirement
                    </label>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => alert('Demo test submission received! Data recorded.')}
              className="flex items-center justify-center gap-2 h-10 w-full rounded-lg bg-primary text-sm font-bold text-primary-foreground hover:opacity-90 shadow-sm transition"
            >
              <Send className="size-4" />
              Submit Form (Preview Test)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
