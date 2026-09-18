import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import { TECH_CATEGORIES, PUBLIC_QUESTIONS } from '../../data/publicQuestionsData';
import {
  Code,
  Server,
  Database,
  Coffee,
  Atom,
  ChevronRight,
  Search,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP = {
  Coffee: Coffee,
  Code: Code,
  Atom: Atom,
  Server: Server,
  Database: Database,
};

const PublicQuestionCategory = () => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');

  const categorySlug = category?.toLowerCase();
  const categoryInfo = TECH_CATEGORIES[categorySlug];
  const questionsList = PUBLIC_QUESTIONS[categorySlug] || [];

  if (!categoryInfo) {
    return <Navigate to="/interview-questions" replace />;
  }

  const topicName = categoryInfo.topicName || categoryInfo.title.replace(' Questions', '');
  const displayH1 = categoryInfo.h1Title || `${topicName} Technical Interview Questions & Answers`;

  const IconComponent = ICON_MAP[categoryInfo.iconName] || BookOpen;

  // Filter questions by section and search term
  const filteredQuestions = questionsList.filter(q => {
    const matchesSection = selectedSection === 'All' || q.section === selectedSection;
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.section.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const canonicalUrl = `https://hireready-1-0hvc.onrender.com/interview-questions/${categorySlug}`;

  const article = ['a', 'e', 'i', 'o', 'u', 'sql'].some(v => topicName.toLowerCase().startsWith(v))
    ? 'an'
    : 'a';

  const faqItems = [
    {
      q: `How should I prepare for ${article} ${topicName} technical interview?`,
      a: `Start by mastering core concepts in ${categoryInfo.sections.join(', ')}. Review standard question patterns, write working code examples by hand, and practice interactive mock interviews to build speed and verbal communication confidence.`,
    },
    {
      q: `Are these ${topicName} interview questions suitable for freshers and experienced developers?`,
      a: `Yes. All interview questions, code snippets, and explanations are structured for candidates across experience levels—from fundamental mechanics for freshers to advanced architectural concepts for senior engineers.`,
    },
    {
      q: `What ${topicName} topics should I study before an interview?`,
      a: `Focus on core areas including ${categoryInfo.sections.join(', ')}. Practice writing code snippets, understanding runtime mechanics, and practicing interactive mock interview sessions on HireReady.`,
    },
  ];

  // Structured Data (Breadcrumb & FAQPage)
  const jsonLd = [
    {
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
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryInfo.title,
          item: canonicalUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <SEO
        title={categoryInfo.metaTitle}
        description={categoryInfo.metaDescription}
        canonical={canonicalUrl}
        robots="index, follow"
      />

      {/* JSON-LD Structured Data */}
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
            <li>
              <Link
                to="/interview-questions"
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Interview Questions
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </li>
            <li className="font-semibold text-slate-900 dark:text-slate-100" aria-current="page">
              {categoryInfo.title}
            </li>
          </ol>
        </nav>

        {/* Back Link */}
        <Link
          to="/interview-questions"
          className="inline-flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> All Interview Categories
        </Link>

        {/* Category Header */}
        <header className="p-8 sm:p-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
            <div className="p-4 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 shrink-0">
              <IconComponent className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                  {displayH1}
                </h1>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400">
                  {questionsList.length} Questions
                </span>
              </div>
              <p className="mt-2 text-base text-slate-700 dark:text-slate-200 max-w-3xl">
                {categoryInfo.description}
              </p>
            </div>
          </div>

          {/* Section Filter Pills */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Frequently Asked {topicName} Interview Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSection('All')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedSection === 'All'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                All Sections
              </button>
              {categoryInfo.sections.map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedSection === sec
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Question List */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {topicName} Technical Interview Questions ({filteredQuestions.length})
            </h2>

            {/* Keyword Search */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={`Filter ${categoryInfo.title}...`}
                aria-label={`Search ${categoryInfo.title}`}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {filteredQuestions.map((q, idx) => (
            <article
              id={`q-${idx + 1}`}
              key={q.id}
              className="p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-xs font-semibold">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400">
                    Q{idx + 1}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400">{q.section}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
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

              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                {q.question}
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Answer
                </h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {q.answer}
                </p>
              </div>

              {q.explanation && (
                <div className="mb-4 text-xs text-slate-700 dark:text-slate-200 bg-amber-500/5 dark:bg-amber-500/10 border-l-4 border-amber-500 p-3.5 rounded-r-xl">
                  <strong className="font-semibold text-amber-700 dark:text-amber-400">
                    Key Insight:{' '}
                  </strong>
                  {q.explanation}
                </div>
              )}

              {q.codeSnippet && (
                <div className="mb-4">
                  <div className="text-xs font-mono text-slate-400 mb-1 px-1">Example Code:</div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs overflow-x-auto font-mono">
                    <code>{q.codeSnippet}</code>
                  </pre>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1" /> Verified{' '}
                  {categoryInfo.title} Answer
                </span>
                {idx < filteredQuestions.length - 1 && (
                  <a
                    href={`#q-${idx + 2}`}
                    className="text-primary-600 dark:text-primary-400 font-semibold hover:underline inline-flex items-center"
                  >
                    Next Question in {q.section} <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                )}
              </div>
            </article>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                No questions found matching your filter criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedSection('All');
                  setSearchTerm('');
                }}
                className="mt-3 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Frequently Asked Questions (FAQ) Section */}
        <section className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            {topicName} Interview Preparation Guide & FAQs
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80"
              >
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {item.q}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Interview Topics Section */}
        <section className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Related Interview Topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(TECH_CATEGORIES)
              .filter(cat => cat.slug !== categorySlug)
              .map(cat => (
                <Link
                  key={cat.slug}
                  to={`/interview-questions/${cat.slug}`}
                  className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-primary-500 hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {cat.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-semibold">
            <Link
              to="/interview-questions"
              className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> All Technical Interview Categories
            </Link>
            <Link
              to="/full-stack-interview-roadmap"
              className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center"
            >
              Full-Stack Developer Interview Roadmap 2026 <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublicQuestionCategory;
