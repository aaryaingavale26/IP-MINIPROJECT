export type AttendanceStatus = 'present' | 'absent' | 'late' | 'halfday' | 'excused';

export type StatusFilter = 'all' | 'unmarked' | AttendanceStatus;

export interface Student {
  id: string;
  name: string;
  roll: string;
  course: string;
  section: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  course?: string;
  section?: string;
  subject?: string;
  updated_by_email: string;
  updated_at: string;
}

export interface LiveActivityEvent {
  id: string;
  text: string;
  at: Date;
  mine: boolean;
  student_id?: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  halfday: number;
  excused: number;
  unmarked: number;
  pct: number;
}

export interface UserProfile {
  email: string;
  name: string;
  role: 'teacher' | 'admin' | 'staff';
}

export const COURSES = [
  'B.E. Computer',
  'B.Sc IT',
  'BCA',
  'MCA',
  'All Courses'
] as const;

export const SECTIONS = ['All Sections', 'Section A', 'Section B', 'Section C'] as const;

export const SUBJECTS = [
  'All Subjects',
  'Mathematics',
  'Data Structures & Algorithms',
  'Web Technology',
  'Operating Systems',
  'Database Management Systems',
  'Computer Networks'
] as const;

export const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; bgClass: string; textClass: string; badgeClass: string; borderClass: string }
> = {
  present: {
    label: 'Present',
    bgClass: 'bg-present text-primary-foreground',
    textClass: 'text-present',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    borderClass: 'border-l-present',
  },
  absent: {
    label: 'Absent',
    bgClass: 'bg-absent text-primary-foreground',
    textClass: 'text-absent',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    borderClass: 'border-l-absent',
  },
  late: {
    label: 'Late',
    bgClass: 'bg-late text-foreground',
    textClass: 'text-late',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    borderClass: 'border-l-late',
  },
  halfday: {
    label: 'Half-Day',
    bgClass: 'bg-halfday text-white',
    textClass: 'text-halfday',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    borderClass: 'border-l-halfday',
  },
  excused: {
    label: 'Excused Leave',
    bgClass: 'bg-excused text-white',
    textClass: 'text-excused',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    borderClass: 'border-l-excused',
  },
};
