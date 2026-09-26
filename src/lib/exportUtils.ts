import { Student, AttendanceRecord } from '../types/attendance';

/**
 * Escapes CSV cell value to handle commas, quotes, and newlines safely
 */
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Initiates browser download of a CSV file with UTF-8 BOM for Microsoft Excel compatibility
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and triggers download of a daily attendance CSV sheet
 */
export function exportDailyAttendanceCSV(params: {
  date: string;
  students: Student[];
  attendanceMap: Record<string, AttendanceRecord>;
  subject?: string;
  section?: string;
}): void {
  const { date, students, attendanceMap, subject = 'All Subjects', section = 'All Sections' } = params;

  const headers = [
    'Roll Number',
    'Student Name',
    'Course',
    'Section',
    'Subject',
    'Date',
    'Status',
    'Remarks / Notes',
    'Marked By',
    'Timestamp'
  ];

  const rows = students.map(student => {
    const record = attendanceMap[student.id];
    const status = record?.status ? record.status.toUpperCase() : 'UNMARKED';
    const remarks = record?.remarks || '—';
    const markedBy = record?.updated_by_email || '—';
    const timestamp = record?.updated_at ? new Date(record.updated_at).toLocaleString() : '—';
    const currentSection = student.section || section;

    return [
      escapeCSV(student.roll),
      escapeCSV(student.name),
      escapeCSV(student.course),
      escapeCSV(currentSection),
      escapeCSV(subject),
      escapeCSV(date),
      escapeCSV(status),
      escapeCSV(remarks),
      escapeCSV(markedBy),
      escapeCSV(timestamp),
    ].join(',');
  });

  const summary = [
    '',
    `"Attendance ERP - Daily Roll-Call Report"`,
    `"Date: ${date}"`,
    `"Subject: ${subject}"`,
    `"Section: ${section}"`,
    `"Total Students: ${students.length}"`,
    `"Generated At: ${new Date().toLocaleString()}"`,
    '',
  ].join('\r\n');

  const csvContent = summary + headers.join(',') + '\r\n' + rows.join('\r\n');
  const sanitizedSubject = subject.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `attendance_${date}_${sanitizedSubject}.csv`;

  downloadCSV(filename, csvContent);
}

/**
 * Exports a cumulative roll-call summary report
 */
export function exportAttendanceSummaryCSV(params: {
  students: Student[];
  records: AttendanceRecord[];
}): void {
  const { students, records } = params;

  const headers = [
    'Roll Number',
    'Student Name',
    'Course',
    'Section',
    'Total Sessions Logged',
    'Present Count',
    'Absent Count',
    'Late Count',
    'Half-Day Count',
    'Excused Leave Count',
    'Attendance %'
  ];

  const rows = students.map(student => {
    const studentRecords = records.filter(r => r.student_id === student.id);
    const total = studentRecords.length;
    const present = studentRecords.filter(r => r.status === 'present').length;
    const absent = studentRecords.filter(r => r.status === 'absent').length;
    const late = studentRecords.filter(r => r.status === 'late').length;
    const halfday = studentRecords.filter(r => r.status === 'halfday').length;
    const excused = studentRecords.filter(r => r.status === 'excused').length;
    
    // Percentage counts present, half-day (0.5), late (0.8)
    const effectiveAttended = present + (halfday * 0.5) + (late * 0.8);
    const pct = total > 0 ? Math.round((effectiveAttended / total) * 100) : 0;

    return [
      escapeCSV(student.roll),
      escapeCSV(student.name),
      escapeCSV(student.course),
      escapeCSV(student.section),
      escapeCSV(total),
      escapeCSV(present),
      escapeCSV(absent),
      escapeCSV(late),
      escapeCSV(halfday),
      escapeCSV(excused),
      escapeCSV(`${pct}%`),
    ].join(',');
  });

  const csvContent = headers.join(',') + '\r\n' + rows.join('\r\n');
  downloadCSV(`attendance_comprehensive_summary_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
}
