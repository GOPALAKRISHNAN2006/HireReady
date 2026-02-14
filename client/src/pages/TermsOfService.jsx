import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e1a] transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <FileText className="w-4 h-4 mr-2" />
            Legal
          </div>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              By accessing and using HireReady, you agree to be bound by these Terms of Service. If you do not agree to these terms, 
              please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Description of Service</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              HireReady is an AI-powered interview preparation platform that provides mock interviews, skill assessments, 
              performance analytics, and learning resources to help users prepare for job interviews.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. User Accounts</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You are responsible for:</p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete registration information</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Acceptable Use</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You agree not to:</p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Share your account with others or create multiple accounts</li>
              <li>Attempt to reverse engineer or exploit the platform</li>
              <li>Upload harmful, offensive, or inappropriate content</li>
              <li>Interfere with the service or other users' experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. AI-Generated Content</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Our platform uses AI to generate interview questions, feedback, and recommendations. While we strive for accuracy, 
              AI-generated content is provided for educational purposes and should not be considered professional career advice. 
              Users should use their own judgment when applying suggestions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Intellectual Property</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              All content, features, and functionality of HireReady — including the design, text, graphics, and software — are owned by 
              HireReady and are protected by intellectual property laws. Your interview responses and personal data remain your property.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              HireReady is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use 
              of the platform, including but not limited to interview outcomes or career decisions made based on our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Changes to Terms</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of significant changes via email or 
              platform notifications. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. Contact</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:hireready007@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">hireready007@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
