import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageSquare, Github } from 'lucide-react'

const Contact = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e1a] transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Get in Touch
          </div>
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-white/70">We'd love to hear from you</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Email Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email Us</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              For general inquiries, feedback, or support — reach out and we'll get back to you as soon as possible.
            </p>
            <a 
              href="mailto:hireready007@gmail.com" 
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              hireready007@gmail.com
            </a>
          </div>

          {/* GitHub Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-slate-500/20">
              <Github className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">GitHub</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Found a bug or have a feature request? Open an issue on our GitHub repository.
            </p>
            <a 
              href="https://github.com/GOPALAKRISHNAN2006/HireReady" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              View on GitHub →
            </a>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Have a Question?</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Check out our <Link to="/help" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Help Center</Link> for 
            answers to frequently asked questions, or join our <Link to="/community" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Community Hub</Link> to 
            connect with other users.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Contact
