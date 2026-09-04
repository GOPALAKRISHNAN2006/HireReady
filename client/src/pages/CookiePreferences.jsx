import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import SEO from '../components/SEO';
import {
  Cookie,
  ShieldCheck,
  ArrowLeft,
  Check,
  RefreshCw,
  Lock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useCookieStore } from '../store/cookieStore';
import toast from 'react-hot-toast';

const CookiePreferencesPage = () => {
  const { preferences, savePreferences, acceptAll, rejectNonEssential } = useCookieStore();
  const [localPrefs, setLocalPrefs] = useState({ ...preferences });

  useEffect(() => {
    setLocalPrefs({ ...preferences });
  }, [preferences]);

  const handleSave = () => {
    savePreferences(localPrefs);
    toast.success('Cookie preferences updated successfully!');
  };

  const handleAcceptAll = () => {
    acceptAll();
    toast.success('All cookie categories accepted!');
  };

  const handleRejectNonEssential = () => {
    rejectNonEssential();
    toast.success('Non-essential cookies disabled!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e1a] transition-colors duration-300">
      <SEO
        title="Cookie Preferences | HireReady"
        description="Manage your privacy settings and cookie preferences for HireReady."
        canonical="/cookie-preferences"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-600 to-indigo-700 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <Cookie className="w-4 h-4 mr-2" />
            Privacy Controls
          </div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Cookie Preferences</h1>
          <p className="text-white/80 max-w-xl mx-auto text-base">
            Control how HireReady uses cookies and local storage technology to manage your session,
            personalize your experience, and optimize performance.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Quick Action Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Quick Consent Controls
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Apply standard privacy presets across all categories instantly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={handleRejectNonEssential}
              size="sm"
              className="flex-1 md:flex-none"
            >
              Reject Non-Essential
            </Button>
            <Button onClick={handleAcceptAll} size="sm" className="flex-1 md:flex-none">
              Accept All
            </Button>
          </div>
        </div>

        {/* Category Controls */}
        <div className="space-y-6">
          {/* Strictly Necessary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Strictly Necessary Cookies
                    <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold">
                      Required
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Authentication, state security & essential APIs
                  </p>
                </div>
              </div>
              <div className="w-11 h-6 bg-primary-600/50 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-600" />
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-13">
              These cookies are necessary for the website to function and cannot be switched off in
              our systems. They are usually only set in response to actions made by you which amount
              to a request for services, such as logging in, maintaining security tokens, or setting
              privacy preferences.
            </p>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Functional & Preferences
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    User settings, dark mode & layout memory
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLocalPrefs(prev => ({ ...prev, preferences: !prev.preferences }))}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                  localPrefs.preferences ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform absolute top-1 left-1 ${
                    localPrefs.preferences ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-13">
              These cookies enable enhanced functionality and personalization, such as remembering
              your selected theme (dark or light mode), editor preferences, audio settings during
              mock interviews, and sidebar expansion state.
            </p>
          </div>

          {/* Analytics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Analytics & Performance
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Usage stats & performance diagnostics
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLocalPrefs(prev => ({ ...prev, analytics: !prev.analytics }))}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                  localPrefs.analytics ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform absolute top-1 left-1 ${
                    localPrefs.analytics ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-13">
              These cookies allow us to count visits and traffic sources so we can measure and
              improve the performance of our platform. They help us know which pages and practice
              modules are the most popular and see how visitors move around the site.
            </p>
          </div>

          {/* Marketing */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Marketing & Tailored Updates
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Feature updates & tailored prep materials
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLocalPrefs(prev => ({ ...prev, marketing: !prev.marketing }))}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                  localPrefs.marketing ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform absolute top-1 left-1 ${
                    localPrefs.marketing ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-13">
              These cookies may be set through our site to build a profile of your interest in
              technical roles and display tailored career guidance or event notifications on
              relevant channels.
            </p>
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For more details on data usage, view our{' '}
            <Link to="/privacy" className="text-primary-600 dark:text-primary-400 underline">
              Privacy Policy
            </Link>
            .
          </p>
          <Button onClick={handleSave} size="lg" className="shadow-lg shadow-primary-500/25">
            Save Preference Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferencesPage;
