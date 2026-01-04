
// LandingHeader - Hidden on landing page (no settings gear needed for unauthenticated users)
// This component is kept for potential future use but returns null to hide the settings
import React from 'react';

export const LandingHeader: React.FC<{ onDev: () => void, onLogin: () => void, onGuide: () => void, theme: any, onToggleTheme: () => void }> = () => {
    // Return null to hide settings gear on landing page
    return null;
};
