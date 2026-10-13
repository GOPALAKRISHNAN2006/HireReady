/**
 * Comprehensive curated answers and evaluation criteria for Interview Question Bank.
 * Used as high-quality fallback whenever questions in the database lack pre-filled expected answers.
 */

export const curatedAnswersMap = {
  // System Design
  'design an e-commerce platform with product catalog and checkout': {
    expectedAnswer: `Architecture Overview:
1. High-Level Components:
   - API Gateway / Reverse Proxy: Route traffic, rate limiting, SSL termination, and authentication.
   - Product Catalog Service: Read-heavy service backed by Elasticsearch / MongoDB for fast product filtering, faceted search, and categorization. Redis for hot item caching.
   - Inventory Service: Manages stock levels with distributed locks (Redis Redlock or DB row-level locking) to prevent overselling.
   - Shopping Cart Service: Ephemeral storage using Redis with TTL or DynamoDB, persisting cart state per user/session.
   - Order Service: Orchestrates order placement, state transitions (Pending -> Paid -> Shipped), and communicates with payment gateways via idempotent webhooks.
   - Payment Service: Integrates with Stripe/PayPal. Uses idempotency keys to avoid double-charging.
   - Notification Service: Event-driven worker consuming from RabbitMQ/Kafka to dispatch emails and SMS updates.

2. Database & Data Consistency:
   - Polyglot persistence: PostgreSQL for ACID financial transactions (Orders, Payments); MongoDB/Elasticsearch for product catalog and fuzzy text queries.
   - Saga Pattern (Choreography/Orchestration) for distributed transactions across Order, Payment, and Inventory services instead of 2PC.

3. Scalability & Resilience:
   - Multi-tier caching: CDN for static assets & images, Redis for product details and user sessions.
   - Read/write replicas for relational databases.
   - Asynchronous queueing (Kafka/RabbitMQ) for checkout fulfillment and email processing to maintain sub-second user latency.`,
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
      'How do you handle shopping cart migration when an anonymous user logs in?',
    ],
  },

  'design a search autocomplete feature for a search engine': {
    expectedAnswer: `System Architecture:
1. Data Structures:
   - Trie (Prefix Tree): In-memory trie where each node stores characters and precomputed top-k highest frequency search queries to achieve O(prefix_length) response time.
   - Serialization: Compact binary serialization or Ternary Search Trees (TST) to minimize RAM footprint.

2. Real-Time Query Pipeline:
   - Client sends debounce-throttled keystroke events (e.g., 200ms delay).
   - API Gateway routes to Autocomplete Service.
   - In-memory cache (Redis) checks prefix -> top results. Cache hit rate is typically 80%+.
   - If cache miss, query Trie cluster partitioned by prefix (e.g., a-c, d-f) with replication.

3. Offline Aggregation Pipeline:
   - User query logs collected via Kafka into stream processing (Apache Flink / Spark Streaming).
   - MapReduce / Weekly aggregation computes query frequency and trending decay score: Score = Frequency * e^(-λ * t).
   - Background worker updates Trie nodes and invalidates stale Redis cache keys.

4. Scalability & Latency Optimization:
   - Target latency: < 50ms per keystroke.
   - Client-side caching: Browser caches results for common prefixes.
   - Geo-distributed Edge caching via CDN.`,
    keyPoints: [
      'Trie data structure with precomputed top suggestions stored at each node',
      'Debouncing at client tier to prevent query storms',
      'Separation of read-path (sub-50ms trie lookup) and write-path (batch/streaming frequency aggregation)',
      'Filtering inappropriate or adult queries via blacklist Bloom filters',
      'Partitioning strategy for Trie shards across servers',
    ],
    hints: [
      'Focus on keeping keystroke response under 50ms',
      'Explain why updating the Trie on every single search in real time is a bottleneck',
      'Think about personalization and trending query decay over time',
    ],
    followUpQuestions: [
      'How would you support multi-language and typo tolerance (fuzzy matching)?',
      'How would you incorporate personalized suggestions based on user history?',
    ],
  },

  'how would you design a video streaming platform like youtube': {
    expectedAnswer: `System Architecture:
1. Video Ingestion & Processing Pipeline:
   - Client uploads video chunked via multipart upload directly to Object Storage (AWS S3) using presigned URLs.
   - Upload completion event publishes to Kafka queue.
   - Transcoding cluster (FFmpeg workers on GPU instances) converts raw video into adaptive bitrate formats (HLS / MPEG-DASH) at multiple resolutions (1080p, 720p, 480p, 360p).
   - Generates thumbnails, extracts audio for captions, and splits video into small 2-6 second TS/MP4 segments.

2. Video Delivery & Streaming:
   - Global CDN (Cloudflare / CloudFront) caches video segments geographically close to viewers.
   - Video player automatically switches stream quality based on current network bandwidth (Adaptive Bitrate Streaming).

3. Metadata & Search:
   - Relational DB (PostgreSQL) for user accounts, channel metadata, and subscriptions.
   - NoSQL (Cassandra / DynamoDB) for high-write view counts, video statistics, and comments.
   - Elasticsearch for video title, description, and tag search.

4. View Count & Recommendation:
   - Asynchronous batch counting via Kafka and Redis HyperLogLog to prevent view count fraud and deduplicate repeated views.
   - Dedicated recommendation service leveraging collaborative filtering and embedding vectors.`,
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
      'Address copyright and content moderation workflows',
    ],
    followUpQuestions: [
      'How do you prevent hot video thundering herd problems on CDN cache misses?',
      'How does YouTube manage live streaming latency compared to VOD (video-on-demand)?',
    ],
  },

  'how would you design a job scheduler system': {
    expectedAnswer: `Architecture Overview:
1. Core Components:
   - Job API / Gateway: Exposes endpoints for clients to submit, cancel, and inspect scheduled jobs (one-off, delayed, or recurring cron).
   - Job Store (Database): Relational DB or distributed key-value store holding job metadata, cron expressions, payload, status, and next execution timestamp.
   - Poller / Dispatcher Cluster: Distributed workers running leader-election (via ZooKeeper or Redis Redlock) or time-partitioned indexing.
   - Distributed Queue: RabbitMQ / Kafka / Redis Streams to hold immediately executable tasks.
   - Worker Pool: Stateless task executors pulling from queues and executing user code/webhooks.

2. Scheduling Mechanisms:
   - Time-Wheel / Hierarchical Timing Wheel: High-throughput in-memory structure for fine-grained timer tracking (O(1) insertion and execution).
   - Redis Sorted Set (ZSET): Score is the Unix epoch execution time. Dispatcher polls using ZRANGEBYSCORE with ZPOPMIN to atomically acquire tasks whose time <= now.

3. Reliability & Fault Tolerance:
   - At-least-once delivery with idempotency keys.
   - Heartbeat monitoring: Workers periodically ping. If worker dies, unacknowledged job is requeued.
   - Dead-Letter Queue (DLQ) with exponential backoff retry policies for failing jobs.`,
    keyPoints: [
      'Using Redis Sorted Sets (ZSET) or Timing Wheels for delayed scheduling',
      'Preventing double execution across multiple dispatchers with atomic pops or distributed locks',
      'Cron parsing and next-run calculation',
      'Handling worker node failures via heartbeats and task leases (visibility timeout)',
      'Scalability via time-bucket partitioning',
    ],
    hints: [
      'Think about how to find jobs that are ready to run right now without full table scans',
      'Consider what happens if a task takes 30 minutes to execute',
      'Explain how recurring cron jobs update their next execution time',
    ],
    followUpQuestions: [
      'How do you ensure jobs with high execution times do not block quick jobs?',
      'How do you handle clock drift across distributed server nodes?',
    ],
  },

  'design a social media feed like twitter or facebook': {
    expectedAnswer: `Architecture Overview:
1. Feed Generation Models:
   - Push Model (Fan-out on Write): When a user posts, immediately write the post ID into the feed cache (Redis list) of all their followers.
     * Pros: O(1) feed read latency.
     * Cons: High write cost for celebrity users with millions of followers.
   - Pull Model (Fan-out on Read): Feed is generated dynamically when user opens the app by querying followee posts.
     * Pros: Fast writes.
     * Cons: Slow reads with complex joins.
   - Hybrid Model (Industry Standard):
     * Normal users (<25k followers): Fan-out on write into follower Redis timelines.
     * Celebrities / High-follower accounts: Handled via fan-out on read and merged into user feed at query time.

2. Storage & Caching:
   - User timeline cache: Redis Sorted Set (key: user_id, score: post_timestamp).
   - Post storage: NoSQL (Cassandra / DynamoDB) or partitioned relational DB.
   - Media storage: S3 + CDN for images and video thumbnails.

3. Ranking & Pagination:
   - Cursor-based pagination (using post timestamp / ID) to prevent missing or duplicate posts during real-time scrolling.
   - ML ranking service scores posts based on engagement likelihood before returning the top 50.`,
    keyPoints: [
      'Comparison of Fan-out on Write vs Fan-out on Read vs Hybrid approach',
      'The celebrity / high fan-out problem and how to mitigate it',
      'Cursor-based pagination instead of offset-based pagination',
      'In-memory timeline caching using Redis Sorted Sets',
      'Ranking and engagement feed algorithms',
    ],
    hints: [
      'Ask whether the feed is strictly chronological or algorithmic/ranked',
      'Address what happens when Elon Musk or Cristiano Ronaldo posts a tweet',
      'Discuss how cursor pagination handles new incoming posts while scrolling',
    ],
    followUpQuestions: [
      'How would you support real-time feed updates while the user is actively reading?',
      'How do you handle post deletions and privacy checks across distributed caches?',
    ],
  },

  'explain how you would scale a web application to handle millions of users': {
    expectedAnswer: `Comprehensive Scaling Strategy:
1. Stateless Application Tier:
   - Decouple session state from application servers using distributed cache (Redis) or JWTs.
   - Deploy behind Load Balancers (HAProxy, AWS ALB, NGINX) using Round Robin or Least Connections with auto-scaling groups based on CPU/traffic metrics.

2. Multi-Layer Caching Strategy:
   - Client & CDN: Edge cache static assets, marketing pages, and public API responses with Cache-Control headers.
   - Application Cache: Redis / Memcached for expensive database query results, hot user sessions, and feature flags.
   - DB Buffer Pool: Tune database buffer pools and query caches.

3. Database Scaling:
   - Read/Write Splitting: Primary database handles writes; multiple read replicas handle query load.
   - Sharding / Horizontal Partitioning: Partition tables by user_id or tenant_id across physical database clusters.
   - Database Connection Pooling (PgBouncer, HikariCP) to avoid connection saturation.

4. Asynchronous Architecture:
   - Offload heavy tasks (image processing, emails, report generation) to background job queues (Kafka, RabbitMQ, Celery).

5. Resilience & Observability:
   - Circuit breakers (Resilience4j), rate limiting, graceful degradation, and distributed tracing (OpenTelemetry, Prometheus, Grafana).`,
    keyPoints: [
      'Stateless architecture enables horizontal autoscaling behind load balancers',
      'Multi-tier caching (CDN -> Redis -> DB buffer pools)',
      'Database evolution: Read replicas -> Caching -> Sharding / Partitioning',
      'Asynchronous task processing with message queues',
      'Microservices / bounded context decomposition when team and traffic grow',
    ],
    hints: [
      'Start with a single server baseline and systematically identify the bottlenecks',
      'Explain vertical scaling (scaling up) vs horizontal scaling (scaling out)',
      'Mention CAP theorem and eventual consistency implications',
    ],
    followUpQuestions: [
      'How do you manage database migrations on a multi-terabyte sharded cluster without downtime?',
      'How do you prevent cache stampede / thundering herd when an important cache key expires?',
    ],
  },

  'how would you design a real-time chat application': {
    expectedAnswer: `Architecture Overview:
1. Communication Protocols:
   - WebSockets for bi-directional, persistent, low-latency communication.
   - HTTP/REST for authentication, profile management, and uploading media.
   - WebRTC for peer-to-peer audio/video calls.

2. Real-Time Message Routing:
   - WebSocket Gateway Servers maintain persistent TCP connections with active users.
   - Pub/Sub message broker (Redis Pub/Sub or Kafka) connects the distributed gateway nodes so User A connected to Gateway 1 can instantly send messages to User B connected to Gateway 2.

3. Message Storage & History:
   - Wide-column store (Apache Cassandra / ScyllaDB) or DynamoDB: Optimized for high sequential write throughput with primary key (conversation_id, message_id).
   - Messages partitioned by conversation_id with clustered index on timestamp/snowflake ID.

4. Presence & Offline Delivery:
   - Online status tracked in Redis with TTL heartbeats (e.g., client pings every 30s).
   - If recipient is offline, message is stored in DB and an event is queued for Push Notification Service (FCM/APNs).

5. Security & Receipts:
   - End-to-end encryption (Signal Protocol) or TLS in transit + encryption at rest.
   - Message status states: Sent (single tick), Delivered (double tick), Read (blue tick).`,
    keyPoints: [
      'WebSockets with Pub/Sub cluster for cross-server message dispatch',
      'Cassandra / DynamoDB schema design for chat messages (conversation_id partition key)',
      'Presence system using Redis key expiration and heartbeats',
      'Push notification bridge for offline recipients',
      'Message ordering using Snowflake IDs or Lamport timestamps',
    ],
    hints: [
      'Explain why HTTP polling or long-polling is inefficient for 100k+ active chatters',
      'Discuss group chats: small groups (10 people) vs large channels (100,000 members)',
      'Consider media upload flow: media goes to S3 first, then link sent in chat',
    ],
    followUpQuestions: [
      'How would you implement message search across millions of historical messages?',
      'How does group chat fan-out differ from 1-on-1 private messaging?',
    ],
  },

  'how would you design a notification system': {
    expectedAnswer: `Architecture Overview:
1. Core Components:
   - Notification Service API: Ingests notification trigger requests from other microservices (Order, Auth, Marketing). Validates payloads and deduplicates events.
   - User Preference Service: Checks user notification settings (e.g., push enabled, email disabled, quiet hours).
   - Priority Queue System: RabbitMQ / Kafka with segregated queues for Critical (OTP, payment receipts) vs Non-Critical (marketing, weekly digests).
   - Dispatcher Workers: Specialized workers for each communication channel:
     * APNs / FCM for mobile push notifications
     * SendGrid / AWS SES for emails
     * Twilio for SMS
   - Rate Limiter: Protects users from notification spam and respects provider rate quotas.

2. Reliability & At-Least-Once Delivery:
   - Message persistence in database with status tracking (Created -> Queued -> Sent -> Delivered -> Failed).
   - Exponential backoff retry with Dead-Letter Queues for failed deliveries.
   - Idempotency key per event to prevent duplicate emails or SMS charges.

3. Template Engine & Localization:
   - Dynamic templates (Handlebars/Mustache) with i18n support rendering localized text and variables based on recipient language.`,
    keyPoints: [
      'Separation of channels (Push, Email, SMS) with dedicated worker pools',
      'User notification preferences and do-not-disturb (quiet hours) logic',
      'Priority queues to prevent marketing blasts from delaying critical 2FA OTP codes',
      'Rate limiting per user and retry logic with DLQs',
      'Idempotency to prevent sending duplicate notifications',
    ],
    hints: [
      'Clarify different notification channels and delivery guarantees',
      'Think about user experience: what prevents a bug from spamming a user 100 times?',
      'Consider analytics and delivery receipt webhooks',
    ],
    followUpQuestions: [
      'How do you track open rates and click-through rates across email and push?',
      'How would you handle sudden third-party provider outages (e.g., Twilio outage)?',
    ],
  },

  'design a url shortening service like bit.ly': {
    expectedAnswer: `System Architecture:
1. Core Functional Flow:
   - Shorten: POST /api/shorten { longUrl } -> Returns https://short.ly/{hash}
   - Redirect: GET /{hash} -> 301 (Permanent) or 302 (Temporary) redirect to longUrl.

2. Short Code Generation:
   - Base62 Encoding: Characters [0-9, a-z, A-Z] (62 possible characters).
   - 7-character string provides 62^7 ≈ 3.5 trillion unique short URLs.
   - Approach A: Distributed ID Generator (Twitter Snowflake) -> Convert 64-bit integer into Base62 string. Guaranteed collision-free, O(1).
   - Approach B: MD5/SHA-256 hash first 43 bits -> Base62. Requires collision check in DB.
   - Range-based Token Server (ZooKeeper assigning blocks of 1,000,000 IDs to app nodes).

3. Redirection & HTTP Status:
   - 301 Redirect: Browser caches redirect (reduces server load, but blinds server from click analytics).
   - 302 Redirect: Every click hits server (enables real-time analytics and geo-tracking). Recommended for Bitly.

4. Caching & Database:
   - Read-to-write ratio is typically 100:1 (read-heavy).
   - Redis cluster caches hot mappings (hash -> longUrl). 20% of URLs generate 80% of traffic (Pareto principle).
   - NoSQL Key-Value store (DynamoDB / Cassandra) or PostgreSQL with unique index on shortCode.`,
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
      'Discuss URL expiration and deletion policies',
    ],
    followUpQuestions: [
      'How do you prevent malicious phishing URLs from abusing the service?',
      'How would you design custom vanity URLs (e.g., short.ly/my-custom-link)?',
    ],
  },

  'design a rate limiter for an api': {
    expectedAnswer: `System Architecture:
1. Common Rate Limiting Algorithms:
   - Token Bucket: Tokens added at constant rate up to burst capacity. Each request consumes one token. Allows bursts while maintaining average rate. (Industry Standard - AWS/Stripe).
   - Leaking Bucket: Requests enter FIFO queue and are processed at constant outflow rate. Smooths out traffic spikes.
   - Fixed Window Counter: Divides time into fixed windows (e.g., 1 minute). Counter resets. Flaw: 2x rate burst at window boundaries.
   - Sliding Window Log: Stores timestamps of requests in Redis Sorted Set. Perfectly accurate, but high memory overhead.
   - Sliding Window Counter: Hybrid combining previous window weight and current count. Low memory and prevents boundary spikes.

2. Distributed Implementation:
   - Storage: In-memory distributed cache (Redis) using atomic operations.
   - Token Bucket in Redis: Implemented via Redis Lua Script to ensure atomic check-and-decrement, eliminating race conditions.

3. Placement & Architecture:
   - Positioned at API Gateway / Reverse Proxy (Kong, Envoy, NGINX) before reaching backend application services.
   - Response Headers:
     * X-Ratelimit-Limit: Max allowed requests
     * X-Ratelimit-Remaining: Remaining in current window
     * X-Ratelimit-Reset: Unix timestamp to quota replenishment
   - HTTP 429 Too Many Requests returned when quota exceeded.`,
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
      'Discuss distributed multi-region rate-limiting synchronization challenges',
    ],
    followUpQuestions: [
      'What should happen if the Redis rate-limiter cluster goes down? Fail open or fail closed?',
      'How do you prevent distributed denial-of-service (DDoS) from rotating IP addresses?',
    ],
  },

  // DSA & Core Concepts
  'explain the difference between an array and a linked list': {
    expectedAnswer: `Detailed Comparison:
1. Memory Allocation:
   - Array: Contiguous block of memory allocated statically or dynamically. Elements stored adjacent to each other.
   - Linked List: Non-contiguous nodes scattered across heap memory, connected by pointers/references.

2. Access & Search:
   - Array: O(1) random access by index via formula: Address = BaseAddress + index * element_size.
   - Linked List: O(n) sequential access. Must traverse from head node pointer by pointer.

3. Insertion & Deletion:
   - Array: O(n) in worst/average case due to shifting elements (O(1) amortized at end for dynamic arrays).
   - Linked List: O(1) if pointer to target node is already known (e.g., insert at head/tail). O(n) to find the position.

4. Cache Locality & Memory Overhead:
   - Array: Excellent spatial locality of reference. CPU pre-fetches contiguous elements into L1/L2 cache lines, resulting in fast iteration.
   - Linked List: Poor cache locality due to heap fragmentation. Extra memory overhead per node to store pointers (4-8 bytes per node).

When to use which:
- Use Array: Frequent random index access, fixed or predictable size, cache-friendly iterations.
- Use Linked List: Constant-time insertions/deletions at both ends (e.g., queues, LRU caches), unknown size where reallocating large contiguous arrays is expensive.`,
    keyPoints: [
      'Contiguous vs non-contiguous memory allocation',
      'O(1) random access in arrays vs O(n) traversal in linked lists',
      'O(1) insertion at head in linked lists vs O(n) shifting in arrays',
      'CPU cache line locality advantages of arrays',
      'Pointer memory overhead in linked lists',
    ],
    hints: [
      'Highlight CPU cache locality - interviewers love this distinction',
      'Clarify dynamic arrays (like Java ArrayList or Python list) vs raw fixed arrays',
      'Discuss real-world scenarios like LRU Cache implementation',
    ],
    followUpQuestions: [
      'How does dynamic array resizing work under the hood and why is append amortized O(1)?',
      'When would an unrolled linked list be preferred over both standard arrays and linked lists?',
    ],
  },

  'what is the time complexity of common operations in a binary search tree': {
    expectedAnswer: `Time Complexity Analysis:
1. Balanced Binary Search Tree (AVL, Red-Black Tree):
   - Search: O(log n)
   - Insertion: O(log n)
   - Deletion: O(log n)
   - Find Min / Max: O(log n)

2. Unbalanced / Skewed BST (Worst Case - degenerate tree like a linked list):
   - Search: O(n)
   - Insertion: O(n)
   - Deletion: O(n)

3. Auxiliary Operations & Space:
   - In-order traversal: O(n) time (visits all nodes in ascending sorted order).
   - Space Complexity: O(h) where h is tree height for recursive call stack (O(log n) for balanced, O(n) for skewed).

4. Why Balancing Matters:
   - Inserting already-sorted data [1, 2, 3, 4, 5] into an un-balanced BST produces a linear chain of depth n, reducing efficiency to O(n).
   - Self-balancing trees (Red-Black trees used in Java TreeMap/C++ std::map) perform tree rotations to guarantee O(log n) bounds.`,
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
      'Explain what happens when items are inserted in sorted order',
    ],
    followUpQuestions: [
      'What is the difference between AVL Tree and Red-Black Tree in terms of rebalancing frequency?',
      'How would you validate whether an arbitrary binary tree is a valid BST?',
    ],
  },

  'explain how a hash table works and how collisions are handled': {
    expectedAnswer: `Hash Table Internals:
1. Core Mechanism:
   - Key-value pairs stored in an underlying array.
   - Hash function converts key into integer hash code, then modulo operation (hash % array_length) maps to array bucket index.
   - Target time complexity: Average O(1) for insert, search, and delete.

2. Collision Resolution Techniques:
   - Separate Chaining: Each bucket holds a linked list or self-balancing tree (Java 8+ HashMap converts linked list to Red-Black tree when bucket length exceeds 8).
   - Open Addressing (Probing): All elements stored directly in array.
     * Linear Probing: If bucket full, check index + 1, index + 2... (Suffers from primary clustering).
     * Quadratic Probing: Check index + 1^2, index + 2^2, index + 3^2...
     * Double Hashing: Uses second hash function to calculate step interval.

3. Load Factor & Rehashing:
   - Load Factor α = (number of items) / (array capacity). Standard default is 0.75.
   - When threshold exceeded, array doubles in capacity, and all elements are re-hashed into the new array (O(n) resizing cost, amortized O(1)).`,
    keyPoints: [
      'Hash function + modulo arithmetic maps keys to bucket indices',
      'Separate chaining vs Open addressing collision strategies',
      'Load factor (typically 0.75) and dynamic rehashing/resizing',
      'Java 8 treeification optimization (linked list to Red-Black tree when bucket size > 8)',
      'Worst-case O(n) complexity when all keys collide into one bucket',
    ],
    hints: [
      'Explain what makes a good hash function (uniform distribution, deterministic, fast)',
      'Mention worst-case scenario and Hash DoS attacks',
      'Explain load factor and why we rehash before the table is 100% full',
    ],
    followUpQuestions: [
      'How can an adversary exploit hash table collisions to perform a Denial of Service attack?',
      'How does Python or Go implement hash tables compared to Java?',
    ],
  },

  'what is the difference between bfs and dfs? when would you use each': {
    expectedAnswer: `Comparison of BFS & DFS:
1. Breadth-First Search (BFS):
   - Traversal Order: Level by level, visiting all neighbors at current distance before moving deeper.
   - Data Structure: Queue (FIFO).
   - Time Complexity: O(V + E) for graphs; O(n) for trees.
   - Space Complexity: O(w) where w is max width of tree (O(V) in worst case).
   - Best Use Cases:
     * Finding the shortest path in unweighted graphs or grids (e.g., shortest word ladder, maze exit).
     * Level-order tree serialization.
     * Finding nearest nodes or social network connections within degree k.

2. Depth-First Search (DFS):
   - Traversal Order: Explores as far as possible down each branch before backtracking.
   - Data Structure: Stack (LIFO) or recursive call stack.
   - Time Complexity: O(V + E) for graphs; O(n) for trees.
   - Space Complexity: O(h) where h is max depth of graph/tree.
   - Best Use Cases:
     * Topological sort and dependency resolution.
     * Cycle detection in directed/undirected graphs.
     * Path finding when exploring all permutations (backtracking, Sudoku, N-Queens).
     * Connected components count (Flood Fill / Number of Islands).`,
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
      'Discuss space complexity trade-offs between wide trees vs deep trees',
    ],
    followUpQuestions: [
      'When would Iterative Deepening DFS (IDDFS) be preferred over standard BFS and DFS?',
      'How do you adapt BFS to find the shortest path in weighted graphs (Dijkstra algorithm)?',
    ],
  },

  // Web & Frontend
  'explain the virtual dom in react and why it improves performance': {
    expectedAnswer: `Virtual DOM Architecture:
1. What is the Virtual DOM?
   - A lightweight JavaScript object representation of the actual browser DOM kept in memory.
   - A React element like <div className="card">Hello</div> is represented as a plain JS object: { type: 'div', props: { className: 'card', children: 'Hello' } }.

2. Why the Real DOM is Slow:
   - Direct DOM manipulation is not slow in itself; the expense comes from browser layout recalculations, style re-computations, and repaints/reflows across the render tree.

3. The Reconciliation Process:
   - Step 1 (Render): When component state/props change, React renders a new Virtual DOM tree.
   - Step 2 (Diffing): React compares the new Virtual DOM with the previous snapshot using a heuristic O(n) diffing algorithm:
     * Elements of different types produce different trees (old torn down, new mounted).
     * Keys uniquely identify children across renders to avoid unnecessary re-creation of list items.
   - Step 3 (Commit/Batching): React calculates the minimal set of real DOM operations required and applies them in a single batched browser reflow.

4. React 16+ Fiber Architecture:
   - Replaced synchronous stack reconciliation with incremental, interruptible work units (Fibers) allowing high-priority updates (typing, animations) to interrupt background rendering.`,
    keyPoints: [
      'In-memory lightweight JS object tree representing UI',
      'Eliminates unnecessary layout and reflow recalculations by batching real DOM writes',
      'Heuristic O(n) diffing algorithm using component types and stable list keys',
      'Reconciliation separates render phase (pure computation) from commit phase (DOM mutations)',
      'React Fiber enables asynchronous scheduling and priority-based interruptible rendering',
    ],
    hints: [
      'Clarify that Virtual DOM is not faster than direct, optimal vanilla DOM scripting, but it makes declarative UI fast by default',
      'Emphasize why "keys" are critical in lists during reconciliation',
      'Mention React Fiber and concurrent rendering features',
    ],
    followUpQuestions: [
      'Why do frameworks like Svelte or SolidJS choose to avoid the Virtual DOM entirely?',
      'What happens if you use random Math.random() numbers as React list keys?',
    ],
  },

  'explain how cors works and why it is important for web security': {
    expectedAnswer: `Cross-Origin Resource Sharing (CORS):
1. Same-Origin Policy (SOP):
   - Fundamental browser security model restricting a script on origin A (https://app.com:443) from reading responses from origin B (https://api.com:443) without explicit server permission.
   - An origin is defined by protocol + domain + port.

2. How CORS Works:
   - Simple Requests (GET, HEAD, POST with standard headers like text/plain, multipart/form-data):
     * Browser attaches 'Origin: https://app.com' header.
     * Server responds with 'Access-Control-Allow-Origin: https://app.com' or '*'.
   - Preflight Requests (PUT, DELETE, JSON content-type, custom headers):
     * Browser automatically sends an HTTP OPTIONS preflight request before the actual request.
     * Headers sent: 'Access-Control-Request-Method', 'Access-Control-Request-Headers'.
     * Server must respond with 200/204 and permission headers: 'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers', and 'Access-Control-Max-Age' (caching the preflight).

3. Credentials & Cookies:
   - For requests sending cookies or Authorization headers withCredentials = true:
   - Server MUST NOT use wildcard '*'; it must reflect the exact origin and send 'Access-Control-Allow-Credentials: true'.`,
    keyPoints: [
      'Enforced strictly by the client browser based on Same-Origin Policy (protocol, domain, port)',
      'Preflight OPTIONS request triggered for non-simple methods or custom headers',
      'Key headers: Access-Control-Allow-Origin, Allow-Methods, Allow-Headers',
      'CORS is not a server protection against curl/Postman; it is a browser protection against malicious third-party websites reading private user data',
      'Credentialed requests require exact origin specification, never wildcard *',
    ],
    hints: [
      'Emphasize that CORS is a browser-enforced security mechanism, not a backend firewall',
      'Explain why curl or Postman requests work even when CORS is blocked in Chrome',
      'Discuss how reverse proxies (NGINX) solve CORS by hosting API and frontend on same origin',
    ],
    followUpQuestions: [
      'Why does CORS still allow the server to execute a POST request even when the browser blocks the response from being read by JS?',
      'How does CSRF (Cross-Site Request Forgery) relate to CORS?',
    ],
  },

  'explain the event loop in javascript': {
    expectedAnswer: `JavaScript Event Loop Architecture:
1. Single-Threaded Runtime:
   - JavaScript engine (V8) has a single Call Stack and Memory Heap. It executes one piece of code at a time synchronously.

2. Concurrency Model:
   - Call Stack: Executes synchronous frames until empty.
   - Web APIs / Node.js C++ APIs: Handles asynchronous operations (DOM events, fetch/HTTP, setTimeout, fs) in background threads outside the JS engine.
   - Callback Queues:
     * Microtask Queue: Highest priority. Holds Promise .then() callbacks, queueMicrotask(), and MutationObserver (and process.nextTick in Node.js).
     * Macrotask Queue (Task Queue): Holds setTimeout, setInterval, setImmediate, and I/O callbacks.

3. Event Loop Execution Order:
   1. Execute synchronous code on the Call Stack until empty.
   2. Check Microtask Queue: Drain ALL microtasks until microtask queue is completely empty (even if microtasks spawn more microtasks).
   3. Render UI updates (in browser).
   4. Dequeue ONE task from the Macrotask Queue and push onto Call Stack.
   5. Repeat cycle.`,
    keyPoints: [
      'Single-threaded Call Stack executes synchronous code to completion',
      'Asynchronous operations offloaded to Web APIs / Node libuv worker threads',
      'Microtask queue (Promises) has strict priority over Macrotask queue (setTimeout)',
      'Microtasks are completely drained after each task before browser repainting or next macrotask',
      'Blocking the call stack freezes UI interactions and animations',
    ],
    hints: [
      'Walk through a code snippet containing console.log, setTimeout(0), and Promise.resolve().then()',
      'Explain microtask vs macrotask execution order explicitly',
      'Mention requestAnimationFrame and its relation to browser refresh rates',
    ],
    followUpQuestions: [
      'What happens if a microtask recursively enqueues another microtask indefinitely?',
      'How does Node.js event loop differ from the browser event loop (phases: timers, poll, check)?',
    ],
  },

  'what is the difference between rest and graphql': {
    expectedAnswer: `Comprehensive Comparison:
1. Architecture & Design:
   - REST (Representational State Transfer): Resource-oriented. Relies on standard HTTP methods (GET, POST, PUT, DELETE) and multiple discrete URL endpoints (/users/123/posts).
   - GraphQL: Query-language-oriented. Single HTTP POST endpoint (/graphql) where client explicitly requests the exact fields needed via schema definition.

2. Over-fetching & Under-fetching:
   - REST: Often over-fetches (e.g., getting 30 user fields when only name is needed) or under-fetches (requires 3 sequential round-trips to fetch user, their posts, and comments - N+1 API call problem).
   - GraphQL: Completely eliminates over/under-fetching by allowing declarative nested queries in a single HTTP request.

3. Caching & Tooling:
   - REST: Built-in HTTP caching works out-of-the-box using HTTP status codes, ETags, and browser/CDN cache headers.
   - GraphQL: Because all requests hit single POST endpoint, standard HTTP-level caching cannot be used. Requires complex client-side normalized caches (Apollo Client, Relay).

4. When to Use Which:
   - Use REST: Simple CRUD apps, microservices with public APIs, strong caching requirements, small teams.
   - Use GraphQL: Complex interconnected data graphs, mobile apps requiring minimal payload sizes, multi-platform frontends with varying data needs.`,
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
      'Mention schema stitching and federation in large organizations',
    ],
    followUpQuestions: [
      'How does GraphQL handle file uploads and binary data?',
      'How do you protect a GraphQL server from denial-of-service queries with deeply nested relationships?',
    ],
  },

  // Behavioral Questions
  'tell me about yourself and your experience': {
    expectedAnswer: `Recommended Response Structure (Present -> Past -> Future Framework):
1. Present (30-45 seconds):
   - Current role, core technical competencies, and day-to-day focus (e.g., "I am currently a full-stack software engineer specializing in scalable React and Node.js applications...").
   - Mention key domain or scale of systems you operate.

2. Past Highlights (45-60 seconds):
   - Academic background or foundational journey into engineering.
   - 1-2 major technical achievements that demonstrate problem-solving and impact (e.g., "At my previous company, I led the migration of a legacy monolithic checkout service to an event-driven architecture, reducing checkout latency by 40% and saving $80k in infrastructure costs").

3. Future & Why This Role (30 seconds):
   - Why you are excited about this specific opportunity, team, and company mission.
   - How your skills directly align with the challenges this role tackles.`,
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
      'Connect the dots on how your journey led you to this interview',
    ],
    followUpQuestions: [
      'What has been the single most technically challenging problem you personally solved?',
      'Where do you feel you have the most room to grow as an engineer?',
    ],
  },

  'tell me about a time when you had to work with a difficult team member': {
    expectedAnswer: `Structure using the STAR Framework (Situation, Task, Action, Result):
1. Situation:
   - Provide objective context without disparaging the individual (e.g., "During a critical API refactor with tight deadlines, a senior team member and I strongly disagreed on whether to introduce GraphQL or stick with existing REST endpoints with caching").

2. Task:
   - Define the shared objective: "We needed to reach technical consensus quickly to prevent blocking three dependent frontend engineers while ensuring the system remained performant."

3. Action:
   - Focus on empathetic communication, objective data, and collaboration:
     * Scheduled a 1-on-1 private discussion to understand their underlying concerns (they were worried about team learning curve and deadline risks).
     * Proposed an objective decision framework: created a 1-page design doc with benchmarking trade-offs and built a 2-hour prototype.
     * Found a collaborative middle ground that addressed their valid risk concerns while meeting technical goals.

4. Result & Reflection:
   - Project delivered on time with zero regressions; built strong long-term mutual respect and established a standard RFC template for future team architecture decisions.`,
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
      'Include a key lesson learned from the experience',
    ],
    followUpQuestions: [
      'How would you handle a situation where an agreement cannot be reached even after discussing data?',
      'Have you ever received constructive feedback that was difficult to hear? How did you respond?',
    ],
  },

  'tell me about a time you failed. what did you learn from it': {
    expectedAnswer: `Structure using the STAR Framework:
1. Situation:
   - Be genuinely vulnerable with a real technical or process mistake:
     "In a previous role, I deployed a database migration script during an evening release that inadvertently triggered a table lock on our primary PostgreSQL transactions table, causing API timeouts for users for 22 minutes."

2. Task:
   - "My immediate responsibility was to mitigate user impact, restore production availability, and prevent similar incidents."

3. Action:
   - Immediate triage: Collaborated with on-call DBA to kill the locking transaction and rolled back the release within 15 minutes. Communicated clearly with support.
   - Root cause analysis: Wrote a transparent, blameless post-mortem explaining why the lock occurred (ALTER TABLE with default value on older Postgres version).
   - Long-term prevention: Integrated safe-migration linters (strong_migrations) into our CI pipeline to detect table-locking syntax before merge, and established a staging dry-run protocol on production-scale replica data.

4. Result & Learning:
   - Zero migration-related downtime incidents occurred in the subsequent two years. Learned that automated guardrails and blameless post-mortems are far more effective than relying solely on manual caution.`,
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
      'Emphasize how this shaped your approach to reliable engineering today',
    ],
    followUpQuestions: [
      'How do you foster a blameless culture when junior engineers make production errors?',
      'How has this experience changed how you review pull requests from other engineers?',
    ],
  },
};

/**
 * Normalizes text to match question keys
 */
export function normalizeQuestionKey(text = '') {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Look up a curated answer for a question text
 */
export function getCuratedAnswer(questionText = '') {
  if (!questionText) return null;
  const normalized = normalizeQuestionKey(questionText);

  // Exact key match
  if (curatedAnswersMap[normalized]) {
    return curatedAnswersMap[normalized];
  }

  // Partial match
  for (const [key, value] of Object.entries(curatedAnswersMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  // Keywords heuristic match
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
  if (
    normalized.includes('time you failed') ||
    normalized.includes('biggest failure') ||
    normalized.includes('biggest mistake')
  ) {
    return curatedAnswersMap['tell me about a time you failed. what did you learn from it'];
  }

  return null;
}
