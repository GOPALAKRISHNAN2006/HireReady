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

  // DevOps & Cloud
  'explain the difference between docker containers and virtual machines': {
    expectedAnswer: `Virtual Machines vs Docker Containers:
1. Virtual Machines (Hypervisor-Based):
   - Virtualize underlying hardware. Each VM runs a full guest operating system with dedicated kernel, system binaries, and allocated RAM.
   - Heavyweight: Multi-gigabyte image sizes, several minutes startup time, higher memory overhead.

2. Docker Containers (OS-Level Virtualization):
   - Share host Linux kernel. Isolate processes at OS level using kernel primitives.
   - Lightweight: Megabyte image sizes, sub-second startup times, near-native performance.

3. Linux Kernel Isolation Primitives:
   - Namespaces: Isolate what a process can see (PID for process IDs, NET for network interfaces/ports, MNT for filesystem mount points, IPC for shared memory, UTS for hostname, USER for UID/GID mappings).
   - Control Groups (cgroups): Restrict how much resources a process can consume (CPU shares, memory quotas, disk I/O bandwidth).
   - OverlayFS: Copy-on-Write (CoW) layered storage allowing fast container spin-ups sharing immutable base layers.`,
    keyPoints: [
      'Hypervisor hardware virtualization vs OS-level kernel sharing',
      'Linux Namespaces for process/network/filesystem isolation',
      'cgroups for resource metering and allocation caps',
      'OverlayFS / CoW layered filesystem efficiency',
    ],
    hints: [
      'Mention kernel sharing vs guest operating systems',
      'Explain cgroups (resource limits) and namespaces (view isolation)',
    ],
    followUpQuestions: [
      'What are rootless containers and why are they important for security?',
      'Can a container escape exploit compromise the host OS kernel?',
    ],
  },

  'what is kubernetes explain the architecture and role of the control plane': {
    expectedAnswer: `Kubernetes Architecture Overview:
1. Control Plane (Master Node - Cluster Brain):
   - kube-apiserver: Central REST API gateway exposing the cluster interface, validating manifests, and orchestrating state.
   - etcd: Distributed consistent key-value store holding cluster state and configuration via Raft consensus.
   - kube-scheduler: Evaluates resource requests, node affinity, taints, and assigns unscheduled pods to optimal worker nodes.
   - kube-controller-manager: Runs continuous reconciliation loops (Node, ReplicaSet, EndpointSlice, ServiceAccount controllers).
   - cloud-controller-manager: Bridges cloud provider primitives (LoadBalancers, Persistent Volumes, Routing).

2. Worker Node Components (Execution Plane):
   - kubelet: Agent running on each node ensuring containers described in PodSpecs are running and healthy.
   - kube-proxy: Manages network routing tables (iptables/IPVS) for Kubernetes Services, enabling internal load balancing.
   - Container Runtime: Engine executing container images (containerd, CRI-O).`,
    keyPoints: [
      'Control Plane components: kube-apiserver, etcd, scheduler, controller-manager',
      'Worker Node components: kubelet, kube-proxy, container runtime',
      'etcd consensus using Raft protocol for cluster state storage',
      'Declarative reconciliation loops vs imperative commands',
    ],
    hints: [
      'Break into Control Plane vs Worker Node responsibilities',
      'Explain the purpose of etcd and why it requires an odd number of replicas (quorum)',
    ],
    followUpQuestions: [
      'What happens if the Control Plane nodes temporarily lose network connectivity?',
      'How does kube-proxy handle traffic routing using IPVS vs iptables?',
    ],
  },

  'explain continuous integration and continuous deployment cicd': {
    expectedAnswer: `Production-Grade CI/CD Pipeline:
1. Definitions:
   - CI (Continuous Integration): Automatically building and testing code on every commit to detect defects early.
   - CD (Continuous Delivery): Automatically preparing verified release artifacts; deployment to production requires manual sign-off.
   - CD (Continuous Deployment): Automatically deploying every passing build directly to production with zero manual gates.

2. Production Pipeline Stages:
   - Lint & Static Analysis: ESLint, TypeScript typechecks, and secret scanning (TruffleHog).
   - Test Matrix: Parallelized Unit tests (Jest), Integration tests, and component test suites with >80% coverage check.
   - Build & Package: Multi-stage Docker build producing hardened minimal images tagged with Git commit SHA.
   - Security Scanning: Container vulnerability scan using Trivy/Snyk before pushing to ECR/GCR.
   - Staging & Smoke Tests: Deployment to preview environment; automated Playwright E2E smoke tests.
   - Progressive Production Rollout: GitOps tool (ArgoCD/Flux) reconciles state using Blue-Green or Canary deployment with automated rollback on error spikes.`,
    keyPoints: [
      'Difference between CI, Continuous Delivery, and Continuous Deployment',
      'Shift-left security: static analysis, secrets detection, and container CVE scanning',
      'Multi-stage Docker builds for minimal attack surface',
      'GitOps deployment reconciliation using ArgoCD / Flux',
      'Automated rollbacks triggered by metrics / error rate thresholds',
    ],
    hints: [
      'Distinguish Continuous Delivery from Continuous Deployment',
      'Cover testing, security scanning, multi-stage image builds, and automated rollback',
    ],
    followUpQuestions: [
      'How do you manage database schema migrations within an automated CI/CD pipeline without downtime?',
      'How do Blue-Green deployments differ from Canary deployments?',
    ],
  },

  'compare bluegreen deployments canary releases and rolling updates': {
    expectedAnswer: `Deployment Strategies Comparison:
1. Rolling Update:
   - Incrementally replaces old pods with new pods (e.g., 25% maxSurge, 25% maxUnavailable).
   - Pros: Zero extra infrastructure cost, zero downtime.
   - Cons: Version mixing (v1 and v2 coexist), slow incremental rollback.

2. Blue-Green Deployment:
   - Two identical production environments: Blue (active live traffic) and Green (new version standby).
   - After testing Green, load balancer flips 100% of traffic instantly to Green.
   - Pros: Instant rollback (switch router back to Blue), no version mixing.
   - Cons: Requires 2x compute capacity during release, database schema must support both versions simultaneously.

3. Canary Release:
   - Routes a small percentage of real user traffic (e.g., 5% via Envoy / Istio service mesh) to new version.
   - Metrics (latency, HTTP 5xx errors, memory) monitored before progressively ramping to 100%.
   - Pros: Lowest blast radius for production regressions, real-world user validation.
   - Cons: Complex traffic routing infrastructure, temporary version mixing.`,
    keyPoints: [
      'Rolling Update: zero extra cost, but version mixing and slow rollback',
      'Blue-Green: 2x compute cost, but instant traffic cutover and instant rollback',
      'Canary: minimal blast radius with metric-driven progressive traffic weighting',
      'Database schema forward/backward compatibility requirement',
    ],
    hints: [
      'Focus on blast radius, rollback speed, and infrastructure cost trade-offs',
      'Address the challenge of backward database schema compatibility',
    ],
    followUpQuestions: [
      'How do you handle sticky sessions or WebSockets during a Blue-Green cutover?',
      'What automated metrics should trigger an immediate Canary rollback?',
    ],
  },

  'what is infrastructure as code iac compare terraform with ansible': {
    expectedAnswer: `Infrastructure as Code (IaC):
1. Overview:
   - Managing and provisioning computing infrastructure through machine-readable definition files rather than manual console clicks.

2. Terraform vs Ansible:
   - Terraform: Declarative provisioning tool. Specializes in standing up cloud infrastructure (VPCs, EC2, RDS, S3). State-driven (terraform.tfstate tracks real cloud resources).
   - Ansible: Procedure-oriented configuration management. Specializes in configuring existing servers (package installation, configs, users) over SSH. Stateless.

3. Terraform State Management:
   - terraform.tfstate records the mapping between code declarations and cloud provider IDs.
   - Remote State: Stored in cloud object storage (S3/GCS) with server-side encryption.
   - State Locking: Uses distributed locks (DynamoDB) to prevent concurrent writes from corrupting infrastructure state.`,
    keyPoints: [
      'Declarative provisioning (Terraform) vs configuration management (Ansible)',
      'Terraform state file purpose: tracks mapping of code to real-world cloud resources',
      'Remote backend storage in S3/GCS with encryption at rest',
      'Distributed state locking via DynamoDB to prevent concurrent writes',
    ],
    hints: [
      'Differentiate infrastructure provisioning (Terraform) vs server configuration (Ansible)',
      'Explain why storing terraform.tfstate locally on developer machines is dangerous',
    ],
    followUpQuestions: [
      'How do you manage sensitive secrets in Terraform without committing them to Git?',
      'What is state drift and how does terraform refresh detect it?',
    ],
  },

  // Mobile
  'explain the react native architecture how does the new architecture': {
    expectedAnswer: `React Native Architecture:
1. Legacy Architecture Bottlenecks:
   - Three threads: JS Thread, UI Main Thread, Shadow Thread (Yoga layout).
   - Legacy Bridge: Asynchronous JSON-serialized string queue.
   - Issues: JSON serialization overhead, asynchronous-only communication causing frame drops during fast scrolling (blank frames) and gesture lag.

2. New Architecture Innovations:
   - JSI (JavaScript Interface): C++ layer allowing JavaScript to hold direct references to host C++ and native objects, eliminating JSON serialization and enabling synchronous calls.
   - TurboModules: Lazy loads native modules on-demand instead of initializing all native code at startup, improving cold launch time.
   - Fabric: Unified C++ rendering pipeline supporting concurrent rendering, synchronous layout measurements, and smooth priority-based updates aligned with React 18 Concurrent Mode.`,
    keyPoints: [
      'Legacy Bridge bottleneck: asynchronous JSON serialization queue',
      'JSI allows direct C++ pointer access without string serialization',
      'TurboModules lazy-load native capabilities to improve cold startup time',
      'Fabric unified C++ render tree with synchronous layout measurements',
    ],
    hints: [
      'Identify the legacy JSON bridge serialization bottleneck',
      'Explain JSI enabling direct C++ host object calls',
      'Contrast TurboModules (lazy native modules) with Fabric (UI renderer)',
    ],
    followUpQuestions: [
      'Why does synchronous layout measurement matter for nested scrollable lists in mobile apps?',
      'How does Hermes JavaScript engine contribute to cold start performance in React Native?',
    ],
  },

  'describe the android activity lifecycle': {
    expectedAnswer: `Android Activity Lifecycle:
1. Lifecycle Methods:
   - onCreate(): Activity initialized; set view content (setContentView), bind ViewModels.
   - onStart(): Activity becomes visible to user; register broadcast receivers.
   - onResume(): Activity enters foreground, interactive with user; start animations, camera feeds.
   - onPause(): Partially obscured (dialog/multi-window); pause heavy operations, persist draft inputs.
   - onStop(): No longer visible; release memory-heavy assets.
   - onDestroy(): Activity destroyed; final cleanup.

2. Configuration Changes (Screen Rotation):
   - Android tears down and re-creates the Activity to reload configuration-specific resources.
   - State preservation: ViewModels survive configuration changes. SavedStateHandle preserves UI state across OS background process kills.`,
    keyPoints: [
      'Full lifecycle progression: onCreate, onStart, onResume, onPause, onStop, onDestroy',
      'Configuration changes trigger complete Activity destruction to reload resources',
      'ViewModel survives configuration changes (rotation)',
      'SavedStateHandle / onSaveInstanceState preserves state across low-memory OS process kills',
    ],
    hints: [
      'Walk through onCreate -> onStart -> onResume -> onPause -> onStop -> onDestroy',
      'Explain why screen rotation triggers full teardown and recreate',
    ],
    followUpQuestions: [
      'What is the difference between onPause() and onStop() regarding visibility and user interaction?',
      'How does Jetpack Compose change state preservation compared to traditional XML Activities?',
    ],
  },

  'how does automatic reference counting arc work in ios swift': {
    expectedAnswer: `Automatic Reference Counting (ARC) in Swift:
1. Core Mechanism:
   - Compile-time memory management for reference types (classes).
   - Injects retain (+1) and release (-1) calls during compilation.
   - When reference count reaches 0, memory is deallocated immediately.

2. Retain Cycles (Memory Leaks):
   - Occurs when two objects hold strong references to each other, preventing count from reaching 0.
   - Common in closures capturing self strongly.

3. Prevention:
   - weak: Optional reference (var delegate: Delegate?). Does not increment count. Automatically zeroes out (becomes nil) on deallocation.
   - unowned: Non-optional pointer. Does not increment count. Used when target object has equal or longer lifetime.
   - Closure capture lists: [weak self] inside escaping closures breaks retain cycles.`,
    keyPoints: [
      'Compile-time deterministic retain/release injection',
      'Retain cycle: mutual strong references prevent reference count from reaching 0',
      'weak references are optional and zeroing on deallocation',
      'unowned references are non-optional and crash if accessed post-deallocation',
      'Capture lists ([weak self]) in closures break capture retain cycles',
    ],
    hints: [
      'Explain that ARC is compile-time tracking, not a runtime garbage collector',
      'Contrast strong vs weak vs unowned references',
    ],
    followUpQuestions: [
      'How does Xcode Memory Graph Debugger or Instruments Leaks instrument help detect retain cycles?',
      'Why do Swift structs and enums not require ARC memory management?',
    ],
  },

  'how do you design an offlinefirst mobile application': {
    expectedAnswer: `Offline-First Mobile Architecture:
1. Single Source of Truth (SSOT):
   - UI observes local reactive database (Room in Android, CoreData/Realm in iOS, WatermelonDB/SQLite in React Native).
   - UI never queries remote network API directly for rendering.

2. Optimistic Writes & Outbox Queue:
   - Local DB immediately writes record with status = "PENDING_SYNC" and client-generated UUID.
   - Mutation action enqueued in persistent Outbox Queue table in local DB.
   - UI updates instantly with zero network delay.

3. Background Synchronization:
   - Background worker (WorkManager / BGTaskScheduler) processes Outbox Queue on connectivity.
   - Conflict resolution: Last-Write-Wins (LWW) with timestamps, CRDTs for text, or server-adjudicated reconciliation.
   - On success: Record status updated to "SYNCED". On failure: Exponential backoff retry.`,
    keyPoints: [
      'Single Source of Truth: UI observes local reactive database (Room/CoreData/WatermelonDB)',
      'Optimistic UI updates with client-side UUID generation',
      'Persistent Outbox Queue table for actions queued while offline',
      'Background sync using OS schedulers (WorkManager / BGTaskScheduler)',
      'Conflict resolution strategies (Last-Write-Wins, CRDTs, server reconciliation)',
    ],
    hints: [
      'Emphasize Single Source of Truth: UI always reads from local database',
      'Explain the persistent Outbox Queue pattern for mutations made while offline',
    ],
    followUpQuestions: [
      'How do you handle binary file/image uploads queued while the device is in airplane mode?',
      'What happens if two mobile devices edit the same record offline concurrently?',
    ],
  },

  // Databases
  'explain database isolation levels and the anomalies they prevent': {
    expectedAnswer: `Database Isolation Levels (ANSI SQL):
1. Read Uncommitted:
   - Permits reading uncommitted data. Vulnerable to Dirty Reads, Non-Repeatable Reads, Phantom Reads.

2. Read Committed (PostgreSQL / Oracle default):
   - Transactions only read data committed before statement execution.
   - Prevents: Dirty Reads. Vulnerable to: Non-Repeatable Reads and Phantom Reads.

3. Repeatable Read (MySQL InnoDB default):
   - Guarantees rows read within a transaction remain identical on subsequent reads.
   - Prevents: Dirty Reads, Non-Repeatable Reads. Vulnerable to: Phantom Reads (in standard ANSI SQL).

4. Serializable:
   - Highest isolation. Simulates strict serial transaction execution using Two-Phase Locking (2PL) or Serializable Snapshot Isolation (SSI).
   - Prevents: All anomalies (Dirty Reads, Non-Repeatable Reads, Phantom Reads, Write Skew).

Anomalies Defined:
- Dirty Read: Reading data from uncommitted transaction that might rollback.
- Non-Repeatable Read: Reading same row twice yields different column values due to concurrent commit.
- Phantom Read: Re-executing range query returns new rows inserted by concurrent commit.`,
    keyPoints: [
      '4 ANSI levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable',
      'Dirty Read: Reading uncommitted dirty changes that might be rolled back',
      'Non-Repeatable Read: Same row value changes between reads within a transaction',
      'Phantom Read: New rows appear in range queries between executions',
      'MVCC (Multi-Version Concurrency Control) provides snapshot isolation without read locks',
    ],
    hints: [
      'List the 4 levels in order of strictness: Read Uncommitted, Read Committed, Repeatable Read, Serializable',
      'Clearly define Dirty Read, Non-Repeatable Read, and Phantom Read anomalies',
    ],
    followUpQuestions: [
      'How does PostgreSQL MVCC implement Repeatable Read using snapshot transaction IDs (xmin/xmax)?',
      'What is Write Skew anomaly and which isolation level prevents it?',
    ],
  },

  'explain btrees vs lsmtrees': {
    expectedAnswer: `B-Trees vs LSM-Trees Storage Engines:
1. B-Tree / B+ Tree (PostgreSQL, MySQL InnoDB, SQLite):
   - Architecture: Balanced search tree stored in fixed-size disk blocks/pages (4KB-16KB). Updates modified in-place with WAL protection.
   - Reads: Excellent O(log n) random reads with shallow tree depth.
   - Writes: Random writes require disk seeks and page splits, causing write amplification.
   - Best for: Read-heavy workloads, traditional relational OLTP.

2. LSM-Tree (Cassandra, RocksDB, ScyllaDB, BigTable):
   - Architecture: Writes append sequentially to in-memory MemTable and disk WAL. When full, flushed as immutable SSTables. Compaction merges files in background.
   - Reads: Slower random reads (checks MemTable + multiple SSTables), accelerated by Bloom Filters.
   - Writes: High throughput because all writes are sequential disk appends.
   - Best for: Write-heavy workloads, time-series data, distributed NoSQL.`,
    keyPoints: [
      'B-Tree updates in-place: optimal for random reads and general relational OLTP',
      'LSM-Tree writes append-only to MemTable and flushes to SSTables: optimal for heavy writes',
      'Bloom filters accelerate LSM-Tree reads by checking if a key exists in an SSTable',
      'Background compaction merges and cleans deleted keys (tombstones) in LSM-Trees',
    ],
    hints: [
      'Highlight in-place updates (B-Tree) vs append-only immutable files (LSM-Tree)',
      'Explain SSTables, MemTable, Bloom Filters, and background compaction in LSM-Trees',
    ],
    followUpQuestions: [
      'What is write amplification, read amplification, and space amplification in LSM-Trees?',
      'How do Bloom filters prevent unnecessary disk I/O in RocksDB?',
    ],
  },

  'what are sql window functions': {
    expectedAnswer: `SQL Window Functions:
1. Core Concept:
   - Perform calculations across a set of rows related to current row without collapsing rows into a single group like GROUP BY.
   - Syntax: FUNCTION() OVER (PARTITION BY col1 ORDER BY col2)

2. Ranking Functions:
   - ROW_NUMBER(): Unique sequential integer starting from 1 (no ties: 1, 2, 3).
   - RANK(): Tied rows receive same rank; subsequent rank has gaps (1, 1, 3).
   - DENSE_RANK(): Tied rows receive same rank; subsequent rank is sequential (1, 1, 2).

3. Aggregate & Value Functions:
   - SUM(val) OVER (PARTITION BY dept ORDER BY date): Running cumulative total.
   - LAG(val, 1): Accesses previous row value without self-join.
   - LEAD(val, 1): Accesses next row value.`,
    keyPoints: [
      'Window functions retain original row granularity while calculating aggregates',
      'OVER (PARTITION BY ... ORDER BY ...)',
      'ROW_NUMBER: continuous sequential integers (1, 2, 3)',
      'RANK: tied ranks create subsequent gaps (1, 1, 3)',
      'DENSE_RANK: tied ranks without subsequent gaps (1, 1, 2)',
    ],
    hints: [
      'Contrast Window functions vs GROUP BY: window functions do not collapse rows',
      'Clearly contrast the tie behavior of ROW_NUMBER vs RANK vs DENSE_RANK',
    ],
    followUpQuestions: [
      'How do LEAD() and LAG() window functions work for comparing chronological metrics?',
      'How does the database execute window functions internally (sorting vs hashing)?',
    ],
  },

  // System Design
  'design a collaborative document editing service like google docs': {
    expectedAnswer: `Collaborative Document Editing Architecture:
1. Real-Time Communication:
   - WebSockets for bi-directional real-time document change events and cursor positions.
   - Client applies local edits immediately (0ms typing latency) and asynchronously transmits operations.

2. Conflict Resolution Algorithms:
   - Operational Transformation (OT) (Google Docs): Centralized sequencer transforms Operation A against Operation B based on revision histories before broadcasting.
   - CRDTs (Conflict-Free Replicated Data Types) (Yjs, Automerge, Figma): Commutative operations with fractional index IDs merge in any arrival order without centralized sequencer.

3. System Components:
   - WebSocket Gateway: Consistent Hashing routes editors of the same document to the same Document Editing Server node.
   - Document Memory Server: Holds active document state in memory (Redis/RAM) and buffers operations.
   - Persistence Service: Periodically takes document snapshots and appends changelogs to PostgreSQL/S3.`,
    keyPoints: [
      'OT (centralized server transformation) vs CRDT (commutative decentralized fractional indexing)',
      'WebSocket gateway with document-affinity routing using Consistent Hashing',
      'In-memory document session cache with periodic snapshot persistence to S3/DB',
      'Optimistic local typing with background synchronization',
      'Presence system for live multi-user cursor coordinates',
    ],
    hints: [
      'Compare Operational Transformation (OT) vs Conflict-Free Replicated Data Types (CRDT)',
      'Explain how consistent hashing routes editors of the same document to the same server node',
    ],
    followUpQuestions: [
      'Why did Figma choose CRDTs over Operational Transformation for design canvas sync?',
      'How do you manage memory consumption for active documents open for weeks by thousands of users?',
    ],
  },

  'design a ridehailing service like uber or lyft': {
    expectedAnswer: `Ride-Hailing System Architecture:
1. Geospatial Ingestion:
   - Driver apps emit GPS coordinates (lat, lon, driver_id, status) every 3-5 seconds over WebSocket/gRPC.
   - Geospatial index: Uber H3 (hexagonal spatial index) or Redis GEO partition earth into cells (~500m radius).
   - In-memory cache stores cell_id -> set of active driver IDs.

2. Ride Request & Dispatch Matching:
   - Rider requests pickup -> Match Service determines rider H3 cell.
   - Queries concentric k-ring neighbor cells for candidate drivers.
   - Filters idle drivers, vehicle category, and heading.
   - Ranks candidate drivers using ETA calculation factoring real-time traffic.
   - Dispatches ride to closest driver with a 15-second acceptance lease lock.

3. Storage Tiering:
   - Location cache: In-memory Redis cluster.
   - Transactional state: PostgreSQL with ACID guarantees (Trips, Invoices, Payments).
   - Historical routes: Cassandra / S3 for ride telemetry and auditing.`,
    keyPoints: [
      'Geospatial indexing using Uber H3 / Google S2 / Redis GEO rather than slow relational queries',
      'Frequent 3s GPS telemetry streams over WebSocket/gRPC to in-memory cache',
      'Concentric k-ring neighboring cell searches for candidate driver pooling',
      'Dispatch assignment with short distributed locks (15s acceptance window)',
      'Decoupling hot geospatial cache from transactional trip state (PostgreSQL)',
    ],
    hints: [
      'Explain why traditional relational DB queries (ST_DWithin) fail at 1M+ simultaneous location updates/sec',
      'Describe Geohashing / Uber H3 hexagonal spatial indexing',
    ],
    followUpQuestions: [
      'How would you design dynamic surge pricing based on local supply and demand imbalances?',
      'How do you handle driver reassignment if a driver rejects or ignores a dispatched ride?',
    ],
  },

  // ML
  'explain the transformer architecture how does the multihead selfattention': {
    expectedAnswer: `Transformer & Multi-Head Self-Attention:
1. Self-Attention Formulation:
   - Input embeddings projected into Queries (Q), Keys (K), Values (V) via learnable weight matrices.
   - Formula: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V
   - Scaling factor sqrt(d_k) prevents large dot products that push softmax into regions with vanishing gradients.
   - Softmax computes attention weights (similarity distribution across all token pairs).

2. Multi-Head Attention:
   - Q, K, V linearly projected h times into lower-dimensional subspaces.
   - Attention computed in parallel across all heads and concatenated: MultiHead = Concat(head_1, ..., head_h) * W_O.
   - Allows model to jointly attend to information from different representation subspaces (e.g., syntax vs semantics).

3. Positional Encoding:
   - Sinusoidal or learned rotary embeddings (RoPE) inject token order into permutation-invariant attention.`,
    keyPoints: [
      'Attention formula: softmax((Q * K^T) / sqrt(d_k)) * V',
      'Scaling factor sqrt(d_k) prevents vanishing gradients in softmax',
      'Multi-Head attention attends to diverse relational subspaces in parallel',
      'Positional encodings inject sequential token order into permutation-invariant attention',
    ],
    hints: [
      'Write and explain the Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V formula',
      'Explain why scaling by sqrt(d_k) is required',
    ],
    followUpQuestions: [
      'What is FlashAttention and how does it optimize GPU SRAM memory access?',
      'What is the difference between Encoder-only (BERT), Decoder-only (GPT), and Encoder-Decoder (T5) architectures?',
    ],
  },

  'what is retrievalaugmented generation rag': {
    expectedAnswer: `Retrieval-Augmented Generation (RAG):
1. Purpose:
   - Grounds Large Language Models (LLMs) in external proprietary knowledge retrieved from a vector store, eliminating hallucinations and enabling real-time up-to-date answers.

2. Production Pipeline:
   - Ingestion: Semantic document chunking (e.g., 500 tokens with 50-token overlap) -> Embedding generation -> Storage in Vector Database (Pinecone, Qdrant, pgvector) with HNSW indexing.
   - Hybrid Retrieval: Combines Dense Vector Search (semantic similarity) with Sparse Lexical Search (BM25 keyword matching) using Reciprocal Rank Fusion (RRF).
   - Re-ranking: Cross-encoder re-ranker model scores top retrieved passages down to top 5 most relevant.
   - Generation: Injects retrieved excerpts into LLM system prompt with strict citations requirement.`,
    keyPoints: [
      'RAG grounds LLM generation in external retrieved documents to eliminate hallucinations',
      'Ingestion: semantic chunking with overlap + vector database indexing (HNSW)',
      'Retrieval: Hybrid Search (Dense vectors + Sparse BM25) with Reciprocal Rank Fusion',
      'Re-ranking top passages using cross-encoder models before prompt injection',
    ],
    hints: [
      'Distinguish ingestion pipeline (chunking + embedding) from retrieval pipeline',
      'Explain Hybrid Search (Vector + BM25 keyword matching)',
    ],
    followUpQuestions: [
      'How do you evaluate RAG quality using metrics like RAGAS (faithfulness, answer relevance, context recall)?',
      'How do you handle multi-hop reasoning where an answer requires synthesizing information across multiple documents?',
    ],
  },

  // DSA
  'explain the sliding window technique': {
    expectedAnswer: `Sliding Window Algorithmic Technique:
1. Core Concept:
   - Two pointers (left and right) maintain a contiguous subarray/substring, converting nested loops (O(n²)) into linear O(n) time.

2. Fixed-Size Window:
   - Constant window size k.
   - Expand right by 1, contract left by 1. Add incoming element, subtract outgoing element.
   - Example: Maximum sum subarray of size k.

3. Dynamic-Size Window:
   - Expand right pointer until window violates constraint (e.g., at most k distinct characters).
   - Contract left pointer one by one until constraint is satisfied again.
   - Record optimal window length at each valid state.
   - Example: Longest Substring Without Repeating Characters (LeetCode 3).`,
    keyPoints: [
      'Reduces brute-force O(n²) subarray scanning to linear O(n) time',
      'Fixed-size window: constant size k, slides by adding right and removing left',
      'Dynamic-size window: expands right to explore, contracts left to restore validity',
      'Pointers move strictly forward; amortized 2n operations total',
    ],
    hints: [
      'Highlight how sliding window converts nested loops into single O(n) pass',
      'Contrast fixed size k window vs dynamic condition-based window',
    ],
    followUpQuestions: [
      'How would you solve the Sliding Window Maximum problem in O(n) time using a Monotonic Deque?',
      'Why does the sliding window technique fail when array elements can be negative?',
    ],
  },

  'what is a trie prefix tree': {
    expectedAnswer: `Trie (Prefix Tree) Data Structure:
1. Node Structure:
   - children: Array of size 26 or HashMap<Character, TrieNode>.
   - isEndOfWord: Boolean flag marking complete word boundaries.

2. Operations:
   - insert(word): Traverse from root, create missing character nodes, set isEndOfWord = true at end. Time: O(L) where L is word length.
   - search(word): Traverse character by character. If all exist and last node has isEndOfWord = true, return true. Time: O(L).
   - startsWith(prefix): Traverse prefix characters. If all exist, return true (does not check isEndOfWord). Time: O(P).

3. Use Cases:
   - Autocomplete search suggestions, spell-checking, IP routing tables (longest prefix matching).`,
    keyPoints: [
      'TrieNode contains children references and an isEndOfWord terminal flag',
      'O(L) time complexity for insert, search, and prefix matching',
      'Optimal for search autocomplete, spell-checking, and IP routing tables',
      'Substantial space savings when large sets of words share identical prefixes',
    ],
    hints: [
      'Explain the node structure (children map/array + isEndOfWord boolean)',
      'Explain why startsWith differs from search',
    ],
    followUpQuestions: [
      'How would you implement a Radix Tree (Compressed Trie) to save memory on long non-branching paths?',
      'How can a Trie be used to solve the Maximum XOR of Two Numbers problem?',
    ],
  },

  // Behavioral
  'tell me about a time you had to lead a technical project with tight deadlines': {
    expectedAnswer: `Structure using STAR Framework:
1. Situation:
   - Engineering org needed to build a GDPR-compliant Data Deletion service across 12 microservices in 6 weeks before strict legal deadline with vague initial specs.

2. Task:
   - Lead engineer responsible for de-risking architecture, coordinating cross-team dependencies, and delivering on time.

3. Action:
   - Drafted a 2-page RFC detailing proposed Kafka event-driven deletion workflow.
   - Aligned stakeholders in a 45-min sync to agree on exact SLA expectations (30-day grace period).
   - Decomposed work into 3 phased milestones (Audit logging -> Soft delete -> Hard delete cascade) with 10-min async daily check-ins.

4. Result:
   - Shipped 1 week ahead of deadline with zero regressions; RFC template adopted org-wide.`,
    keyPoints: [
      'STAR framework with explicit focus on technical leadership',
      'De-risked ambiguity through documentation (RFC) and stakeholder alignment',
      'Structured milestones into incremental, low-risk deliverables',
      'Delivered ahead of schedule with lasting organizational impact',
    ],
    hints: [
      'Focus on HOW you transformed ambiguity into actionable technical tasks',
      'Demonstrate proactive stakeholder alignment and dependency management',
    ],
    followUpQuestions: [
      'How did you ensure junior engineers on the team did not feel overwhelmed by the tight deadline?',
      'If you had to run the project again, what would you do differently?',
    ],
  },

  'how do you handle production outages': {
    expectedAnswer: `Production Outage Management Framework:
1. Real-Time Mitigation (During Outage):
   - Containment > Root Cause: Prioritize restoring customer availability (rollback, toggle feature flag, scale up instances, shed traffic) before debugging code on live servers.
   - Appoint an Incident Commander and a Communications Lead providing 15-minute stakeholder updates.

2. Incident Example (STAR):
   - Situation: Payment service memory leak causing 500 errors to spike to 18% during peak sales.
   - Action: Implemented instant traffic shed on non-essential endpoints, rolled back canary release in 8 minutes, confirmed error rate dropped to 0.02%.

3. Blameless Post-Mortem Process (After Outage):
   - Blameless Culture: Focus on systemic flaws and monitoring blind spots, never blaming individuals.
   - 5 Whys Analysis: Un-closed DB cursor in newly introduced reporting query.
   - Action Items: Automated CI memory profiling tests, Prometheus alerts on memory slope > 20%/hr, circuit breakers.`,
    keyPoints: [
      'Availability mitigation takes priority over root cause investigation',
      'Clear incident command and stakeholder communication protocols',
      'Blameless post-mortem culture focusing on systems rather than individuals',
      '5 Whys analysis leading to tangible automated preventive actions in CI/CD',
    ],
    hints: [
      'Emphasize that during an outage, restoring availability comes before debugging',
      'Highlight blameless post-mortem culture and the 5 Whys method',
    ],
    followUpQuestions: [
      'How do you balance post-mortem remediation tickets against ongoing product roadmap pressure?',
      'What alerts do you monitor to catch memory leaks before they impact customers?',
    ],
  },

  'how does linux memory management work explain virtual memory page faults swapping and the oom killer':
    {
      expectedAnswer:
        'Linux Memory Management:\n1. Virtual Memory & Page Tables: Each process is given an isolated virtual address space. The CPU Memory Management Unit (MMU) translates virtual addresses to physical RAM pages using page tables and the Translation Lookaside Buffer (TLB).\n2. Page Faults: Occur when a process accesses a virtual page not currently in physical RAM. Minor page fault: Page is in memory (e.g. shared library) and just needs mapping. Major page fault: Page must be read from disk (swap or file).\n3. Swapping: Moving inactive memory pages to swap disk to free RAM. High swapping causes thrashing where CPU spends all time waiting on disk I/O.\n4. OOM (Out Of Memory) Killer: When system runs critically low on memory and cannot allocate pages, the Linux kernel invokes the OOM Killer. It calculates an oom_score for each process based on RAM usage and runtime, and sends SIGKILL to terminate the highest-scoring non-critical process to protect kernel stability.',
      keyPoints: [
        'Virtual memory isolation via MMU & page tables',
        'Minor vs major page faults',
        'Swap disk thrashing',
        'OOM Killer SIGKILL intervention based on oom_score',
      ],
      hints: [
        'Explain MMU translation of virtual to physical memory',
        'Contrast minor vs major page faults',
        'Explain oom_score calculation',
      ],
      followUpQuestions: [],
    },

  'explain dns resolution stepbystep from browser url entry to ip address': {
    expectedAnswer:
      'Step-by-step DNS Resolution:\n1. Browser & OS Cache: Browser checks its local DNS cache; if miss, checks OS DNS cache and local hosts file.\n2. Recursive Resolver: Query sent to ISP / public DNS resolver (e.g., 8.8.8.8, 1.1.1.1). If cached in resolver memory, IP is returned immediately.\n3. Root Nameserver (.): If resolver cache misses, it queries one of the 13 logical root nameservers, which responds with TLD server IP (e.g., .com TLD).\n4. TLD Nameserver (.com): Resolver queries .com TLD server, which responds with the Authoritative Nameserver IP for example.com.\n5. Authoritative Nameserver: Resolver queries authoritative server (e.g., Cloudflare, Route53), which looks up the DNS record (A record for IPv4, AAAA for IPv6, CNAME for alias) and returns the IP.\n6. Client Connection: Resolver caches response according to TTL (Time-To-Live) and hands IP back to browser to initiate TCP/TLS handshake.',
    keyPoints: [
      'Iterative vs recursive DNS query flow',
      'Hierarchy: Root -> TLD (.com) -> Authoritative Nameserver',
      'A vs AAAA vs CNAME records',
      'TTL cache expiration',
    ],
    hints: [
      'Follow: Browser Cache -> OS Cache -> Recursive Resolver -> Root -> TLD -> Authoritative Server',
      'Mention TTL caching at each layer',
    ],
    followUpQuestions: [],
  },

  'what is a service mesh eg istio linkerd why is it needed in microservices architectures': {
    expectedAnswer:
      'A Service Mesh is a dedicated infrastructure layer for managing service-to-service (east-west) communication in microservices architectures without modifying application code.\n\nArchitecture:\n1. Data Plane: Sidecar proxies (Envoy) deployed alongside every microservice container intercepting all inbound and outbound network traffic.\n2. Control Plane (Istio / Linkerd): Configures proxies, enforces policy rules, and collects telemetry.\n\nKey Capabilities:\n- Mutual TLS (mTLS): Automatic zero-trust encryption and cryptographic service identity between pods.\n- Advanced Traffic Routing: Canary traffic splitting (e.g., 90% v1, 10% v2), fault injection, circuit breaking, and automatic retries.\n- Observability: Distributed request tracing (OpenTelemetry, Jaeger), service dependency graphs (Kiali), and standardized latency/error rate metrics.\n- Access Control: Fine-grained authorization policies defining which services can call which endpoints.',
    keyPoints: [
      'Data Plane (Envoy sidecars) vs Control Plane',
      'Automatic mTLS service-to-service encryption',
      'Canary traffic splitting & circuit breaking',
      'Distributed tracing and centralized telemetry',
    ],
    hints: [
      'Explain sidecar proxy pattern (Envoy)',
      'Highlight mTLS zero-trust security without changing app code',
      'Discuss observability and circuit breaking',
    ],
    followUpQuestions: [],
  },

  'explain prometheus architecture how do pullbased metric scraping timeseries storage and alertmanager work':
    {
      expectedAnswer:
        'Prometheus Architecture:\n1. Pull-Based Scraping: Prometheus periodically sends HTTP GET requests to target /metrics endpoints at defined intervals (scrape_interval: 15s). Targets discovered dynamically via Kubernetes API or Consul service discovery.\n2. Metric Types: Counter (monotonically increasing, e.g., http_requests_total), Gauge (fluctuating value, e.g., memory_usage_bytes), Histogram (request durations bucketed), and Summary.\n3. Time-Series Storage (TSDB): Custom on-disk time-series database storing metrics as append-only chunks compressed using Gorilla float-compression and XOR timestamp delta encoding.\n4. PromQL: Powerful query language for calculating rate, increase, histogram quantiles (e.g., p99 latency: histogram_quantile(0.99, sum(rate(http_duration_bucket[5m])) by (le))).\n5. Alertmanager: Evaluates Prometheus alerting rules, handles alert deduplication, grouping, silencing, and dispatches notifications to PagerDuty, Slack, or webhooks.',
      keyPoints: [
        'Pull-based scraping over HTTP with dynamic service discovery',
        'Metric types: Counter, Gauge, Histogram, Summary',
        'Custom TSDB with Gorilla compression',
        'Alertmanager deduplication and routing',
      ],
      hints: [
        'Explain pull-based scraping vs push-based metrics',
        'Define Counter vs Gauge vs Histogram',
        'Mention PromQL and Alertmanager',
      ],
      followUpQuestions: [],
    },

  'explain flutter architecture how does the flutter rendering engine skia impeller bypass oem native widgets':
    {
      expectedAnswer:
        'Flutter Architecture:\n1. Framework Layer (Dart): Exposes declarative UI widgets, animations, gestures, and Material/Cupertino design systems. Everything is a widget.\n2. Engine Layer (C++): Hosts Dart runtime, text layout (LibTxt), platform channels, and graphic rendering engine (Skia or modern Impeller).\n3. Embedder (Platform Specific): Initializes platform-specific shell (Android surface, iOS UIView), handles thread scheduling, and captures native events.\n\nWhy Flutter Bypasses OEM Widgets:\n- Unlike React Native which maps JavaScript components to OEM widgets (android.widget.Button, UIButton), Flutter renders its own pixels directly onto a canvas surface using GPU acceleration (Metal on iOS, Vulkan on Android).\n- Eliminates bridge serialization and native widget version inconsistencies across Android OS versions.\n- Impeller Engine: Replaced Skia to eliminate shader compilation jank by pre-compiling all shader pipelines ahead-of-time (AOT).',
      keyPoints: [
        'Three layers: Dart Framework, C++ Engine, Platform Embedder',
        'Renders pixels directly to GPU canvas, bypassing OEM widgets',
        'Uniform pixel-perfect UI across all OS versions',
        'Impeller AOT shader pre-compilation eliminating frame drops',
      ],
      hints: [
        'Contrast Flutter drawing its own canvas pixels vs React Native mapping to native views',
        'Mention Impeller pre-compiling shaders to stop jank',
        'Explain Dart Framework -> C++ Engine -> Platform Embedder hierarchy',
      ],
      followUpQuestions: [],
    },

  'how do you optimize mobile app startup time cold start warm start hot start': {
    expectedAnswer:
      'Mobile App Startup Types:\n1. Cold Start: App launches from scratch (process does not exist in memory). OS allocates process, initializes Application class, inflates initial Activity/Window. Most critical metric (target < 1.5s - 2s).\n2. Warm Start: App process remains in memory, but UI Activity was destroyed and must be recreated.\n3. Hot Start: App brought to foreground from background cache; zero initialization needed.\n\nOptimization Strategies:\n- Defer Heavy Initialization: Move analytics, crash reporters, third-party SDKs out of Application.onCreate() to background threads or lazy initialization (Android App Startup library).\n- Splash Screen with Theme WindowBackground: Set a custom windowBackground drawable on the startup theme so user sees instant branded splash screen instead of black/white blank window.\n- Bytecode & AOT Optimization: Use R8 / ProGuard to remove dead code; enable baseline profiles in Android (dex pre-compilation) and Hermes engine in React Native.\n- Lazy Load Initial UI: Avoid deep nested view hierarchies; defer off-screen tabs and heavy images until main screen renders.',
    keyPoints: [
      'Cold start vs Warm start vs Hot start differences',
      'Lazy/asynchronous third-party SDK initialization',
      'Theme windowBackground for perceived instantaneous launch',
      'R8/Proguard tree shaking & Baseline Profiles',
    ],
    hints: [
      'Define Cold vs Warm vs Hot start',
      'Focus on removing synchronous blocking SDK init in Application.onCreate()',
      'Mention Baseline Profiles and windowBackground splash screens',
    ],
    followUpQuestions: [],
  },

  'how do you securely store sensitive user credentials in mobile applications ios keychain vs android keystore':
    {
      expectedAnswer:
        'Security in Mobile Storage:\n1. NEVER store plain text credentials, auth tokens, or encryption keys in SharedPreferences (Android), UserDefaults (iOS), or localStorage (React Native), as these are stored as unencrypted XML/plist files on the filesystem accessible on rooted/jailbroken devices or backup dumps.\n\n2. iOS Keychain Services:\n   - Secure, hardware-backed database managed by the OS security daemon.\n   - Access Control: Configured with kSecAttrAccessible (e.g., kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly to prevent export via iCloud backups).\n   - Can require Biometric (FaceID / TouchID) authentication to unlock sensitive keys via LocalAuthentication framework.\n\n3. Android Keystore System:\n   - Cryptographic key management system where private keys are generated and stored in hardware-isolated Secure Element / Trusted Execution Environment (TEE).\n   - EncryptedSharedPreferences (Jetpack Security): Uses AES-256 GCM to encrypt key-value pairs where the master encryption key is managed securely in Android Keystore.\n   - BiometricPrompt authentication bound to cryptographic key use.',
      keyPoints: [
        'SharedPreferences / UserDefaults are plaintext and vulnerable',
        'iOS Keychain provides hardware-backed encrypted storage',
        'Android Keystore stores keys inside TEE / Secure Element',
        'EncryptedSharedPreferences and biometric authentication binding',
      ],
      hints: [
        'Explain why SharedPreferences and UserDefaults are insecure',
        'Contrast iOS Keychain vs Android Keystore',
        'Mention hardware isolation (TEE / Secure Enclave)',
      ],
      followUpQuestions: [],
    },

  'what is database sharding explain rangebased hashbased and directorybased sharding strategies': {
    expectedAnswer:
      'Database Sharding is horizontal partitioning of a database across multiple physical servers/nodes, where each node (shard) holds a distinct subset of data sharing the same schema.\n\nSharding Strategies:\n1. Range-Based Sharding:\n   - Data partitioned by value ranges of a shard key (e.g., user_id 1-100k -> Shard 1, 100k-200k -> Shard 2; or by customer last name A-D, E-H).\n   - Pros: Simple, allows efficient range queries within a single shard.\n   - Cons: Vulnerable to severe write hot-spotting (e.g., chronological ID or timestamp range causes all new writes to hit only the newest shard).\n\n2. Hash-Based Sharding:\n   - Applies a deterministic hash function to shard key: shard_id = hash(user_id) % num_shards.\n   - Pros: Uniform data distribution across all nodes, eliminates hot spots.\n   - Cons: Range queries require scatter-gather across all shards. Adding/removing nodes requires extensive resharding (mitigated by Consistent Hashing).\n\n3. Directory-Based / Lookup Sharding:\n   - A centralized lookup service / mapping table stores which shard holds which partition key.\n   - Pros: Highly flexible; individual large tenants can be assigned to dedicated shards without changing hash functions.\n   - Cons: The lookup service introduces a single point of failure and extra network hop.',
    keyPoints: [
      'Range-based: easy range queries, but write hot-spotting',
      'Hash-based: uniform distribution, but range queries require scatter-gather',
      'Directory-based: lookup service flexibility, but extra hop overhead',
      'Consistent hashing minimizes resharding data movement',
    ],
    hints: [
      'Contrast Range vs Hash vs Directory sharding',
      'Discuss write hot-spotting in range-based sharding',
      'Explain scatter-gather queries when querying without shard key',
    ],
    followUpQuestions: [],
  },

  'what is consistent hashing and how does it prevent massive cachenode redistribution in distributed systems':
    {
      expectedAnswer:
        'The Problem with Standard Modulo Hashing:\n- Traditional hashing uses: server = hash(key) % N.\n- When adding or removing a single node (N changes to N+1 or N-1), almost all keys (N / (N+1) ≈ 90%+) hash to new server positions, invalidating entire caches and triggering catastrophic database thundering herds.\n\nHow Consistent Hashing Works:\n1. Hash Ring: Both servers and keys are hashed onto the same circular 360-degree integer space [0, 2^32 - 1] using uniform hash function (MD5/SHA-256).\n2. Key Mapping: To locate the server for a key, hash the key to a position on the ring and walk clockwise until finding the first server node.\n3. Node Addition/Removal: When a server node is added or removed, only the keys immediately preceding that node on the ring are remapped (on average K/N keys moved, where K is total keys and N is number of servers).\n4. Virtual Nodes (Replicas): If nodes are unevenly spaced on the ring, some servers will receive disproportionate load (hot spotting). Consistent hashing assigns multiple virtual points (e.g., 100-500 virtual nodes per physical machine: NodeA_1, NodeA_2) across the ring, ensuring uniform load distribution.',
      keyPoints: [
        'Modulo hash reassigns almost all keys on node churn',
        'Hash Ring: Keys and servers mapped to same circular integer range',
        'Clockwise traversal to find responsible node',
        'Virtual nodes balance load and prevent hotspots',
      ],
      hints: [
        'Explain why hash(key) % N fails when cluster size changes',
        'Describe the circular hash ring and clockwise traversal',
        'Explain why Virtual Nodes are essential for uniform distribution',
      ],
      followUpQuestions: [],
    },

  'what is writeahead logging wal and how does it guarantee atomicity and durability in acid databases':
    {
      expectedAnswer:
        'Write-Ahead Logging (WAL) is a core database transaction management mechanism where all state modifications are recorded sequentially to a persistent log file on disk BEFORE the actual data pages in the database buffer pool are modified on disk.\n\nHow WAL Guarantees ACID:\n1. Durability (Crash Recovery):\n   - Writing small sequential log records to disk (via fsync) is orders of magnitude faster than performing random I/O disk writes across large table pages.\n   - Once WAL record is flushed, the transaction commits with guaranteed durability.\n   - If server crashes before dirty buffer pages are written to table storage, the database recovers by replaying WAL records from the last Checkpoint (REDO phase).\n2. Atomicity (Rollback):\n   - If a transaction aborts or errors halfway, the database reads the Undo logs in WAL and reverses modifications in reverse order (UNDO phase), ensuring all-or-nothing execution.\n3. Checkpoints:\n   - Periodic background process flushes all dirty memory pages to disk and writes a Checkpoint record to WAL, allowing the log files before the checkpoint to be recycled.',
      keyPoints: [
        'Changes written to append-only log before modifying data pages',
        'Fast sequential disk I/O guarantees durability at commit',
        'Crash recovery uses REDO and UNDO logs from checkpoint',
        'Checkpoints flush dirty pages and prune old WAL files',
      ],
      hints: [
        'Sequential disk I/O vs random disk I/O performance',
        'Explain REDO (roll-forward) and UNDO (roll-back) recovery phases',
        'Describe how Checkpoints bound recovery time',
      ],
      followUpQuestions: [],
    },

  'design a distributed message queue like apache kafka how do partitions offset tracking and consumer groups work':
    {
      expectedAnswer:
        'Distributed Message Queue Architecture:\n1. Core Concepts:\n   - Topic: Logical stream of messages.\n   - Partition: Physical subdivision of a topic. Partitions are append-only commit logs ordered chronologically, serving as the unit of parallelism.\n   - Broker: Cluster node holding partition logs.\n\n2. Ingestion & Write Path:\n   - Producer publishes message with optional key. If key provided, partition = hash(key) % num_partitions; otherwise Round Robin.\n   - Writes are append-only sequential disk writes (using OS page cache and zero-copy sendfile syscalls for sub-millisecond throughput).\n   - Replication: Each partition has 1 Leader and N In-Sync Replicas (ISR). Producer acks configuration: acks=0 (no wait), acks=1 (leader only), acks=all (all ISRs confirm).\n\n3. Consumption & Consumer Groups:\n   - Consumer Group: Multiple consumers collaborating to process a topic. Each partition is assigned to exactly ONE consumer within a group (enables parallel processing with strict in-order guarantees per partition).\n   - Offset Tracking: Consumers track their progress via integer offset stored in internal __consumer_offsets topic. When consumer restarts, it resumes from last committed offset.\n   - Pull Model: Consumers pull messages at their own pace, preventing consumer overload.',
      keyPoints: [
        'Topics partitioned into immutable, append-only commit logs',
        'Partition key ensures strict ordering for related entities (e.g. user_id)',
        'Consumer Groups partition assignment and pull model',
        'Offset tracking in __consumer_offsets topic',
        'Zero-copy sendfile and OS PageCache performance',
      ],
      hints: [
        'Explain partition as the unit of parallelism and ordering',
        'Describe Consumer Groups: 1 partition assigned to at most 1 consumer in a group',
        'Discuss OS PageCache and Zero-Copy I/O efficiency',
      ],
      followUpQuestions: [],
    },

  'design an online code execution platform like leetcode or hackerrank how do you isolate untrusted user code securely':
    {
      expectedAnswer:
        'Online Code Execution Platform Architecture:\n1. System Flow:\n   - Client submits code -> API Gateway -> Submission Service creates record in PostgreSQL and pushes job to RabbitMQ/Kafka queue.\n   - Worker Nodes pull execution jobs, compile/run code against test cases, and emit evaluation results via WebSockets to client.\n\n2. Secure Sandboxing of Untrusted Code (Crucial Core):\n   - Running raw docker exec is vulnerable to kernel escape exploits, fork bombs, and network scans.\n   - Multi-Layered Sandbox Isolation:\n     * Lightweight VMs (AWS Firecracker / gVisor): MicroVMs booted in <100ms with dedicated guest kernels, preventing host kernel exploits.\n     * Linux seccomp (Secure Computing Mode): Whitelist allowed system calls; block networking (socket), process creation (fork/clone), and arbitrary filesystem operations.\n     * cgroups v2: Enforce hard limits on CPU execution time (e.g. 2.0s limit, SIGXCPU), memory limit (e.g. 256MB, SIGKILL on OOM), and process count (pids.max = 1 to prevent fork bombs).\n     * Ephemeral read-only root filesystems with tmpfs scratch space.\n     * Network isolation: Disabled network interface (--net=none).\n\n3. Judge Evaluation Pipeline:\n   - Pre-compiled test inputs mounted read-only.\n   - Output compared against expected outputs (exact match or custom checker script) with time and memory measurement.',
      keyPoints: [
        'Asynchronous job queue (RabbitMQ/Kafka) decoupling submit from execution',
        'MicroVM isolation (AWS Firecracker, gVisor) for secure untrusted code execution',
        'Linux seccomp syscall whitelisting & cgroups resource limits',
        'Network-disabled sandboxes with tmpfs scratch mounts',
      ],
      hints: [
        'Focus heavily on security: how to stop fork bombs, cryptocurrency mining, and network attacks',
        'Mention MicroVMs (Firecracker / gVisor) and seccomp syscall filtering',
        'Explain asynchronous queueing to handle high submission concurrency',
      ],
      followUpQuestions: [],
    },

  'what is a monotonic stack how do you use it to solve the next greater element problem in on time':
    {
      expectedAnswer:
        'A Monotonic Stack is a stack data structure where elements are maintained in strictly increasing or strictly decreasing order.\n\nNext Greater Element Problem (LeetCode 496 / 503):\n- Goal: For each element in array, find the first element to its right that is strictly greater.\n\nAlgorithm (Monotonically Decreasing Stack):\n1. Maintain a stack holding indices of elements.\n2. Iterate through array from left to right:\n   - While stack is not empty AND current element nums[i] > nums[stack.peek()]:\n     * Pop top index prevIndex from stack.\n     * result[prevIndex] = nums[i] (current element is the next greater element for popped index).\n   - Push current index i onto stack.\n3. After loop, any indices remaining on stack have no greater element to their right (result remains -1).\n\nTime & Space Complexity:\n- Time Complexity: O(n). Although nested while loop exists, each element is pushed onto stack exactly once and popped at most once (amortized 2n operations).\n- Space Complexity: O(n) for stack and result array.',
      keyPoints: [
        'Maintains elements in strictly increasing or decreasing order',
        'Amortized O(n) time because each element pushed and popped at most once',
        'Solves Next Greater Element, Daily Temperatures, Trapping Rain Water',
        'Store indices on stack to calculate distance and assign results directly',
      ],
      hints: [
        'Maintain indices rather than values on the stack',
        'Explain why time complexity is amortized O(n) despite nested while loop',
        'Mention related problems: Daily Temperatures, Largest Rectangle in Histogram',
      ],
      followUpQuestions: [],
    },

  'explain the unionfind disjoint set union data structure with path compression and union by rank':
    {
      expectedAnswer:
        'Union-Find (Disjoint Set Union - DSU) is a data structure that tracks elements partitioned into disjoint subsets, supporting two primary operations in near constant time:\n\n1. find(x): Identifies which subset element x belongs to by returning the representative/root of x.\n2. union(x, y): Merges the subset containing x with the subset containing y.\n\nTwo Critical Optimizations:\n1. Path Compression (during find):\n   - When traversing up the tree to find root, point every visited node directly to the root: parent[x] = find(parent[x]).\n   - Flattens the tree depth to 1 on subsequent calls.\n2. Union by Rank / Size (during union):\n   - Always attach the shorter tree under the root of the taller tree to prevent long degenerate chains.\n   - If rank[rootX] < rank[rootY], parent[rootX] = rootY; otherwise attach rootY under rootX and increment rank.\n\nTime Complexity:\n- Combining Path Compression and Union by Rank reduces operations to O(α(n)) amortized time, where α is the Inverse Ackermann function. For all practical values of n (even number of atoms in universe), α(n) < 5 (effectively constant O(1) time).\n\nApplications: Kruskal Minimum Spanning Tree, Cycle detection in undirected graphs, Number of Connected Components.',
      keyPoints: [
        'Disjoint set tracking with find and union operations',
        'Path Compression points nodes directly to root during find',
        'Union by Rank attaches smaller tree to larger tree',
        'Amortized time O(α(n)) ≈ O(1) per operation',
        'Applications: Kruskal MST and dynamic connectivity',
      ],
      hints: [
        'Explain parent array representation',
        'Contrast find with path compression vs naive traversal',
        'Explain Inverse Ackermann function α(n) ≈ O(1)',
      ],
      followUpQuestions: [],
    },

  'explain nextjs server components rsc vs client components how do they work under the hood': {
    expectedAnswer:
      'React Server Components (RSC) vs Client Components:\n\n1. React Server Components (RSC - Default in Next.js App Router):\n   - Execution: Render solely on server; code NEVER ships to browser bundle.\n   - Capabilities: Direct access to backend resources (database queries, filesystem, secrets/API keys).\n   - Output: Renders into a special JSON-like virtual stream called RSC Payload (containing serialized React elements and component slots), not plain HTML.\n   - Benefits: 0KB client bundle size, faster initial page load, zero API round-trips for server data.\n   - Limitations: Cannot use React hooks (useState, useEffect) or browser event listeners (onClick).\n\n2. Client Components (marked with "use client"):\n   - Execution: Pre-rendered into HTML on server during SSR, then hydrated with JavaScript in client browser.\n   - Capabilities: Full access to browser APIs, useState, useEffect, context, and DOM event listeners.\n   - Benefits: Rich interactive UI (forms, toggles, client animations).\n\n3. Interleaving Pattern:\n   - Server components can import Client components directly.\n   - Client components cannot import Server components directly, but can accept Server components as children props (<ClientComponent><ServerComponent /></ClientComponent>), preserving 0-bundle server rendering for nested children.',
    keyPoints: [
      'Server components run exclusively on server with 0KB client JS overhead',
      'Direct DB access and secrets security in Server Components',
      'Client components ("use client") for interactive hooks and event handlers',
      'Children prop pattern allows nesting Server components inside Client components',
    ],
    hints: [
      'Server components code never ships to browser bundle (0kb JS)',
      'Server components stream RSC payload, Client components hydrate in browser',
      'Explain how to pass Server components as children to Client components',
    ],
    followUpQuestions: [],
  },

  'what is crosssite scripting xss explain stored reflected and dombased xss with prevention strategies':
    {
      expectedAnswer:
        'Cross-Site Scripting (XSS) is a security vulnerability where an attacker injects malicious client-side scripts into trusted web applications, executing in victim browsers to steal session cookies, tokens, or perform unauthorized actions.\n\nThree Types of XSS:\n1. Stored XSS (Persistent):\n   - Malicious script is permanently stored in database (e.g. comment field, profile bio) and served to every user who views that page.\n   - Most dangerous XSS type.\n2. Reflected XSS (Non-Persistent):\n   - Malicious script is reflected off web server immediately via URL query parameters or form submissions (e.g. search.php?q=<script>...).\n   - Attacker tricks victim into clicking crafted phishing link.\n3. DOM-Based XSS:\n   - Vulnerability exists entirely in client-side JavaScript without server involvement.\n   - Client code reads untrusted source (location.hash, document.referrer) and passes it to unsafe sink (innerHTML, eval(), document.write).\n\nPrevention Strategies:\n- Context-Aware Output Encoding: HTML entity encoding before rendering user input.\n- Modern Frameworks: React escapes string variables in JSX by default (avoid dangerouslySetInnerHTML).\n- Content Security Policy (CSP): Enforce strict CSP headers restricting script sources and disabling inline scripts (default-src self).\n- HttpOnly Cookies: Set HttpOnly flag on session cookies so JavaScript document.cookie cannot read them.',
      keyPoints: [
        'Stored XSS persists in database; Reflected reflects via URL; DOM-based executes client-side',
        'Dangerous sinks: innerHTML, document.write, eval()',
        'React auto-escapes JSX text expressions',
        'Content Security Policy (CSP) and HttpOnly cookie flags',
      ],
      hints: [
        'Define Stored vs Reflected vs DOM-based XSS',
        'Mention Dangerous sinks (innerHTML, eval)',
        'Explain defense in depth: escaping, CSP headers, and HttpOnly cookies',
      ],
      followUpQuestions: [],
    },

  'explain the transformer architecture selfattention multihead attention and positional encoding':
    {
      expectedAnswer:
        'Transformer Architecture ("Attention Is All You Need"):\n\n1. Self-Attention Mechanism:\n   - Maps input tokens into Query (Q), Key (K), and Value (V) vector projections using learned weight matrices.\n   - Computes attention weights: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V.\n   - Dot product (Q * K^T) measures token pairwise similarity; dividing by sqrt(d_k) prevents softmax gradient vanishing in high dimensions; softmax normalizes into probability weights that scale V.\n\n2. Multi-Head Attention (MHA):\n   - Projects Q, K, V into h distinct lower-dimensional subspaces in parallel.\n   - Allows model to simultaneously attend to information from different representation subspaces (e.g. syntactic agreement, coreference, semantic relations).\n   - Outputs concatenated and linearly projected back to model dimension d_model.\n\n3. Positional Encoding:\n   - Because Self-Attention is permutation invariant (order-agnostic), token positions must be explicitly injected.\n   - Sinusoidal encodings: PE(pos, 2i) = sin(pos / 10000^(2i/d_model)) and cos for odd indices; or learned positional embeddings (BERT) or RoPE (Rotary Position Embeddings in modern LLMs).\n\n4. Encoder-Decoder Blocks:\n   - Layer normalization (Pre-LN in modern LLMs), residual skip connections (x + Sublayer(x)), and position-wise Feed-Forward Networks (FFN).',
      keyPoints: [
        'Query, Key, Value dot-product attention calculation',
        'Multi-Head Attention captures diverse semantic subspaces in parallel',
        'Positional Encoding (Sinusoidal / RoPE) solves permutation invariance',
        'Residual connections and Layer Normalization stabilize gradient flow',
      ],
      hints: [
        'Break down formula: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V',
        'Explain why division by sqrt(d_k) prevents vanishing gradients',
        'Explain why positional encoding is needed due to permutation invariance',
      ],
      followUpQuestions: [],
    },

  'how do you detect and mitigate data drift and concept drift in production ml systems': {
    expectedAnswer:
      "Drift in Production ML Systems:\n\n1. Distinguishing Drift Types:\n   - Covariate / Data Drift: P(X) changes while P(Y|X) remains constant. Input feature distribution shifts over time (e.g. user demographics shift, new camera hardware produces different image resolutions).\n   - Concept Drift: P(Y|X) changes while P(X) may remain constant. The true relationship between input features and target labels changes (e.g. consumer purchasing habits suddenly shift during macroeconomic crisis, fraud patterns mutate).\n\n2. Detection Techniques:\n   - Statistical Distance Tests: Kolmogorov-Smirnov (KS) test for continuous variables; Chi-Square test for categorical variables comparing inference window vs baseline training distribution.\n   - Distribution Divergence Metrics: Population Stability Index (PSI > 0.2 indicates significant drift), Wasserstein distance (Earth Mover's Distance), and Kullback-Leibler (KL) / Jensen-Shannon (JS) divergence.\n   - Model Performance Monitoring: Track delayed ground truth labels against model predictions (precision/recall, AUC-ROC drop, RMSE inflation).\n\n3. Mitigation Strategies:\n   - Automated Retraining Pipeline: Trigger CI/CD training pipeline (Kubeflow / Airflow) on drifting data with sliding window or exponential decay weighting.\n   - Shadow / Canary Deployment: Deploy newly retrained model in shadow mode before routing live traffic.\n   - Fallback Rules: Fall back to rule-based heuristics or ensemble models when outlier drift score exceeds confidence threshold.",
    keyPoints: [
      'Data drift P(X) shift vs Concept drift P(Y|X) relationship shift',
      'Detection via PSI, KS test, and Wasserstein distance',
      'Automated retraining with sliding windows and shadow model validation',
      'Delayed ground truth tracking and fallbacks',
    ],
    hints: [
      'Differentiate P(X) shift (data drift) from P(Y|X) shift (concept drift)',
      'Mention statistical tests: KS test, Chi-Square, and PSI (Population Stability Index)',
      'Describe mitigation: sliding window retraining, shadow deployments',
    ],
    followUpQuestions: [],
  },

  'tell me about a time you disagreed with an engineering decision made by leadership or a teammate how did you resolve it':
    {
      expectedAnswer:
        'Framework: Amazon Leadership Principle "Have Backbone; Disagree and Commit" using STAR Method:\n\n1. Situation:\n   - Tech lead proposed migrating our customer notification service to a complex distributed microservices framework using an unproven technology stack with high operational overhead for our team of 4 engineers.\n\n2. Task:\n   - Voice technical concerns constructively while keeping team morale high and preventing unneeded architectural complexity.\n\n3. Action:\n   - Gathered Data: Built a quick prototype benchmark showing network latency overhead and calculated projected AWS infrastructure costs vs our current solution.\n   - RFC Proposal: Wrote a short, neutral Decision Matrix document comparing the proposed approach against extending our current modular architecture.\n   - Respectful Discussion: Scheduled a 1-on-1 walk-through, actively listened to the lead\'s motivations (fear of database lock contention), and demonstrated how connection pooling and read replicas resolved their core fear with 80% less effort.\n   - Disagree and Commit: We agreed on a phased hybrid approach. If team had voted for the rewrite, I would have committed 100% to making it successful without lingering resentment.\n\n4. Result:\n   - Saved an estimated 6 weeks of engineering effort; system handled Black Friday traffic with 99.99% uptime and zero contention.',
      keyPoints: [
        'Objective data-driven persuasion over personal opinion',
        'Active listening to uncover underlying architectural concerns',
        'Collaborative decision matrix comparison',
        'Disagree and commit alignment once decided',
      ],
      hints: [
        'Focus on objective data and prototypes rather than subjective opinions',
        "Demonstrate respectful listening to the other party's underlying concern",
        'Show willingness to commit wholeheartedly once a decision is finalized',
      ],
      followUpQuestions: [],
    },

  'describe a situation where you had to balance technical debt against delivering features quickly':
    {
      expectedAnswer:
        'Framework: Strategic Technical Debt Management using STAR Method:\n\n1. Situation:\n   - Two weeks before a critical enterprise client pilot launch, product required a custom reporting exporter. The clean long-term architecture (asynchronous worker with S3 upload) would take 3 weeks, while a synchronous API generation route would take 4 days but could cause memory spikes if report size exceeded 10,000 rows.\n\n2. Task:\n   - Meet the pilot launch milestone without permanently crippling system reliability or accumulating invisible debt.\n\n3. Action:\n   - Conscious Debt Acceptance: Implemented the faster synchronous solution with safety guardrails (hard cap on row limit, strict query timeouts, and circuit breakers).\n   - Documented Debt & Created Debt Ticket: Documented the trade-off in the PR and created an immediate sprint backlog ticket with clear acceptance criteria for the async refactor.\n   - Negotiated Maintenance Budget: Agreed with Product Manager to allocate 20% of the very next sprint to convert the exporter to the worker queue before open public rollout.\n\n4. Result:\n   - Closed enterprise pilot contract successfully on time. Shipped the async queue refactor during the subsequent sprint without customer incidents or production degradation.',
      keyPoints: [
        'Deliberate technical debt trade-off aligned with business milestones',
        'Defensive safety guardrails (limits, timeouts) preventing system crashes',
        'Transparent documentation and scheduled repayment sprint budget',
        'Zero customer outage during pilot',
      ],
      hints: [
        'Emphasize that technical debt can be taken intentionally like financial debt, provided it is managed and paid down',
        'Show collaboration with Product Managers to allocate refactoring capacity',
        'Highlight defensive guardrails added to protect production',
      ],
      followUpQuestions: [],
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
