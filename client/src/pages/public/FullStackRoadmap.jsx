import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import {
  Code,
  Server,
  Database,
  Layers,
  Cpu,
  UserCheck,
  Calendar,
  CheckSquare,
  ChevronRight,
  BookOpen,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

const FullStackRoadmap = () => {
  const canonicalUrl = 'https://hireready-1-0hvc.onrender.com/full-stack-interview-roadmap';

  // Breadcrumb & Article Structured Data
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
          name: 'Full-Stack Interview Roadmap',
          item: canonicalUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'Full-Stack Developer Interview Roadmap 2026',
      description:
        'A comprehensive 6-week preparation guide covering Frontend, Backend, Databases, System Design, DSA, and Behavioral interviews.',
      url: canonicalUrl,
      author: {
        '@type': 'Organization',
        name: 'HireReady',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <SEO
        title="Full-Stack Developer Interview Roadmap 2026 | HireReady"
        description="Master full-stack developer interviews with our complete 6-week preparation roadmap covering React, Node.js, SQL, System Design, DSA, and Behavioral rounds."
        canonical={canonicalUrl}
        robots="index, follow"
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
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
              Full-Stack Interview Roadmap
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> 2026 Complete Guide
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            Full-Stack Developer Interview Roadmap 2026
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Preparing for a full-stack engineer role requires mastering frontend UI architecture,
            server side backend APIs, relational & NoSQL databases, data structures, system design,
            and behavioral communication. Follow this structured preparation blueprint to land your
            dream job.
          </p>
        </header>

        {/* Roadmap Table of Contents Grid */}
        <section className="mb-12 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" /> Roadmap
            Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <a
              href="#section-1"
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              1. What to Learn
            </a>
            <a
              href="#section-2"
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              2. Frontend Prep (React & JS)
            </a>
            <a
              href="#section-3"
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              3. Backend Prep (Node & APIs)
            </a>
            <a
              href="#section-4"
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              4. Database Prep (SQL & Mongo)
            </a>
            <a
              href="#section-5"
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              5. Data Structures & Algorithms
            </a>
            <a
              href="#section-6"
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              6. System Design Basics
            </a>
            <a
              href="#section-7"
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              7. Behavioral Prep (STAR)
            </a>
            <a
              href="#section-8"
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              8. 6-Week Study Schedule
            </a>
            <a
              href="#section-9"
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              9. Common Sample Questions
            </a>
          </div>
        </section>

        {/* Section 1 */}
        <section id="section-1" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center">
            <Layers className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2.5" />
            1. What to Learn for a Full-Stack Interview
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Full-stack interviews assess your ability to build complete web applications from user
            interface components down to backend microservices and database queries. Most companies
            evaluate candidates across 5 core competency pillars:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
                Frontend Engineering
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                HTML5 semantic structure, CSS layouts, JS ES6+, React Hooks, State Management, and
                web performance optimization.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
                Backend Architecture
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Node.js event loop, Express REST APIs, authentication (JWT/OAuth), middleware
                pipelines, and error handling.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
                Database Systems
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Relational SQL queries (Joins, Indexing, Transactions) and NoSQL Document models
                (MongoDB aggregation).
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
                DSA & System Design
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Array/String manipulation, Tree traversals, Caching (Redis), Load balancing, and
                microservices scalability.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center">
            <Code className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2.5" />
            2. Frontend Preparation
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Frontend interviews focus heavily on DOM manipulation, asynchronous programming,
            closures, and modern framework patterns like React Hooks.
          </p>

          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                JavaScript Core & ES6+
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                Be ready to explain lexical scoping, closure memory references, prototypal
                inheritance, event delegation, and asynchronous Promises / Async-Await execution
                order.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/interview-questions/javascript"
                  className="inline-flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Practice JavaScript Interview Questions{' '}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                React Framework Architecture
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                Focus on Virtual DOM diffing reconciliation, custom Hooks composition (`useMemo`,
                `useCallback`), global state management (Zustand / Redux), and bundle code
                splitting.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/interview-questions/react"
                  className="inline-flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Practice React.js Interview Questions <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center">
            <Server className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2.5" />
            3. Backend Preparation
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Backend rounds test your understanding of event-driven architectures, non-blocking
            asynchronous processing, RESTful design patterns, security middleware, and session
            management.
          </p>

          <div className="space-y-4">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Node.js & Express API Development
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                Understand the libuv event loop phases, non-blocking I/O queues, Express middleware
                chains, JWT authentication mechanisms, and rate limiting security controls.
              </p>
              <Link
                to="/interview-questions/nodejs"
                className="inline-flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Practice Node.js Backend Questions <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Java & Enterprise Services
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                Review core Java OOP principles, collections, multithreading synchronization, and
                JVM memory management.
              </p>
              <Link
                to="/interview-questions/java"
                className="inline-flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Practice Java Developer Questions <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center">
            <Database className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2.5" />
            4. Database Preparation
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Database questions range from writing complex JOIN queries to explaining indexing data
            structures (B-Trees) and data normalization trade-offs.
          </p>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              SQL Relational & NoSQL Systems
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Master SQL joins (INNER, LEFT, RIGHT, FULL), ACID transaction guarantees, indexing
              strategies, group aggregations, and MongoDB document relationships.
            </p>
            <Link
              to="/interview-questions/sql"
              className="inline-flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Practice SQL & Database Questions <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </section>

        {/* Section 5 */}
        <section id="section-5" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center">
            <Cpu className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2.5" />
            5. Data Structures & Algorithms (DSA)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Focus problem-solving prep on fundamental data structures and algorithmic patterns
            frequently asked in full-stack coding rounds:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-medium">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              Arrays & Two Pointers
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              Strings & Sliding Window
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              HashMap & HashSets
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              LinkedLists & Stacks
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              Binary Trees & BFS/DFS
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              Dynamic Programming
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="section-6" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center">
            <Layers className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2.5" />
            6. System Design Basics
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            System design interviews test high-level architectural decision-making:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
            <li>
              <strong>Client-Server & REST:</strong> Stateless API design, HTTP status codes,
              headers, and CORS rules.
            </li>
            <li>
              <strong>Caching Strategies:</strong> Redis in-memory caching, CDN edge caching, and
              cache invalidation policies.
            </li>
            <li>
              <strong>Load Balancing:</strong> Round-robin, least-connections, and horizontal
              auto-scaling.
            </li>
            <li>
              <strong>Database Scalability:</strong> Read replicas, master-slave replication, and
              database sharding.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section id="section-7" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center">
            <UserCheck className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2.5" />
            7. Behavioral Interview Preparation (STAR Method)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Structure behavioral answers using the <strong>STAR Method</strong> (Situation, Task,
            Action, Result) for questions on conflict resolution, technical tradeoffs, and project
            accomplishments.
          </p>
        </section>

        {/* Section 8 */}
        <section id="section-8" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center">
            <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2.5" />
            8. 6-Week Practical Preparation Timeline
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <strong className="text-primary-600 dark:text-primary-400 font-bold block mb-1">
                Week 1: Modern JavaScript & ES6 Core
              </strong>
              Master closures, event loop, promises, async/await, and DOM manipulation.
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <strong className="text-primary-600 dark:text-primary-400 font-bold block mb-1">
                Week 2: React Architecture & State
              </strong>
              Practice custom Hooks, Virtual DOM, and state management patterns.
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <strong className="text-primary-600 dark:text-primary-400 font-bold block mb-1">
                Week 3: Node.js & Express REST APIs
              </strong>
              Build asynchronous Express endpoints with JWT auth middleware and error handling.
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <strong className="text-primary-600 dark:text-primary-400 font-bold block mb-1">
                Week 4: SQL & NoSQL Database Optimization
              </strong>
              Write complex SQL joins, indexing strategies, and MongoDB aggregations.
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <strong className="text-primary-600 dark:text-primary-400 font-bold block mb-1">
                Week 5: Data Structures & System Design Basics
              </strong>
              Solve top array/tree DSA problems and review caching & load balancing principles.
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <strong className="text-primary-600 dark:text-primary-400 font-bold block mb-1">
                Week 6: Interactive AI Mock Interviews
              </strong>
              Take full timed AI mock interviews on HireReady to practice verbal delivery under
              pressure.
            </div>
          </div>
        </section>

        {/* Section 9 */}
        <section id="section-9" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center">
            <CheckSquare className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2.5" />
            9. Common Full-Stack Interview Questions
          </h2>
          <div className="space-y-4">
            <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-2">
                Q1: How does CORS work and how do you configure it in Node/Express?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                CORS (Cross-Origin Resource Sharing) is a browser security mechanism that uses HTTP
                headers to determine whether a browser can load resources from a domain different
                from the origin server. In Express, configure CORS using the `cors` middleware
                package.
              </p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-2">
                Q2: What is the difference between SQL `INNER JOIN` and `LEFT JOIN`?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                `INNER JOIN` returns only records that match in both tables. `LEFT JOIN` returns all
                records from the left table along with matching records from the right table
                (filling un-matched right values with `NULL`).
              </p>
            </div>
          </div>
          <div className="mt-6 text-center sm:text-left">
            <Link
              to="/interview-questions"
              className="inline-flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Explore All Technical Interview Categories <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between shadow-xl">
          <div className="mb-6 sm:mb-0 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
              Ready to Practice Full-Stack AI Interviews?
            </h2>
            <p className="text-primary-100 text-sm sm:text-base">
              Test your full-stack knowledge in live interactive AI mock interviews with instant
              speech evaluation and technical scoring.
            </p>
          </div>
          <Link
            to="/signup"
            className="px-6 py-3.5 rounded-xl bg-white text-primary-600 font-bold hover:bg-slate-100 transition-colors shadow-lg min-h-[48px] inline-flex items-center justify-center whitespace-nowrap"
          >
            Start Free Mock Interview <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default FullStackRoadmap;
