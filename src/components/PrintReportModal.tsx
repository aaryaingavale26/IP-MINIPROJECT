import React from 'react';
import { Student, AttendanceRecord, AttendanceStats, UserProfile } from '../types/attendance';
import { Printer, X, Download } from 'lucide-react';
import { exportDailyAttendanceCSV } from '../lib/exportUtils';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  course: string;
  section: string;
  subject: string;
  students: Student[];
  attendanceMap: Record<string, AttendanceRecord>;
  stats: AttendanceStats;
  user: UserProfile;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  date,
  course,
  section,
  subject,
  students,
  attendanceMap,
  stats,
  user,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportDailyAttendanceCSV({
      date,
      students,
      attendanceMap,
      subject,
      section,
    });
  };

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white text-zinc-900 shadow-2xl my-auto">
        {/* Modal Action Bar (Hidden in physical print) */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 no-print bg-zinc-50 rounded-t-2xl">
          <div>
            <h3 className="font-display text-lg font-bold text-zinc-800">
              Printable Daily Roll-Call Record
            </h3>
            <p className="text-xs text-zinc-500">
              Formatted specifically for administrative physical records and paper roll-calls
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition shadow-sm"
            >
              <Download className="size-3.5" />
              Download CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
            >
              <Printer className="size-4" />
              Print Document
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 transition"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-8 print-page font-sans text-xs">
          {/* Official Document Header */}
          <div className="border-b-2 border-zinc-900 pb-4 text-center space-y-1">
            <h1 className="font-display text-xl font-black uppercase tracking-wider text-zinc-900">
              DEPARTMENT OF COMPUTER ENGINEERING & TECHNOLOGY
            </h1>
            <p className="text-xs font-semibold uppercase text-zinc-700 tracking-wide">
              Official Daily Roll-Call & Attendance Register
            </p>
            <p className="text-[11px] font-mono text-zinc-500">
              Academic Session 2026–2027 · Form No: ERP-ATT-01
            </p>
          </div>

          {/* Session Meta Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 bg-zinc-50 border border-zinc-300 rounded-lg text-xs">
            <div>
              <span className="font-bold text-zinc-500 uppercase text-[10px] block">Date:</span>
              <span className="font-semibold text-zinc-900">{formattedDate}</span>
            </div>
            <div>
              <span className="font-bold text-zinc-500 uppercase text-[10px] block">Course / Class:</span>
              <span className="font-semibold text-zinc-900">{course}</span>
            </div>
            <div>
              <span className="font-bold text-zinc-500 uppercase text-[10px] block">Section:</span>
              <span className="font-semibold text-zinc-900">{section}</span>
            </div>
            <div>
              <span className="font-bold text-zinc-500 uppercase text-[10px] block">Subject / Period:</span>
              <span className="font-semibold text-zinc-900">{subject}</span>
            </div>
            <div>
              <span className="font-bold text-zinc-500 uppercase text-[10px] block">Faculty In-Charge:</span>
              <span className="font-semibold text-zinc-900">{user.name}</span>
            </div>
            <div>
              <span className="font-bold text-zinc-500 uppercase text-[10px] block">Staff Email:</span>
              <span className="font-mono text-zinc-900 text-[11px]">{user.email}</span>
            </div>
            <div className="col-span-2">
              <span className="font-bold text-zinc-500 uppercase text-[10px] block">Generated Timestamp:</span>
              <span className="font-mono text-zinc-900 text-[11px]">{new Date().toLocaleString()}</span>
            </div>
          </div>

          {/* Metrics Summary Strip */}
          <div className="grid grid-cols-7 gap-2 mb-4 text-center">
            <div className="border border-zinc-300 p-2 rounded">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Total</span>
              <span className="font-display font-bold text-base text-zinc-900">{stats.total}</span>
            </div>
            <div className="border border-emerald-300 bg-emerald-50/50 p-2 rounded">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Present</span>
              <span className="font-display font-bold text-base text-emerald-700">{stats.present}</span>
            </div>
            <div className="border border-rose-300 bg-rose-50/50 p-2 rounded">
              <span className="text-[10px] uppercase font-bold text-rose-800 block">Absent</span>
              <span className="font-display font-bold text-base text-rose-700">{stats.absent}</span>
            </div>
            <div className="border border-amber-300 bg-amber-50/50 p-2 rounded">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Late</span>
              <span className="font-display font-bold text-base text-amber-700">{stats.late}</span>
            </div>
            <div className="border border-blue-300 bg-blue-50/50 p-2 rounded">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">Half-Day</span>
              <span className="font-display font-bold text-base text-blue-700">{stats.halfday}</span>
            </div>
            <div className="border border-purple-300 bg-purple-50/50 p-2 rounded">
              <span className="text-[10px] uppercase font-bold text-purple-800 block">Excused</span>
              <span className="font-display font-bold text-base text-purple-700">{stats.excused}</span>
            </div>
            <div className="border border-zinc-900 bg-zinc-900 text-white p-2 rounded">
              <span className="text-[10px] uppercase font-bold text-zinc-300 block">Rate %</span>
              <span className="font-display font-bold text-base">{stats.pct}%</span>
            </div>
          </div>

          {/* Roll Call Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-zinc-400 text-left text-xs">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-400 text-zinc-800">
                  <th className="border border-zinc-400 p-2 w-10 text-center">#</th>
                  <th className="border border-zinc-400 p-2 w-24">Roll No</th>
                  <th className="border border-zinc-400 p-2">Student Name</th>
                  <th className="border border-zinc-400 p-2 w-28">Class / Sec</th>
                  <th className="border border-zinc-400 p-2 w-28 text-center">Status</th>
                  <th className="border border-zinc-400 p-2">Remarks / Reason</th>
                  <th className="border border-zinc-400 p-2 w-32 text-center">Student Initial</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const record = attendanceMap[student.id];
                  const status = record?.status ? record.status.toUpperCase() : 'UNMARKED';
                  const remarks = record?.remarks || '—';

                  let statusBadgeColor = 'text-zinc-500';
                  if (status === 'PRESENT') statusBadgeColor = 'text-emerald-700 font-bold';
                  if (status === 'ABSENT') statusBadgeColor = 'text-rose-700 font-bold';
                  if (status === 'LATE') statusBadgeColor = 'text-amber-700 font-bold';
                  if (status === 'HALFDAY') statusBadgeColor = 'text-blue-700 font-bold';
                  if (status === 'EXCUSED') statusBadgeColor = 'text-purple-700 font-bold';

                  return (
                    <tr key={student.id} className="border-b border-zinc-300">
                      <td className="border border-zinc-300 p-2 text-center text-zinc-500 font-mono">
                        {idx + 1}
                      </td>
                      <td className="border border-zinc-300 p-2 font-mono font-semibold">
                        {student.roll}
                      </td>
                      <td className="border border-zinc-300 p-2 font-medium">
                        {student.name}
                      </td>
                      <td className="border border-zinc-300 p-2 text-zinc-600 text-[11px]">
                        {student.course} ({student.section || 'A'})
                      </td>
                      <td className={`border border-zinc-300 p-2 text-center text-[11px] ${statusBadgeColor}`}>
                        {status}
                      </td>
                      <td className="border border-zinc-300 p-2 text-zinc-700 text-[11px] italic">
                        {remarks}
                      </td>
                      <td className="border border-zinc-300 p-2 text-center">
                        <span className="inline-block w-16 border-b border-dotted border-zinc-400" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Endorsement & Signatures */}
          <div className="mt-8 pt-6 border-t border-zinc-300 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <div className="h-12 border-b border-zinc-400 mx-auto w-40" />
              <p className="mt-1 font-bold text-zinc-800">Faculty Signature</p>
              <p className="text-[10px] text-zinc-500">{user.name}</p>
            </div>
            <div>
              <div className="h-12 border-b border-zinc-400 mx-auto w-40" />
              <p className="mt-1 font-bold text-zinc-800">HOD Verification</p>
              <p className="text-[10px] text-zinc-500">Department of Computer Engg.</p>
            </div>
            <div>
              <div className="h-12 border-b border-zinc-400 mx-auto w-40" />
              <p className="mt-1 font-bold text-zinc-800">Institutional Seal / Date</p>
              <p className="text-[10px] text-zinc-500">Academic Records Division</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
