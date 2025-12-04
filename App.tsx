
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { calculateGlobalComposite } from './utils/calculations';
import { Sidebar } from './components/Sidebar';
import { Syllabus } from './components/Syllabus';

const MemoizedSidebar = React.memo(Sidebar);
const MemoizedSyllabus = React.memo(Syllabus);
import { AuthModal } from './components/auth/AuthModal';
import { DeveloperModal } from './components/auth/DeveloperModal';
import { AppGuideModal } from './components/guide/AppGuideModal';
import { AppearanceModal } from './components/settings/AppearanceModal';
import { LandingHeader } from './components/layout/LandingHeader';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { WelcomeHero } from './components/layout/WelcomeHero';
import { SkeletonDashboard } from './components/layout/SkeletonDashboard';
import { FirebaseDomainError } from './components/layout/FirebaseDomainError';
import { Toast } from './components/ui/Toast';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { useDataManager } from './hooks/useDataManager';
import { useAuthHandlers } from './hooks/useAuthHandlers';
import { useAppearance } from './hooks/ui/useAppearance';
import { useToast, ToastContext } from './hooks/useToast';

function App() {
  const { userId, setUserId, isAuthResolving, userData, settings, isLoading, connectionStatus, handleStatusUpdate, handleNoteUpdate, handleSettingsUpdate, toggleTheme, handleLogout, forceSync } = useFirebaseSync();
  const [activeSubject, setActiveSubject] = useState<string>('biology');
  const [showDevModal, setShowDevModal] = useState(false);
  const [showAppGuide, setShowAppGuide] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [bypassAuth, setBypassAuth] = useState(false);
  
  const { toast, showToast, hideToast } = useToast();
  
  const [postLoginLoading, setPostLoginLoading] = useState(false);
  
  const auth = useAuthHandlers(setUserId, () => setPostLoginLoading(true));

  useAppearance(settings);

  const wrappedStatusUpdate = useCallback(async (key: string) => {
    if (!userId) return;
    try {
      await handleStatusUpdate(key);
      showToast('success');
    } catch (error) {
      showToast('error');
    }
  }, [handleStatusUpdate, showToast, userId]);

  const wrappedNoteUpdate = useCallback(async (key: string, text: string) => {
    if (!userId) return;
    try {
      await handleNoteUpdate(key, text);
      showToast('success');
    } catch (error) {
      showToast('error');
    }
  }, [handleNoteUpdate, showToast, userId]);

  const wrappedSettingsUpdate = useCallback(async (newSettings: any) => {
    if (!userId) return;
    try {
      await handleSettingsUpdate(newSettings);
      showToast('success');
    } catch (error) {
      showToast('error');
    }
  }, [handleSettingsUpdate, showToast, userId]);
  
  const dataMgr = useDataManager(settings, wrappedSettingsUpdate, activeSubject, setActiveSubject);

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

  const compositeData = useMemo(
    () => calculateGlobalComposite(userData, settings),
    [userData, settings]
  );

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
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:py-6 lg:overflow-hidden flex flex-col">
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
                                <MemoizedSidebar
                                    activeSubject={activeSubject}
                                    onChangeSubject={setActiveSubject}
                                    userData={userData}
                                    settings={settings}
                                    onUpdateSettings={wrappedSettingsUpdate}
                                    onDeleteSubject={dataMgr.handleDeleteSubject}
                                    compositeData={compositeData}
                                    onUpdateWeights={dataMgr.handleWeightUpdate}
                                    onUpdateCountdown={(t, l) => wrappedSettingsUpdate({ ...settings, countdownTarget: t, countdownLabel: l })}
                                />
                            </div>
                            <div id="syllabus-print-container" className="lg:h-full lg:overflow-y-auto custom-scrollbar pr-1 pb-20 lg:pb-0">
                                <MemoizedSyllabus activeSubject={activeSubject} userData={userData} settings={settings} onUpdateStatus={wrappedStatusUpdate} onUpdateNote={wrappedNoteUpdate} onTogglePaper={(key) => wrappedSettingsUpdate({ ...settings, syllabusOpenState: { ...settings.syllabusOpenState, [key]: !settings.syllabusOpenState[key] } })} onRenameColumn={dataMgr.onRenameColumn} onAddColumn={dataMgr.onAddColumn} onAddChapter={dataMgr.onAddChapter} onDeleteChapter={dataMgr.onDeleteChapter} onDeleteColumn={dataMgr.onDeleteColumn} onRenameChapter={dataMgr.handleRenameChapter} />
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
        <AppearanceModal isOpen={showAppearance} onClose={() => setShowAppearance(false)} settings={settings} onUpdateSettings={wrappedSettingsUpdate} />
        
        <Toast 
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onHide={hideToast}
        />
    </div>
  );
}
export default App;
