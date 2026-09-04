import { useState } from 'react';
import { useCookieStore } from '../store/cookieStore';
import { Button } from './ui';
import { Cookie, ShieldCheck, SlidersHorizontal, X, Info, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const {
    hasConsented,
    isModalOpen,
    preferences,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    openModal,
    closeModal,
  } = useCookieStore();

  const [tempPreferences, setTempPreferences] = useState({ ...preferences });

  const handleOpenPreferencesModal = () => {
    setTempPreferences({ ...preferences });
    openModal();
  };

  const handleSaveModal = () => {
    savePreferences(tempPreferences);
  };

  return (
    <>
      {/* Floating Bottom Cookie Banner */}
      {!hasConsented && (
        <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 animate-slide-up">
          <div className="bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-5 md:p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-600/20 text-primary-400 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary-500/30">
                <Cookie className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-semibold text-white">We value your privacy</h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze site
                  usage, and support our interview prep tools. Essential cookies remain enabled.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={acceptAll}
                    size="sm"
                    className="bg-primary-600 hover:bg-primary-500 text-white font-medium"
                  >
                    Accept All
                  </Button>

                  <Button
                    onClick={rejectNonEssential}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                  >
                    Reject Non-Essential
                  </Button>

                  <Button
                    onClick={handleOpenPreferencesModal}
                    variant="ghost"
                    size="sm"
                    icon={SlidersHorizontal}
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Manage Preferences
                  </Button>
                </div>

                <div className="mt-3 text-[11px] text-slate-400">
                  Read our{' '}
                  <Link to="/privacy" className="underline hover:text-white">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/cookie-preferences" className="underline hover:text-white">
                    Cookie Policy
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Cookie Preferences
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Customize your data & privacy settings
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose which categories of cookies and local storage you allow us to use. Essential
                cookies are strictly necessary for authentication, security, and baseline feature
                performance.
              </p>

              {/* Necessary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                      Strictly Necessary Cookies
                    </h3>
                    <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-bold uppercase tracking-wider">
                      Always Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Required for basic site navigation, account authentication, session security,
                    and saved system preferences.
                  </p>
                </div>
                <div className="pt-1">
                  <div className="w-10 h-6 bg-primary-600 opacity-60 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    Functional & Preference Cookies
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Remembers choices like theme preference (dark/light), layout customization, and
                    language settings across sessions.
                  </p>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setTempPreferences(prev => ({ ...prev, preferences: !prev.preferences }))
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                      tempPreferences.preferences
                        ? 'bg-primary-600'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform absolute top-1 left-1 ${
                        tempPreferences.preferences ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Analytics */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    Analytics & Performance
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Helps us understand how users interact with practice modules, mock interviews,
                    and tools to diagnose errors and optimize response times.
                  </p>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setTempPreferences(prev => ({ ...prev, analytics: !prev.analytics }))
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                      tempPreferences.analytics
                        ? 'bg-primary-600'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform absolute top-1 left-1 ${
                        tempPreferences.analytics ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Marketing */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    Marketing & Tailored Communication
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Allows tailored announcements about new practice challenges, career features,
                    and interview tips relevant to your profile.
                  </p>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setTempPreferences(prev => ({ ...prev, marketing: !prev.marketing }))
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                      tempPreferences.marketing
                        ? 'bg-primary-600'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform absolute top-1 left-1 ${
                        tempPreferences.marketing ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={rejectNonEssential}
                className="text-slate-600 dark:text-slate-400"
              >
                Reject Non-Essential
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveModal}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
