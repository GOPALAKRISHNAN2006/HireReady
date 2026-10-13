/**
 * Comprehensive curated interview answers, evaluation criteria, and hints
 * Used to enrich questions in question.routes and fallbackQuestionsData in interview.routes.
 */

const curatedAnswersMap = {
  'design an e-commerce platform with product catalog and checkout': {
    expectedAnswer: `Architecture Overview:\n1. High-Level Components:\n   - API Gateway: Route traffic, rate limiting, authentication, and SSL termination.\n   - Product Catalog Service: Elasticsearch/MongoDB for fast product filtering, faceted search, and category lookups; Redis for hot product caching.\n   - Inventory Service: Manages stock levels with distributed locks (Redis Redlock or DB row-level locking) to prevent overselling.\n   - Shopping Cart Service: Ephemeral storage using Redis with TTL or DynamoDB, persisting cart state per user/session.\n   - Order Service: Orchestrates order placement, state transitions (Pending -> Paid -> Shipped), and communicates with payment gateways via idempotent webhooks.\n   - Payment Service: Integrates with Stripe/PayPal. Uses idempotency keys to avoid double-charging.\n   - Notification Service: Event-driven worker consuming from RabbitMQ/Kafka to dispatch emails and SMS updates.\n\n2. Database & Data Consistency:\n   - Polyglot persistence: PostgreSQL for ACID financial transactions (Orders, Payments); MongoDB/Elasticsearch for product catalog and fuzzy text queries.\n   - Saga Pattern (Choreography/Orchestration) for distributed transactions across Order, Payment, and Inventory services instead of 2PC.\n\n3. Scalability & Resilience:\n   - Multi-tier caching: CDN for static assets & images, Redis for product details.\n   - Read/write replicas for relational databases.\n   - Asynchronous queueing (Kafka/RabbitMQ) for checkout fulfillment to maintain sub-second user latency.`,
    keyPoints: [
      'Microservices breakdown (Catalog, Cart, Inventory, Order, Payment)',
      'Handling race conditions in inventory with distributed locking or optimistic concurrency',
      'Idempotency in payment transactions using UUID tokens',
      'Saga pattern for distributed order workflows instead of two-phase commit',
      'Read-heavy optimization using Redis caching and Elasticsearch for catalog search',
    ],
    hints: [
      'Clarify functional requirements (scale, concurrent users, flash sale scenarios)',
      'Explain how you prevent two users from buying the last available item simultaneously',
      'Discuss data consistency vs latency trade-offs during checkout',
    ],
    followUpQuestions: [
      'How would you handle flash sales (e.g., 100k users buying 100 items in 5 seconds)?',
      'What happens if the payment succeeds but the inventory reservation fails?',
    ],
  },

  'design a search autocomplete feature for a search engine': {
    expectedAnswer: `System Architecture:\n1. Data Structures:\n   - Trie (Prefix Tree): In-memory trie where each node stores characters and precomputed top-k highest frequency search queries to achieve O(prefix_length) response time.\n   - Serialization: Compact binary serialization or Ternary Search Trees (TST) to minimize RAM footprint.\n\n2. Real-Time Query Pipeline:\n   - Client sends debounce-throttled keystroke events (e.g., 200ms delay).\n   - API Gateway routes to Autocomplete Service.\n   - In-memory cache (Redis) checks prefix -> top results. Cache hit rate is typically 80%+.\n   - If cache miss, query Trie cluster partitioned by prefix (e.g., a-c, d-f) with replication.\n\n3. Offline Aggregation Pipeline:\n   - User query logs collected via Kafka into stream processing (Apache Flink / Spark Streaming).\n   - MapReduce / Weekly aggregation computes query frequency and trending decay score: Score = Frequency * e^(-λ * t).\n   - Background worker updates Trie nodes and invalidates stale Redis cache keys.\n\n4. Latency Optimization:\n   - Target latency: < 50ms per keystroke.\n   - Client-side caching and Geo-distributed Edge CDN caching.`,
    keyPoints: [
      'Trie data structure with precomputed top suggestions stored at each node',
      'Debouncing at client tier to prevent query storms',
      'Separation of read-path (sub-50ms trie lookup) and write-path (batch/streaming frequency aggregation)',
      'Filtering inappropriate queries via blacklist Bloom filters',
      'Partitioning strategy for Trie shards across servers',
    ],
    hints: [
      'Focus on keeping keystroke response under 50ms',
      'Explain why updating the Trie on every single search in real time is a bottleneck',
      'Think about personalization and trending query decay over time',
    ],
    followUpQuestions: [
      'How would you support multi-language and typo tolerance (fuzzy matching)?',
    ],
  },

  'how would you design a video streaming platform like youtube': {
    expectedAnswer: `System Architecture:\n1. Video Ingestion & Processing Pipeline:\n   - Client uploads video chunked via multipart upload directly to Object Storage (AWS S3) using presigned URLs.\n   - Upload completion event publishes to Kafka queue.\n   - Transcoding cluster (FFmpeg workers on GPU instances) converts raw video into adaptive bitrate formats (HLS / MPEG-DASH) at multiple resolutions (1080p, 720p, 480p, 360p).\n   - Generates thumbnails, extracts audio for captions, and splits video into small 2-6 second TS/MP4 segments.\n\n2. Video Delivery & Streaming:\n   - Global CDN (Cloudflare / CloudFront) caches video segments geographically close to viewers.\n   - Video player automatically switches stream quality based on current network bandwidth (Adaptive Bitrate Streaming).\n\n3. Metadata & Search:\n   - Relational DB (PostgreSQL) for user accounts, channel metadata, and subscriptions.\n   - NoSQL (Cassandra / DynamoDB) for high-write view counts, video statistics, and comments.\n   - Elasticsearch for video title, description, and tag search.\n\n4. View Count & Recommendation:\n   - Asynchronous batch counting via Kafka and Redis HyperLogLog to prevent view count fraud.\n   - Dedicated recommendation service leveraging collaborative filtering and embedding vectors.`,
    keyPoints: [
      'Adaptive Bitrate Streaming using HLS/DASH and multi-resolution transcoding',
      'Direct-to-S3 chunked upload using presigned URLs to bypass web server bottleneck',
      'CDN caching strategy for static video segments',
      'Deduplicated view counting using distributed queues and stream processing',
      'Storage tiering (hot CDN storage vs cold archival storage for low-view videos)',
    ],
    hints: [
      'Differentiate between video upload (heavy compute) and video playback (heavy bandwidth/CDN)',
      'Explain how mobile devices switch resolutions without playback interruption',
    ],
    followUpQuestions: [
      'How do you prevent hot video thundering herd problems on CDN cache misses?',
    ],
  },

  'how would you design a job scheduler system': {
    expectedAnswer: `Architecture Overview:\n1. Core Components:\n   - Job API / Gateway: Exposes endpoints for clients to submit, cancel, and inspect scheduled jobs (one-off, delayed, or recurring cron).\n   - Job Store (Database): Relational DB or distributed key-value store holding job metadata, cron expressions, payload, status, and next execution timestamp.\n   - Poller / Dispatcher Cluster: Distributed workers running leader-election (via ZooKeeper or Redis Redlock) or time-partitioned indexing.\n   - Distributed Queue: RabbitMQ / Kafka / Redis Streams to hold immediately executable tasks.\n   - Worker Pool: Stateless task executors pulling from queues and executing user code/webhooks.\n\n2. Scheduling Mechanisms:\n   - Time-Wheel / Hierarchical Timing Wheel: High-throughput in-memory structure for fine-grained timer tracking (O(1) insertion and execution).\n   - Redis Sorted Set (ZSET): Score is the Unix epoch execution time. Dispatcher polls using ZRANGEBYSCORE with ZPOPMIN to atomically acquire tasks whose time <= now.\n\n3. Reliability & Fault Tolerance:\n   - At-least-once delivery with idempotency keys.\n   - Heartbeat monitoring: Workers periodically ping. If worker dies, unacknowledged job is requeued.\n   - Dead-Letter Queue (DLQ) with exponential backoff retry policies for failing jobs.`,
    keyPoints: [
      'Using Redis Sorted Sets (ZSET) or Timing Wheels for delayed scheduling',
      'Preventing double execution across multiple dispatchers with atomic pops or distributed locks',
      'Cron parsing and next-run calculation',
      'Handling worker node failures via heartbeats and task leases',
      'Scalability via time-bucket partitioning',
    ],
    hints: [
      'Think about how to find jobs that are ready to run right now without full table scans',
      'Consider what happens if a task takes 30 minutes to execute',
    ],
  },

  'design a social media feed like twitter or facebook': {
    expectedAnswer: `Architecture Overview:\n1. Feed Generation Models:\n   - Push Model (Fan-out on Write): When a user posts, immediately write the post ID into the feed cache (Redis list) of all their followers. (O(1) read latency; expensive for celebrity posts).\n   - Pull Model (Fan-out on Read): Feed is generated dynamically when user opens the app by querying followee posts. (Fast writes, slow reads).\n   - Hybrid Model (Industry Standard):\n     * Normal users (<25k followers): Fan-out on write into follower Redis timelines.\n     * Celebrities / High-follower accounts: Handled via fan-out on read and merged into user feed at query time.\n\n2. Storage & Caching:\n   - User timeline cache: Redis Sorted Set (key: user_id, score: post_timestamp).\n   - Post storage: Cassandra / DynamoDB or partitioned relational DB.\n   - Media storage: S3 + CDN for images and video thumbnails.\n\n3. Ranking & Pagination:\n   - Cursor-based pagination using post timestamp/ID to prevent duplicate or skipped posts during real-time scrolling.`,
    keyPoints: [
      'Fan-out on Write vs Fan-out on Read vs Hybrid approach',
      'The celebrity / high fan-out problem and how to mitigate it',
      'Cursor-based pagination instead of offset-based pagination',
      'In-memory timeline caching using Redis Sorted Sets',
      'Ranking and engagement feed algorithms',
    ],
    hints: [
      'Ask whether the feed is strictly chronological or algorithmic/ranked',
      'Address what happens when high-follower accounts post a message',
    ],
  },

  'explain how you would scale a web application to handle millions of users': {
    expectedAnswer: `Comprehensive Scaling Strategy:\n1. Stateless Application Tier:\n   - Decouple session state from application servers using distributed cache (Redis) or JWTs.\n   - Deploy behind Load Balancers (HAProxy, AWS ALB, NGINX) with auto-scaling groups based on CPU/traffic metrics.\n\n2. Multi-Layer Caching Strategy:\n   - Client & CDN: Edge cache static assets and public API responses with Cache-Control headers.\n   - Application Cache: Redis / Memcached for expensive database query results and user sessions.\n   - DB Buffer Pool: Tune database buffer pools and query caches.\n\n3. Database Scaling:\n   - Read/Write Splitting: Primary database handles writes; multiple read replicas handle query load.\n   - Sharding / Horizontal Partitioning: Partition tables by user_id across physical database clusters.\n   - Database Connection Pooling (PgBouncer, HikariCP) to avoid connection saturation.\n\n4. Asynchronous Architecture:\n   - Offload heavy tasks (image processing, emails, report generation) to background job queues (Kafka, RabbitMQ, Celery).\n\n5. Resilience & Observability:\n   - Circuit breakers, rate limiting, graceful degradation, and distributed tracing.`,
    keyPoints: [
      'Stateless architecture enables horizontal autoscaling behind load balancers',
      'Multi-tier caching (CDN -> Redis -> DB buffer pools)',
      'Database evolution: Read replicas -> Caching -> Sharding',
      'Asynchronous task processing with message queues',
      'Graceful degradation with circuit breakers and rate limiting',
    ],
    hints: [
      'Start with a single server baseline and systematically identify the bottlenecks',
      'Explain vertical scaling vs horizontal scaling',
    ],
  },

  'how would you design a real-time chat application': {
    expectedAnswer: `Architecture Overview:\n1. Communication Protocols:\n   - WebSockets for bi-directional, persistent, low-latency communication.\n   - HTTP/REST for authentication, profile management, and uploading media.\n\n2. Real-Time Message Routing:\n   - WebSocket Gateway Servers maintain persistent TCP connections with active users.\n   - Pub/Sub message broker (Redis Pub/Sub or Kafka) connects the distributed gateway nodes so User A connected to Gateway 1 can instantly send messages to User B connected to Gateway 2.\n\n3. Message Storage & History:\n   - Wide-column store (Cassandra / ScyllaDB) or DynamoDB: Optimized for high sequential write throughput with primary key (conversation_id, message_id).\n\n4. Presence & Offline Delivery:\n   - Online status tracked in Redis with TTL heartbeats.\n   - If recipient is offline, message is stored in DB and an event is queued for Push Notification Service (FCM/APNs).\n\n5. Message Status Tracking:\n   - Sent (single check), Delivered (double check), Read (blue check) receipts.`,
    keyPoints: [
      'WebSockets with Pub/Sub cluster for cross-server message dispatch',
      'Cassandra / DynamoDB schema design for chat messages (conversation_id partition key)',
      'Presence system using Redis key expiration and heartbeats',
      'Push notification bridge for offline recipients',
      'Message ordering using Snowflake IDs or Lamport timestamps',
    ],
    hints: [
      'Explain why HTTP polling is inefficient for active chatters',
      'Discuss group chats vs 1-on-1 private messaging',
    ],
  },

  'how would you design a notification system': {
    expectedAnswer: `Architecture Overview:\n1. Core Components:\n   - Notification Service API: Ingests notification requests from other microservices. Validates payloads and deduplicates events.\n   - User Preference Service: Checks user notification settings (push enabled, email disabled, quiet hours).\n   - Priority Queue System: RabbitMQ / Kafka with segregated queues for Critical (OTP, payment receipts) vs Non-Critical (marketing digests).\n   - Dispatcher Workers: Specialized workers for each communication channel (APNs/FCM for push, SendGrid/SES for email, Twilio for SMS).\n   - Rate Limiter: Protects users from notification spam and respects provider rate quotas.\n\n2. Reliability & Delivery:\n   - Message persistence in database with status tracking (Created -> Queued -> Sent -> Delivered -> Failed).\n   - Exponential backoff retry with Dead-Letter Queues for failed deliveries.\n   - Idempotency key per event to prevent duplicate notifications.\n\n3. Template Engine:\n   - Dynamic templates with i18n support rendering localized text and variables based on recipient language.`,
    keyPoints: [
      'Separation of channels (Push, Email, SMS) with dedicated worker pools',
      'User notification preferences and do-not-disturb (quiet hours) logic',
      'Priority queues to prevent marketing blasts from delaying critical 2FA OTP codes',
      'Rate limiting per user and retry logic with DLQs',
      'Idempotency to prevent sending duplicate notifications',
    ],
    hints: [
      'Clarify different notification channels and delivery guarantees',
      'Think about user experience: what prevents a bug from spamming a user?',
    ],
  },

  'design a url shortening service like bit.ly': {
    expectedAnswer: `System Architecture:\n1. Core Functional Flow:\n   - Shorten: POST /api/shorten { longUrl } -> Returns https://short.ly/{hash}\n   - Redirect: GET /{hash} -> 301 (Permanent) or 302 (Temporary) redirect to longUrl.\n\n2. Short Code Generation:\n   - Base62 Encoding: Characters [0-9, a-z, A-Z] (62 possible characters).\n   - 7-character string provides 62^7 ≈ 3.5 trillion unique short URLs.\n   - Distributed ID Generator (Twitter Snowflake) -> Convert 64-bit integer into Base62 string. Guaranteed collision-free, O(1).\n\n3. Redirection & HTTP Status:\n   - 301 Redirect: Browser caches redirect (reduces server load, but blinds server from analytics).\n   - 302 Redirect: Every click hits server (enables real-time analytics and geo-tracking).\n\n4. Caching & Database:\n   - Read-to-write ratio is typically 100:1 (read-heavy).\n   - Redis cluster caches hot mappings (hash -> longUrl).\n   - NoSQL Key-Value store (DynamoDB / Cassandra) or PostgreSQL with unique index on shortCode.`,
    keyPoints: [
      'Base62 encoding of counter / distributed IDs (62^7 = 3.5T unique links)',
      '301 vs 302 redirect trade-offs regarding analytics vs caching',
      'Read-heavy optimization using Redis cache',
      'Distributed unique ID generation without single point of failure',
      'Click analytics collection asynchronously via Kafka',
    ],
    hints: [
      'Calculate scale: if 100M URLs created/month, estimate storage needed for 5-10 years',
      'Explain how Base62 works and why it is chosen over Base64',
    ],
  },

  'design a rate limiter for an api': {
    expectedAnswer: `System Architecture:\n1. Common Rate Limiting Algorithms:\n   - Token Bucket: Tokens added at constant rate up to burst capacity. Each request consumes one token. Allows bursts while maintaining average rate. (Industry Standard - AWS/Stripe).\n   - Leaking Bucket: Requests enter FIFO queue and are processed at constant outflow rate. Smooths out traffic spikes.\n   - Fixed Window Counter: Divides time into fixed windows. Flaw: 2x rate burst at window boundaries.\n   - Sliding Window Counter: Hybrid combining previous window weight and current count. Low memory and prevents boundary spikes.\n\n2. Distributed Implementation:\n   - Storage: In-memory distributed cache (Redis) using atomic operations.\n   - Token Bucket in Redis: Implemented via Redis Lua Script to ensure atomic check-and-decrement, eliminating race conditions.\n\n3. Placement & Headers:\n   - Positioned at API Gateway / Reverse Proxy (Kong, Envoy, NGINX) before reaching backend application services.\n   - Headers: X-Ratelimit-Limit, X-Ratelimit-Remaining, X-Ratelimit-Reset.\n   - HTTP 429 Too Many Requests returned when quota exceeded.`,
    keyPoints: [
      'Comparison of Token Bucket, Leaking Bucket, and Sliding Window Counter',
      'Using Redis Lua scripts to prevent race conditions across distributed servers',
      'Standard HTTP 429 response and rate-limiting headers',
      'Rate-limiting keys (Client IP, User ID, API Token)',
      'Graceful degradation when rate-limiter cache fails',
    ],
    hints: [
      'Compare algorithms by memory consumption, accuracy, and handling of bursts',
      'Explain why a simple GET + increment + SET in Redis causes race conditions',
    ],
  },

  'explain the difference between an array and a linked list': {
    expectedAnswer: `Detailed Comparison:\n1. Memory Allocation:\n   - Array: Contiguous block of memory allocated statically or dynamically. Elements stored adjacent to each other.\n   - Linked List: Non-contiguous nodes scattered across heap memory, connected by pointers/references.\n\n2. Access & Search:\n   - Array: O(1) random access by index via formula: Address = BaseAddress + index * element_size.\n   - Linked List: O(n) sequential access. Must traverse from head node pointer by pointer.\n\n3. Insertion & Deletion:\n   - Array: O(n) in worst/average case due to shifting elements (O(1) amortized at end for dynamic arrays).\n   - Linked List: O(1) if pointer to target node is already known (e.g., insert at head/tail). O(n) to find the position.\n\n4. Cache Locality & Memory Overhead:\n   - Array: Excellent spatial locality of reference. CPU pre-fetches contiguous elements into L1/L2 cache lines.\n   - Linked List: Poor cache locality due to heap fragmentation. Extra memory overhead per node to store pointers.\n\nWhen to use which:\n- Use Array: Frequent random index access, fixed/predictable size, cache-friendly iterations.\n- Use Linked List: Frequent insertions/deletions at both ends (e.g., queues, LRU caches).`,
    keyPoints: [
      'Contiguous vs non-contiguous memory allocation',
      'O(1) random access in arrays vs O(n) traversal in linked lists',
      'O(1) insertion at head in linked lists vs O(n) shifting in arrays',
      'CPU cache line locality advantages of arrays',
      'Pointer memory overhead in linked lists',
    ],
    hints: [
      'Highlight CPU cache locality - interviewers love this distinction',
      'Discuss real-world scenarios like LRU Cache implementation',
    ],
  },

  'what is the time complexity of common operations in a binary search tree': {
    expectedAnswer: `Time Complexity Analysis:\n1. Balanced Binary Search Tree (AVL, Red-Black Tree):\n   - Search: O(log n)\n   - Insertion: O(log n)\n   - Deletion: O(log n)\n   - Find Min / Max: O(log n)\n\n2. Unbalanced / Skewed BST (Worst Case - degenerate tree like a linked list):\n   - Search: O(n)\n   - Insertion: O(n)\n   - Deletion: O(n)\n\n3. Auxiliary Operations & Space:\n   - In-order traversal: O(n) time (visits all nodes in ascending sorted order).\n   - Space Complexity: O(h) where h is tree height for recursive call stack (O(log n) for balanced, O(n) for skewed).\n\n4. Why Balancing Matters:\n   - Inserting sorted data [1, 2, 3, 4, 5] into an un-balanced BST produces a linear chain of depth n, reducing efficiency to O(n).\n   - Self-balancing trees (Red-Black trees) perform tree rotations to guarantee O(log n) bounds.`,
    keyPoints: [
      'Average / Balanced case is O(log n); worst case for skewed tree is O(n)',
      'Tree height h determines time complexity O(h)',
      'In-order traversal yields sorted order in O(n) time',
      'Self-balancing trees (AVL, Red-Black) maintain height of log(n) via rotations',
      'Stack memory space complexity is O(h)',
    ],
    hints: [
      'Always distinguish between balanced BST and degenerate/skewed BST',
      'Mention tree rotations used by Red-Black or AVL trees to prevent O(n) degradation',
    ],
  },

  'explain how a hash table works and how collisions are handled': {
    expectedAnswer: `Hash Table Internals:\n1. Core Mechanism:\n   - Key-value pairs stored in an underlying array.\n   - Hash function converts key into integer hash code, then modulo operation (hash % array_length) maps to array bucket index.\n   - Target time complexity: Average O(1) for insert, search, and delete.\n\n2. Collision Resolution Techniques:\n   - Separate Chaining: Each bucket holds a linked list or self-balancing tree (Java 8+ HashMap converts linked list to Red-Black tree when bucket length exceeds 8).\n   - Open Addressing (Probing): All elements stored directly in array.\n     * Linear Probing: If bucket full, check index + 1, index + 2...\n     * Quadratic Probing: Check index + 1^2, index + 2^2, index + 3^2...\n     * Double Hashing: Uses second hash function to calculate step interval.\n\n3. Load Factor & Rehashing:\n   - Load Factor α = (number of items) / (array capacity). Standard default is 0.75.\n   - When threshold exceeded, array doubles in capacity, and all elements are re-hashed into the new array (O(n) resizing cost, amortized O(1)).`,
    keyPoints: [
      'Hash function + modulo arithmetic maps keys to bucket indices',
      'Separate chaining vs Open addressing collision strategies',
      'Load factor (typically 0.75) and dynamic rehashing/resizing',
      'Java 8 treeification optimization (linked list to Red-Black tree when bucket size > 8)',
      'Worst-case O(n) complexity when all keys collide into one bucket',
    ],
    hints: [
      'Explain what makes a good hash function (uniform distribution, deterministic, fast)',
      'Explain load factor and why we rehash before the table is 100% full',
    ],
  },

  'what is the difference between bfs and dfs? when would you use each': {
    expectedAnswer: `Comparison of BFS & DFS:\n1. Breadth-First Search (BFS):\n   - Traversal Order: Level by level, visiting all neighbors at current distance before moving deeper.\n   - Data Structure: Queue (FIFO).\n   - Time Complexity: O(V + E) for graphs; O(n) for trees.\n   - Space Complexity: O(w) where w is max width of tree.\n   - Best Use Cases:\n     * Finding the shortest path in unweighted graphs or grids (e.g., shortest word ladder, maze exit).\n     * Level-order tree serialization.\n     * Finding nearest nodes or social network connections within degree k.\n\n2. Depth-First Search (DFS):\n   - Traversal Order: Explores as far as possible down each branch before backtracking.\n   - Data Structure: Stack (LIFO) or recursive call stack.\n   - Time Complexity: O(V + E) for graphs; O(n) for trees.\n   - Space Complexity: O(h) where h is max depth of graph/tree.\n   - Best Use Cases:\n     * Topological sort and dependency resolution.\n     * Cycle detection in directed/undirected graphs.\n     * Path finding when exploring all permutations (backtracking, Sudoku, N-Queens).\n     * Connected components count (Flood Fill / Number of Islands).`,
    keyPoints: [
      'BFS uses Queue (FIFO); DFS uses Stack (LIFO) or recursion',
      'BFS guarantees shortest path in unweighted graphs',
      'DFS has lower memory footprint when trees/graphs are wide but shallow',
      'Both have O(V + E) time complexity on adjacency lists',
      'Cycle detection and topological sort are best solved with DFS',
    ],
    hints: [
      'Remember: "Shortest path in unweighted graph" = always BFS',
      'Remember: "Exhaustive combinatorial search / backtracking" = always DFS',
    ],
  },

  'explain the virtual dom in react and why it improves performance': {
    expectedAnswer: `Virtual DOM Architecture:\n1. What is the Virtual DOM?\n   - A lightweight JavaScript object representation of the actual browser DOM kept in memory.\n\n2. Why the Real DOM is Slow:\n   - Direct DOM manipulation causes expensive browser layout recalculations, style re-computations, and repaints/reflows across the render tree.\n\n3. The Reconciliation Process:\n   - Step 1 (Render): When state/props change, React creates a new Virtual DOM tree.\n   - Step 2 (Diffing): React compares the new Virtual DOM with the previous snapshot using a heuristic O(n) diffing algorithm.\n   - Step 3 (Commit/Batching): React calculates the minimal set of real DOM operations required and applies them in a single batched browser reflow.\n\n4. React Fiber:\n   - Incremental, interruptible work units allowing high-priority updates (typing, animations) to interrupt background rendering.`,
    keyPoints: [
      'In-memory lightweight JS object tree representing UI',
      'Eliminates unnecessary layout and reflow recalculations by batching real DOM writes',
      'Heuristic O(n) diffing algorithm using component types and stable list keys',
      'Reconciliation separates render phase (pure computation) from commit phase (DOM mutations)',
      'React Fiber enables asynchronous scheduling and priority-based interruptible rendering',
    ],
    hints: [
      'Clarify that Virtual DOM makes declarative UI fast by default',
      'Emphasize why "keys" are critical in lists during reconciliation',
    ],
  },

  'explain how cors works and why it is important for web security': {
    expectedAnswer: `Cross-Origin Resource Sharing (CORS):\n1. Same-Origin Policy (SOP):\n   - Fundamental browser security model restricting a script on origin A from reading responses from origin B without explicit server permission (protocol, domain, port).\n\n2. How CORS Works:\n   - Simple Requests: Browser sends Origin header; server responds with Access-Control-Allow-Origin.\n   - Preflight Requests: Browser sends HTTP OPTIONS request with Access-Control-Request-Method and Headers. Server responds with 200/204 and Access-Control-Allow-Origin, Allow-Methods, Allow-Headers.\n\n3. Credentials:\n   - When sending cookies or Authorization headers withCredentials = true, server MUST specify exact origin (never wildcard *) and include Access-Control-Allow-Credentials: true.`,
    keyPoints: [
      'Enforced strictly by the client browser based on Same-Origin Policy (protocol, domain, port)',
      'Preflight OPTIONS request triggered for non-simple methods or custom headers',
      'Key headers: Access-Control-Allow-Origin, Allow-Methods, Allow-Headers',
      'CORS protects users from malicious third-party websites reading private session data',
      'Credentialed requests require exact origin specification, never wildcard *',
    ],
    hints: [
      'Emphasize that CORS is a browser-enforced security mechanism, not a backend firewall',
      'Explain why curl or Postman requests work even when CORS is blocked in Chrome',
    ],
  },

  'explain the event loop in javascript': {
    expectedAnswer: `JavaScript Event Loop Architecture:\n1. Single-Threaded Runtime:\n   - JavaScript engine (V8) has a single Call Stack and Memory Heap executing one piece of code at a time synchronously.\n\n2. Concurrency Model:\n   - Call Stack: Executes synchronous frames until empty.\n   - Web APIs / Node libuv: Handles asynchronous operations (DOM events, fetch, setTimeout, fs) in background threads.\n   - Callback Queues:\n     * Microtask Queue: Highest priority. Holds Promise .then() callbacks, queueMicrotask(), MutationObserver (process.nextTick in Node).\n     * Macrotask Queue: Holds setTimeout, setInterval, setImmediate, and I/O callbacks.\n\n3. Event Loop Execution Order:\n   1. Execute synchronous code on Call Stack until empty.\n   2. Drain ALL microtasks from Microtask Queue until empty.\n   3. Render UI updates (in browser).\n   4. Dequeue ONE task from Macrotask Queue onto Call Stack.\n   5. Repeat cycle.`,
    keyPoints: [
      'Single-threaded Call Stack executes synchronous code to completion',
      'Asynchronous operations offloaded to Web APIs / Node libuv worker threads',
      'Microtask queue (Promises) has strict priority over Macrotask queue (setTimeout)',
      'Microtasks are completely drained after each task before browser repainting or next macrotask',
      'Blocking the call stack freezes UI interactions and animations',
    ],
    hints: [
      'Explain microtask vs macrotask execution order explicitly',
      'Walk through console.log, setTimeout(0), and Promise.resolve().then() execution sequence',
    ],
  },

  'what is the difference between rest and graphql': {
    expectedAnswer: `Comprehensive Comparison:\n1. Architecture & Design:\n   - REST: Resource-oriented. Standard HTTP methods (GET, POST, PUT, DELETE) and multiple discrete URL endpoints.\n   - GraphQL: Query-language-oriented. Single HTTP POST endpoint (/graphql) where client explicitly requests the exact fields needed via schema definition.\n\n2. Over-fetching & Under-fetching:\n   - REST: Often over-fetches unwanted fields or under-fetches requiring multiple roundtrips (N+1 API calls).\n   - GraphQL: Eliminates over/under-fetching via declarative nested queries in a single HTTP request.\n\n3. Caching:\n   - REST: Built-in HTTP caching works out-of-the-box using HTTP status codes, ETags, and browser/CDN cache headers.\n   - GraphQL: Because all requests hit single POST endpoint, standard HTTP-level caching cannot be used. Requires client-side normalized caches (Apollo Client, Relay).`,
    keyPoints: [
      'Single endpoint with declarative query payload vs multiple resource endpoints',
      'Solves over-fetching and under-fetching on client applications',
      'HTTP caching is straightforward in REST; complex in GraphQL',
      'Strongly typed schema with introspective documentation in GraphQL',
      'Backend N+1 database problem in GraphQL mitigated via DataLoader batching',
    ],
    hints: [
      'Explain the DataLoader pattern for solving N+1 database queries in GraphQL resolvers',
      'Discuss how CDN caching favors RESTful endpoints',
    ],
  },

  'tell me about yourself and your experience': {
    expectedAnswer: `Recommended Response Structure (Present -> Past -> Future Framework):\n1. Present (30-45 seconds):\n   - Current role, core technical competencies, and day-to-day focus.\n2. Past Highlights (45-60 seconds):\n   - Foundational journey and 1-2 major technical achievements demonstrating problem-solving and quantifiable impact.\n3. Future & Why This Role (30 seconds):\n   - Why you are excited about this specific opportunity, team, and company mission.\n   - How your skills directly align with the challenges this role tackles.`,
    keyPoints: [
      'Follow Present -> Past -> Future structural framework',
      'Keep response concise (under 2 minutes); do not recite resume line-by-line',
      'Highlight 1-2 quantifiable business impacts or architectural achievements',
      'Tailor the conclusion directly to why you want this specific position',
      'Exude professional enthusiasm and self-awareness',
    ],
    hints: [
      'Do not just recite your chronological resume',
      'Quantify results with metrics (latencies reduced, revenue enabled, users served)',
    ],
  },

  'tell me about a time when you had to work with a difficult team member': {
    expectedAnswer: `Structure using the STAR Framework (Situation, Task, Action, Result):\n1. Situation:\n   - Objective technical disagreement without disparaging the individual.\n2. Task:\n   - Define shared goal to deliver reliable software on time without blocking teammates.\n3. Action:\n   - Held private 1-on-1 to understand underlying concerns; created a 1-page design doc with benchmarking data; built a rapid prototype to test assumptions collaboratively.\n4. Result & Reflection:\n   - Reached technical consensus, shipped on time with zero regressions, and established standard RFC templates for future architectural decisions.`,
    keyPoints: [
      'STAR method: Situation, Task, Action, Result',
      'Never speak negatively about colleagues; frame conflict around ideas and goals',
      'Active listening and seeking to understand the other person perspective',
      'Using data, prototypes, and objective decision criteria to break deadlocks',
      'Positive resolution and long-term team relationship growth',
    ],
    hints: [
      'Focus 70% of your answer on YOUR actions and constructive communication',
      'Demonstrate emotional intelligence and blameless collaboration',
    ],
  },

  'tell me about a time you failed. what did you learn from it': {
    expectedAnswer: `Structure using the STAR Framework:\n1. Situation:\n   - Real technical or process mistake with personal ownership (e.g., table-locking migration during release causing brief timeout spike).\n2. Task:\n   - Immediate responsibility to mitigate user impact, restore availability, and prevent recurrence.\n3. Action:\n   - Rolled back quickly with DBA assistance; wrote blameless post-mortem; integrated safe migration linters into CI pipeline; created dry-run staging protocol.\n4. Result & Learning:\n   - Zero migration downtime incidents in the following years; learned that automated guardrails and blameless post-mortems are far more effective than manual caution.`,
    keyPoints: [
      'Pick a genuine failure where you had personal ownership, not a disguised triumph',
      'Demonstrate immediate composure, ownership, and swift incident mitigation',
      'Conduct blameless root cause analysis (RCA)',
      'Implemented lasting automated guardrails to ensure the mistake never recurs',
      'Show genuine maturity, humility, and engineering growth',
    ],
    hints: [
      'Avoid cliché answers like "I worked too hard"',
      'Focus heavily on the systemic prevention measures you put in place afterward',
    ],
  },
};

function normalizeKey(text = '') {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findCuratedAnswer(questionText = '') {
  if (!questionText) return null;
  const normalized = normalizeKey(questionText);

  if (curatedAnswersMap[normalized]) {
    return curatedAnswersMap[normalized];
  }

  for (const [key, val] of Object.entries(curatedAnswersMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return val;
    }
  }

  // Keywords heuristic matching
  if (
    normalized.includes('ecommerce') ||
    (normalized.includes('commerce') && normalized.includes('catalog'))
  ) {
    return curatedAnswersMap['design an e-commerce platform with product catalog and checkout'];
  }
  if (
    normalized.includes('autocomplete') ||
    (normalized.includes('search') && normalized.includes('suggest'))
  ) {
    return curatedAnswersMap['design a search autocomplete feature for a search engine'];
  }
  if (
    normalized.includes('video streaming') ||
    (normalized.includes('youtube') && normalized.includes('stream'))
  ) {
    return curatedAnswersMap['how would you design a video streaming platform like youtube'];
  }
  if (normalized.includes('job scheduler') || normalized.includes('scheduler system')) {
    return curatedAnswersMap['how would you design a job scheduler system'];
  }
  if (
    normalized.includes('social media feed') ||
    normalized.includes('twitter') ||
    normalized.includes('news feed')
  ) {
    return curatedAnswersMap['design a social media feed like twitter or facebook'];
  }
  if (normalized.includes('scale a web application') || normalized.includes('millions of users')) {
    return curatedAnswersMap[
      'explain how you would scale a web application to handle millions of users'
    ];
  }
  if (
    normalized.includes('realtime chat') ||
    normalized.includes('chat application') ||
    normalized.includes('slack')
  ) {
    return curatedAnswersMap['how would you design a real-time chat application'];
  }
  if (normalized.includes('notification system') || normalized.includes('notifications')) {
    return curatedAnswersMap['how would you design a notification system'];
  }
  if (
    normalized.includes('url shortening') ||
    normalized.includes('tinyurl') ||
    normalized.includes('bitly')
  ) {
    return curatedAnswersMap['design a url shortening service like bit.ly'];
  }
  if (normalized.includes('rate limiter') || normalized.includes('rate limiting')) {
    return curatedAnswersMap['design a rate limiter for an api'];
  }
  if (
    normalized.includes('array and a linked list') ||
    (normalized.includes('array') && normalized.includes('linked list'))
  ) {
    return curatedAnswersMap['explain the difference between an array and a linked list'];
  }
  if (normalized.includes('binary search tree') || normalized.includes('bst')) {
    return curatedAnswersMap[
      'what is the time complexity of common operations in a binary search tree'
    ];
  }
  if (
    normalized.includes('hash table') ||
    normalized.includes('hashmap') ||
    normalized.includes('collisions')
  ) {
    return curatedAnswersMap['explain how a hash table works and how collisions are handled'];
  }
  if (
    normalized.includes('bfs and dfs') ||
    (normalized.includes('bfs') && normalized.includes('dfs'))
  ) {
    return curatedAnswersMap['what is the difference between bfs and dfs? when would you use each'];
  }
  if (
    normalized.includes('virtual dom') ||
    (normalized.includes('dom') && normalized.includes('reconciliation'))
  ) {
    return curatedAnswersMap['explain the virtual dom in react and why it improves performance'];
  }
  if (normalized.includes('cors') || normalized.includes('cross origin')) {
    return curatedAnswersMap['explain how cors works and why it is important for web security'];
  }
  if (
    normalized.includes('event loop') ||
    (normalized.includes('microtask') && normalized.includes('macrotask'))
  ) {
    return curatedAnswersMap['explain the event loop in javascript'];
  }
  if (
    normalized.includes('rest and graphql') ||
    (normalized.includes('graphql') && normalized.includes('rest'))
  ) {
    return curatedAnswersMap['what is the difference between rest and graphql'];
  }
  if (
    normalized.includes('tell me about yourself') ||
    normalized.includes('walk me through your resume')
  ) {
    return curatedAnswersMap['tell me about yourself and your experience'];
  }
  if (normalized.includes('difficult team member') || normalized.includes('conflict with')) {
    return curatedAnswersMap[
      'tell me about a time when you had to work with a difficult team member'
    ];
  }
  if (normalized.includes('time you failed') || normalized.includes('biggest failure')) {
    return curatedAnswersMap['tell me about a time you failed. what did you learn from it'];
  }

  return null;
}

try {
  const { additionalQuestions } = require('../seeds/additionalQuestions');
  const { additionalBatch2 } = require('../seeds/additionalBatch2');
  const allBatches = [
    ...(Array.isArray(additionalQuestions) ? additionalQuestions : []),
    ...(Array.isArray(additionalBatch2) ? additionalBatch2 : []),
  ];

  for (const q of allBatches) {
    const k = normalizeKey(q.text);
    if (!curatedAnswersMap[k]) {
      curatedAnswersMap[k] = {
        expectedAnswer: q.expectedAnswer,
        keyPoints: q.keyPoints || [],
        hints: q.hints || [],
        followUpQuestions: q.followUpQuestions || [],
      };
    }
  }
} catch (e) {
  // non-blocking
}

module.exports = {
  curatedAnswersMap,
  findCuratedAnswer,
};
