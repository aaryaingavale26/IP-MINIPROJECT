import React, { useState } from 'react';
import { UserProfile } from './types/attendance';
import { StorageService } from './lib/storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Forms } from './pages/Forms';
import { Auth } from './pages/Auth';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    StorageService.getCurrentUser()
  );
  const [activeTab, setActiveTab] = useState<'attendance' | 'forms'>('attendance');
  const [triggerPrintDirectly, setTriggerPrintDirectly] = useState<boolean>(false);

  const handleLogin = (user: UserProfile) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Global ERP Navbar */}
      <Navbar
        user={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenPrintReport={() => {
          // Trigger print report modal in dashboard or trigger window.print
          setTriggerPrintDirectly(prev => !prev);
          window.print();
        }}
        onSignOut={handleSignOut}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {activeTab === 'attendance' ? (
          <Dashboard
            user={currentUser}
            onOpenPrintReportDirectly={() => setTriggerPrintDirectly(prev => !prev)}
          />
        ) : (
          <Forms />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4 text-center text-xs text-muted-foreground no-print mt-12">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-2">
          <p>© 2026 Attendance ERP · Department of Computer Engineering</p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ● System Online & Synced
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
