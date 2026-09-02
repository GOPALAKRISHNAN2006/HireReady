import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import SEO from '../components/SEO';
import { Wrench, RefreshCw, Home, HelpCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRetry = () => {
    setIsRefreshing(true);
    toast.loading('Checking server status...', { id: 'maintenance-check' });
    setTimeout(() => {
      setIsRefreshing(false);
      toast.dismiss('maintenance-check');
      // If maintenance flag is clear, window.location.reload() will return user to app
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <SEO
        title="Maintenance | HireReady"
        description="HireReady is undergoing scheduled maintenance."
        robots="noindex, nofollow"
      />

      {/* Animated background rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary-500/10 via-indigo-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full text-center py-12 px-6 sm:px-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl">
        {/* Animated Icon Container */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-primary-100 dark:bg-primary-950/50 rounded-3xl animate-ping opacity-25" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-primary-500/30">
            <Wrench
              className="w-12 h-12 text-white animate-bounce"
              style={{ animationDuration: '3s' }}
            />
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-300 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          SCHEDULED SYSTEM UPGRADE
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          We'll Be Right Back!
        </h1>

        <p className="text-slate-600 dark:text-slate-300 mb-8 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
          HireReady is currently undergoing essential maintenance and infrastructure enhancements to
          improve performance and reliability.
        </p>

        {/* Feature checklist */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 mb-8 border border-slate-200/60 dark:border-slate-700/60 text-left space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Database optimization & stability updates</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>AI interview engine performance tuning</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Your practice data & history remain 100% safe</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleRetry}
            isLoading={isRefreshing}
            icon={RefreshCw}
            size="lg"
            className="w-full sm:w-auto shadow-lg shadow-primary-500/25"
          >
            Check Status & Retry
          </Button>

          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" icon={Home} size="lg" className="w-full sm:w-auto">
              Home
            </Button>
          </Link>

          <Link to="/help" className="w-full sm:w-auto">
            <Button variant="ghost" icon={HelpCircle} size="lg" className="w-full sm:w-auto">
              Support Center
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
