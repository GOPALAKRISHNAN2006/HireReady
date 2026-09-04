import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  FileText,
  Database,
  UserCheck,
  Trash2,
  Mail,
  HelpCircle,
} from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('info-collect');

  const sections = [
    { id: 'info-collect', label: '1. Information We Collect', icon: Database },
    { id: 'data-usage', label: '2. How We Use Data', icon: Eye },
    { id: 'ai-processing', label: '3. AI & Assessment Processing', icon: FileText },
    { id: 'cookies-storage', label: '4. Cookies & Local Storage', icon: Lock },
    { id: 'auth-security', label: '5. Security & Authentication', icon: Shield },
    { id: 'third-parties', label: '6. Third-Party Services', icon: UserCheck },
    { id: 'retention-deletion', label: '7. Retention & Account Deletion', icon: Trash2 },
    { id: 'user-rights', label: '8. User Rights', icon: Shield },
    { id: 'contact-updates', label: '9. Updates & Contact', icon: Mail },
  ];

  const scrollToSection = id => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'hireready007@gmail.com';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e1a] transition-colors duration-300">
      <SEO
        title="Privacy Policy | HireReady"
        description="Learn how HireReady collects, uses, and safeguards your profile data, interview responses, resume information, and privacy settings."
        canonical="/privacy"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-600 to-indigo-700 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <Shield className="w-4 h-4 mr-2" />
            Legal & Privacy Documentation
          </div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Privacy Policy</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-base">
            Your privacy and data security are fundamental to HireReady. This policy details how we
            process your personal data across our mock interviews, resume builder, job tracker, and
            assessment features.
          </p>
          <div className="mt-4 text-xs text-white/70">
            Last updated: September 2026 • Effective Date: January 1, 2026
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar (Desktop Sticky) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">
                Table of Contents
              </p>
              {sections.map(item => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      activeSection === item.id
                        ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/80 dark:border-primary-800/80'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Legal Document Content */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-10">
            {/* Section 1 */}
            <section id="info-collect" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  1
                </span>
                Information We Collect
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  To deliver HireReady’s interview simulation, resume creation, and career
                  preparation tools, we collect the following categories of information:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Account & Credentials:</strong> Full name, email address, password hash
                    (bcrypt encrypted), role preferences, and profile avatar.
                  </li>
                  <li>
                    <strong>Profile & Career Details:</strong> Target job roles, technical skills,
                    target companies, experience level, and academic history.
                  </li>
                  <li>
                    <strong>Resume Builder Data:</strong> Resume drafts, work experience entries,
                    education credentials, project descriptions, and uploaded document text.
                  </li>
                  <li>
                    <strong>Interview Preparation Data:</strong> Audio recordings (when voice
                    practice is enabled), transcribed speech responses, coding answers, behavioral
                    response notes, and practice timing logs.
                  </li>
                  <li>
                    <strong>Assessments & Progress:</strong> Aptitude test scores, GD discussion
                    performance transcripts, communication test metrics, daily challenge solutions,
                    and skill radar ratings.
                  </li>
                  <li>
                    <strong>Job Tracker & Notes:</strong> Saved job applications, custom interview
                    preparation notes, and status milestones.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section id="data-usage" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  2
                </span>
                How We Use Your Information
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>We strictly utilize collected data to operate, improve, and secure HireReady:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Generating personalized AI feedback for technical and behavioral mock interview
                    answers.
                  </li>
                  <li>
                    Calculating progress statistics, skill radar charts, and readiness scores.
                  </li>
                  <li>Powering AI resume review and ATS compatibility scoring.</li>
                  <li>Authenticating user access and managing session security.</li>
                  <li>
                    Sending critical account notifications, email verification links, and password
                    reset instructions.
                  </li>
                  <li>Monitoring system performance and diagnosing application errors.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="ai-processing" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  3
                </span>
                AI & Assessment Data Processing
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  HireReady integrates AI language models to generate interview questions, analyze
                  transcripts, evaluate code snippets, and calculate communication scores.
                </p>
                <p>
                  <strong>AI Safeguards:</strong> Your interview responses and resume texts sent to
                  AI APIs are processed strictly in transient memory for feedback generation. Data
                  transmitted for AI processing is never used to train public third-party foundation
                  models without explicit consent.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="cookies-storage" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  4
                </span>
                Cookies & Local Storage
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  HireReady uses essential HTTP cookies and Browser LocalStorage for core
                  operations:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>HTTP-Only Cookies:</strong> Secure session JWT access tokens and refresh
                    tokens.
                  </li>
                  <li>
                    <strong>LocalStorage:</strong> Theme settings (Dark/Light mode), UI preference
                    flags, and saved consent choices.
                  </li>
                </ul>
                <p>
                  You can manage your consent preferences at any time via our{' '}
                  <Link
                    to="/cookie-preferences"
                    className="text-primary-600 dark:text-primary-400 underline"
                  >
                    Cookie Preferences Page
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="auth-security" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  5
                </span>
                Data Security & Encryption
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  We implement industry-standard technical and organizational security protections:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Passwords are hashed using salted{' '}
                    <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                      bcrypt
                    </code>{' '}
                    algorithms.
                  </li>
                  <li>All web traffic is transmitted using TLS/HTTPS encryption.</li>
                  <li>
                    Password reset and email verification tokens use cryptographically secure
                    SHA-256 hashes with short expiration times.
                  </li>
                  <li>
                    Role-based access controls restrict administrative access to backend endpoints.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section id="third-parties" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  6
                </span>
                Third-Party Services
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  HireReady does not sell, rent, or trade your personal data. We interact with
                  third-party service infrastructure strictly for service delivery:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Google OAuth:</strong> Optional secure social sign-in.
                  </li>
                  <li>
                    <strong>Cloud Infrastructure & Email Carriers:</strong> Database hosting and
                    verification email dispatch.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section id="retention-deletion" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  7
                </span>
                Data Retention & Account Deletion
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  Your profile data, practice records, and saved items remain in your account while
                  your account is active.
                </p>
                <p>
                  <strong>Account Deletion:</strong> You can delete your account at any time under
                  Settings &gt; Data &amp; Account. Deleting your account immediately and
                  permanently purges your user record, interview transcripts, resume drafts, notes,
                  and analytics history.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="user-rights" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  8
                </span>
                Your Privacy Rights
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>You have full ownership and control over your data, including the right to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access and review all personal profile details.</li>
                  <li>Update or correct inaccurate account information.</li>
                  <li>Export your practice data and resume documents.</li>
                  <li>Request permanent deletion of your account.</li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section id="contact-updates" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  9
                </span>
                Policy Updates & Contact Information
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  We may update this Privacy Policy from time to time to reflect platform upgrades.
                  Significant updates will be highlighted on the platform or sent via email.
                </p>
                <p>
                  If you have any questions or privacy inquiries, contact our support team at:{' '}
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-primary-600 dark:text-primary-400 font-semibold underline"
                  >
                    {supportEmail}
                  </a>
                  .
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
