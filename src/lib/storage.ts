import { Student, AttendanceRecord, AttendanceStatus, LiveActivityEvent, UserProfile } from '../types/attendance';

const STUDENTS_KEY = 'attendance_erp_students_v1';
const ATTENDANCE_KEY = 'attendance_erp_records_v1';
const ACTIVITY_KEY = 'attendance_erp_activity_v1';
const USER_KEY = 'attendance_erp_current_user_v1';

export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-001', name: 'Neha Rao', roll: 'CS-001', course: 'B.E. Computer', section: 'Section A' },
  { id: 'std-002', name: 'Rahul Sharma', roll: 'CS-002', course: 'B.E. Computer', section: 'Section A' },
  { id: 'std-003', name: 'Priya Patel', roll: 'CS-003', course: 'B.E. Computer', section: 'Section B' },
  { id: 'std-004', name: 'Aarav Deshmukh', roll: 'CS-004', course: 'B.E. Computer', section: 'Section B' },
  { id: 'std-005', name: 'Ananya Iyer', roll: 'IT-101', course: 'B.Sc IT', section: 'Section A' },
  { id: 'std-006', name: 'Vikram Verma', roll: 'IT-102', course: 'B.Sc IT', section: 'Section A' },
  { id: 'std-007', name: 'Sneha Kulkarni', roll: 'IT-103', course: 'B.Sc IT', section: 'Section B' },
  { id: 'std-008', name: 'Rohit Joshi', roll: 'BCA-201', course: 'BCA', section: 'Section A' },
  { id: 'std-009', name: 'Tanvi Mehta', roll: 'BCA-202', course: 'BCA', section: 'Section B' },
  { id: 'std-010', name: 'Devendra Singh', roll: 'MCA-301', course: 'MCA', section: 'Section A' },
  { id: 'std-011', name: 'Pooja Hegde', roll: 'MCA-302', course: 'MCA', section: 'Section A' },
  { id: 'std-012', name: 'Kunal Shinde', roll: 'MCA-303', course: 'MCA', section: 'Section B' },
];

export const DEFAULT_USER: UserProfile = {
  email: 'prof.aarya@institution.edu',
  name: 'Prof. Aarya Ingavale',
  role: 'teacher'
};

function triggerStorageChange() {
  window.dispatchEvent(new Event('attendance-storage-change'));
}

export const StorageService = {
  getCurrentUser(): UserProfile {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  setCurrentUser(user: UserProfile) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    triggerStorageChange();
  },

  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STUDENTS_KEY);
      if (!data) {
        localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
        return INITIAL_STUDENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  addStudent(student: Omit<Student, 'id'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...student,
      id: `std-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    };
    const updated = [newStudent, ...students];
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(updated));
    triggerStorageChange();
    return newStudent;
  },

  deleteStudent(id: string): void {
    const students = this.getStudents().filter(s => s.id !== id);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    
    // Also remove attendance records for this student
    const records = this.getAllAttendance().filter(r => r.student_id !== id);
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
    
    triggerStorageChange();
  },

  getAllAttendance(): AttendanceRecord[] {
    try {
      const data = localStorage.getItem(ATTENDANCE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getAttendanceForDate(date: string, subject?: string, section?: string): AttendanceRecord[] {
    const records = this.getAllAttendance();
    return records.filter(r => {
      const matchDate = r.date === date;
      const matchSubject = !subject || subject === 'All Subjects' || r.subject === subject;
      const matchSection = !section || section === 'All Sections' || r.section === section;
      return matchDate && matchSubject && matchSection;
    });
  },

  upsertAttendance(record: {
    student_id: string;
    date: string;
    status: AttendanceStatus;
    remarks?: string;
    subject?: string;
    section?: string;
    updated_by_email: string;
  }): AttendanceRecord {
    const records = this.getAllAttendance();
    const cleanSubject = record.subject && record.subject !== 'All Subjects' ? record.subject : 'General';
    
    const existingIndex = records.findIndex(r => 
      r.student_id === record.student_id && 
      r.date === record.date &&
      (r.subject || 'General') === cleanSubject
    );

    const now = new Date().toISOString();
    let updatedRecord: AttendanceRecord;

    if (existingIndex >= 0) {
      updatedRecord = {
        ...records[existingIndex],
        status: record.status,
        remarks: record.remarks !== undefined ? record.remarks : records[existingIndex].remarks,
        subject: cleanSubject,
        section: record.section || records[existingIndex].section,
        updated_by_email: record.updated_by_email,
        updated_at: now,
      };
      records[existingIndex] = updatedRecord;
    } else {
      updatedRecord = {
        id: `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        student_id: record.student_id,
        date: record.date,
        status: record.status,
        remarks: record.remarks || '',
        subject: cleanSubject,
        section: record.section || '',
        updated_by_email: record.updated_by_email,
        updated_at: now,
      };
      records.push(updatedRecord);
    }

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
    triggerStorageChange();
    return updatedRecord;
  },

  batchMarkAttendance(
    studentIds: string[],
    date: string,
    status: AttendanceStatus,
    updated_by_email: string,
    subject?: string,
    section?: string
  ): void {
    const records = this.getAllAttendance();
    const cleanSubject = subject && subject !== 'All Subjects' ? subject : 'General';
    const now = new Date().toISOString();

    studentIds.forEach(studentId => {
      const idx = records.findIndex(r => 
        r.student_id === studentId && 
        r.date === date &&
        (r.subject || 'General') === cleanSubject
      );

      if (idx >= 0) {
        records[idx] = {
          ...records[idx],
          status,
          subject: cleanSubject,
          section: section || records[idx].section,
          updated_by_email,
          updated_at: now,
        };
      } else {
        records.push({
          id: `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          student_id: studentId,
          date,
          status,
          remarks: '',
          subject: cleanSubject,
          section: section || '',
          updated_by_email,
          updated_at: now,
        });
      }
    });

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
    triggerStorageChange();
  },

  resetAttendance(studentIds: string[], date: string, subject?: string): void {
    const cleanSubject = subject && subject !== 'All Subjects' ? subject : 'General';
    const records = this.getAllAttendance().filter(r => {
      const isTargetStudent = studentIds.includes(r.student_id);
      const isTargetDate = r.date === date;
      const isTargetSubject = (r.subject || 'General') === cleanSubject;
      return !(isTargetStudent && isTargetDate && isTargetSubject);
    });

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
    triggerStorageChange();
  },

  updateRemarks(
    studentId: string,
    date: string,
    remarks: string,
    updated_by_email: string,
    subject?: string
  ): void {
    const records = this.getAllAttendance();
    const cleanSubject = subject && subject !== 'All Subjects' ? subject : 'General';
    const now = new Date().toISOString();

    const idx = records.findIndex(r => 
      r.student_id === studentId && 
      r.date === date &&
      (r.subject || 'General') === cleanSubject
    );

    if (idx >= 0) {
      records[idx].remarks = remarks;
      records[idx].updated_by_email = updated_by_email;
      records[idx].updated_at = now;
    } else {
      records.push({
        id: `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        student_id: studentId,
        date,
        status: 'present',
        remarks,
        subject: cleanSubject,
        updated_by_email,
        updated_at: now,
      });
    }

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
    triggerStorageChange();
  },

  getActivity(): LiveActivityEvent[] {
    try {
      const data = localStorage.getItem(ACTIVITY_KEY);
      if (!data) return [];
      const list = JSON.parse(data);
      return list.map((item: any) => ({
        ...item,
        at: new Date(item.at)
      }));
    } catch {
      return [];
    }
  },

  addActivity(event: { text: string; mine: boolean; student_id?: string }): LiveActivityEvent {
    const list = this.getActivity();
    const newEvent: LiveActivityEvent = {
      id: `act-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      text: event.text,
      mine: event.mine,
      student_id: event.student_id,
      at: new Date(),
    };
    const updated = [newEvent, ...list].slice(0, 30);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
    triggerStorageChange();
    return newEvent;
  },
};
