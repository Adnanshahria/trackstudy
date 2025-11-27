
import React, { useState } from 'react';
import { calculateGlobalComposite } from './utils/calculations';
import { HeroSection } from './components/HeroSection';
import { Sidebar } from './components/Sidebar';
import { Syllabus } from './components/Syllabus';
import { AuthModal } from './components/auth/AuthModal';
import { DeveloperModal } from './components/auth/DeveloperModal';
import { AppGuideModal } from './components/guide/AppGuideModal';
import { AppearanceModal } from './components/settings/AppearanceModal';
import { LandingHeader } from './components/layout/LandingHeader';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { WelcomeHero } from './components/layout/WelcomeHero';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { useDataManager } from './hooks/useDataManager';
import { useAuthHandlers } from './hooks/useAuthHandlers';
import { useAppearance } from './hooks/ui/useAppearance';

function App() {
  const { userId, setUserId, isAuthResolving, userData, settings, isLoading, connectionStatus, handleStatusUpdate, handleNoteUpdate, handleSettingsUpdate, toggleTheme, handleLogout, forceSync } = useFirebaseSync();
  const [activeSubject, setActiveSubject] = useState<string>('biology');
  const [showDevModal, setShowDevModal] = useState(false);
  const [showAppGuide, setShowAppGuide] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  
  const auth = useAuthHandlers(setUserId);
  const dataMgr = useDataManager(settings, handleSettingsUpdate, activeSubject, setActiveSubject);

  useAppearance(settings);

  const compositeData = calculateGlobalComposite(userData, settings);

  if (isAuthResolving) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#1A1A1C] transition-colors duration-300">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider animate-pulse">Initializing...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col text-slate-800 dark:text-slate-200 selection:bg-blue-500/30 selection:text-blue-600 dark:selection:text-blue-200 transition-colors duration-300 bg-slate-50 dark:bg-[#1A1A1C]">
        {!userId && (
            <LandingHeader 
                onDev={() => setShowDevModal(true)} 
                onLogin={() => auth.setShowLoginModal(true)} 
                onGuide={() => setShowAppGuide(true)} 
                theme={settings.theme} 
                onToggleTheme={toggleTheme} 
            />
        )}
        <main className="flex-1 w-full max-w-screen-xl mx-auto p-4 lg:py-6 overflow-hidden flex flex-col">
            {userId ? (
                <>
                    <DashboardHeader 
                        onDev={() => setShowDevModal(true)} 
                        status={connectionStatus} 
                        userId={userId} 
                        userData={userData} 
                        onLogout={handleLogout} 
                        onToggleTheme={toggleTheme} 
                        theme={settings.theme} 
                        onGuide={() => setShowAppGuide(true)}
                        onAppearance={() => setShowAppearance(true)}
                        onForceSync={forceSync}
                    />
                    {isLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Syncing Data...</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                            <div className="no-print shrink-0 mb-6">
                                <HeroSection compositeData={compositeData} settings={settings} onUpdateWeights={dataMgr.handleWeightUpdate} onUpdateCountdown={(t, l) => handleSettingsUpdate({ ...settings, countdownTarget: t, countdownLabel: l })} />
                            </div>
                            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start overflow-y-auto lg:overflow-hidden print:block">
                                <div className="no-print lg:h-full lg:overflow-y-auto custom-scrollbar pr-1 pb-10 lg:pb-0">
                                    <Sidebar activeSubject={activeSubject} onChangeSubject={setActiveSubject} userData={userData} settings={settings} onUpdateSettings={handleSettingsUpdate} onDeleteSubject={dataMgr.handleDeleteSubject} />
                                </div>
                                <div id="syllabus-print-container" className="lg:h-full lg:overflow-y-auto custom-scrollbar pr-1 pb-20 lg:pb-0">
                                    <Syllabus activeSubject={activeSubject} userData={userData} settings={settings} onUpdateStatus={handleStatusUpdate} onUpdateNote={handleNoteUpdate} onTogglePaper={(key) => handleSettingsUpdate({ ...settings, syllabusOpenState: { ...settings.syllabusOpenState, [key]: !settings.syllabusOpenState[key] } })} onRenameColumn={dataMgr.onRenameColumn} onAddColumn={dataMgr.onAddColumn} onAddChapter={dataMgr.onAddChapter} onDeleteChapter={dataMgr.onDeleteChapter} onDeleteColumn={dataMgr.onDeleteColumn} onRenameChapter={dataMgr.handleRenameChapter} />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                 <div className="h-full overflow-y-auto"><WelcomeHero onLogin={() => auth.setShowLoginModal(true)} /></div>
            )}
        </main>
        
        <AuthModal isOpen={auth.showLoginModal} onClose={() => auth.setShowLoginModal(false)} {...auth} isCheckingUser={auth.isCheckingUser} modalError={auth.modalError} modalSuccess={auth.modalSuccess} />
        <DeveloperModal isOpen={showDevModal} onClose={() => setShowDevModal(false)} />
        <AppGuideModal isOpen={showAppGuide} onClose={() => setShowAppGuide(false)} />
        <AppearanceModal isOpen={showAppearance} onClose={() => setShowAppearance(false)} settings={settings} onUpdateSettings={handleSettingsUpdate} />
    </div>
  );
}
export default App;
