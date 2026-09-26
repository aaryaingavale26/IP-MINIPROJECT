import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Student,
  AttendanceRecord,
  AttendanceStatus,
  StatusFilter,
  AttendanceStats,
  UserProfile,
} from '../types/attendance';
import { StorageService } from '../lib/storage';
import { exportDailyAttendanceCSV } from '../lib/exportUtils';
import { StatsOverview } from '../components/StatsOverview';
import { FilterBar } from '../components/FilterBar';
import { BatchActions } from '../components/BatchActions';
import { StudentList } from '../components/StudentList';
import { AddStudentForm } from '../components/AddStudentForm';
import { LiveActivity } from '../components/LiveActivity';
import { RemarkModal } from '../components/RemarkModal';
import { PrintReportModal } from '../components/PrintReportModal';

interface DashboardProps {
  user: UserProfile;
  onOpenPrintReportDirectly?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  // Today's local date YYYY-MM-DD
  const getTodayDate = () => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  };

  const [currentDate, setCurrentDate] = useState<string>(getTodayDate);
  const [selectedCourse, setSelectedCourse] = useState<string>('All Courses');
  const [selectedSection, setSelectedSection] = useState<string>('All Sections');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Storage synced state
  const [allStudents, setAllStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<Record<string, number>>({});
  const [liveEvents, setLiveEvents] = useState(() => StorageService.getActivity());

  // Modal states
  const [activeRemarkStudent, setActiveRemarkStudent] = useState<Student | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Load and refresh attendance for current date & subject
  const loadData = useCallback(() => {
    const students = StorageService.getStudents();
    setAllStudents(students);
    const records = StorageService.getAttendanceForDate(currentDate, selectedSubject, selectedSection);
    setAttendanceRecords(records);
    setLiveEvents(StorageService.getActivity());
  }, [currentDate, selectedSubject, selectedSection]);

  useEffect(() => {
    loadData();

    const handleStorageEvent = () => loadData();
    window.addEventListener('attendance-storage-change', handleStorageEvent);
    return () => window.removeEventListener('attendance-storage-change', handleStorageEvent);
  }, [loadData]);

  // Clean recent update flash badges after 2 seconds
  useEffect(() => {
    if (!Object.keys(recentUpdates).length) return;
    const timer = setTimeout(() => {
      const cutoff = Date.now() - 2000;
      setRecentUpdates(prev =>
        Object.fromEntries(Object.entries(prev).filter(([, ts]) => ts > cutoff))
      );
    }, 2100);
    return () => clearTimeout(timer);
  }, [recentUpdates]);

  // Attendance lookup map for instant lookup by student_id
  const attendanceMap = useMemo(() => {
    return Object.fromEntries(attendanceRecords.map(r => [r.student_id, r]));
  }, [attendanceRecords]);

  // Filter students based on Course, Section, Search query, and Status
  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      // Course match
      if (selectedCourse !== 'All Courses' && student.course !== selectedCourse) {
        return false;
      }
      // Section match
      if (selectedSection !== 'All Sections' && student.section !== selectedSection) {
        return false;
      }
      // Search query match (name, roll, course)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          student.name.toLowerCase().includes(query) ||
          student.roll.toLowerCase().includes(query) ||
          student.course.toLowerCase().includes(query);
        if (!matches) return false;
      }
      // Status Filter match
      const record = attendanceMap[student.id];
      const status = record?.status;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'unmarked') return !status;
      return status === statusFilter;
    });
  }, [allStudents, selectedCourse, selectedSection, searchQuery, statusFilter, attendanceMap]);

  // Overall attendance statistics for the current selected view
  const stats: AttendanceStats = useMemo(() => {
    // We compute stats across the students in the selected Course & Section
    const scopedStudents = allStudents.filter(s => {
      const matchCourse = selectedCourse === 'All Courses' || s.course === selectedCourse;
      const matchSection = selectedSection === 'All Sections' || s.section === selectedSection;
      return matchCourse && matchSection;
    });

    const counts = {
      present: 0,
      absent: 0,
      late: 0,
      halfday: 0,
      excused: 0,
    };

    scopedStudents.forEach(s => {
      const st = attendanceMap[s.id]?.status;
      if (st && st in counts) {
        counts[st as keyof typeof counts]++;
      }
    });

    const total = scopedStudents.length;
    const marked = counts.present + counts.absent + counts.late + counts.halfday + counts.excused;
    const unmarked = Math.max(0, total - marked);

    // Rate calculation: Present + Late (counted as attended) + HalfDay (0.5)
    const attendedEffective = counts.present + counts.late + counts.halfday * 0.5;
    const pct = total > 0 ? Math.round((attendedEffective / total) * 100) : 0;

    return {
      total,
      ...counts,
      unmarked,
      pct,
    };
  }, [allStudents, selectedCourse, selectedSection, attendanceMap]);

  // Handlers
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    const student = allStudents.find(s => s.id === studentId);
    StorageService.upsertAttendance({
      student_id: studentId,
      date: currentDate,
      status,
      subject: selectedSubject,
      section: student?.section || selectedSection,
      updated_by_email: user.email,
    });

    setRecentUpdates(prev => ({ ...prev, [studentId]: Date.now() }));

    const statusLabel = status.toUpperCase();
    StorageService.addActivity({
      text: `You marked ${student?.name || 'student'} ${statusLabel} (${selectedSubject})`,
      mine: true,
      student_id: studentId,
    });
  };

  const handleMarkAllPresent = () => {
    const ids = filteredStudents.map(s => s.id);
    if (!ids.length) return;

    StorageService.batchMarkAttendance(
      ids,
      currentDate,
      'present',
      user.email,
      selectedSubject,
      selectedSection
    );

    const updates: Record<string, number> = {};
    ids.forEach(id => (updates[id] = Date.now()));
    setRecentUpdates(updates);

    StorageService.addActivity({
      text: `You marked all ${ids.length} visible students PRESENT`,
      mine: true,
    });
  };

  const handleMarkAllAbsent = () => {
    const ids = filteredStudents.map(s => s.id);
    if (!ids.length) return;

    StorageService.batchMarkAttendance(
      ids,
      currentDate,
      'absent',
      user.email,
      selectedSubject,
      selectedSection
    );

    const updates: Record<string, number> = {};
    ids.forEach(id => (updates[id] = Date.now()));
    setRecentUpdates(updates);

    StorageService.addActivity({
      text: `You marked all ${ids.length} visible students ABSENT`,
      mine: true,
    });
  };

  const handleResetAttendance = () => {
    const ids = filteredStudents.map(s => s.id);
    if (!ids.length) return;

    if (window.confirm(`Reset attendance for ${ids.length} student(s) on ${currentDate}?`)) {
      StorageService.resetAttendance(ids, currentDate, selectedSubject);
      StorageService.addActivity({
        text: `You reset attendance for ${ids.length} students on ${currentDate}`,
        mine: true,
      });
    }
  };

  const handleSaveRemark = (remarks: string) => {
    if (!activeRemarkStudent) return;
    StorageService.updateRemarks(
      activeRemarkStudent.id,
      currentDate,
      remarks,
      user.email,
      selectedSubject
    );

    StorageService.addActivity({
      text: remarks
        ? `Added remark for ${activeRemarkStudent.name}: "${remarks}"`
        : `Removed remark for ${activeRemarkStudent.name}`,
      mine: true,
      student_id: activeRemarkStudent.id,
    });
  };

  const handleAddStudent = (data: { name: string; roll: string; course: string; section: string }) => {
    const newStudent = StorageService.addStudent(data);
    StorageService.addActivity({
      text: `Enrolled new student: ${newStudent.name} (${newStudent.roll})`,
      mine: true,
      student_id: newStudent.id,
    });
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to remove ${studentName} from the roster?`)) {
      StorageService.deleteStudent(studentId);
      StorageService.addActivity({
        text: `Removed ${studentName} from student roster`,
        mine: true,
      });
    }
  };

  const handleExportCSV = () => {
    exportDailyAttendanceCSV({
      date: currentDate,
      students: filteredStudents,
      attendanceMap,
      subject: selectedSubject,
      section: selectedSection,
    });
    StorageService.addActivity({
      text: `Downloaded CSV attendance report for ${currentDate}`,
      mine: true,
    });
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setSelectedCourse('All Courses');
    setSelectedSection('All Sections');
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Metrics & Progress Bar */}
      <StatsOverview stats={stats} />

      {/* 2. Calendar Navigator, Course/Section/Subject & Status Chips */}
      <FilterBar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        selectedCourse={selectedCourse}
        onCourseChange={setSelectedCourse}
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        stats={stats}
      />

      {/* 3. Batch Actions (Mark All Present, Absent, Reset, Export CSV, Print) */}
      <BatchActions
        onMarkAllPresent={handleMarkAllPresent}
        onMarkAllAbsent={handleMarkAllAbsent}
        onResetAttendance={handleResetAttendance}
        onExportCSV={handleExportCSV}
        onOpenPrintReport={() => setIsPrintModalOpen(true)}
        filteredCount={filteredStudents.length}
      />

      {/* 4. Main Grid: Student Roster Table & Sidebar (Enroll Student + Live Activity) */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left: Student List with 5 statuses and Remark triggers */}
        <div className="space-y-4">
          <StudentList
            students={filteredStudents}
            attendanceMap={attendanceMap}
            recentUpdates={recentUpdates}
            currentUserEmail={user.email}
            statusFilter={statusFilter}
            searchQuery={searchQuery}
            onClearFilters={handleClearFilters}
            onStatusChange={handleStatusChange}
            onOpenRemarkModal={student => setActiveRemarkStudent(student)}
            onDeleteStudent={handleDeleteStudent}
          />
        </div>

        {/* Right Sidebar: Enroll Student & Live Activity Feed */}
        <aside className="space-y-6">
          <AddStudentForm
            existingRolls={allStudents.map(s => s.roll)}
            onAddStudent={handleAddStudent}
          />
          <LiveActivity events={liveEvents} />
        </aside>
      </div>

      {/* Remark / Notes Modal */}
      <RemarkModal
        isOpen={Boolean(activeRemarkStudent)}
        onClose={() => setActiveRemarkStudent(null)}
        student={activeRemarkStudent}
        attendanceRecord={activeRemarkStudent ? attendanceMap[activeRemarkStudent.id] : undefined}
        onSaveRemark={handleSaveRemark}
      />

      {/* Printable Daily Report Modal */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        date={currentDate}
        course={selectedCourse}
        section={selectedSection}
        subject={selectedSubject}
        students={filteredStudents}
        attendanceMap={attendanceMap}
        stats={stats}
        user={user}
      />
    </div>
  );
};
