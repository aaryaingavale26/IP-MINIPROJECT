# Attendance ERP — Live Institutional Attendance & Roll-Call System

A modern, full-featured Institutional Attendance ERP web application engineered with React 18, Vite, TypeScript, and Tailwind CSS. Built to streamline classroom roll-calls, real-time collaboration among faculty, period-by-period attendance tracking, and administrative record keeping.

Live Prototype Reference: [snuggle-data-bind.lovable.app](https://snuggle-data-bind.lovable.app)  
Target Repository: [IP-MINIPROJECT](https://github.com/aaryaingavale26/IP-MINIPROJECT.git)

---

## ✨ Features Implemented

### 1. ⚡ Quick Batch Actions
- **Mark All Present**: Mark all visible/filtered students present in a single click.
- **Mark All Absent**: Mark all visible/filtered students absent in a single click.
- **Reset Attendance**: Reset or clear attendance records for the selected session to re-take roll-call.

### 2. 📝 Attendance Remarks & Notes
- Attach per-student notes and reason explanations (e.g., *"Excused - Doctor's appointment"*, *"Arrived 20 mins late - Traffic"*).
- Interactive modal with 8 quick reason presets or freeform custom text notes.
- Visual note badges directly on the student list with quick edit and removal support.
- Fully included in CSV exports and physical printable records.

### 3. 🏷️ Half-Day & Leave Tracking (5-Status Model)
Expanded attendance statuses beyond binary present/absent:
- **Present** (Emerald)
- **Absent** (Rose)
- **Late** (Amber)
- **Half-Day** (Blue / Sky)
- **Excused Leave** (Purple)
- Real-time statistics overview cards updating total counts, unmarked students, and session attendance percentage.

### 4. 📅 Calendar & Date-Picker Navigation
- Date navigation bar with **Previous Day (`<`)**, **Next Day (`>`)**, and **Today** shortcut buttons.
- Switch to any past date to view historical attendance records or retroactively mark attendance.

### 5. 🔍 Quick-Filter by Status
- Instant filter chips above the roster:
  - `All Students`, `Unmarked`, `Present`, `Absent`, `Late`, `Half-Day`, `Excused Leave`
- Dynamic count badges on every chip reflecting the current filtered subset.
- Combined with real-time text search across student names, roll numbers, and courses.

### 6. 🏫 Class, Subject & Section Selector (Period-by-Period Tracking)
- Group and take attendance by:
  - **Course / Class**: *B.E. Computer*, *B.Sc IT*, *BCA*, *MCA*
  - **Section**: *Section A*, *Section B*, *Section C*
  - **Subject / Period**: *Mathematics*, *Data Structures & Algorithms*, *Web Technology*, *Operating Systems*, *DBMS*, *Computer Networks*
- Multiple teachers can record attendance for different periods on the same day without overwriting each other.

### 7. 📊 Export to CSV / Excel
- **Export Daily Sheet**: Download complete daily attendance roster as a `.csv` file formatted with UTF-8 BOM for immediate opening in Microsoft Excel and Google Sheets.
- Columns include: Roll Number, Name, Course, Section, Subject, Date, Status, Remarks/Notes, Faculty Email, and Timestamp.

### 8. 🖨️ Printable Daily Roll-Call Report
- Publication-quality physical print format (`@media print`) designed for administrative filings and paper roll-calls.
- Displays institutional header, academic session, session meta info, statistical summary boxes, full student roll table with status and remarks, and formal signature blocks (Faculty Signature, HOD Verification, and Institutional Seal).

### 9. 📋 Attendance Forms Module
- Built-in form templates for student leave applications, medical certificate submissions, and late arrival reason slips with live interactive preview.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- `npm` or `yarn`

### Installation & Local Run
```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.

### Building for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🛠️ Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Icons**: Lucide React
- **Persistence**: LocalStorage with auto-seeding + optional Supabase Cloud Client
- **Export Engine**: Client-side CSV generator with Excel BOM support

---

## 📄 License
MIT License. Built for institutional educational purposes.
