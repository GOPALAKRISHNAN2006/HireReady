import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { TECH_CATEGORIES, PUBLIC_QUESTIONS } from '../../data/publicQuestionsData';
import {
  Code,
  Server,
  Database,
  Coffee,
  Atom,
  Search,
  BookOpen,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

const ICON_MAP = {
  Coffee: Coffee,
  Code: Code,
  Atom: Atom,
  Server: Server,
  Database: Database,
};

const PublicQuestionsDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = Object.values(TECH_CATEGORIES);

  // Filter questions based on search term
  const allFilteredQuestions = Object.entries(PUBLIC_QUESTIONS).flatMap(
    ([categoryKey, questions]) => {
      const categoryInfo = TECH_CATEGORIES[categoryKey];
      return questions
        .filter(
          q =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.section.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(q => ({ ...q, categoryKey, categoryTitle: categoryInfo?.title }));
    }
  );

  // Breadcrumb structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://hireready-1-0hvc.onrender.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Interview Questions',
        item: 'https://hireready-1-0hvc.onrender.com/interview-questions',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <SEO
        title="Technical Interview Questions | HireReady"
        description="Practice curated technical interview questions across Java, JavaScript, React, Node.js, and SQL with detailed explanations and code examples."
        canonical="https://hireready-1-0hvc.onrender.com/interview-questions"
        robots="index, follow"
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link
                to="/"
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </li>
            <li className="font-semibold text-slate-900 dark:text-slate-100" aria-current="page">
              Interview Questions
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Curated Tech Interview Prep</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Technical Interview Questions
          </h1>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200">
            Explore curated interview questions with in-depth answers, explanations, and code
            snippets across top programming technologies.
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search questions by keyword (e.g. closures, joins, virtual dom)..."
              aria-label="Search technical interview questions"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </header>

        {/* Categories Grid */}
        {!searchTerm && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
              Browse Technologies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => {
                const IconComponent = ICON_MAP[cat.iconName] || BookOpen;
                const questionCount = PUBLIC_QUESTIONS[cat.slug]?.length || 0;

                return (
                  <Link
                    key={cat.slug}
                    to={`/interview-questions/${cat.slug}`}
                    className="group relative p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-primary-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {cat.badge}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-slate-700 dark:text-slate-200 mb-4 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span>{questionCount} Key Questions</span>
                      <span className="inline-flex items-center text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
                        Explore <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Search Results / Featured Questions Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {searchTerm ? `Search Results (${allFilteredQuestions.length})` : 'Popular Questions'}
            </h2>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          <div className="space-y-4">
            {allFilteredQuestions.slice(0, 10).map(q => (
              <article
                key={q.id}
                className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-2 text-xs font-semibold mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400">
                    {q.categoryTitle}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400">{q.section}</span>
                  <span className="text-slate-400">•</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      q.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : q.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {q.question}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line mb-3">
                  {q.answer}
                </p>

                {q.codeSnippet && (
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs overflow-x-auto font-mono mb-3">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                  <span className="inline-flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1" /> Verified
                    Educational Answer
                  </span>
                  <Link
                    to={`/interview-questions/${q.categoryKey}`}
                    className="text-primary-600 dark:text-primary-400 font-semibold hover:underline inline-flex items-center"
                  >
                    View All {q.categoryTitle} Questions{' '}
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                </div>
              </article>
            ))}

            {allFilteredQuestions.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                  No questions match "{searchTerm}"
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try searching for closures, joins, useEffect, or multithreading.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between shadow-xl">
          <div className="mb-6 sm:mb-0 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
              Ready to Practice AI Mock Interviews?
            </h2>
            <p className="text-primary-100 text-sm sm:text-base">
              Take interactive AI-powered mock technical & HR interviews with real-time scoring,
              speech analysis, and customized feedback.
            </p>
          </div>
          <Link
            to="/signup"
            className="px-6 py-3.5 rounded-xl bg-white text-primary-600 font-bold hover:bg-slate-100 transition-colors shadow-lg min-h-[48px] inline-flex items-center justify-center whitespace-nowrap"
          >
            Get Started Free
          </Link>
        </section>
      </main>
    </div>
  );
};

export default PublicQuestionsDirectory;
