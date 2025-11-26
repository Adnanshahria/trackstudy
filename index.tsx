import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Smart Error Boundary to catch "Blank Screen" crashes
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught Error in App:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#e2e8f0', backgroundColor: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ color: '#f43f5e', fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ marginBottom: '1rem' }}>The application crashed. Here is the error:</p>
          <pre style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log("🚀 Starting App Mount...");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);