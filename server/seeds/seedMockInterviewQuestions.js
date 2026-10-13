/**
 * ===========================================
 * Comprehensive Interview Questions Seed
 * ===========================================
 * Seeds interview questions for all categories and difficulty levels
 * to populate the Question Bank and Mock Interview sessions.
 *
 * Usage: node seeds/seedMockInterviewQuestions.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question.model');
const { additionalQuestions } = require('./additionalQuestions');
const { additionalBatch2 } = require('./additionalBatch2');

const questionsData = [
  // ==========================================
  // WEB DEVELOPMENT (18 questions)
  // ==========================================
  {
    text: 'What is the Virtual DOM in React and how does reconciliation work?',
    category: 'web',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['react', 'virtual-dom', 'reconciliation', 'frontend'],
    expectedAnswer:
      'The Virtual DOM is a lightweight JavaScript object representation of the real DOM. When state changes, React creates a new Virtual DOM tree, diffs it against previous tree using the reconciliation algorithm (heuristic O(n) diffing), and batch-updates only modified real DOM nodes.',
    hints: ['Mention why real DOM operations are expensive', 'Explain diffing and batching'],
    keyPoints: [
      'In-memory representation',
      'Diffing algorithm',
      'Batch DOM manipulation',
      'Fiber architecture',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain the difference between let, const, and var in JavaScript. What is hoisting?',
    category: 'web',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['javascript', 'es6', 'hoisting', 'scope'],
    expectedAnswer:
      'var is function-scoped and hoisted with undefined initialization. let and const are block-scoped and hoisted to the Temporal Dead Zone (TDZ) where accessing them before declaration throws a ReferenceError. const cannot be reassigned.',
    hints: ['Discuss scope (function vs block)', 'Explain Temporal Dead Zone'],
    keyPoints: [
      'Function vs block scope',
      'Reassignment rules',
      'Temporal Dead Zone',
      'Hoisting behavior',
    ],
    recommendedTimeMinutes: 3,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is the difference between cookies, localStorage, and sessionStorage?',
    category: 'web',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['web', 'storage', 'browser', 'cookies'],
    expectedAnswer:
      'Cookies (~4KB) are sent with every HTTP request, have configurable expiry and flags (HttpOnly, Secure, SameSite). localStorage (5-10MB) persists across browser sessions with no expiration. sessionStorage (5-10MB) is scoped to the tab and cleared when closed.',
    hints: ['Compare storage sizes', 'Explain when each is sent to the server'],
    keyPoints: [
      'Capacity differences',
      'Lifecycle/persistence',
      'Server transmission',
      'Security flags (HttpOnly)',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain how CORS works and why it is critical for web security.',
    category: 'web',
    difficulty: 'medium',
    type: 'technical',
    tags: ['security', 'cors', 'api', 'http'],
    expectedAnswer:
      'Cross-Origin Resource Sharing (CORS) is a browser security mechanism based on the Same-Origin Policy. When a frontend requests a different origin (protocol, domain, or port), the browser sends an OPTIONS preflight request. The server must respond with Access-Control-Allow-Origin headers to permit access.',
    hints: ['Mention Same-Origin Policy', 'Explain preflight OPTIONS request'],
    keyPoints: [
      'Same-Origin Policy',
      'Preflight OPTIONS request',
      'Access-Control headers',
      'Browser-enforced mechanism',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain the Event Loop in JavaScript. How do microtasks differ from macrotasks?',
    category: 'web',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['javascript', 'event-loop', 'async', 'promises'],
    expectedAnswer:
      'JavaScript has a single-threaded call stack. Asynchronous callbacks are queued in task queues. When the call stack is empty, the event loop drains ALL microtasks (Promises, queueMicrotask, MutationObserver) before processing the next macrotask (setTimeout, setInterval, I/O).',
    hints: [
      'Differentiate Call Stack vs Task Queues',
      'Order of execution between Promise and setTimeout',
    ],
    keyPoints: [
      'Single-threaded call stack',
      'Microtask queue priority',
      'Macrotask queue',
      'Starvation risk',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What are React Hooks rules and how do useState and useEffect work internally?',
    category: 'web',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['react', 'hooks', 'lifecycle', 'frontend'],
    expectedAnswer:
      'Hooks must only be called at the top level and in React function components. Internally, React tracks hook state as a linked list associated with the current Fiber node, relying on consistent call order. useEffect runs after DOM paint, handling cleanup via return functions.',
    hints: [
      'Why cannot hooks be in loops or conditions?',
      'Mention Fiber linked list of hook states',
    ],
    keyPoints: [
      'Top-level call rule',
      'Fiber hook linked list',
      'Effect cleanup function',
      'Dependency array comparison',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is the difference between Server-Side Rendering (SSR), Client-Side Rendering (CSR), and Static Site Generation (SSG)?',
    category: 'web',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['nextjs', 'ssr', 'ssg', 'performance'],
    expectedAnswer:
      'CSR renders HTML in the browser via JavaScript; fast subsequent navigation but slower initial load and poorer SEO. SSR renders HTML on the server on each request; great for dynamic data and SEO. SSG generates HTML at build time; fastest TTFB and CDN-cacheable.',
    hints: [
      'Consider SEO, build time, and server cost trade-offs',
      'Mention Next.js rendering modes',
    ],
    keyPoints: [
      'TTFB vs FCP comparison',
      'SEO implications',
      'Server compute load',
      'Hydration process',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How does CSS Specificity work? How does the cascade resolve style conflicts?',
    category: 'web',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['css', 'frontend', 'specificity'],
    expectedAnswer:
      'CSS specificity is calculated as a 4-part weight: Inline styles (1,0,0,0) > IDs (0,1,0,0) > Classes, attributes, pseudo-classes (0,0,1,0) > Elements and pseudo-elements (0,0,0,1). !important overrides standard specificity.',
    hints: ['Recall the 0,0,0,0 tuple calculation', 'What does !important do?'],
    keyPoints: [
      'Inline vs ID vs Class vs Element',
      'Weight calculation',
      '!important priority',
      'Source order tiebreaker',
    ],
    recommendedTimeMinutes: 3,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain web security vulnerabilities: XSS, CSRF, and SQL Injection. How do you prevent them?',
    category: 'web',
    difficulty: 'hard',
    type: 'technical',
    tags: ['security', 'xss', 'csrf', 'owasp'],
    expectedAnswer:
      'XSS: Injecting malicious scripts executed in user browsers; prevent via input sanitization, React JSX escaping, and CSP headers. CSRF: Tricking authenticated users into unwanted actions; prevent with SameSite cookies and Anti-CSRF tokens. SQLi: Malicious SQL queries; prevent with parameterized queries/ORMs.',
    hints: [
      'Differentiate client-side script injection vs unauthorized request forgery',
      'Mention SameSite and parameterized queries',
    ],
    keyPoints: [
      'XSS sanitization & CSP',
      'CSRF anti-tokens & SameSite',
      'SQL Parameterization',
      'Defense-in-depth',
    ],
    recommendedTimeMinutes: 7,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How would you optimize web performance for a slow-loading web application?',
    category: 'web',
    difficulty: 'hard',
    type: 'technical',
    tags: ['performance', 'web-vitals', 'optimization'],
    expectedAnswer:
      'Optimize Core Web Vitals (LCP, FID/INP, CLS). Techniques: Code splitting & dynamic imports, image optimization (WebP/AVIF, responsive sizes), browser caching & CDN, tree shaking, critical CSS inlining, font display swap, and avoiding layout shifts with fixed dimensions.',
    hints: ['Structure answer around Core Web Vitals', 'Mention bundle size and asset loading'],
    keyPoints: [
      'Core Web Vitals metrics',
      'Code splitting (React.lazy)',
      'CDN and asset compression',
      'Cumulative Layout Shift mitigation',
    ],
    recommendedTimeMinutes: 7,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Debouncing vs Throttling in JavaScript. Implement a debounce utility.',
    category: 'web',
    difficulty: 'medium',
    type: 'coding',
    tags: ['javascript', 'performance', 'debounce', 'throttle'],
    expectedAnswer:
      'Debouncing delays execution until a specified idle time passes without new events (e.g., search autocomplete). Throttling enforces execution at most once per time interval (e.g., scroll/resize). Debounce uses setTimeout and clearTimeout.',
    hints: ['Think of an elevator door closing', 'Return a closure holding the timer ID'],
    keyPoints: [
      'Idle wait vs rate limiting',
      'Closure and clearTimeout',
      'Real-world search vs scroll use cases',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Node.js architecture. How does libuv enable asynchronous non-blocking I/O?',
    category: 'web',
    difficulty: 'hard',
    type: 'conceptual',
    tags: ['nodejs', 'backend', 'libuv', 'architecture'],
    expectedAnswer:
      'Node.js pairs V8 for JS execution with libuv for asynchronous I/O. libuv uses OS kernel mechanisms (epoll on Linux, kqueue on macOS, IOCP on Windows) for network I/O and a configurable thread pool (default 4 threads) for blocking tasks like disk I/O and crypto.',
    hints: [
      'What does V8 do vs what does libuv do?',
      'Mention OS event notification systems vs thread pool',
    ],
    keyPoints: [
      'V8 engine role',
      'libuv thread pool',
      'OS async primitives (epoll/kqueue)',
      'Non-blocking worker model',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // DATA STRUCTURES & ALGORITHMS (18 questions)
  // ==========================================
  {
    text: 'Explain the difference between an Array and a Linked List. When would you use one over the other?',
    category: 'dsa',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['arrays', 'linked-list', 'data-structures'],
    expectedAnswer:
      'Arrays use contiguous memory, offering O(1) random access via index, but O(n) insertions/deletions. Linked Lists use non-contiguous memory connected via pointers, offering O(1) head insertion/deletion, but O(n) element lookup. Use arrays for indexing; linked lists for frequent insertions/deletions without resizing overhead.',
    hints: [
      'Contrast memory layout and cache locality',
      'Compare read vs insert time complexities',
    ],
    keyPoints: [
      'Contiguous vs pointer nodes',
      'O(1) access vs O(n) traversal',
      'Cache friendliness',
      'Dynamic resizing cost',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How does a Hash Table work? Explain collision resolution strategies: Chaining vs Open Addressing.',
    category: 'dsa',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['hash-table', 'data-structures', 'collisions'],
    expectedAnswer:
      'A hash table maps keys to bucket indices using a hash function. Collisions occur when multiple keys hash to the same bucket. Chaining stores colliding elements in a linked list or balanced tree at the bucket. Open Addressing finds the next open bucket via Linear Probing, Quadratic Probing, or Double Hashing.',
    hints: ['What is the role of load factor?', 'Explain clustering in linear probing'],
    keyPoints: [
      'Hash function and modulo',
      'Separate chaining',
      'Open addressing probing',
      'Load factor rehashing',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Compare QuickSort and MergeSort. What are their time and space complexities, and when is each preferred?',
    category: 'dsa',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['sorting', 'algorithms', 'time-complexity'],
    expectedAnswer:
      'QuickSort is in-place with O(n log n) average and O(n²) worst-case time, requiring O(log n) stack space. MergeSort is stable with guaranteed O(n log n) time in all cases, but requires O(n) auxiliary space. QuickSort is faster in practice due to cache locality; MergeSort is preferred for linked lists and external sorting.',
    hints: ['Which is stable?', 'Which uses extra memory for merging?'],
    keyPoints: [
      'Average vs worst-case time',
      'Space complexity O(n) vs O(log n)',
      'Stability difference',
      'Cache performance',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain the Two Pointers technique and Sliding Window. Give classic problems where they apply.',
    category: 'dsa',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['two-pointers', 'sliding-window', 'algorithms'],
    expectedAnswer:
      'Two pointers uses two indices moving towards each other (e.g., Two Sum on sorted array, valid palindrome) or at different speeds (fast/slow pointer for cycle detection). Sliding window maintains a dynamic or fixed subarray range to optimize contiguous segment problems from O(n²) to O(n).',
    hints: [
      'How does sorting enable two pointers?',
      'Give an example like maximum sum subarray or longest substring',
    ],
    keyPoints: [
      'Opposite direction vs fast/slow pointer',
      'Window expansion and contraction',
      'O(n) linear time optimization',
      'Monotonic properties',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Dynamic Programming. What are the two core properties required, and compare Memoization vs Tabulation?',
    category: 'dsa',
    difficulty: 'hard',
    type: 'conceptual',
    tags: ['dynamic-programming', 'memoization', 'algorithms'],
    expectedAnswer:
      'DP applies to problems with: 1) Optimal Substructure (optimal solution comes from optimal subproblem solutions) and 2) Overlapping Subproblems. Memoization is top-down recursion with caching. Tabulation is bottom-up iterative computation filling a table.',
    hints: [
      'Think of Fibonacci or Knapsack',
      'Contrast call stack recursion vs iterative table filling',
    ],
    keyPoints: [
      'Optimal substructure',
      'Overlapping subproblems',
      'Top-down memoization',
      'Bottom-up tabulation',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is a Binary Search Tree (BST)? What causes a BST to degrade to O(n), and how do Self-Balancing Trees solve this?',
    category: 'dsa',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['trees', 'bst', 'avl', 'red-black'],
    expectedAnswer:
      'In a BST, all left descendants are smaller and right descendants larger than node. When inserted in sorted order, BST degrades into a skewed linked list with O(n) search. Self-balancing trees (AVL, Red-Black) perform tree rotations to maintain O(log n) height.',
    hints: [
      'What happens when inserting 1, 2, 3, 4, 5 into a standard BST?',
      'How do rotations work?',
    ],
    keyPoints: [
      'BST ordering invariant',
      'Skewed degenerate tree O(n)',
      'Tree rotations (left/right)',
      'AVL vs Red-Black balancing guarantee',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Breadth-First Search (BFS) vs Depth-First Search (DFS) on graphs. When would you use each?',
    category: 'dsa',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['graphs', 'bfs', 'dfs', 'traversal'],
    expectedAnswer:
      'BFS explores neighbor-by-neighbor using a queue; ideal for finding the shortest path in unweighted graphs and level-order traversal. DFS explores deeply down each branch using recursion or a stack; ideal for topological sort, cycle detection, and maze solving.',
    hints: ['Queue vs Stack data structure', 'Shortest path guarantee in unweighted graphs'],
    keyPoints: [
      'Queue vs Stack/Recursion',
      'Shortest path in unweighted graphs (BFS)',
      'Topological sorting & cycle detection (DFS)',
      'Time complexity O(V + E)',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How does Floyd Cycle Detection (Tortoise and Hare algorithm) detect cycles in a linked list?',
    category: 'dsa',
    difficulty: 'medium',
    type: 'technical',
    tags: ['linked-list', 'pointers', 'algorithms'],
    expectedAnswer:
      'Use two pointers: slow moves 1 step, fast moves 2 steps. If there is a cycle, fast will eventually lap and meet slow inside the loop. To find the cycle entry point, reset slow to the head and advance both pointers 1 step at a time until they meet.',
    hints: [
      'Think of runners on a circular track',
      'Mathematical explanation for distance from head to loop start',
    ],
    keyPoints: [
      'Fast pointer 2x speed',
      'Meeting point guarantee O(n)',
      'Finding entrance node',
      'O(1) auxiliary space',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How does a Min-Heap / Max-Heap work, and what is the difference between Heap Sort and Priority Queue?',
    category: 'dsa',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['heap', 'priority-queue', 'data-structures'],
    expectedAnswer:
      'A binary heap is a complete binary tree satisfying the heap property (parent is smaller/larger than children). Stored efficiently as an array where index i has children at 2i+1 and 2i+2. Insertion and extract-min are O(log n). Priority queue is an abstract data type commonly implemented via heaps.',
    hints: [
      'Explain array indexing without pointers',
      'Time complexity for build-heap vs extract-min',
    ],
    keyPoints: [
      'Complete binary tree array representation',
      'Heap property',
      'O(log n) push/pop',
      'O(n) build-heap algorithm',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How do you detect cycles in directed vs undirected graphs?',
    category: 'dsa',
    difficulty: 'hard',
    type: 'technical',
    tags: ['graphs', 'cycle-detection', 'dfs', 'union-find'],
    expectedAnswer:
      'In an undirected graph, detect cycles using DFS checking visited nodes that are not the direct parent, or using Disjoint Set Union (Union-Find). In a directed graph, tracking simple visited is insufficient; you must track nodes currently in the recursion stack (3-color DFS: White, Gray, Black) or use Kahn algorithm (topological sort).',
    hints: [
      'Why does directed graph cycle detection require checking recursion stack?',
      'Mention 3-color DFS',
    ],
    keyPoints: [
      'Parent tracking in undirected graphs',
      'Union-Find Disjoint Set',
      'Recursion stack tracking in directed graphs',
      'Kahns algorithm indegree count',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // BEHAVIORAL & HR (15 questions)
  // ==========================================
  {
    text: 'Tell me about yourself, your background, and why you are interested in this position.',
    category: 'behavioral',
    difficulty: 'easy',
    type: 'behavioral',
    tags: ['introduction', 'hr', 'career'],
    expectedAnswer:
      'Follow the Present-Past-Future formula: 1) Present: current role, key technical stack, and recent achievements. 2) Past: educational background and key prior experiences. 3) Future: why this specific company and role are the ideal next step to create mutual value.',
    hints: ['Keep it under 2 minutes', 'Focus on relevance to the target job'],
    keyPoints: [
      'Present-Past-Future structure',
      'Highlights of technical strengths',
      'Clear career narrative',
      'Direct alignment with company',
    ],
    recommendedTimeMinutes: 3,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Tell me about a time you had a disagreement with a team member or manager. How did you resolve it?',
    category: 'behavioral',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['conflict-resolution', 'teamwork', 'communication'],
    expectedAnswer:
      'Use the STAR method (Situation, Task, Action, Result). Focus on resolving technical or procedural disagreements with empathy, objective data/metrics, active listening, and finding consensus that prioritized project success rather than ego.',
    hints: ['Focus on the constructive outcome', 'Never badmouth a colleague'],
    keyPoints: [
      'STAR methodology',
      'Objective data-driven approach',
      'Active listening',
      'Positive resolution & relationship maintained',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Describe a project where you faced a significant obstacle or failure. What did you learn?',
    category: 'behavioral',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['failure', 'growth-mindset', 'resilience'],
    expectedAnswer:
      'Pick a genuine professional challenge. Explain what happened, take personal accountability, detail the post-mortem analysis, the corrective steps taken, and how the lessons learned prevented similar issues in subsequent projects.',
    hints: ['Show ownership and self-reflection', 'Emphasize the positive takeaways'],
    keyPoints: [
      'Genuine vulnerability & ownership',
      'Root cause analysis',
      'Corrective action taken',
      'Long-term growth mindset',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How do you prioritize your work when dealing with competing deadlines and high pressure?',
    category: 'behavioral',
    difficulty: 'easy',
    type: 'behavioral',
    tags: ['time-management', 'prioritization', 'productivity'],
    expectedAnswer:
      'Utilize frameworks like the Eisenhower Matrix (Urgent vs Important) or impact vs effort scoring. Communicate proactively with stakeholders to manage expectations, unblock dependencies, and break complex deliverables into incremental milestones.',
    hints: ['Mention communication with project managers', 'Explain your personal triage process'],
    keyPoints: [
      'Prioritization framework',
      'Stakeholder communication',
      'Decomposition of work',
      'Staying calm under pressure',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Tell me about a time you had to learn a new technology or domain quickly to deliver a project.',
    category: 'behavioral',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['adaptability', 'fast-learner', 'growth'],
    expectedAnswer:
      'Describe the situation and deadline constraints. Outline your systematic learning approach: official documentation, building proof-of-concept prototypes, seeking mentorship, and delivering on schedule with high code quality.',
    hints: ['Explain your actual learning process', 'Quantify the outcome'],
    keyPoints: [
      'Structured learning strategy',
      'Proof of concept validation',
      'Effective resource utilization',
      'Successful on-time delivery',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Describe a situation where you received critical feedback during a code review or performance review. How did you respond?',
    category: 'behavioral',
    difficulty: 'easy',
    type: 'behavioral',
    tags: ['code-review', 'feedback', 'team-player'],
    expectedAnswer:
      'Demonstrate that code reviews are about software quality, not personal criticism. Show curiosity by asking clarifying questions, embracing best practices, promptly refactoring the code, and thanking the reviewer.',
    hints: ['Separate your ego from your code', 'Show eagerness to adopt team conventions'],
    keyPoints: [
      'Ego separation',
      'Appreciation for constructive feedback',
      'Actionable improvements made',
      'Adopting team standards',
    ],
    recommendedTimeMinutes: 3,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Where do you see your career in 3 to 5 years, and how does this role fit into those plans?',
    category: 'behavioral',
    difficulty: 'easy',
    type: 'behavioral',
    tags: ['career-goals', 'long-term', 'vision'],
    expectedAnswer:
      'Express realistic, ambitious goals: deepening technical mastery, taking on architecture ownership or mentorship, and driving business impact within the engineering team.',
    hints: ['Demonstrate commitment and passion for engineering', 'Align with company growth'],
    keyPoints: [
      'Technical trajectory',
      'Leadership or domain expertise',
      'Commitment to continuous learning',
      'Mutual long-term value',
    ],
    recommendedTimeMinutes: 3,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // SYSTEM DESIGN (15 questions)
  // ==========================================
  {
    text: 'Design a URL Shortening Service like TinyURL or Bitly.',
    category: 'system-design',
    difficulty: 'medium',
    type: 'technical',
    tags: ['system-design', 'hashing', 'scalability', 'database'],
    expectedAnswer:
      'Requirements: Shorten long URL to 7 alphanumeric characters (Base62: 62^7 = 3.5 trillion URLs), redirect via 301/302, low latency read. Architecture: Load Balancer, App Servers, Distributed ID Generator / Token Counter, NoSQL/SQL DB with unique index on shortCode, Redis cache for top 20% hot URLs.',
    hints: [
      'Base62 encoding vs MD5 truncation',
      '301 permanent vs 302 temporary redirect differences',
    ],
    keyPoints: [
      'Capacity estimation',
      'Base62 encoding mechanism',
      'Redis caching layer',
      'Database schema & index',
      '301 vs 302 redirect for analytics',
    ],
    recommendedTimeMinutes: 15,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Design an API Rate Limiter to protect services from abuse.',
    category: 'system-design',
    difficulty: 'medium',
    type: 'technical',
    tags: ['system-design', 'rate-limiter', 'redis', 'algorithms'],
    expectedAnswer:
      'Algorithms: Token Bucket (supports bursts), Leaking Bucket (constant rate), Fixed Window Counter, Sliding Window Log, Sliding Window Counter. Implementation: Redis with atomic Lua scripts or sliding window sorted sets (ZADD/ZREMRANGEBYSCORE). Returns HTTP 429 Too Many Requests with Retry-After header.',
    hints: ['Compare Token Bucket vs Sliding Window', 'Explain distributed state using Redis'],
    keyPoints: [
      'Algorithm trade-offs',
      'Redis distributed counter',
      'Race condition prevention via Lua',
      'HTTP 429 response handling',
    ],
    recommendedTimeMinutes: 12,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Design a real-time 1-on-1 Chat Application like WhatsApp or Slack.',
    category: 'system-design',
    difficulty: 'hard',
    type: 'technical',
    tags: ['system-design', 'websockets', 'messaging', 'scalability'],
    expectedAnswer:
      'Requirements: Real-time messaging, presence (online/offline), message persistence, read receipts. Architecture: WebSocket gateway for bi-directional connection, Session/Connection Manager in Redis, Message Service, Message Queue (Kafka/RabbitMQ) for decoupled ingestion, Cassandra/DynamoDB for high-write message storage, Push Notification service (APNs/FCM) for offline users.',
    hints: [
      'How do clients maintain connection?',
      'How do you handle offline recipient message delivery?',
    ],
    keyPoints: [
      'WebSocket connection management',
      'Message queue fan-out',
      'NoSQL write-heavy schema',
      'Offline push notifications',
      'Message status lifecycle',
    ],
    recommendedTimeMinutes: 20,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Microservices vs Monolithic architecture. When should a team migrate, and what are the trade-offs?',
    category: 'system-design',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['architecture', 'microservices', 'monolith', 'distributed-systems'],
    expectedAnswer:
      'Monolith is single deployment artifact; simple to develop, test, and deploy early on. Microservices decompose by business domains with separate databases; enables independent team scaling and deployment. Trade-offs: distributed complexity, network latency, distributed transactions (Saga pattern), and observability challenges.',
    hints: [
      'Do not start with microservices for small teams',
      'Mention data consistency and Saga pattern',
    ],
    keyPoints: [
      'Team velocity vs operational overhead',
      'Database per service pattern',
      'Saga distributed transactions',
      'Service discovery & API Gateway',
    ],
    recommendedTimeMinutes: 8,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Design a Distributed Notification Service supporting Email, SMS, and Push Notifications.',
    category: 'system-design',
    difficulty: 'hard',
    type: 'technical',
    tags: ['system-design', 'kafka', 'queues', 'notifications'],
    expectedAnswer:
      'Architecture: Notification API validates payload, persists request in DB, and publishes to Kafka partitioned by notification channel/priority. Dedicated consumer workers process channels (SES for email, Twilio for SMS, FCM for push). Features: User preference filtering, Rate limiting, Exponential backoff retry queue, and Dead Letter Queue (DLQ) for failed messages.',
    hints: ['How do you ensure notifications are not spammed?', 'Explain Dead Letter Queue (DLQ)'],
    keyPoints: [
      'Kafka topic partitioning by channel',
      'Worker consumer groups',
      'Rate limiting & quiet hours',
      'Idempotency and deduplication',
      'Dead Letter Queue',
    ],
    recommendedTimeMinutes: 15,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // MACHINE LEARNING & AI (12 questions)
  // ==========================================
  {
    text: 'Explain Supervised vs Unsupervised vs Reinforcement Learning with examples.',
    category: 'ml',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['machine-learning', 'fundamentals', 'algorithms'],
    expectedAnswer:
      'Supervised Learning uses labeled data (input-output pairs) for classification and regression (e.g., spam detection, price prediction). Unsupervised Learning identifies patterns in unlabeled data (e.g., K-Means clustering, PCA). Reinforcement Learning trains agents via rewards/penalties through trial and error in an environment (e.g., AlphaGo, autonomous driving).',
    hints: ['Focus on the nature of the training signal/labels', 'Give concrete examples for each'],
    keyPoints: [
      'Labeled data mapping',
      'Unlabeled structure discovery',
      'Reward-based policy optimization',
      'Real-world application examples',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is the Bias-Variance Tradeoff, and how do you diagnose and fix Overfitting vs Underfitting?',
    category: 'ml',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['machine-learning', 'overfitting', 'regularization'],
    expectedAnswer:
      'Bias is error from erroneous model assumptions (underfitting; high train and test error). Variance is sensitivity to fluctuations in training data (overfitting; low train error, high test error). Fix underfitting: increase model capacity, add features. Fix overfitting: regularization (L1/L2, Dropout), cross-validation, data augmentation, reducing parameters.',
    hints: [
      'High train error vs high test error diagnosis',
      'Techniques like L1/L2 regularization and Dropout',
    ],
    keyPoints: [
      'High bias = underfitting',
      'High variance = overfitting',
      'Learning curves diagnosis',
      'Regularization strategies',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Precision, Recall, and F1-Score. Why is Accuracy misleading for imbalanced datasets?',
    category: 'ml',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['metrics', 'evaluation', 'classification'],
    expectedAnswer:
      'Accuracy = (TP+TN)/Total; in a 99% negative dataset (e.g., fraud), a dummy model predicting all negatives achieves 99% accuracy but 0 utility. Precision = TP/(TP+FP) (how many predicted positives were correct). Recall = TP/(TP+FN) (how many actual positives were caught). F1-Score is the harmonic mean of precision and recall.',
    hints: ['Use medical diagnosis or credit card fraud as an intuition', 'Explain harmonic mean'],
    keyPoints: [
      'Accuracy paradox in imbalanced data',
      'Precision formula & cost of false alarms',
      'Recall formula & cost of misses',
      'F1-score harmonic mean balance',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What are Transformers in Deep Learning, and how does the Self-Attention mechanism work?',
    category: 'ml',
    difficulty: 'hard',
    type: 'technical',
    tags: ['deep-learning', 'transformers', 'nlp', 'llm'],
    expectedAnswer:
      'Transformers replaced sequential RNNs with parallel self-attention. Self-attention computes relationships between all tokens simultaneously using Query (Q), Key (K), and Value (V) projections: Attention(Q, K, V) = softmax((Q*K^T) / sqrt(d_k)) * V. Multi-head attention captures diverse relational patterns across representation subspaces.',
    hints: [
      'Explain Q, K, V matrix analogy (search query, index keys, content values)',
      'Why is scaling factor sqrt(d_k) needed?',
    ],
    keyPoints: [
      'Parallelization vs sequential RNNs',
      'Query, Key, Value computation',
      'Softmax attention matrix',
      'Multi-Head Attention benefits',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Retrieval-Augmented Generation (RAG) vs Fine-Tuning for Large Language Models (LLMs).',
    category: 'ml',
    difficulty: 'hard',
    type: 'technical',
    tags: ['llm', 'rag', 'fine-tuning', 'ai'],
    expectedAnswer:
      'RAG retrieves relevant external documents via vector embedding search (cosine similarity) and injects them into the LLM prompt context at query time; best for dynamic, private, or verifiable knowledge without retraining. Fine-Tuning updates model weights on domain-specific datasets; best for adopting specific tone, style, or task formats.',
    hints: [
      'Think of RAG as an open-book exam and Fine-Tuning as memorization/skill practice',
      'Compare cost, hallucination control, and updates',
    ],
    keyPoints: [
      'Vector database & embedding similarity',
      'Context injection vs weight updating',
      'Hallucination reduction via citations',
      'Cost and maintenance comparison',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // DATABASE & SQL (12 questions)
  // ==========================================
  {
    text: 'Explain SQL vs NoSQL databases. When would you choose PostgreSQL vs MongoDB?',
    category: 'database',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['database', 'sql', 'nosql', 'mongodb', 'postgresql'],
    expectedAnswer:
      'SQL (PostgreSQL) is relational, ACID-compliant, with rigid schemas; best for complex joins, multi-table transactions (banking, e-commerce orders). NoSQL (MongoDB) is document-oriented, horizontally scalable, with dynamic schemas; best for rapid prototyping, hierarchical JSON documents, and high write throughput.',
    hints: ['ACID vs BASE consistency', 'Structured tabular data vs hierarchical document data'],
    keyPoints: [
      'ACID transactions vs eventual consistency',
      'Schema enforcement vs flexibility',
      'Horizontal vs vertical scaling',
      'Use case comparisons',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How do Database Indexes work, and why should you not index every column?',
    category: 'database',
    difficulty: 'medium',
    type: 'technical',
    tags: ['database', 'indexing', 'b-tree', 'sql'],
    expectedAnswer:
      'Indexes use B-Tree or B+ Tree structures to provide O(log n) lookups instead of O(n) full table scans. Over-indexing degrades write performance (INSERT/UPDATE/DELETE must update all indexes), consumes significant disk space, and adds optimizer overhead.',
    hints: ['B-Tree traversal vs sequential scan', 'Impact of indexes on write operations'],
    keyPoints: [
      'B-Tree / B+ Tree data structure',
      'O(log n) read acceleration',
      'Write amplification overhead',
      'Index selectivity guideline',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Database Normalization (1NF, 2NF, 3NF). When is Denormalization beneficial?',
    category: 'database',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['database', 'normalization', 'sql'],
    expectedAnswer:
      '1NF: Atomic values, unique records. 2NF: 1NF + no partial functional dependency on composite primary key. 3NF: 2NF + no transitive dependency. Denormalization intentionally adds redundancy to eliminate expensive joins in read-heavy analytics/reporting workloads.',
    hints: ['Eliminate data redundancy vs read performance query joins'],
    keyPoints: [
      '1NF atomicity',
      '2NF partial dependencies',
      '3NF transitive dependencies',
      'Denormalization for read performance',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Database ACID properties and Transaction Isolation Levels.',
    category: 'database',
    difficulty: 'hard',
    type: 'technical',
    tags: ['acid', 'transactions', 'database', 'concurrency'],
    expectedAnswer:
      'ACID: Atomicity (all or nothing), Consistency (preserves invariants), Isolation (concurrent transactions do not interfere), Durability (survives crashes via WAL). Isolation Levels: Read Uncommitted (dirty reads), Read Committed (non-repeatable reads), Repeatable Read (phantom reads), Serializable (full isolation).',
    hints: [
      'Dirty read vs Non-repeatable read vs Phantom read',
      'Write-Ahead Log (WAL) for durability',
    ],
    keyPoints: [
      'ACID definitions',
      '4 Transaction Isolation Levels',
      'Concurrency phenomena (dirty/phantom reads)',
      'MVCC (Multi-Version Concurrency Control)',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN in SQL?',
    category: 'database',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['sql', 'database', 'joins'],
    expectedAnswer:
      'INNER JOIN returns rows with matching keys in both tables. LEFT JOIN returns all rows from left table plus matched rows from right (nulls if no match). RIGHT JOIN returns all from right plus matched from left. FULL OUTER JOIN returns all rows from both tables, filling nulls where no match exists.',
    hints: ['Venn diagram intuition', 'What happens when no matching key exists?'],
    keyPoints: [
      'Matching keys only (INNER)',
      'Preserve left table (LEFT)',
      'Preserve right table (RIGHT)',
      'All rows combined (FULL OUTER)',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What are database transactions and how does Write-Ahead Logging (WAL) ensure durability?',
    category: 'database',
    difficulty: 'medium',
    type: 'technical',
    tags: ['database', 'wal', 'transactions'],
    expectedAnswer:
      'A transaction is a sequence of database operations executed as a single unit. WAL ensures durability by writing change records sequentially to an append-only log on non-volatile disk before changes are applied to actual database pages in memory. On crash recovery, the database replays the WAL.',
    hints: [
      'Why is sequential disk write faster than random page writes?',
      'How does recovery work?',
    ],
    keyPoints: [
      'Atomic unit of work',
      'Sequential append log',
      'Crash recovery replay',
      'Flush before commit confirmation',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Connection Pooling in databases. Why is creating a new database connection per request bad?',
    category: 'database',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['database', 'connection-pool', 'performance'],
    expectedAnswer:
      'Creating a database connection requires TCP handshakes, TLS negotiation, authentication, and allocating server memory threads. A connection pool maintains a cache of open, reusable connections. Requests borrow a connection and return it upon query completion, drastically reducing latency and database server strain.',
    hints: ['TCP and TLS handshake overhead', 'Resource consumption per connection on DB server'],
    keyPoints: [
      'Handshake & authentication overhead',
      'Connection reuse',
      'Max connection limit protection',
      'Latency reduction',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Database Sharding vs Replication. What are the trade-offs of Master-Slave vs Multi-Master replication?',
    category: 'database',
    difficulty: 'hard',
    type: 'technical',
    tags: ['database', 'sharding', 'replication', 'distributed-systems'],
    expectedAnswer:
      'Replication duplicates entire database across multiple nodes for high availability and read scalability (Master writes, Slaves read). Sharding partitions rows across different servers based on a shard key for write and storage scalability. Master-Slave has single write bottleneck but simple consistency; Multi-Master allows writes anywhere but introduces conflict resolution complexity.',
    hints: ['Read scaling vs Write scaling', 'Split-brain and write conflicts in Multi-Master'],
    keyPoints: [
      'Replication for read scale & redundancy',
      'Sharding for write & storage scale',
      'Shard key selection',
      'Conflict resolution in Multi-Master',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },

  // Additional System Design
  {
    text: 'How does consistent hashing work, and why is it used in distributed caching like Memcached or DynamoDB?',
    category: 'system-design',
    difficulty: 'hard',
    type: 'technical',
    tags: ['system-design', 'consistent-hashing', 'caching', 'distributed-systems'],
    expectedAnswer:
      'Traditional modulo hashing (hash(key) % N) causes almost all keys to remap when servers (N) are added or removed, invalidating caches. Consistent hashing maps both keys and servers onto a circular 2^32 hash ring. When a server joins or leaves, only k/N keys are remapped. Virtual nodes prevent hot spots and ensure uniform distribution.',
    hints: [
      'What happens with hash(key) % N when N changes?',
      'Explain the hash ring and virtual nodes',
    ],
    keyPoints: [
      'Hash ring topology',
      'Minimal key redistribution (k/N)',
      'Virtual nodes for load balancing',
      'Fault tolerance in distributed caches',
    ],
    recommendedTimeMinutes: 10,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Design a web crawler that can crawl billions of web pages concurrently.',
    category: 'system-design',
    difficulty: 'hard',
    type: 'technical',
    tags: ['system-design', 'crawler', 'distributed-systems'],
    expectedAnswer:
      'Components: URL Frontier (priority & politeness queues per domain), DNS Resolver with caching, HTML Downloader, Content Parser, Duplicate Content Detector (SimHash/fingerprinting), URL Extractor, and Storage (S3/BigTable). Politeness: obey robots.txt and limit rate per domain. Scalability: distributed Kafka queues and Bloom filters for visited URLs.',
    hints: ['How to avoid duplicate crawls?', 'Explain politeness and robots.txt'],
    keyPoints: [
      'URL Frontier architecture',
      'Bloom filter for visited URLs',
      'Politeness & rate limiting',
      'Distributed fault-tolerant workers',
    ],
    recommendedTimeMinutes: 15,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Caching strategies: Cache-Aside, Read-Through, Write-Through, Write-Back, and Write-Around.',
    category: 'system-design',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['caching', 'system-design', 'redis'],
    expectedAnswer:
      'Cache-Aside: App reads from cache; if miss, reads DB and populates cache. Read-Through: App treats cache as primary; cache library loads from DB on miss. Write-Through: App writes to cache, which synchronously writes to DB. Write-Back (Write-Behind): App writes to cache; cache asynchronously batches writes to DB (fastest, risk of data loss on crash). Write-Around: App writes directly to DB, bypassing cache.',
    hints: ['Sync write vs async batch write', 'Data loss risk in Write-Back'],
    keyPoints: [
      'Cache-Aside lazy loading',
      'Write-Through consistency',
      'Write-Back high write throughput',
      'Cache invalidation challenges',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is a Content Delivery Network (CDN) and how does edge caching reduce latency for global users?',
    category: 'system-design',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['cdn', 'networking', 'system-design'],
    expectedAnswer:
      'A CDN is a globally distributed network of Points of Presence (PoPs) / Edge servers. When a user requests static assets (JS, CSS, images, video), Anycast DNS routes the request to the geographically nearest edge server. If cached, content is returned immediately with low latency; on cache miss, edge fetches from origin server and caches it.',
    hints: ['Physical distance and speed of light in fiber optic cables', 'Anycast routing'],
    keyPoints: [
      'Geographic proximity / Edge PoPs',
      'Anycast DNS routing',
      'Origin shielding',
      'Cache-Control & TTL headers',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },

  // Additional Behavioral
  {
    text: 'Tell me about a time you had to deal with ambiguous requirements on a project. How did you proceed?',
    category: 'behavioral',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['ambiguity', 'problem-solving', 'leadership'],
    expectedAnswer:
      'Use STAR format. Explain how you broke the ambiguous objective into assumptions, proactively organized alignment meetings with product managers and stakeholders, drafted written RFC/design docs, and built quick incremental prototypes to validate requirements iteratively.',
    hints: ['Show initiative in creating clarity', 'Do not wait for someone to spoon-feed answers'],
    keyPoints: [
      'Proactive discovery',
      'Writing design docs / RFCs',
      'Iterative prototyping',
      'Continuous stakeholder feedback',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Describe an instance where you mentored a junior engineer or helped a colleague grow.',
    category: 'behavioral',
    difficulty: 'easy',
    type: 'behavioral',
    tags: ['mentorship', 'teamwork', 'leadership'],
    expectedAnswer:
      'Detail how you identified their challenges, held regular pair programming and 1-on-1 check-ins, explained the "why" behind software design decisions, provided supportive and actionable code review feedback, and celebrated their independent achievements.',
    hints: [
      'Focus on guiding them to find solutions rather than doing the work for them',
      'Quantify their growth',
    ],
    keyPoints: [
      'Empathy and patience',
      'Pair programming & Socratic guidance',
      'Actionable code reviews',
      'Empowering autonomy',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Tell me about a time you noticed a technical flaw or security vulnerability in production. What actions did you take?',
    category: 'behavioral',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['ownership', 'incident-response', 'quality'],
    expectedAnswer:
      'Describe prompt notification to team and incident management, mitigating immediate risk (hotfix, rollback, or firewall rule), conducting blameless root cause analysis (RCA), writing regression tests, and documenting preventive measures.',
    hints: ['Highlight composure and communication under urgency', 'Mention blameless post-mortem'],
    keyPoints: [
      'Rapid triage & mitigation',
      'Clear communication during incident',
      'Blameless post-mortem',
      'Automated regression prevention',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How do you balance writing perfect, clean code with the business pressure to deliver quickly?',
    category: 'behavioral',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['pragmatism', 'tech-debt', 'business-value'],
    expectedAnswer:
      'Demonstrate pragmatic engineering: software exists to deliver business value. Write modular, testable code for core logic, avoid premature optimization, explicitly document accepted technical debt, and plan follow-up refactoring tickets once MVP is validated.',
    hints: ['Avoid over-engineering', 'Treat tech debt as a deliberate, tracked financial loan'],
    keyPoints: [
      'Pragmatic engineering mindset',
      'Core logic testing vs premature optimization',
      'Documenting intentional tech debt',
      'Aligning with business milestones',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },

  // Additional ML / AI
  {
    text: 'Explain Gradient Descent and compare Batch, Stochastic (SGD), and Mini-batch Gradient Descent.',
    category: 'ml',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['machine-learning', 'optimization', 'gradient-descent'],
    expectedAnswer:
      'Gradient descent minimizes the loss function by iteratively moving in the direction of steepest descent (-gradient) scaled by learning rate. Batch GD uses the entire dataset per update (stable but slow on large data). SGD uses a single sample per update (fast, noisy, can escape local minima). Mini-batch GD uses batches (e.g., 32-256) balancing GPU vectorization and stable convergence.',
    hints: ['How does batch size affect GPU training?', 'Mention learning rate and oscillation'],
    keyPoints: [
      'Loss surface gradient update',
      'Batch GD stability vs compute cost',
      'SGD noise and speed',
      'Mini-batch GPU parallelism standard',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is the vanishing/exploding gradient problem in deep neural networks, and how do modern architectures solve it?',
    category: 'ml',
    difficulty: 'hard',
    type: 'technical',
    tags: ['deep-learning', 'neural-networks', 'gradients'],
    expectedAnswer:
      'During backpropagation via chain rule, multiplying many small derivatives (e.g., sigmoid < 0.25) causes gradients to vanish exponentially in early layers, preventing learning. Large derivatives cause exploding gradients. Solutions: ReLU/GELU activation functions, residual skip connections (ResNet), Batch Normalization / Layer Normalization, and gradient clipping.',
    hints: [
      'Why did sigmoid cause vanishing gradients?',
      'Explain how ResNet skip connections help gradients flow',
    ],
    keyPoints: [
      'Chain rule derivative decay',
      'ReLU non-saturating activation',
      'Residual connections gradient highway',
      'Normalization layers & gradient clipping',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How do you handle severe class imbalance in a machine learning dataset?',
    category: 'ml',
    difficulty: 'medium',
    type: 'technical',
    tags: ['machine-learning', 'imbalance', 'data-preprocessing'],
    expectedAnswer:
      'Techniques: 1) Resampling: Random undersampling majority class or oversampling minority class (SMOTE - Synthetic Minority Over-sampling Technique). 2) Algorithmic: Class-weighted loss functions (e.g., Focal Loss, class_weight="balanced"). 3) Metrics: Avoid Accuracy; evaluate with PR-AUC, F1-Score, or Matthews Correlation Coefficient.',
    hints: ['Mention SMOTE synthetic data creation', 'Class-weighted loss penalty'],
    keyPoints: [
      'SMOTE synthetic oversampling',
      'Cost-sensitive / class-weighted loss',
      'Ensemble techniques (Balanced Random Forest)',
      'PR-AUC evaluation metrics',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
];

async function seedMockQuestions() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI not found');
      process.exit(1);
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected! Checking existing questions...');

    let insertedCount = 0;
    let skippedCount = 0;

    const allQuestions = [...questionsData, ...additionalQuestions, ...additionalBatch2];

    for (const q of allQuestions) {
      const exists = await Question.findOne({ text: q.text });
      if (!exists) {
        await Question.create({
          ...q,
          isApproved: true,
          isActive: true,
        });
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    const totalInDb = await Question.countDocuments({
      isActive: { $ne: false },
      isApproved: { $ne: false },
    });
    console.log(`✅ Seeding complete:`);
    console.log(`   - Inserted new questions: ${insertedCount}`);
    console.log(`   - Existing questions: ${skippedCount}`);
    console.log(`   - Total active approved questions in DB: ${totalInDb}`);

    const countsByCategory = await Question.aggregate([
      { $match: { isActive: { $ne: false }, isApproved: { $ne: false } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    console.log('   - Counts by category:', countsByCategory);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding questions:', err);
    process.exit(1);
  }
}

seedMockQuestions();
