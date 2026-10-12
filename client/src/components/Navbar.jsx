import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import api from '../services/api';
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  Brain,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  X,
  Loader2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { trackEvent } from '../services/analytics';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useSettingsStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Live search debounced fetch
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.get('/questions', {
          params: { search: trimmed, limit: 5 },
        });
        const items = response.data?.data?.questions || response.data?.questions || [];
        setSearchResults(items);
        setShowSearchDropdown(true);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    const handleKeyDown = event => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setShowSearchDropdown(true);
      }
      if (event.key === 'Escape') {
        setShowSearchDropdown(false);
        setDropdownOpen(false);
        setMobileSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = e => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setShowSearchDropdown(false);
    setMobileSearchOpen(false);
    navigate(`/questions?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectResult = item => {
    setShowSearchDropdown(false);
    setMobileSearchOpen(false);
    navigate(`/questions?search=${encodeURIComponent(item.text)}`);
  };

  const handleLogout = () => {
    trackEvent('logout');
    logout();
    setDropdownOpen(false);
  };

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    const cycle = { light: 'dark', dark: 'system', system: 'light' };
    setTheme(cycle[theme] || 'light');
  };

  const themeIcon = theme === 'system' ? Monitor : isDark ? Sun : Moon;
  const themeLabel =
    theme === 'system' ? 'System theme' : isDark ? 'Switch to light mode' : 'Switch to dark mode';

  const displayName = user?.firstName || user?.name?.split(' ')[0] || 'User';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-primary-500/[0.08] transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-2.5 h-16">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-primary-500/10 transition-all duration-200 active:scale-95"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>

          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 dark:shadow-primary-500/20 group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-105">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent hidden sm:block">
              HireReady
            </span>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8 relative" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative w-full group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 transition-colors"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) setShowSearchDropdown(true);
              }}
              placeholder="Search interview questions, DSA, topics... (⌘K)"
              aria-label="Search questions and topics"
              className="w-full pl-11 pr-20 py-2 bg-slate-100/90 dark:bg-[#0f172a]/90 border border-slate-200/60 dark:border-primary-500/15 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/40 focus:bg-white dark:focus:bg-[#131c31] focus:border-primary-300 dark:focus:border-primary-500/40 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {isSearching ? (
                <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchDropdown(false);
                  }}
                  className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/60 dark:bg-slate-800 rounded border border-slate-300/40 dark:border-slate-700/60">
                  ⌘K
                </kbd>
              )}
            </div>
          </form>

          {/* Autocomplete Results Dropdown */}
          {showSearchDropdown && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-primary-500/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 px-3">
                <span>QUESTION BANK MATCHES</span>
                {isSearching && <span>Searching...</span>}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/60 dark:divide-slate-800/60">
                {searchResults.length > 0 ? (
                  searchResults.map(q => (
                    <button
                      key={q._id || q.id}
                      type="button"
                      onClick={() => handleSelectResult(q)}
                      className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-primary-500/10 transition-colors flex items-start gap-3 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary-600 dark:text-primary-400">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2">
                          {q.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span className="capitalize px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            {q.category}
                          </span>
                          <span
                            className={`capitalize text-[11px] font-medium ${
                              q.difficulty === 'easy'
                                ? 'text-emerald-500'
                                : q.difficulty === 'hard'
                                  ? 'text-rose-500'
                                  : 'text-amber-500'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : !isSearching ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No questions found matching "{searchQuery}"
                  </div>
                ) : null}
              </div>

              {/* Dropdown Footer: Search all */}
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center justify-center gap-1.5 transition-colors border-t border-slate-100 dark:border-slate-800"
              >
                <span>View all results for "{searchQuery}" in Question Bank</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen);
              setTimeout(() => mobileInputRef.current?.focus(), 100);
            }}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-primary-500/10 text-slate-500 transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-primary-500/10 transition-all duration-300 relative group"
            title={themeLabel}
            aria-label={themeLabel}
          >
            {theme === 'system' ? (
              <Monitor
                className="w-5 h-5 text-primary-500 group-hover:text-primary-400 transition-colors"
                aria-hidden="true"
              />
            ) : isDark ? (
              <Sun
                className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors"
                aria-hidden="true"
              />
            ) : (
              <Moon
                className="w-5 h-5 text-slate-500 group-hover:text-primary-600 transition-colors"
                aria-hidden="true"
              />
            )}
          </button>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-primary-500/10 transition-all duration-200 relative group"
            aria-label="View notifications"
          >
            <Bell
              className="w-5 h-5 text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200"
              aria-hidden="true"
            />
            <span
              className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"
              aria-hidden="true"
            ></span>
          </Link>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-primary-500/10 transition-all duration-200 group"
              aria-label="User account menu"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-500 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                {user?.avatar &&
                user.avatar !== 'default-avatar.png' &&
                user.avatar.startsWith('http') ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="w-9 h-9 rounded-xl object-cover"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="text-sm font-bold text-white">${displayName.charAt(0).toUpperCase()}</span>`;
                    }}
                  />
                ) : (
                  <span className="text-sm font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">
                {displayName}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/90 dark:bg-[#111827]/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100/50 dark:border-primary-500/10 py-2 animate-slide-down">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-primary-500/10">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {user?.firstName} {user?.lastName || ''}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {user?.role === 'admin' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary-500/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-slate-100 dark:bg-primary-500/10 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/profile#settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary-500/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-slate-100 dark:bg-primary-500/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span>Settings</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 dark:border-primary-500/10 pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full"
                  >
                    <div className="w-8 h-8 bg-red-50 dark:bg-red-500/10 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Input */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search interview questions..."
              className="w-full pl-10 pr-20 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="submit"
                className="px-2.5 py-1 text-xs font-semibold bg-primary-600 text-white rounded-lg shadow-sm"
              >
                Go
              </button>
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
