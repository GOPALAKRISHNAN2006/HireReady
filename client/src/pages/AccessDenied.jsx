import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import SEO from '../components/SEO';
import { ShieldAlert, Home, ArrowLeft, LogOut, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const AccessDenied = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <SEO
        title="Access Denied | HireReady"
        description="You do not have permission to access this resource."
        robots="noindex, nofollow"
      />

      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center py-12 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl">
        {/* Shield Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-2xl rotate-6 animate-pulse" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Status Code Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-full text-xs font-semibold text-red-600 dark:text-red-400 mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>ERROR 403 • FORBIDDEN</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
          Access Denied
        </h1>

        <p className="text-slate-600 dark:text-slate-300 mb-6 text-base sm:text-lg leading-relaxed">
          Sorry, your account{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            ({user?.email || 'current session'})
          </span>{' '}
          does not have the required permissions to view this page.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 mb-8 border border-slate-200/60 dark:border-slate-700/60 text-left text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Why am I seeing this?
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>You attempted to access an administrative or restricted section.</li>
            <li>
              Your role (
              <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-800 dark:text-slate-200">
                {user?.role || 'guest'}
              </code>
              ) is not authorized for this resource.
            </li>
            <li>If you believe this is an error, please contact your platform administrator.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            icon={ArrowLeft}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>

          <Link to="/" className="w-full sm:w-auto">
            <Button icon={Home} className="w-full sm:w-auto">
              Go to Home
            </Button>
          </Link>

          {user && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              icon={LogOut}
              className="w-full sm:w-auto text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
