import React from 'react';

interface FirebaseDomainErrorProps {
  onContinueAsGuest: () => void;
}

export const FirebaseDomainError: React.FC<FirebaseDomainErrorProps> = ({ onContinueAsGuest }) => {
  const currentDomain = window.location.hostname;
  
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20">
          <span className="text-3xl">⚠️</span>
        </div>
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Domain Not Authorized</h1>
          <p className="text-slate-400 text-sm">
            Your current domain needs to be whitelisted in Firebase Console to use authentication.
          </p>
        </div>
        
        {/* Current Domain Display */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-2">Current Domain:</p>
          <p className="text-slate-200 font-mono text-sm break-all">{currentDomain}</p>
        </div>
        
        {/* Instructions */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-left space-y-3">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">Setup Instructions</p>
          <ol className="text-xs text-slate-400 space-y-2">
            <li><span className="text-blue-400">1.</span> Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Firebase Console</a></li>
            <li><span className="text-blue-400">2.</span> Select project: <strong className="text-slate-300">my-study-dashboard</strong></li>
            <li><span className="text-blue-400">3.</span> Go to Authentication → Settings → Authorized domains</li>
            <li><span className="text-blue-400">4.</span> Click "Add domain" and enter: <code className="bg-slate-900 px-2 py-1 rounded text-slate-200">{currentDomain}</code></li>
            <li><span className="text-blue-400">5.</span> Refresh this page</li>
          </ol>
        </div>
        
        {/* Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={onContinueAsGuest}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20"
          >
            Continue as Guest
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all duration-200"
          >
            Refresh Page
          </button>
        </div>
        
        {/* Help Text */}
        <p className="text-xs text-slate-500">
          Don't have Firebase access? Continue as guest to explore the app offline.
        </p>
      </div>
    </div>
  );
};
