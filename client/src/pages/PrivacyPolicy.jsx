import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e1a] transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <Shield className="w-4 h-4 mr-2" />
            Legal
          </div>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-white/70">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              When you create an account on HireReady, we collect your name, email address, and password (stored securely using encryption). 
              During your use of the platform, we also collect interview responses, practice session data, and performance analytics to provide personalized feedback.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-2">
              <li>Provide and maintain our interview preparation services</li>
              <li>Generate AI-powered feedback on your practice sessions</li>
              <li>Track your progress and provide performance analytics</li>
              <li>Send you important account and service updates</li>
              <li>Improve our platform and develop new features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Data Security</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We implement industry-standard security measures to protect your personal information. Passwords are hashed using bcrypt, 
              and all data transmission is encrypted. We regularly review our security practices to ensure your data remains safe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Data Sharing</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share anonymized, 
              aggregated data for analytics purposes. Your interview responses and personal data are never shared with other users 
              unless you explicitly choose to participate in community features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Your Rights</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You have the right to:</p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-2">
              <li>Access your personal data at any time through your profile settings</li>
              <li>Request correction of any inaccurate information</li>
              <li>Export your data from the Settings page</li>
              <li>Delete your account and all associated data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Cookies</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We use essential cookies to maintain your session and authentication state. We also use localStorage to save your 
              theme preferences and settings. We do not use third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Contact</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hireready007@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">hireready007@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
