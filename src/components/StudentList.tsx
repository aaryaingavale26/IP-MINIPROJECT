import React from 'react';
import { Student, AttendanceRecord, AttendanceStatus, StatusFilter } from '../types/attendance';
import { StudentRow } from './StudentRow';
import { Users, SearchX } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  attendanceMap: Record<string, AttendanceRecord>;
  recentUpdates: Record<string, number>;
  currentUserEmail: string;
  isLoading?: boolean;
  statusFilter: StatusFilter;
  searchQuery: string;
  onClearFilters: () => void;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onOpenRemarkModal: (student: Student) => void;
  onDeleteStudent: (studentId: string, studentName: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  attendanceMap,
  recentUpdates,
  currentUserEmail,
  isLoading,
  statusFilter,
  searchQuery,
  onClearFilters,
  onStatusChange,
  onOpenRemarkModal,
  onDeleteStudent,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
        <div className="inline-block size-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
        <p className="text-sm font-medium">Loading student roster...</p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Student List Table Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <h2 className="font-display text-sm font-bold text-foreground">
            Student Roster ({students.length})
          </h2>
        </div>
        {(statusFilter !== 'all' || searchQuery) && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Filtered by: {statusFilter !== 'all' ? `[${statusFilter}]` : ''}{' '}
              {searchQuery ? `"${searchQuery}"` : ''}
            </span>
            <button
              onClick={onClearFilters}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Roster Items */}
      {students.length > 0 ? (
        <ul className="divide-y divide-border">
          {students.map(student => (
            <StudentRow
              key={student.id}
              student={student}
              record={attendanceMap[student.id]}
              currentUserEmail={currentUserEmail}
              isRecentlyUpdated={Boolean(recentUpdates[student.id])}
              onStatusChange={status => onStatusChange(student.id, status)}
              onOpenRemarkModal={() => onOpenRemarkModal(student)}
              onDeleteStudent={() => onDeleteStudent(student.id, student.name)}
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
          <SearchX className="size-10 text-muted-foreground/60 mb-2" />
          <p className="text-sm font-semibold text-foreground">No students found matching your criteria</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Try adjusting your search query, clearing status filters, or selecting a different course/section.
          </p>
          <button
            onClick={onClearFilters}
            className="mt-4 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
};
