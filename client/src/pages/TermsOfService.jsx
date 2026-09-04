import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Scale,
  AlertOctagon,
  UserX,
  Cpu,
} from 'lucide-react';
import SEO from '../components/SEO';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', label: '1. Acceptance of Terms', icon: FileText },
    { id: 'eligibility', label: '2. Eligibility & Account', icon: UserX },
    { id: 'acceptable-use', label: '3. Acceptable Use Policy', icon: ShieldAlert },
    { id: 'ai-disclaimer', label: '4. AI Tools & Disclaimers', icon: Cpu },
    { id: 'assessments', label: '5. Assessments & Job Tracker', icon: CheckCircle },
    { id: 'user-content', label: '6. User Content & IP', icon: Scale },
    { id: 'service-availability', label: '7. Service Availability', icon: AlertOctagon },
    { id: 'liability', label: '8. Limitation of Liability', icon: Scale },
    { id: 'termination', label: '9. Suspension & Termination', icon: UserX },
    { id: 'contact-governing', label: '10. Governing Law & Contact', icon: HelpCircle },
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
        title="Terms & Conditions | HireReady"
        description="Read the HireReady Terms & Conditions governing your use of our AI interview preparation platform, aptitude tests, and career resources."
        canonical="/terms"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-600 to-indigo-700 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <FileText className="w-4 h-4 mr-2" />
            Terms & Conditions Agreement
          </div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Terms & Conditions</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-base">
            Please read these terms carefully before using HireReady. They define your legal rights,
            platform rules, and disclaimers regarding AI outputs and interview preparation
            assistance.
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
          {/* Sidebar Navigation */}
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

          {/* Main Legal Content */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-10">
            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  1
                </span>
                Acceptance of Terms
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  By creating an account, browsing, or utilizing the HireReady web application, you
                  agree to comply with and be bound by these Terms &amp; Conditions. If you do not
                  agree to all of these terms, you may not access or use HireReady.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="eligibility" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  2
                </span>
                Eligibility &amp; Account Registration
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  You must be at least 16 years of age (or the legal age of majority in your
                  jurisdiction) to register an account. When registering, you agree to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Provide accurate, current, and complete account details.</li>
                  <li>Maintain the confidentiality of your password and authentication tokens.</li>
                  <li>Promptly notify HireReady of any unauthorized account access.</li>
                  <li>
                    Accept full responsibility for all activities occurring under your credentials.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="acceptable-use" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  3
                </span>
                Acceptable Use Policy
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>You agree not to engage in any prohibited activities on HireReady, including:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Attempting to bypass access controls or authentication mechanisms.</li>
                  <li>Using automated scraping, bots, or unauthorized API access scripts.</li>
                  <li>Uploading malicious code, viruses, or disruptive scripts.</li>
                  <li>
                    Submitting offensive, harassing, or illegal content in community features or
                    feedback prompts.
                  </li>
                  <li>Sharing account credentials with third parties.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 - Important AI Disclaimer */}
            <section id="ai-disclaimer" className="scroll-mt-10">
              <div className="p-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl mb-4">
                <h2 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  4. AI Tools &amp; No Guarantee of Employment Disclaimer
                </h2>
                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                  IMPORTANT: HireReady is an automated educational and interview preparation
                  assistance platform.
                </p>
              </div>

              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  <strong>Nature of Assistance:</strong> Mock interview feedback, AI scoring
                  ratings, resume optimization suggestions, communication analysis, and aptitude
                  solutions generated by HireReady are computer-assisted tools designed for
                  self-improvement and practice purposes.
                </p>
                <p>
                  <strong>No Employment Guarantee:</strong> HireReady does NOT guarantee job
                  placement, successful hiring, interview selection, or specific performance
                  outcomes with any employer. Achieving high practice scores on HireReady does not
                  guarantee performance in real candidate evaluations conducted by hiring entities.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="assessments" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  5
                </span>
                Assessments, Aptitude &amp; Job Tracking Features
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  Assessments, group discussion exercises, and job tracking tools are provided for
                  self-study. HireReady reserves the right to adjust question banks, scoring
                  formulas, or challenge topics to maintain educational standards.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="user-content" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  6
                </span>
                Intellectual Property &amp; User Content
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  <strong>Platform IP:</strong> All code, interface designs, logos, question
                  databases, and algorithms are the property of HireReady.
                </p>
                <p>
                  <strong>User Ownership:</strong> You retain ownership of all original resumes,
                  personal notes, and interview responses you create. By uploading content, you
                  grant HireReady a non-exclusive license strictly to process and display that
                  content to deliver service features to you.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="service-availability" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  7
                </span>
                Service Availability &amp; Modifications
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  While we aim for maximum availability, HireReady is provided on an "as is" and "as
                  available" basis. We reserve the right to perform scheduled maintenance, update
                  features, or temporarily suspend access for upgrades without liability.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="liability" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  8
                </span>
                Limitation of Liability
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  To the maximum extent permitted by applicable law, HireReady shall not be liable
                  for any indirect, incidental, special, consequential, or punitive damages
                  resulting from your access to or inability to access the platform.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="termination" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  9
                </span>
                Account Suspension &amp; Termination
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  HireReady reserves the right to suspend or terminate accounts that violate our
                  Acceptable Use Policy or attempt unauthorized system access. You may terminate
                  your account at any time via Settings.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="contact-governing" className="scroll-mt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-extrabold">
                  10
                </span>
                Governing Law &amp; Support Contact
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  These Terms are governed by applicable local and general digital service
                  standards. For legal questions regarding these Terms, please contact support at:{' '}
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

export default TermsOfService;
