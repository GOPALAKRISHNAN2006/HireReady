import React from 'react';
import { Button } from './ui';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('HireReady Global ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
          <div className="relative z-10 max-w-lg w-full text-center py-12 px-6 sm:px-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Something went wrong
            </h1>

            <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm sm:text-base leading-relaxed">
              An unexpected display error occurred in this component. Our application recovered
              safely without compromising your account data.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={this.handleReload} icon={RefreshCw} className="w-full sm:w-auto">
                Refresh Page
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                icon={Home}
                className="w-full sm:w-auto"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
