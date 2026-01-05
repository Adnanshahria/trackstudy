import { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { calculateGlobalComposite } from './utils/calculations';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthPage } from './pages/AuthPage';

import { DeveloperModal } from './components/auth/DeveloperModal';
import { AppGuideModal } from './components/guide/AppGuideModal';
import { AppearanceModal } from './components/settings/AppearanceModal';
import { AcademicLevelModal } from './components/onboarding/AcademicLevelModal';

import { Toast } from './components/ui/Toast';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { useDataManager } from './hooks/useDataManager';
import { useAuthHandlers } from './hooks/useAuthHandlers';
import { useAppearance } from './hooks/ui/useAppearance';
import { useToast } from './hooks/useToast';
import { OnboardingProvider } from './components/onboarding/OnboardingProvider';
import { getSyllabusData } from './constants/data';

import { SkeletonDashboard } from './components/layout/SkeletonDashboard';

function App() {
  const { userId, setUserId, isAuthResolving, userData, settings, isLoading, connectionStatus, handleStatusUpdate, handleNoteUpdate, handleSettingsUpdate, toggleTheme, handleLogout, forceSync } = useSupabaseSync();



  // Derive initial subject from syllabus keys (not hardcoded 'biology')
  const [activeSubject, setActiveSubject] = useState<string>(() => {
    const keys = Object.keys(settings.syllabus || {});
    return keys[0] || 'biology';
  });

  // Modals state
  const [showDevModal, setShowDevModal] = useState(false);
  const [showAppGuide, setShowAppGuide] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);

  // New user onboarding: detect if academic level needs to be selected
  // Add delay to prevent flash during settings sync race condition
  const [academicModalReady, setAcademicModalReady] = useState(false);
  const rawNeedsAcademicLevel = userId && !isLoading && !settings.academicLevel;

  useEffect(() => {
    if (rawNeedsAcademicLevel) {
      // Wait 500ms before showing modal to let settings stabilize
      const timer = setTimeout(() => setAcademicModalReady(true), 500);
      return () => clearTimeout(timer);
    } else {
      setAcademicModalReady(false);
    }
  }, [rawNeedsAcademicLevel]);

  const needsAcademicLevel = rawNeedsAcademicLevel && academicModalReady;

  const { toast, showToast, hideToast } = useToast();
  const [postLoginLoading, setPostLoginLoading] = useState(false);

  // Pass setPostLoginLoading to auth hook so it can trigger loading state on login
  const auth = useAuthHandlers(setUserId, () => {
    setPostLoginLoading(true);
  });

  useAppearance(settings);

  // Wrappers for toast feedback
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

  // Handler for academic level selection (must be after wrappedSettingsUpdate)
  const handleAcademicLevelSelect = useCallback((level: 'HSC' | 'SSC') => {
    wrappedSettingsUpdate({ ...settings, academicLevel: level, syllabus: getSyllabusData(level) });
  }, [settings, wrappedSettingsUpdate]);

  const dataMgr = useDataManager(settings, wrappedSettingsUpdate, activeSubject, setActiveSubject);

  // Loading Logic
  useEffect(() => {
    if (userId && postLoginLoading) {
      setPostLoginLoading(false);
    }
  }, [userId, postLoginLoading]);

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
    <BrowserRouter>
      <OnboardingProvider userId={userId}>
        <div id="app-root" className="min-h-screen lg:h-screen w-screen lg:overflow-hidden flex flex-col text-slate-800 dark:text-slate-200">
          <div className="flex flex-col flex-1 lg:h-screen lg:overflow-hidden">
            <Routes>
              <Route
                path="/"
                element={!userId ? (
                  <LandingPage
                    onDev={() => setShowDevModal(true)}
                    onGuide={() => setShowAppGuide(true)}
                    theme={settings.theme}
                    onToggleTheme={toggleTheme}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              />

              <Route
                path="/auth"
                element={!userId ? (
                  <AuthPage
                    {...auth}
                    userId={userId}
                    isCheckingUser={auth.isCheckingUser}
                    modalSuccess={auth.modalSuccess}
                    modalError={auth.modalError}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              />

              <Route
                path="/dashboard"
                element={userId ? (
                  <DashboardPage
                    userId={userId}
                    userData={userData}
                    settings={settings}
                    activeSubject={activeSubject}
                    setActiveSubject={setActiveSubject}
                    isLoading={isLoading}
                    connectionStatus={connectionStatus}
                    onLogout={handleLogout}
                    onToggleTheme={toggleTheme}
                    onDev={() => setShowDevModal(true)}
                    onGuide={() => setShowAppGuide(true)}
                    onAppearance={() => setShowAppearance(true)}
                    onForceSync={forceSync}
                    onUpdateSettings={wrappedSettingsUpdate}
                    onUpdateStatus={wrappedStatusUpdate}
                    onUpdateNote={wrappedNoteUpdate}
                    compositeData={compositeData}
                    dataMgr={dataMgr}
                  />
                ) : (
                  <Navigate to="/auth" replace />
                )}
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Global Modals */}
            <DeveloperModal isOpen={showDevModal} onClose={() => setShowDevModal(false)} />
            <AppGuideModal isOpen={showAppGuide} onClose={() => setShowAppGuide(false)} />
            <AppearanceModal isOpen={showAppearance} onClose={() => setShowAppearance(false)} settings={settings} onUpdateSettings={wrappedSettingsUpdate} />
            <AcademicLevelModal isOpen={!!needsAcademicLevel} onSelect={handleAcademicLevelSelect} />



            <Toast
              message={toast.message}
              type={toast.type}
              isVisible={toast.isVisible}
              onHide={hideToast}
            />
          </div>
        </div>
      </OnboardingProvider>
    </BrowserRouter>
  );
}
export default App;
