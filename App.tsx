
import React, { useState, useEffect } from 'react';
import { calculateGlobalComposite } from './utils/calculations';
import { Sidebar } from './components/Sidebar';
import { Syllabus } from './components/Syllabus';
import { AuthModal } from './components/auth/AuthModal';
import { DeveloperModal } from './components/auth/DeveloperModal';
import { AppGuideModal } from './components/guide/AppGuideModal';
import { AppearanceModal } from './components/settings/AppearanceModal';
import { LandingHeader } from './components/layout/LandingHeader';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { WelcomeHero } from './components/layout/WelcomeHero';
import { SkeletonDashboard } from './components/layout/SkeletonDashboard';
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
  
  // State to handle the transition gap between login success and data load
  const [postLoginLoading, setPostLoginLoading] = useState(false);
  
  const auth = useAuthHandlers(setUserId, () => setPostLoginLoading(true));
  const dataMgr = useDataManager(settings, handleSettingsUpdate, activeSubject, setActiveSubject);

  useAppearance(settings);

  // When userId resolves OR postLoginLoading becomes true, check if we can stop loading
  // CRITICAL FIX: Added 'postLoginLoading' to dependencies.
  // Previously, if userId was already set (e.g. fast auth) before postLoginLoading became true,
  // this effect wouldn't run, leaving the user stuck on the loading screen.
  useEffect(() => {
    if (userId && postLoginLoading) {
        setPostLoginLoading(false);
    }
  }, [userId, postLoginLoading]);

  // SAFETY NET: If postLoginLoading is true for more than 8 seconds, force it off.
  // This prevents the app from getting stuck on the loading screen if db sync fails silently.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (postLoginLoading) {
        timeout = setTimeout(() => {
            console.warn("⚠️ Post-login loading timed out. Forcing dashboard render.");
            setPostLoginLoading(false);
        }, 8000);
    }
    return () => clearTimeout(timeout);
  }, [postLoginLoading]);

  const compositeData = calculateGlobalComposite(userData, settings);

  if (isAuthResolving || postLoginLoading) {
      return <SkeletonDashboard />;
  }

  return (
    <div className="min-h-screen lg:h-screen w-screen lg:overflow-hidden flex flex-col text-slate-800 dark:text-slate-200 selection:bg-blue-500/30 selection:text-blue-600 dark:selection:text-blue-200 transition-colors duration-300 bg-slate-50 dark:bg-[#1A1A1C]">
        {!userId && (
            <LandingHeader 
                onDev={() => setShowDevModal(true)} 
                onLogin={() => auth.setShowLoginModal(true)} 
                onGuide={() => setShowAppGuide(true)} 
                theme={settings.theme} 
                onToggleTheme={toggleTheme} 
            />
        )}
        <main className="flex-1 w-full max-w-screen-2xl mx-auto p-4 lg:py-6 lg:overflow-hidden flex flex-col">
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
                         <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start lg:overflow-hidden animate-pulse">
                            <div className="hidden lg:flex flex-col gap-4 h-full">
                                <div className="grid grid-cols-2 gap-3 shrink-0">
                                    <div className="h-32 bg-slate-200 dark:bg-white/5 rounded-2xl border border-slate-300 dark:border-white/5"></div>
                                    <div className="h-32 bg-slate-200 dark:bg-white/5 rounded-2xl border border-slate-300 dark:border-white/5"></div>
                                </div>
                                <div className="h-40 bg-slate-200 dark:bg-white/5 rounded-3xl shrink-0 border border-slate-300 dark:border-white/5"></div>
                                <div className="flex-1 bg-slate-200 dark:bg-white/5 rounded-3xl border border-slate-300 dark:border-white/5"></div>
                            </div>
                            <div className="h-full flex flex-col gap-6 lg:overflow-y-auto pr-1 pb-20 lg:pb-0">
                                <div className="h-20 bg-slate-200 dark:bg-white/5 rounded-2xl shrink-0 border border-slate-300 dark:border-white/5"></div>
                                <div className="h-96 bg-slate-200 dark:bg-white/5 rounded-3xl shrink-0 border border-slate-300 dark:border-white/5"></div>
                            </div>
                         </div>
                    ) : (
                        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start lg:overflow-hidden print:block">
                            <div className="no-print lg:h-full lg:overflow-hidden flex flex-col pb-10 lg:pb-0">
                                <Sidebar 
                                    activeSubject={activeSubject} 
                                    onChangeSubject={setActiveSubject} 
                                    userData={userData} 
                                    settings={settings} 
                                    onUpdateSettings={handleSettingsUpdate} 
                                    onDeleteSubject={dataMgr.handleDeleteSubject}
                                    compositeData={compositeData}
                                    onUpdateWeights={dataMgr.handleWeightUpdate}
                                    onUpdateCountdown={(t, l) => handleSettingsUpdate({ ...settings, countdownTarget: t, countdownLabel: l })}
                                />
                            </div>
                            <div id="syllabus-print-container" className="lg:h-full lg:overflow-y-auto custom-scrollbar pr-1 pb-20 lg:pb-0">
                                <Syllabus activeSubject={activeSubject} userData={userData} settings={settings} onUpdateStatus={handleStatusUpdate} onUpdateNote={handleNoteUpdate} onTogglePaper={(key) => handleSettingsUpdate({ ...settings, syllabusOpenState: { ...settings.syllabusOpenState, [key]: !settings.syllabusOpenState[key] } })} onRenameColumn={dataMgr.onRenameColumn} onAddColumn={dataMgr.onAddColumn} onAddChapter={dataMgr.onAddChapter} onDeleteChapter={dataMgr.onDeleteChapter} onDeleteColumn={dataMgr.onDeleteColumn} onRenameChapter={dataMgr.handleRenameChapter} />
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
