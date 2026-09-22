/**
 * SEO Route Definitions & Metadata Configurations
 * Base Domain: https://hireready-1-0hvc.onrender.com
 */

const BASE_URL = 'https://hireready-1-0hvc.onrender.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.webp`;

const PUBLIC_SEO_ROUTES = {
  '/': {
    title: 'HireReady | AI-Powered Interview Practice & Mock Interviews',
    description:
      "Ace technical and HR interviews with HireReady's AI-powered mock interviews, real-time feedback, skill assessments, and practice tests.",
    canonical: `${BASE_URL}/`,
    robots: 'index, follow',
    ogTitle: 'HireReady | AI-Powered Interview Practice & Mock Interviews',
    ogDescription:
      "Ace technical and HR interviews with HireReady's AI-powered mock interviews, real-time feedback, skill assessments, and practice tests.",
    ogUrl: `${BASE_URL}/`,
  },
  '/interview-questions': {
    title: 'Technical Interview Questions | HireReady',
    description:
      'Practice curated technical interview questions across Java, JavaScript, React, Node.js, and SQL with detailed explanations and code examples.',
    canonical: `${BASE_URL}/interview-questions`,
    robots: 'index, follow',
    ogTitle: 'Technical Interview Questions | HireReady',
    ogDescription:
      'Practice curated technical interview questions across Java, JavaScript, React, Node.js, and SQL with detailed explanations and code examples.',
    ogUrl: `${BASE_URL}/interview-questions`,
  },
  '/interview-questions/javascript': {
    title: 'JavaScript Interview Questions & Answers (2026) | HireReady',
    description:
      'Practice top JavaScript technical interview questions and answers. Master closures, Event Loop, promises, ES6+ coding snippets, and core JS concepts for freshers & pros.',
    canonical: `${BASE_URL}/interview-questions/javascript`,
    robots: 'index, follow',
    ogTitle: 'JavaScript Interview Questions & Answers (2026) | HireReady',
    ogDescription:
      'Practice top JavaScript technical interview questions and answers. Master closures, Event Loop, promises, ES6+ coding snippets, and core JS concepts for freshers & pros.',
    ogUrl: `${BASE_URL}/interview-questions/javascript`,
  },
  '/interview-questions/react': {
    title: 'React Interview Questions & Answers (2026) | HireReady',
    description:
      'Practice React technical interview questions and answers covering Hooks, components, state management, Virtual DOM, performance, and modern React concepts.',
    canonical: `${BASE_URL}/interview-questions/react`,
    robots: 'index, follow',
    ogTitle: 'React Interview Questions & Answers (2026) | HireReady',
    ogDescription:
      'Practice React technical interview questions and answers covering Hooks, components, state management, Virtual DOM, performance, and modern React concepts.',
    ogUrl: `${BASE_URL}/interview-questions/react`,
  },
  '/interview-questions/nodejs': {
    title: 'Node.js Interview Questions & Answers (2026) | HireReady',
    description:
      'Practice Node.js technical interview questions covering the Event Loop, Express.js, REST APIs, asynchronous programming, streams, authentication, and backend concepts.',
    canonical: `${BASE_URL}/interview-questions/nodejs`,
    robots: 'index, follow',
    ogTitle: 'Node.js Interview Questions & Answers (2026) | HireReady',
    ogDescription:
      'Practice Node.js technical interview questions covering the Event Loop, Express.js, REST APIs, asynchronous programming, streams, authentication, and backend concepts.',
    ogUrl: `${BASE_URL}/interview-questions/nodejs`,
  },
  '/interview-questions/java': {
    title: 'Java Interview Questions & Answers (2026) | HireReady',
    description:
      'Practice Java technical interview questions covering OOP, Collections, exception handling, multithreading, JVM concepts, and core Java programming.',
    canonical: `${BASE_URL}/interview-questions/java`,
    robots: 'index, follow',
    ogTitle: 'Java Interview Questions & Answers (2026) | HireReady',
    ogDescription:
      'Practice Java technical interview questions covering OOP, Collections, exception handling, multithreading, JVM concepts, and core Java programming.',
    ogUrl: `${BASE_URL}/interview-questions/java`,
  },
  '/interview-questions/sql': {
    title: 'SQL Interview Questions & Answers (2026) | HireReady',
    description:
      'Practice SQL technical interview questions covering joins, subqueries, indexing, transactions, normalization, SQL queries, and essential database concepts.',
    canonical: `${BASE_URL}/interview-questions/sql`,
    robots: 'index, follow',
    ogTitle: 'SQL Interview Questions & Answers (2026) | HireReady',
    ogDescription:
      'Practice SQL technical interview questions covering joins, subqueries, indexing, transactions, normalization, SQL queries, and essential database concepts.',
    ogUrl: `${BASE_URL}/interview-questions/sql`,
  },
  '/full-stack-interview-roadmap': {
    title: 'Full-Stack Developer Interview Roadmap 2026 | HireReady',
    description:
      'Master full-stack developer interviews with our complete 6-week preparation roadmap covering React, Node.js, SQL, System Design, DSA, and Behavioral rounds.',
    canonical: `${BASE_URL}/full-stack-interview-roadmap`,
    robots: 'index, follow',
    ogTitle: 'Full-Stack Developer Interview Roadmap 2026 | HireReady',
    ogDescription:
      'Master full-stack developer interviews with our complete 6-week preparation roadmap covering React, Node.js, SQL, System Design, DSA, and Behavioral rounds.',
    ogUrl: `${BASE_URL}/full-stack-interview-roadmap`,
  },
  '/privacy': {
    title: 'Privacy Policy | HireReady',
    description:
      'Learn how HireReady collects, uses, and safeguards your profile data, interview responses, resume information, and privacy settings.',
    canonical: `${BASE_URL}/privacy`,
    robots: 'index, follow',
    ogTitle: 'Privacy Policy | HireReady',
    ogDescription:
      'Learn how HireReady collects, uses, and safeguards your profile data, interview responses, resume information, and privacy settings.',
    ogUrl: `${BASE_URL}/privacy`,
  },
  '/privacy-policy': {
    title: 'Privacy Policy | HireReady',
    description:
      'Learn how HireReady collects, uses, and safeguards your profile data, interview responses, resume information, and privacy settings.',
    canonical: `${BASE_URL}/privacy`,
    robots: 'index, follow',
    ogTitle: 'Privacy Policy | HireReady',
    ogDescription:
      'Learn how HireReady collects, uses, and safeguards your profile data, interview responses, resume information, and privacy settings.',
    ogUrl: `${BASE_URL}/privacy`,
  },
  '/terms': {
    title: 'Terms & Conditions | HireReady',
    description:
      'Read the HireReady Terms & Conditions governing your use of our AI interview preparation platform, aptitude tests, and career resources.',
    canonical: `${BASE_URL}/terms`,
    robots: 'index, follow',
    ogTitle: 'Terms & Conditions | HireReady',
    ogDescription:
      'Read the HireReady Terms & Conditions governing your use of our AI interview preparation platform, aptitude tests, and career resources.',
    ogUrl: `${BASE_URL}/terms`,
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | HireReady',
    description:
      'Read the HireReady Terms & Conditions governing your use of our AI interview preparation platform, aptitude tests, and career resources.',
    canonical: `${BASE_URL}/terms`,
    robots: 'index, follow',
    ogTitle: 'Terms & Conditions | HireReady',
    ogDescription:
      'Read the HireReady Terms & Conditions governing your use of our AI interview preparation platform, aptitude tests, and career resources.',
    ogUrl: `${BASE_URL}/terms`,
  },
  '/contact': {
    title: 'Contact Us | HireReady',
    description:
      'Get in touch with the HireReady team for support, feedback, or inquiries about our AI interview preparation platform.',
    canonical: `${BASE_URL}/contact`,
    robots: 'index, follow',
    ogTitle: 'Contact Us | HireReady',
    ogDescription:
      'Get in touch with the HireReady team for support, feedback, or inquiries about our AI interview preparation platform.',
    ogUrl: `${BASE_URL}/contact`,
  },
  '/cookie-preferences': {
    title: 'Cookie Preferences | HireReady',
    description: 'Manage your privacy settings and cookie consent choices for HireReady.',
    canonical: `${BASE_URL}/cookie-preferences`,
    robots: 'index, follow',
    ogTitle: 'Cookie Preferences | HireReady',
    ogDescription: 'Manage your privacy settings and cookie consent choices for HireReady.',
    ogUrl: `${BASE_URL}/cookie-preferences`,
  },
  '/login': {
    title: 'Sign In | HireReady',
    description:
      'Sign in to your HireReady account to practice AI mock interviews and view your progress.',
    canonical: `${BASE_URL}/login`,
    robots: 'index, follow',
    ogTitle: 'Sign In | HireReady',
    ogDescription:
      'Sign in to your HireReady account to practice AI mock interviews and view your progress.',
    ogUrl: `${BASE_URL}/login`,
  },
  '/signup': {
    title: 'Get Started | HireReady',
    description:
      'Create a free HireReady account to practice technical interviews, aptitude tests, and build ATS resumes.',
    canonical: `${BASE_URL}/signup`,
    robots: 'index, follow',
    ogTitle: 'Get Started | HireReady',
    ogDescription:
      'Create a free HireReady account to practice technical interviews, aptitude tests, and build ATS resumes.',
    ogUrl: `${BASE_URL}/signup`,
  },
  '/forgot-password': {
    title: 'Forgot Password | HireReady',
    description: 'Reset your HireReady account password.',
    canonical: `${BASE_URL}/forgot-password`,
    robots: 'index, follow',
    ogTitle: 'Forgot Password | HireReady',
    ogDescription: 'Reset your HireReady account password.',
    ogUrl: `${BASE_URL}/forgot-password`,
  },
  '/help': {
    title: 'Help Center | HireReady',
    description: 'Find answers to common questions and guides for using HireReady.',
    canonical: `${BASE_URL}/help`,
    robots: 'index, follow',
    ogTitle: 'Help Center | HireReady',
    ogDescription: 'Find answers to common questions and guides for using HireReady.',
    ogUrl: `${BASE_URL}/help`,
  },
  '/support': {
    title: 'Help Center | HireReady',
    description: 'Find answers to common questions and guides for using HireReady.',
    canonical: `${BASE_URL}/help`,
    robots: 'index, follow',
    ogTitle: 'Help Center | HireReady',
    ogDescription: 'Find answers to common questions and guides for using HireReady.',
    ogUrl: `${BASE_URL}/help`,
  },
};

// Patterns for private/authenticated routes that must be marked noindex
const PRIVATE_ROUTE_PREFIXES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/analytics',
  '/resume',
  '/aptitude',
  '/gd',
  '/admin',
  '/interview',
  '/questions',
  '/history',
  '/notifications',
  '/saved',
  '/company',
  '/company-prep',
  '/study-materials',
  '/roadmap',
  '/skills',
  '/tips',
  '/community',
  '/daily-challenge',
  '/communication',
  '/study-plan',
  '/mock-lab',
  '/lab',
  '/interview-lab',
  '/ai-chat',
  '/notes',
  '/progress',
  '/flashcards',
  '/leaderboard',
  '/achievements',
  '/access-denied',
  '/maintenance',
];

/**
 * Resolves SEO metadata for a given path
 * @param {string} rawPath
 * @returns {object} metadata
 */
function getSeoMetadataForPath(rawPath) {
  // Normalize trailing slashes (except root)
  const cleanPath = rawPath === '/' ? '/' : rawPath.replace(/\/$/, '');

  // 1. Direct match in public route dictionary
  if (PUBLIC_SEO_ROUTES[cleanPath]) {
    return {
      ...PUBLIC_SEO_ROUTES[cleanPath],
      ogImage: DEFAULT_OG_IMAGE,
      twitterImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
    };
  }

  // 2. Check if private/authenticated route
  const isPrivate = PRIVATE_ROUTE_PREFIXES.some(
    prefix => cleanPath === prefix || cleanPath.startsWith(`${prefix}/`)
  );

  if (isPrivate) {
    const pageTitle = cleanPath
      .split('/')
      .filter(Boolean)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' - ');

    return {
      title: `${pageTitle || 'Dashboard'} | HireReady`,
      description: 'HireReady AI Interview Preparation Portal',
      canonical: `${BASE_URL}${cleanPath}`,
      robots: 'noindex, nofollow',
      ogTitle: `${pageTitle || 'Dashboard'} | HireReady`,
      ogDescription: 'HireReady AI Interview Preparation Portal',
      ogUrl: `${BASE_URL}${cleanPath}`,
      ogImage: DEFAULT_OG_IMAGE,
      twitterImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
    };
  }

  // 3. Fallback for any unknown route
  return {
    title: 'HireReady | AI-Powered Interview Practice & Mock Interviews',
    description:
      "Ace technical and HR interviews with HireReady's AI-powered mock interviews, real-time feedback, skill assessments, and practice tests.",
    canonical: `${BASE_URL}${cleanPath}`,
    robots: 'noindex, follow',
    ogTitle: 'HireReady | AI-Powered Interview Practice & Mock Interviews',
    ogDescription:
      "Ace technical and HR interviews with HireReady's AI-powered mock interviews, real-time feedback, skill assessments, and practice tests.",
    ogUrl: `${BASE_URL}${cleanPath}`,
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
  };
}

/**
 * Generates unique semantic pre-rendered HTML body for public routes
 * to prevent duplicate content issues in Search Engines & LLM crawlers.
 * @param {string} rawPath
 * @returns {string} Pre-rendered body HTML
 */
function getPreRenderedBodyForPath(rawPath) {
  const cleanPath = rawPath === '/' ? '/' : rawPath.replace(/\/$/, '');

  const commonHeader = `
      <header>
        <nav aria-label="Main Navigation">
          <a href="/">HireReady</a> |
          <a href="/interview-questions">Interview Questions</a> |
          <a href="/full-stack-interview-roadmap">Full-Stack Roadmap</a> |
          <a href="/login">Login</a> |
          <a href="/signup">Sign Up</a>
        </nav>
      </header>`;

  const commonFooter = `
      <footer>
        <p>© 2026 HireReady. All rights reserved. Contact: hireready007@gmail.com</p>
        <nav aria-label="Footer Navigation">
          <a href="/">Home</a> |
          <a href="/interview-questions">Interview Questions</a> |
          <a href="/full-stack-interview-roadmap">Full-Stack Roadmap</a> |
          <a href="/privacy">Privacy Policy</a> |
          <a href="/terms">Terms & Conditions</a> |
          <a href="/contact">Contact Us</a>
        </nav>
      </footer>`;

  switch (cleanPath) {
    case '/':
      return `
      ${commonHeader}
      <main>
        <section>
          <h1>Ace Your Next Technical & HR Interview with HireReady</h1>
          <p>HireReady is an AI-powered mock interview platform providing real-time evaluation, instant feedback, skill radar analytics, and ATS resume optimization.</p>
          <a href="/signup">Start Free Practice</a>
          <a href="/login">Login to Account</a>
        </section>
        <section>
          <h2>Platform Features & Capabilities</h2>
          <ul>
            <li><strong>AI Mock Interviews</strong>: Voice & text technical and behavioral mock interview sessions.</li>
            <li><strong>Skill Radar & Analytics</strong>: Benchmark performance across algorithms, frameworks, and communication.</li>
            <li><strong>Aptitude Test Assessments</strong>: Quantitative, logical, and verbal practice modules.</li>
            <li><strong>Group Discussion Simulator</strong>: Multi-agent interactive AI group discussions.</li>
            <li><strong>ATS Resume Builder</strong>: Job description keyword matcher and ATS resume optimizer.</li>
          </ul>
        </section>
        <section>
          <h2>Featured Technical Interview Question Guides</h2>
          <ul>
            <li><a href="/interview-questions/javascript">JavaScript Interview Questions & Answers</a></li>
            <li><a href="/interview-questions/react">React Developer Interview Questions</a></li>
            <li><a href="/interview-questions/nodejs">Node.js Backend Interview Questions</a></li>
            <li><a href="/interview-questions/java">Java Developer Interview Questions</a></li>
            <li><a href="/interview-questions/sql">SQL & Database Interview Questions</a></li>
            <li><a href="/full-stack-interview-roadmap">Full-Stack Developer Interview Roadmap 2026</a></li>
          </ul>
        </section>
        <section>
          <h2>Frequently Asked Questions</h2>
          <article>
            <h3>How does HireReady AI interview feedback work?</h3>
            <p>HireReady evaluates candidate speech and text responses using NLP algorithms, providing instant clarity, accuracy scores, and model answers.</p>
          </article>
        </section>
      </main>
      ${commonFooter}`;

    case '/interview-questions':
      return `
      ${commonHeader}
      <main>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <span>Interview Questions</span>
        </nav>
        <section>
          <h1>Technical Interview Questions & Answers Directory (2026)</h1>
          <p>Master technical interview preparation with curated, verified question sets across frontend, backend, databases, and core software engineering concepts.</p>
        </section>
        <section>
          <h2>Browse Questions by Category</h2>
          <article>
            <h3><a href="/interview-questions/javascript">JavaScript Interview Questions</a></h3>
            <p>Practice top JavaScript technical questions on Closures, Event Loop, Promises, Async/Await, Scope, and ES6+ features.</p>
          </article>
          <article>
            <h3><a href="/interview-questions/react">React Interview Questions</a></h3>
            <p>Master React technical interviews covering Hooks, Virtual DOM, State Management, Custom Hooks, and Performance Optimization.</p>
          </article>
          <article>
            <h3><a href="/interview-questions/nodejs">Node.js Interview Questions</a></h3>
            <p>Prepare for backend Node.js interviews covering Event Loop, Express.js middleware, REST APIs, streams, and authentication.</p>
          </article>
          <article>
            <h3><a href="/interview-questions/java">Java Interview Questions</a></h3>
            <p>Study core Java questions covering Object-Oriented Programming (OOP), Collections Framework, JVM architecture, multithreading, and exceptions.</p>
          </article>
          <article>
            <h3><a href="/interview-questions/sql">SQL & Database Interview Questions</a></h3>
            <p>Review essential SQL interview questions covering JOINs, Subqueries, Indexing, Transactions (ACID), and Database Normalization.</p>
          </article>
        </section>
        <section>
          <h2>Recommended Preparation Resources</h2>
          <p>Explore our complete <a href="/full-stack-interview-roadmap">Full-Stack Developer Interview Roadmap</a> to plan your preparation timeline.</p>
        </section>
      </main>
      ${commonFooter}`;

    case '/interview-questions/javascript':
      return `
      ${commonHeader}
      <main>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <a href="/interview-questions">Interview Questions</a> &gt; <span>JavaScript</span>
        </nav>
        <section>
          <h1>JavaScript Technical Interview Questions & Answers (2026)</h1>
          <p>Comprehensive JavaScript technical interview preparation guide covering closures, event loop execution, asynchronous programming, prototypes, and modern ES6+ coding patterns.</p>
        </section>
        <section>
          <h2>Key JavaScript Interview Topics & Questions</h2>
          <article>
            <h3>Q1: What is a closure in JavaScript and how does it work?</h3>
            <p>A closure is a function bundled together with references to its surrounding lexical environment, allowing inner functions to retain access to outer variables even after the outer function has executed.</p>
            <pre><code>function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}</code></pre>
          </article>
          <article>
            <h3>Q2: How does the JavaScript Event Loop handle asynchronous code?</h3>
            <p>JavaScript is single-threaded. The Event Loop monitors the Call Stack, Task Queue (MacroTasks like setTimeout), and Microtask Queue (Promises). Microtasks execute before Macrotasks whenever the call stack is empty.</p>
          </article>
          <article>
            <h3>Q3: What is the difference between var, let, and const?</h3>
            <p>var is function-scoped and hoisted with undefined initialization. let and const are block-scoped and reside in the Temporal Dead Zone until initialized. const prevents variable reassignment.</p>
          </article>
        </section>
        <section>
          <h2>Related Tech Categories</h2>
          <ul>
            <li><a href="/interview-questions/react">React Interview Questions</a></li>
            <li><a href="/interview-questions/nodejs">Node.js Interview Questions</a></li>
            <li><a href="/interview-questions">All Categories</a></li>
          </ul>
        </section>
      </main>
      ${commonFooter}`;

    case '/interview-questions/react':
      return `
      ${commonHeader}
      <main>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <a href="/interview-questions">Interview Questions</a> &gt; <span>React</span>
        </nav>
        <section>
          <h1>React Technical Interview Questions & Answers (2026)</h1>
          <p>Master React developer interviews with core concept explanations covering Virtual DOM diffing, Hooks mechanics, state management patterns, and performance optimizations.</p>
        </section>
        <section>
          <h2>Key React Interview Questions</h2>
          <article>
            <h3>Q1: How does React Virtual DOM and reconciliation work?</h3>
            <p>React builds an in-memory Virtual DOM representation. On state change, React compares (diffs) the new Virtual DOM tree against the previous snapshot and efficiently updates only changed nodes in the real DOM.</p>
          </article>
          <article>
            <h3>Q2: What are the rules and advantages of React Hooks?</h3>
            <p>Hooks allow functional components to manage state and side effects. Rules require calling Hooks at the top level of React functions without nesting in loops or conditionals.</p>
          </article>
          <article>
            <h3>Q3: How do useMemo and useCallback optimize React application performance?</h3>
            <p>useMemo memoizes calculated values across renders, while useCallback memoizes function instances to avoid unnecessary re-renders of memoized child components.</p>
          </article>
        </section>
        <section>
          <h2>Related Topics</h2>
          <ul>
            <li><a href="/interview-questions/javascript">JavaScript Questions</a></li>
            <li><a href="/interview-questions/nodejs">Node.js Questions</a></li>
          </ul>
        </section>
      </main>
      ${commonFooter}`;

    case '/interview-questions/nodejs':
      return `
      ${commonHeader}
      <main>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <a href="/interview-questions">Interview Questions</a> &gt; <span>Node.js</span>
        </nav>
        <section>
          <h1>Node.js Technical Interview Questions & Answers (2026)</h1>
          <p>Prepare for backend engineering interviews with Node.js questions on non-blocking I/O, event loop phases, Express middleware architecture, and REST API design.</p>
        </section>
        <section>
          <h2>Key Node.js Interview Questions</h2>
          <article>
            <h3>Q1: How does Node.js handle non-blocking asynchronous I/O operations?</h3>
            <p>Node.js uses libuv to execute file and network I/O operations asynchronously on underlying OS threads, notifying the main V8 JavaScript thread via callbacks upon completion.</p>
          </article>
          <article>
            <h3>Q2: What is Express middleware and how does the next() function work?</h3>
            <p>Middleware functions access request and response objects and the next middleware function in the request-response cycle. Calling next() passes control to the next handler.</p>
          </article>
        </section>
        <section>
          <h2>Related Categories</h2>
          <ul>
            <li><a href="/interview-questions/sql">SQL Database Questions</a></li>
            <li><a href="/interview-questions/javascript">JavaScript Questions</a></li>
          </ul>
        </section>
      </main>
      ${commonFooter}`;

    case '/interview-questions/java':
      return `
      ${commonHeader}
      <main>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <a href="/interview-questions">Interview Questions</a> &gt; <span>Java</span>
        </nav>
        <section>
          <h1>Java Technical Interview Questions & Answers (2026)</h1>
          <p>Essential Java interview questions covering Object-Oriented Design (OOP), Collections Framework, multithreading, JVM memory management, and core Java concepts.</p>
        </section>
        <section>
          <h2>Key Java Interview Questions</h2>
          <article>
            <h3>Q1: Explain the four pillars of Object-Oriented Programming (OOP) in Java.</h3>
            <p>The four core pillars are Encapsulation (hiding internal state), Abstraction (exposing essential features), Inheritance (reusing code structures), and Polymorphism (overriding/overloading behavior).</p>
          </article>
          <article>
            <h3>Q2: What is the difference between HashMap and ConcurrentHashMap in Java?</h3>
            <p>HashMap is non-thread-safe and allows null keys/values. ConcurrentHashMap provides thread safety with segment/bucket locking without locking the entire table.</p>
          </article>
          <article>
            <h3>Q3: How does JVM Garbage Collection handle heap memory allocation?</h3>
            <p>The JVM Heap is divided into Young (Eden, Survivor) and Tenured (Old) generations. Garbage collectors reclaim unreachable object memory using algorithms like G1GC or ZGC.</p>
          </article>
        </section>
        <section>
          <h2>Related Categories</h2>
          <ul>
            <li><a href="/interview-questions/sql">SQL Database Questions</a></li>
            <li><a href="/interview-questions">All Question Categories</a></li>
          </ul>
        </section>
      </main>
      ${commonFooter}`;

    case '/interview-questions/sql':
      return `
      ${commonHeader}
      <main>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <a href="/interview-questions">Interview Questions</a> &gt; <span>SQL</span>
        </nav>
        <section>
          <h1>SQL & Database Technical Interview Questions & Answers (2026)</h1>
          <p>Practice database interview questions on SQL queries, JOINs, B-Tree indexes, ACID transaction guarantees, and database schema normalization.</p>
        </section>
        <section>
          <h2>Key SQL Interview Questions</h2>
          <article>
            <h3>Q1: What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN?</h3>
            <p>INNER JOIN returns matching rows in both tables. LEFT JOIN returns all rows from the left table and matching right rows. RIGHT JOIN returns all right rows and matching left rows.</p>
          </article>
          <article>
            <h3>Q2: What are database indexes and how do they speed up query execution?</h3>
            <p>Indexes create lookup data structures (typically B-Trees) on selected columns, allowing the database engine to find rows in logarithmic O(log N) time instead of full table scans O(N).</p>
          </article>
          <article>
            <h3>Q3: Explain ACID properties in relational database transactions.</h3>
            <p>ACID stands for Atomicity (all-or-nothing execution), Consistency (maintaining invariants), Isolation (concurrent execution safety), and Durability (persisted committed state).</p>
          </article>
        </section>
        <section>
          <h2>Related Categories</h2>
          <ul>
            <li><a href="/interview-questions/nodejs">Node.js Questions</a></li>
            <li><a href="/interview-questions/java">Java Questions</a></li>
          </ul>
        </section>
      </main>
      ${commonFooter}`;

    case '/full-stack-interview-roadmap':
      return `
      ${commonHeader}
      <main>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <span>Full-Stack Roadmap</span>
        </nav>
        <section>
          <h1>Full-Stack Developer Interview Preparation Roadmap 2026</h1>
          <p>A structured 6-week preparation roadmap to crack frontend, backend, database, system design, and behavioral technical interviews for full-stack software engineers.</p>
        </section>
        <section>
          <h2>6-Week Step-by-Step Preparation Plan</h2>
          <article>
            <h3>Week 1: Frontend Fundamentals & Modern JavaScript</h3>
            <p>Master JS Closures, Promises, Event Loop, DOM manipulation, and ES6+ coding patterns.</p>
          </article>
          <article>
            <h3>Week 2: Component Architecture & React Deep-Dive</h3>
            <p>Focus on React Hooks, Virtual DOM reconciliation, state management, and performance optimization.</p>
          </article>
          <article>
            <h3>Week 3: Backend Systems with Node.js & Express</h3>
            <p>Build RESTful microservices, asynchronous request pipelines, middleware validation, and authentication (JWT).</p>
          </article>
          <article>
            <h3>Week 4: Database Design, SQL Queries & ORM</h3>
            <p>Design normalized relational schemas, optimize complex SQL joins, index strategies, and transaction handling.</p>
          </article>
          <article>
            <h3>Week 5: System Design & API Engineering</h3>
            <p>Practice scalable system design: Caching (Redis), Load Balancing, Rate Limiting, and Database Sharding.</p>
          </article>
          <article>
            <h3>Week 6: Data Structures, Algorithms & Behavioral Rounds</h3>
            <p>Solve high-frequency coding patterns (Arrays, Two Pointers, Trees, Graphs) and structure STAR-method behavioral responses.</p>
          </article>
        </section>
        <section>
          <h2>Next Steps & Practice</h2>
          <p>Start testing your knowledge with our <a href="/interview-questions">Curated Technical Interview Questions</a>.</p>
        </section>
      </main>
      ${commonFooter}`;

    case '/privacy':
    case '/privacy-policy':
      return `
      ${commonHeader}
      <main>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <span>Privacy Policy</span>
        </nav>
        <section>
          <h1>HireReady Privacy Policy</h1>
          <p>Last updated: September 2026. This policy describes how HireReady collects, stores, processes, and protects your personal information when using our AI interview preparation services.</p>
        </section>
        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect account details (email, name), interview responses, audio transcriptions, resume data, and technical usage metrics necessary to provide AI feedback.</p>
          <h2>2. How Information is Used</h2>
          <p>Your data is strictly utilized to evaluate interview responses, generate skill radar analytics, optimize resume matching, and improve platform performance.</p>
          <h2>3. Data Protection & Privacy Rights</h2>
          <p>We implement enterprise-grade encryption (TLS/AES-256). You retain full rights to request data export or account deletion at any time by contacting support.</p>
        </section>
      </main>
      ${commonFooter}`;

    case '/terms':
    case '/terms-and-conditions':
      return `
      ${commonHeader}
      <main>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <span>Terms & Conditions</span>
        </nav>
        <section>
          <h1>HireReady Terms & Conditions</h1>
          <p>Last updated: September 2026. By accessing or using the HireReady platform, you agree to comply with and be bound by these terms of service.</p>
        </section>
        <section>
          <h2>1. Platform Usage & Account Responsibility</h2>
          <p>HireReady provides automated AI interview practice resources. Users are responsible for maintaining account confidentiality and security.</p>
          <h2>2. Intellectual Property</h2>
          <p>All interview question content, platform code, and branding elements remain the exclusive intellectual property of HireReady.</p>
          <h2>3. Termination & Fair Use</h2>
          <p>HireReady reserves the right to suspend accounts engaged in automated scraping, abuse of AI endpoints, or violation of usage guidelines.</p>
        </section>
      </main>
      ${commonFooter}`;

    case '/contact':
      return `
      ${commonHeader}
      <main>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <span>Contact Us</span>
        </nav>
        <section>
          <h1>Contact HireReady Support & Engineering Team</h1>
          <p>Have questions, feedback, or need support with your AI interview practice account? Get in touch with our support team.</p>
        </section>
        <section>
          <h2>Contact Methods</h2>
          <p><strong>Email Support:</strong> <a href="mailto:hireready007@gmail.com">hireready007@gmail.com</a></p>
          <p><strong>Response Time:</strong> We typically respond to support inquiries within 24 hours on business days.</p>
          <p><strong>GitHub Repository:</strong> <a href="https://github.com/GOPALAKRISHNAN2006/HireReady">HireReady Open Source & Issues</a></p>
        </section>
      </main>
      ${commonFooter}`;

    case '/cookie-preferences':
      return `
      ${commonHeader}
      <main>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <span>Cookie Preferences</span>
        </nav>
        <section>
          <h1>HireReady Cookie Preferences & Privacy Settings</h1>
          <p>Manage how HireReady uses essential, performance, and analytics cookies to deliver your AI interview practice experience.</p>
        </section>
      </main>
      ${commonFooter}`;

    case '/login':
      return `
      ${commonHeader}
      <main>
        <section>
          <h1>Sign In to HireReady</h1>
          <p>Log in to access your AI mock interview practice sessions, skill radar reports, and saved questions.</p>
          <p><a href="/signup">Need an account? Sign Up Free</a> | <a href="/forgot-password">Forgot Password?</a></p>
        </section>
      </main>
      ${commonFooter}`;

    case '/signup':
      return `
      ${commonHeader}
      <main>
        <section>
          <h1>Create Your Free HireReady Account</h1>
          <p>Join HireReady to practice technical interviews, aptitude assessments, and optimize your resume for ATS systems.</p>
          <p><a href="/login">Already registered? Sign In</a></p>
        </section>
      </main>
      ${commonFooter}`;

    case '/forgot-password':
      return `
      ${commonHeader}
      <main>
        <section>
          <h1>Reset Your HireReady Account Password</h1>
          <p>Enter your registered email address to receive a secure password reset link.</p>
          <p><a href="/login">Return to Sign In</a></p>
        </section>
      </main>
      ${commonFooter}`;

    case '/help':
    case '/support':
      return `
      ${commonHeader}
      <main>
        <section>
          <h1>HireReady Help Center & Guides</h1>
          <p>Find answers to common questions about AI mock interviews, scoring criteria, and account settings.</p>
          <p><a href="/contact">Need additional support? Contact Us</a></p>
        </section>
      </main>
      ${commonFooter}`;

    default:
      return `
      ${commonHeader}
      <main>
        <section>
          <h1>HireReady | AI-Powered Interview Practice</h1>
          <p>Ace your technical and HR interviews with HireReady.</p>
        </section>
      </main>
      ${commonFooter}`;
  }
}

module.exports = {
  BASE_URL,
  DEFAULT_OG_IMAGE,
  PUBLIC_SEO_ROUTES,
  PRIVATE_ROUTE_PREFIXES,
  getSeoMetadataForPath,
  getPreRenderedBodyForPath,
};
