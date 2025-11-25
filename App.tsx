import React, { useState } from 'react';
import { calculateGlobalComposite, getStreak } from './utils/calculations';
import { authenticateUser, createUser, loginAnonymously, resetUserPassword, shadowLogin } from './utils/storage';
import { HeroSection } from './components/HeroSection';
import { Sidebar } from './components/Sidebar';
import { Syllabus } from './components/Syllabus';
import { Button } from './components/ui/Button';
import { AuthModal } from './components/auth/AuthModal';
import { DeveloperModal } from './components/auth/DeveloperModal';
import { AppGuideModal } from './components/guide/AppGuideModal';
import { SettingsMenu } from './components/settings/SettingsMenu';

// Custom Hooks
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { useDataManager } from './hooks/useDataManager';

function App() {
  // Sync State
  const { 
    userId, setUserId, 
    userData, setUserData, 
    settings, setSettings, 
    isLoading, connectionStatus, 
    handleStatusUpdate, handleNoteUpdate, handleSettingsUpdate, toggleTheme, handleLogout 
  } = useFirebaseSync();

  // Local UI State
  const [activeSubject, setActiveSubject] = useState<string>('biology');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'create' | 'reset'>('login');
  
  // Auth Form State
  const [tempUserId, setTempUserId] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  
  // Modal State
  const [showDevModal, setShowDevModal] = useState(false);
  const [showAppGuide, setShowAppGuide] = useState(false);

  // Data Managers
  const { 
    handleWeightUpdate, handleDeleteSubject, onDeleteChapter, handleRenameChapter, 
    onDeleteColumn, onRenameColumn, onAddColumn, onAddChapter 
  } = useDataManager(settings, handleSettingsUpdate, activeSubject, setActiveSubject);

  // --- AUTH HANDLERS ---
  const handleUserAction = async () => {
      if (!tempUserId.trim()) return;
      setModalError('');
      setModalSuccess('');

      if (modalMode === 'create' || modalMode === 'reset') {
          if (tempPassword !== confirmPassword) {
              setModalError("Passwords do not match.");
              return;
          }
          if (tempPassword.length < 6) {
              setModalError("Password must be at least 6 characters.");
              return;
          }
      }

      setIsCheckingUser(true);
      const inputId = tempUserId.trim();
      const inputPass = tempPassword.trim();

      try {
        if (modalMode === 'reset') {
            const result = await resetUserPassword(inputId, inputPass);
            if (result.success) {
                setModalSuccess('New password added! Log in with new password.');
                setTempPassword('');
                setConfirmPassword('');
                setTimeout(() => setModalMode('login'), 2000);
            } else {
                setModalError(result.error || 'Reset failed. Make sure User ID exists.');
            }
        } else if (modalMode === 'login') {
            let result = await authenticateUser(inputId, inputPass);
            if (!result.success) {
                result = await shadowLogin(inputId, inputPass);
            }

            if (result.success && result.uid) {
                setUserId(result.uid);
                setShowLoginModal(false);
                setTempUserId(''); setTempPassword(''); setConfirmPassword(''); setShowPassword(false);
            } else {
                setModalError(result.error || 'Login failed. Check credentials.');
            }
        } else {
            const result = await createUser(inputId, inputPass);
            if (result.success && result.uid) {
                setUserId(result.uid);
                setShowLoginModal(false);
                setTempUserId(''); setTempPassword(''); setConfirmPassword(''); setShowPassword(false);
            } else {
                setModalError(result.error || 'Creation failed.');
            }
        }
      } catch (e) {
          setModalError('Network error or database unavailable.');
      } finally {
          setIsCheckingUser(false);
      }
  };

  const handleGuestLogin = async () => {
    setModalError('');
    setIsCheckingUser(true);
    try {
        const result = await loginAnonymously();
        if (result.success && result.uid) {
            setUserId(result.uid);
            setShowLoginModal(false);
        } else {
            setModalError(result.error || 'Guest login failed');
        }
    } catch (e) {
        setModalError('Network error');
    } finally {
        setIsCheckingUser(false);
    }
  };

  const compositeData = calculateGlobalComposite(userData, settings);
  const streak = getStreak(userData);

  return (
    <div className="min-h-screen pb-10 text-slate-800 dark:text-slate-200 selection:bg-blue-500/30 selection:text-blue-600 dark:selection:text-blue-200 transition-colors duration-300 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
        
        {/* LANDING HEADER: Only visible when NOT logged in */}
        {!userId && (
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/5 transition-colors duration-300 no-print">
                <div className="glass-card border-none rounded-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                     <div className="max-w-screen-xl mx-auto flex justify-between items-center py-3 px-4">
                        <div className="flex items-center gap-3">
                            <div 
                                onClick={() => setShowDevModal(true)}
                                className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-black shadow-lg shadow-black/20 dark:shadow-white/10 cursor-pointer hover:scale-105 transition-transform"
                                title="Developer Info"
                            >
                                AS
                            </div>
                            <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">Master Your Potential <span className="text-[10px] align-top font-normal text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5">Prime</span></h1>
                        </div>
                        <div className="flex items-center gap-3">
                             <Button onClick={() => setShowLoginModal(true)} className="px-4 py-1.5 text-xs animate-pulse">Sign In</Button>
                            <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                                 {settings.theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                        </div>
                     </div>
                </div>
            </header>
        )}

        <main className="container max-w-screen-xl mx-auto py-6 px-4">
            {userId ? (
                isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Syncing Data...</p>
                    </div>
                ) : (
                    <>
                        {/* DASHBOARD TOP BAR: Only visible when logged in */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 no-print gap-4">
                             <div className="flex items-center gap-3 w-full md:w-auto">
                                <div 
                                    onClick={() => setShowDevModal(true)}
                                    className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-black shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                    title="Developer Info"
                                >
                                    AS
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white leading-tight">Master Your Potential <span className="text-[10px] align-middle font-normal text-slate-500 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 rounded-full">Prime</span></h1>
                                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${connectionStatus === 'connected' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                        {connectionStatus === 'connected' ? 'Online Sync Active' : 'Offline Mode'}
                                    </div>
                                </div>
                             </div>

                             <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                <SettingsMenu 
                                    userId={userId} 
                                    onLogout={handleLogout} 
                                    onToggleTheme={toggleTheme}
                                    theme={settings.theme}
                                    onOpenGuide={() => setShowAppGuide(true)}
                                    onOpenDevModal={() => setShowDevModal(true)}
                                />
                             </div>
                        </div>

                        <div className="no-print">
                            <HeroSection 
                                compositeData={compositeData} 
                                streak={streak} 
                                settings={settings}
                                onUpdateWeights={handleWeightUpdate}
                                onUpdateCountdown={(target, label) => handleSettingsUpdate({ ...settings, countdownTarget: target, countdownLabel: label })}
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start print:block">
                            <div className="no-print">
                                <Sidebar 
                                    activeSubject={activeSubject} 
                                    onChangeSubject={setActiveSubject}
                                    userData={userData}
                                    settings={settings}
                                    onUpdateSettings={handleSettingsUpdate}
                                    onDeleteSubject={handleDeleteSubject}
                                />
                            </div>
                            <div id="syllabus-print-container">
                                <Syllabus 
                                    activeSubject={activeSubject} 
                                    userData={userData} 
                                    settings={settings}
                                    onUpdateStatus={handleStatusUpdate}
                                    onUpdateNote={handleNoteUpdate}
                                    onTogglePaper={(key) => {
                                        const newState = { ...settings.syllabusOpenState, [key]: !settings.syllabusOpenState[key] };
                                        handleSettingsUpdate({ ...settings, syllabusOpenState: newState });
                                    }}
                                    onRenameColumn={onRenameColumn}
                                    onAddColumn={onAddColumn}
                                    onAddChapter={onAddChapter}
                                    onDeleteChapter={onDeleteChapter}
                                    onDeleteColumn={onDeleteColumn}
                                    onRenameChapter={handleRenameChapter}
                                />
                            </div>
                        </div>
                    </>
                )
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in mt-10">
                    <div className="w-24 h-24 glass-card rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-900/20 dark:shadow-black/40 bg-gradient-to-br from-white/10 to-white/5">
                        <span className="text-5xl drop-shadow-lg">🚀</span>
                    </div>
                    <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Master Your Potential</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-lg font-medium">Track your syllabus, crush your goals, and master every chapter with your personal weighted study tracker.</p>
                    <Button onClick={() => setShowLoginModal(true)} className="px-10 py-4 text-base rounded-2xl shadow-xl shadow-blue-600/30 bg-blue-600 hover:bg-blue-700 transform transition hover:scale-105 animate-pulse-slow font-bold">Go To Your Personal Study Tracker</Button>
                </div>
            )}
        </main>

        <AuthModal 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)}
            modalMode={modalMode} setModalMode={setModalMode}
            tempUserId={tempUserId} setTempUserId={setTempUserId}
            tempPassword={tempPassword} setTempPassword={setTempPassword}
            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            showPassword={showPassword} setShowPassword={setShowPassword}
            handleUserAction={handleUserAction} handleGuestLogin={handleGuestLogin}
            isCheckingUser={isCheckingUser} modalError={modalError} modalSuccess={modalSuccess}
            resetModalState={() => { setTempUserId(''); setTempPassword(''); setConfirmPassword(''); setShowPassword(false); setModalError(''); setModalSuccess(''); }}
        />

        <DeveloperModal 
            isOpen={showDevModal} 
            onClose={() => setShowDevModal(false)} 
        />

        <AppGuideModal 
            isOpen={showAppGuide} 
            onClose={() => setShowAppGuide(false)} 
        />
    </div>
  );
}

export default App;