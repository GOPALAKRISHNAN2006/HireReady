/**
 * Additional Comprehensive Question Bank Expansion Batch 2
 * Expands all categories: DevOps, Mobile, Database, System Design, DSA, Web, ML, Behavioral.
 */

const additionalBatch2 = [
  // ==========================================
  // DEVOPS & CLOUD
  // ==========================================
  {
    text: 'How does Linux memory management work? Explain Virtual Memory, Page Faults, Swapping, and the OOM Killer.',
    category: 'devops',
    difficulty: 'hard',
    type: 'technical',
    tags: ['linux', 'memory', 'kernel', 'devops', 'oom'],
    company: 'Google',
    expectedAnswer:
      'Linux Memory Management:\n1. Virtual Memory & Page Tables: Each process is given an isolated virtual address space. The CPU Memory Management Unit (MMU) translates virtual addresses to physical RAM pages using page tables and the Translation Lookaside Buffer (TLB).\n2. Page Faults: Occur when a process accesses a virtual page not currently in physical RAM. Minor page fault: Page is in memory (e.g. shared library) and just needs mapping. Major page fault: Page must be read from disk (swap or file).\n3. Swapping: Moving inactive memory pages to swap disk to free RAM. High swapping causes thrashing where CPU spends all time waiting on disk I/O.\n4. OOM (Out Of Memory) Killer: When system runs critically low on memory and cannot allocate pages, the Linux kernel invokes the OOM Killer. It calculates an oom_score for each process based on RAM usage and runtime, and sends SIGKILL to terminate the highest-scoring non-critical process to protect kernel stability.',
    hints: [
      'Explain MMU translation of virtual to physical memory',
      'Contrast minor vs major page faults',
      'Explain oom_score calculation',
    ],
    keyPoints: [
      'Virtual memory isolation via MMU & page tables',
      'Minor vs major page faults',
      'Swap disk thrashing',
      'OOM Killer SIGKILL intervention based on oom_score',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain DNS resolution step-by-step from browser URL entry to IP address.',
    category: 'devops',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['networking', 'dns', 'internet', 'protocols'],
    company: 'Cloudflare',
    expectedAnswer:
      'Step-by-step DNS Resolution:\n1. Browser & OS Cache: Browser checks its local DNS cache; if miss, checks OS DNS cache and local hosts file.\n2. Recursive Resolver: Query sent to ISP / public DNS resolver (e.g., 8.8.8.8, 1.1.1.1). If cached in resolver memory, IP is returned immediately.\n3. Root Nameserver (.): If resolver cache misses, it queries one of the 13 logical root nameservers, which responds with TLD server IP (e.g., .com TLD).\n4. TLD Nameserver (.com): Resolver queries .com TLD server, which responds with the Authoritative Nameserver IP for example.com.\n5. Authoritative Nameserver: Resolver queries authoritative server (e.g., Cloudflare, Route53), which looks up the DNS record (A record for IPv4, AAAA for IPv6, CNAME for alias) and returns the IP.\n6. Client Connection: Resolver caches response according to TTL (Time-To-Live) and hands IP back to browser to initiate TCP/TLS handshake.',
    hints: [
      'Follow: Browser Cache -> OS Cache -> Recursive Resolver -> Root -> TLD -> Authoritative Server',
      'Mention TTL caching at each layer',
    ],
    keyPoints: [
      'Iterative vs recursive DNS query flow',
      'Hierarchy: Root -> TLD (.com) -> Authoritative Nameserver',
      'A vs AAAA vs CNAME records',
      'TTL cache expiration',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is a Service Mesh (e.g. Istio, Linkerd)? Why is it needed in microservices architectures?',
    category: 'devops',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['service-mesh', 'istio', 'kubernetes', 'microservices'],
    company: 'Netflix',
    expectedAnswer:
      'A Service Mesh is a dedicated infrastructure layer for managing service-to-service (east-west) communication in microservices architectures without modifying application code.\n\nArchitecture:\n1. Data Plane: Sidecar proxies (Envoy) deployed alongside every microservice container intercepting all inbound and outbound network traffic.\n2. Control Plane (Istio / Linkerd): Configures proxies, enforces policy rules, and collects telemetry.\n\nKey Capabilities:\n- Mutual TLS (mTLS): Automatic zero-trust encryption and cryptographic service identity between pods.\n- Advanced Traffic Routing: Canary traffic splitting (e.g., 90% v1, 10% v2), fault injection, circuit breaking, and automatic retries.\n- Observability: Distributed request tracing (OpenTelemetry, Jaeger), service dependency graphs (Kiali), and standardized latency/error rate metrics.\n- Access Control: Fine-grained authorization policies defining which services can call which endpoints.',
    hints: [
      'Explain sidecar proxy pattern (Envoy)',
      'Highlight mTLS zero-trust security without changing app code',
      'Discuss observability and circuit breaking',
    ],
    keyPoints: [
      'Data Plane (Envoy sidecars) vs Control Plane',
      'Automatic mTLS service-to-service encryption',
      'Canary traffic splitting & circuit breaking',
      'Distributed tracing and centralized telemetry',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Prometheus architecture. How do pull-based metric scraping, time-series storage, and Alertmanager work?',
    category: 'devops',
    difficulty: 'medium',
    type: 'technical',
    tags: ['prometheus', 'monitoring', 'observability', 'devops', 'metrics'],
    company: 'Uber',
    expectedAnswer:
      'Prometheus Architecture:\n1. Pull-Based Scraping: Prometheus periodically sends HTTP GET requests to target /metrics endpoints at defined intervals (scrape_interval: 15s). Targets discovered dynamically via Kubernetes API or Consul service discovery.\n2. Metric Types: Counter (monotonically increasing, e.g., http_requests_total), Gauge (fluctuating value, e.g., memory_usage_bytes), Histogram (request durations bucketed), and Summary.\n3. Time-Series Storage (TSDB): Custom on-disk time-series database storing metrics as append-only chunks compressed using Gorilla float-compression and XOR timestamp delta encoding.\n4. PromQL: Powerful query language for calculating rate, increase, histogram quantiles (e.g., p99 latency: histogram_quantile(0.99, sum(rate(http_duration_bucket[5m])) by (le))).\n5. Alertmanager: Evaluates Prometheus alerting rules, handles alert deduplication, grouping, silencing, and dispatches notifications to PagerDuty, Slack, or webhooks.',
    hints: [
      'Explain pull-based scraping vs push-based metrics',
      'Define Counter vs Gauge vs Histogram',
      'Mention PromQL and Alertmanager',
    ],
    keyPoints: [
      'Pull-based scraping over HTTP with dynamic service discovery',
      'Metric types: Counter, Gauge, Histogram, Summary',
      'Custom TSDB with Gorilla compression',
      'Alertmanager deduplication and routing',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // MOBILE DEVELOPMENT
  // ==========================================
  {
    text: 'Explain Flutter architecture. How does the Flutter rendering engine (Skia / Impeller) bypass OEM native widgets?',
    category: 'mobile',
    difficulty: 'medium',
    type: 'technical',
    tags: ['flutter', 'dart', 'mobile', 'rendering', 'cross-platform'],
    company: 'Google',
    expectedAnswer:
      'Flutter Architecture:\n1. Framework Layer (Dart): Exposes declarative UI widgets, animations, gestures, and Material/Cupertino design systems. Everything is a widget.\n2. Engine Layer (C++): Hosts Dart runtime, text layout (LibTxt), platform channels, and graphic rendering engine (Skia or modern Impeller).\n3. Embedder (Platform Specific): Initializes platform-specific shell (Android surface, iOS UIView), handles thread scheduling, and captures native events.\n\nWhy Flutter Bypasses OEM Widgets:\n- Unlike React Native which maps JavaScript components to OEM widgets (android.widget.Button, UIButton), Flutter renders its own pixels directly onto a canvas surface using GPU acceleration (Metal on iOS, Vulkan on Android).\n- Eliminates bridge serialization and native widget version inconsistencies across Android OS versions.\n- Impeller Engine: Replaced Skia to eliminate shader compilation jank by pre-compiling all shader pipelines ahead-of-time (AOT).',
    hints: [
      'Contrast Flutter drawing its own canvas pixels vs React Native mapping to native views',
      'Mention Impeller pre-compiling shaders to stop jank',
      'Explain Dart Framework -> C++ Engine -> Platform Embedder hierarchy',
    ],
    keyPoints: [
      'Three layers: Dart Framework, C++ Engine, Platform Embedder',
      'Renders pixels directly to GPU canvas, bypassing OEM widgets',
      'Uniform pixel-perfect UI across all OS versions',
      'Impeller AOT shader pre-compilation eliminating frame drops',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How do you optimize mobile app startup time (Cold start, Warm start, Hot start)?',
    category: 'mobile',
    difficulty: 'medium',
    type: 'technical',
    tags: ['mobile', 'performance', 'android', 'ios', 'optimization'],
    company: 'Meta',
    expectedAnswer:
      'Mobile App Startup Types:\n1. Cold Start: App launches from scratch (process does not exist in memory). OS allocates process, initializes Application class, inflates initial Activity/Window. Most critical metric (target < 1.5s - 2s).\n2. Warm Start: App process remains in memory, but UI Activity was destroyed and must be recreated.\n3. Hot Start: App brought to foreground from background cache; zero initialization needed.\n\nOptimization Strategies:\n- Defer Heavy Initialization: Move analytics, crash reporters, third-party SDKs out of Application.onCreate() to background threads or lazy initialization (Android App Startup library).\n- Splash Screen with Theme WindowBackground: Set a custom windowBackground drawable on the startup theme so user sees instant branded splash screen instead of black/white blank window.\n- Bytecode & AOT Optimization: Use R8 / ProGuard to remove dead code; enable baseline profiles in Android (dex pre-compilation) and Hermes engine in React Native.\n- Lazy Load Initial UI: Avoid deep nested view hierarchies; defer off-screen tabs and heavy images until main screen renders.',
    hints: [
      'Define Cold vs Warm vs Hot start',
      'Focus on removing synchronous blocking SDK init in Application.onCreate()',
      'Mention Baseline Profiles and windowBackground splash screens',
    ],
    keyPoints: [
      'Cold start vs Warm start vs Hot start differences',
      'Lazy/asynchronous third-party SDK initialization',
      'Theme windowBackground for perceived instantaneous launch',
      'R8/Proguard tree shaking & Baseline Profiles',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How do you securely store sensitive user credentials in mobile applications (iOS Keychain vs Android Keystore)?',
    category: 'mobile',
    difficulty: 'easy',
    type: 'technical',
    tags: ['mobile', 'security', 'ios', 'android', 'encryption'],
    company: 'Apple',
    expectedAnswer:
      'Security in Mobile Storage:\n1. NEVER store plain text credentials, auth tokens, or encryption keys in SharedPreferences (Android), UserDefaults (iOS), or localStorage (React Native), as these are stored as unencrypted XML/plist files on the filesystem accessible on rooted/jailbroken devices or backup dumps.\n\n2. iOS Keychain Services:\n   - Secure, hardware-backed database managed by the OS security daemon.\n   - Access Control: Configured with kSecAttrAccessible (e.g., kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly to prevent export via iCloud backups).\n   - Can require Biometric (FaceID / TouchID) authentication to unlock sensitive keys via LocalAuthentication framework.\n\n3. Android Keystore System:\n   - Cryptographic key management system where private keys are generated and stored in hardware-isolated Secure Element / Trusted Execution Environment (TEE).\n   - EncryptedSharedPreferences (Jetpack Security): Uses AES-256 GCM to encrypt key-value pairs where the master encryption key is managed securely in Android Keystore.\n   - BiometricPrompt authentication bound to cryptographic key use.',
    hints: [
      'Explain why SharedPreferences and UserDefaults are insecure',
      'Contrast iOS Keychain vs Android Keystore',
      'Mention hardware isolation (TEE / Secure Enclave)',
    ],
    keyPoints: [
      'SharedPreferences / UserDefaults are plaintext and vulnerable',
      'iOS Keychain provides hardware-backed encrypted storage',
      'Android Keystore stores keys inside TEE / Secure Element',
      'EncryptedSharedPreferences and biometric authentication binding',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // DATABASE SYSTEMS
  // ==========================================
  {
    text: 'What is Database Sharding? Explain Range-based, Hash-based, and Directory-based sharding strategies.',
    category: 'database',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['database', 'sharding', 'scaling', 'distributed-systems'],
    company: 'Amazon',
    expectedAnswer:
      'Database Sharding is horizontal partitioning of a database across multiple physical servers/nodes, where each node (shard) holds a distinct subset of data sharing the same schema.\n\nSharding Strategies:\n1. Range-Based Sharding:\n   - Data partitioned by value ranges of a shard key (e.g., user_id 1-100k -> Shard 1, 100k-200k -> Shard 2; or by customer last name A-D, E-H).\n   - Pros: Simple, allows efficient range queries within a single shard.\n   - Cons: Vulnerable to severe write hot-spotting (e.g., chronological ID or timestamp range causes all new writes to hit only the newest shard).\n\n2. Hash-Based Sharding:\n   - Applies a deterministic hash function to shard key: shard_id = hash(user_id) % num_shards.\n   - Pros: Uniform data distribution across all nodes, eliminates hot spots.\n   - Cons: Range queries require scatter-gather across all shards. Adding/removing nodes requires extensive resharding (mitigated by Consistent Hashing).\n\n3. Directory-Based / Lookup Sharding:\n   - A centralized lookup service / mapping table stores which shard holds which partition key.\n   - Pros: Highly flexible; individual large tenants can be assigned to dedicated shards without changing hash functions.\n   - Cons: The lookup service introduces a single point of failure and extra network hop.',
    hints: [
      'Contrast Range vs Hash vs Directory sharding',
      'Discuss write hot-spotting in range-based sharding',
      'Explain scatter-gather queries when querying without shard key',
    ],
    keyPoints: [
      'Range-based: easy range queries, but write hot-spotting',
      'Hash-based: uniform distribution, but range queries require scatter-gather',
      'Directory-based: lookup service flexibility, but extra hop overhead',
      'Consistent hashing minimizes resharding data movement',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is Consistent Hashing and how does it prevent massive cache/node redistribution in distributed systems?',
    category: 'database',
    difficulty: 'hard',
    type: 'technical',
    tags: ['consistent-hashing', 'distributed-systems', 'caching', 'system-design'],
    company: 'Stripe',
    expectedAnswer:
      'The Problem with Standard Modulo Hashing:\n- Traditional hashing uses: server = hash(key) % N.\n- When adding or removing a single node (N changes to N+1 or N-1), almost all keys (N / (N+1) ≈ 90%+) hash to new server positions, invalidating entire caches and triggering catastrophic database thundering herds.\n\nHow Consistent Hashing Works:\n1. Hash Ring: Both servers and keys are hashed onto the same circular 360-degree integer space [0, 2^32 - 1] using uniform hash function (MD5/SHA-256).\n2. Key Mapping: To locate the server for a key, hash the key to a position on the ring and walk clockwise until finding the first server node.\n3. Node Addition/Removal: When a server node is added or removed, only the keys immediately preceding that node on the ring are remapped (on average K/N keys moved, where K is total keys and N is number of servers).\n4. Virtual Nodes (Replicas): If nodes are unevenly spaced on the ring, some servers will receive disproportionate load (hot spotting). Consistent hashing assigns multiple virtual points (e.g., 100-500 virtual nodes per physical machine: NodeA_1, NodeA_2) across the ring, ensuring uniform load distribution.',
    hints: [
      'Explain why hash(key) % N fails when cluster size changes',
      'Describe the circular hash ring and clockwise traversal',
      'Explain why Virtual Nodes are essential for uniform distribution',
    ],
    keyPoints: [
      'Modulo hash reassigns almost all keys on node churn',
      'Hash Ring: Keys and servers mapped to same circular integer range',
      'Clockwise traversal to find responsible node',
      'Virtual nodes balance load and prevent hotspots',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is Write-Ahead Logging (WAL) and how does it guarantee Atomicity and Durability in ACID databases?',
    category: 'database',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['database', 'wal', 'acid', 'durability', 'internals'],
    company: 'PostgreSQL',
    expectedAnswer:
      'Write-Ahead Logging (WAL) is a core database transaction management mechanism where all state modifications are recorded sequentially to a persistent log file on disk BEFORE the actual data pages in the database buffer pool are modified on disk.\n\nHow WAL Guarantees ACID:\n1. Durability (Crash Recovery):\n   - Writing small sequential log records to disk (via fsync) is orders of magnitude faster than performing random I/O disk writes across large table pages.\n   - Once WAL record is flushed, the transaction commits with guaranteed durability.\n   - If server crashes before dirty buffer pages are written to table storage, the database recovers by replaying WAL records from the last Checkpoint (REDO phase).\n2. Atomicity (Rollback):\n   - If a transaction aborts or errors halfway, the database reads the Undo logs in WAL and reverses modifications in reverse order (UNDO phase), ensuring all-or-nothing execution.\n3. Checkpoints:\n   - Periodic background process flushes all dirty memory pages to disk and writes a Checkpoint record to WAL, allowing the log files before the checkpoint to be recycled.',
    hints: [
      'Sequential disk I/O vs random disk I/O performance',
      'Explain REDO (roll-forward) and UNDO (roll-back) recovery phases',
      'Describe how Checkpoints bound recovery time',
    ],
    keyPoints: [
      'Changes written to append-only log before modifying data pages',
      'Fast sequential disk I/O guarantees durability at commit',
      'Crash recovery uses REDO and UNDO logs from checkpoint',
      'Checkpoints flush dirty pages and prune old WAL files',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // ADVANCED SYSTEM DESIGN
  // ==========================================
  {
    text: 'Design a Distributed Message Queue like Apache Kafka. How do partitions, offset tracking, and consumer groups work?',
    category: 'system-design',
    difficulty: 'hard',
    type: 'technical',
    tags: ['system-design', 'kafka', 'message-queue', 'distributed-systems', 'streaming'],
    company: 'LinkedIn',
    expectedAnswer:
      'Distributed Message Queue Architecture:\n1. Core Concepts:\n   - Topic: Logical stream of messages.\n   - Partition: Physical subdivision of a topic. Partitions are append-only commit logs ordered chronologically, serving as the unit of parallelism.\n   - Broker: Cluster node holding partition logs.\n\n2. Ingestion & Write Path:\n   - Producer publishes message with optional key. If key provided, partition = hash(key) % num_partitions; otherwise Round Robin.\n   - Writes are append-only sequential disk writes (using OS page cache and zero-copy sendfile syscalls for sub-millisecond throughput).\n   - Replication: Each partition has 1 Leader and N In-Sync Replicas (ISR). Producer acks configuration: acks=0 (no wait), acks=1 (leader only), acks=all (all ISRs confirm).\n\n3. Consumption & Consumer Groups:\n   - Consumer Group: Multiple consumers collaborating to process a topic. Each partition is assigned to exactly ONE consumer within a group (enables parallel processing with strict in-order guarantees per partition).\n   - Offset Tracking: Consumers track their progress via integer offset stored in internal __consumer_offsets topic. When consumer restarts, it resumes from last committed offset.\n   - Pull Model: Consumers pull messages at their own pace, preventing consumer overload.',
    hints: [
      'Explain partition as the unit of parallelism and ordering',
      'Describe Consumer Groups: 1 partition assigned to at most 1 consumer in a group',
      'Discuss OS PageCache and Zero-Copy I/O efficiency',
    ],
    keyPoints: [
      'Topics partitioned into immutable, append-only commit logs',
      'Partition key ensures strict ordering for related entities (e.g. user_id)',
      'Consumer Groups partition assignment and pull model',
      'Offset tracking in __consumer_offsets topic',
      'Zero-copy sendfile and OS PageCache performance',
    ],
    recommendedTimeMinutes: 7,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Design an Online Code Execution Platform like LeetCode or HackerRank. How do you isolate untrusted user code securely?',
    category: 'system-design',
    difficulty: 'hard',
    type: 'technical',
    tags: ['system-design', 'sandbox', 'security', 'docker', 'execution-engine'],
    company: 'Google',
    expectedAnswer:
      'Online Code Execution Platform Architecture:\n1. System Flow:\n   - Client submits code -> API Gateway -> Submission Service creates record in PostgreSQL and pushes job to RabbitMQ/Kafka queue.\n   - Worker Nodes pull execution jobs, compile/run code against test cases, and emit evaluation results via WebSockets to client.\n\n2. Secure Sandboxing of Untrusted Code (Crucial Core):\n   - Running raw docker exec is vulnerable to kernel escape exploits, fork bombs, and network scans.\n   - Multi-Layered Sandbox Isolation:\n     * Lightweight VMs (AWS Firecracker / gVisor): MicroVMs booted in <100ms with dedicated guest kernels, preventing host kernel exploits.\n     * Linux seccomp (Secure Computing Mode): Whitelist allowed system calls; block networking (socket), process creation (fork/clone), and arbitrary filesystem operations.\n     * cgroups v2: Enforce hard limits on CPU execution time (e.g. 2.0s limit, SIGXCPU), memory limit (e.g. 256MB, SIGKILL on OOM), and process count (pids.max = 1 to prevent fork bombs).\n     * Ephemeral read-only root filesystems with tmpfs scratch space.\n     * Network isolation: Disabled network interface (--net=none).\n\n3. Judge Evaluation Pipeline:\n   - Pre-compiled test inputs mounted read-only.\n   - Output compared against expected outputs (exact match or custom checker script) with time and memory measurement.',
    hints: [
      'Focus heavily on security: how to stop fork bombs, cryptocurrency mining, and network attacks',
      'Mention MicroVMs (Firecracker / gVisor) and seccomp syscall filtering',
      'Explain asynchronous queueing to handle high submission concurrency',
    ],
    keyPoints: [
      'Asynchronous job queue (RabbitMQ/Kafka) decoupling submit from execution',
      'MicroVM isolation (AWS Firecracker, gVisor) for secure untrusted code execution',
      'Linux seccomp syscall whitelisting & cgroups resource limits',
      'Network-disabled sandboxes with tmpfs scratch mounts',
    ],
    recommendedTimeMinutes: 7,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // ADVANCED DSA
  // ==========================================
  {
    text: 'What is a Monotonic Stack? How do you use it to solve the Next Greater Element problem in O(n) time?',
    category: 'dsa',
    difficulty: 'medium',
    type: 'coding',
    tags: ['dsa', 'monotonic-stack', 'stack', 'arrays', 'algorithms'],
    company: 'Amazon',
    expectedAnswer:
      'A Monotonic Stack is a stack data structure where elements are maintained in strictly increasing or strictly decreasing order.\n\nNext Greater Element Problem (LeetCode 496 / 503):\n- Goal: For each element in array, find the first element to its right that is strictly greater.\n\nAlgorithm (Monotonically Decreasing Stack):\n1. Maintain a stack holding indices of elements.\n2. Iterate through array from left to right:\n   - While stack is not empty AND current element nums[i] > nums[stack.peek()]:\n     * Pop top index prevIndex from stack.\n     * result[prevIndex] = nums[i] (current element is the next greater element for popped index).\n   - Push current index i onto stack.\n3. After loop, any indices remaining on stack have no greater element to their right (result remains -1).\n\nTime & Space Complexity:\n- Time Complexity: O(n). Although nested while loop exists, each element is pushed onto stack exactly once and popped at most once (amortized 2n operations).\n- Space Complexity: O(n) for stack and result array.',
    hints: [
      'Maintain indices rather than values on the stack',
      'Explain why time complexity is amortized O(n) despite nested while loop',
      'Mention related problems: Daily Temperatures, Largest Rectangle in Histogram',
    ],
    keyPoints: [
      'Maintains elements in strictly increasing or decreasing order',
      'Amortized O(n) time because each element pushed and popped at most once',
      'Solves Next Greater Element, Daily Temperatures, Trapping Rain Water',
      'Store indices on stack to calculate distance and assign results directly',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain the Union-Find (Disjoint Set Union) data structure with Path Compression and Union by Rank.',
    category: 'dsa',
    difficulty: 'medium',
    type: 'coding',
    tags: ['dsa', 'union-find', 'graphs', 'dsu', 'algorithms'],
    company: 'Microsoft',
    expectedAnswer:
      'Union-Find (Disjoint Set Union - DSU) is a data structure that tracks elements partitioned into disjoint subsets, supporting two primary operations in near constant time:\n\n1. find(x): Identifies which subset element x belongs to by returning the representative/root of x.\n2. union(x, y): Merges the subset containing x with the subset containing y.\n\nTwo Critical Optimizations:\n1. Path Compression (during find):\n   - When traversing up the tree to find root, point every visited node directly to the root: parent[x] = find(parent[x]).\n   - Flattens the tree depth to 1 on subsequent calls.\n2. Union by Rank / Size (during union):\n   - Always attach the shorter tree under the root of the taller tree to prevent long degenerate chains.\n   - If rank[rootX] < rank[rootY], parent[rootX] = rootY; otherwise attach rootY under rootX and increment rank.\n\nTime Complexity:\n- Combining Path Compression and Union by Rank reduces operations to O(α(n)) amortized time, where α is the Inverse Ackermann function. For all practical values of n (even number of atoms in universe), α(n) < 5 (effectively constant O(1) time).\n\nApplications: Kruskal Minimum Spanning Tree, Cycle detection in undirected graphs, Number of Connected Components.',
    hints: [
      'Explain parent array representation',
      'Contrast find with path compression vs naive traversal',
      'Explain Inverse Ackermann function α(n) ≈ O(1)',
    ],
    keyPoints: [
      'Disjoint set tracking with find and union operations',
      'Path Compression points nodes directly to root during find',
      'Union by Rank attaches smaller tree to larger tree',
      'Amortized time O(α(n)) ≈ O(1) per operation',
      'Applications: Kruskal MST and dynamic connectivity',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // MODERN WEB & FULL-STACK
  // ==========================================
  {
    text: 'Explain Next.js Server Components (RSC) vs Client Components. How do they work under the hood?',
    category: 'web',
    difficulty: 'medium',
    type: 'technical',
    tags: ['react', 'nextjs', 'rsc', 'frontend', 'architecture'],
    company: 'Vercel',
    expectedAnswer:
      'React Server Components (RSC) vs Client Components:\n\n1. React Server Components (RSC - Default in Next.js App Router):\n   - Execution: Render solely on server; code NEVER ships to browser bundle.\n   - Capabilities: Direct access to backend resources (database queries, filesystem, secrets/API keys).\n   - Output: Renders into a special JSON-like virtual stream called RSC Payload (containing serialized React elements and component slots), not plain HTML.\n   - Benefits: 0KB client bundle size, faster initial page load, zero API round-trips for server data.\n   - Limitations: Cannot use React hooks (useState, useEffect) or browser event listeners (onClick).\n\n2. Client Components (marked with "use client"):\n   - Execution: Pre-rendered into HTML on server during SSR, then hydrated with JavaScript in client browser.\n   - Capabilities: Full access to browser APIs, useState, useEffect, context, and DOM event listeners.\n   - Benefits: Rich interactive UI (forms, toggles, client animations).\n\n3. Interleaving Pattern:\n   - Server components can import Client components directly.\n   - Client components cannot import Server components directly, but can accept Server components as children props (<ClientComponent><ServerComponent /></ClientComponent>), preserving 0-bundle server rendering for nested children.',
    hints: [
      'Server components code never ships to browser bundle (0kb JS)',
      'Server components stream RSC payload, Client components hydrate in browser',
      'Explain how to pass Server components as children to Client components',
    ],
    keyPoints: [
      'Server components run exclusively on server with 0KB client JS overhead',
      'Direct DB access and secrets security in Server Components',
      'Client components ("use client") for interactive hooks and event handlers',
      'Children prop pattern allows nesting Server components inside Client components',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is Cross-Site Scripting (XSS)? Explain Stored, Reflected, and DOM-based XSS with prevention strategies.',
    category: 'web',
    difficulty: 'medium',
    type: 'technical',
    tags: ['security', 'xss', 'web', 'cybersecurity'],
    company: 'Stripe',
    expectedAnswer:
      'Cross-Site Scripting (XSS) is a security vulnerability where an attacker injects malicious client-side scripts into trusted web applications, executing in victim browsers to steal session cookies, tokens, or perform unauthorized actions.\n\nThree Types of XSS:\n1. Stored XSS (Persistent):\n   - Malicious script is permanently stored in database (e.g. comment field, profile bio) and served to every user who views that page.\n   - Most dangerous XSS type.\n2. Reflected XSS (Non-Persistent):\n   - Malicious script is reflected off web server immediately via URL query parameters or form submissions (e.g. search.php?q=<script>...).\n   - Attacker tricks victim into clicking crafted phishing link.\n3. DOM-Based XSS:\n   - Vulnerability exists entirely in client-side JavaScript without server involvement.\n   - Client code reads untrusted source (location.hash, document.referrer) and passes it to unsafe sink (innerHTML, eval(), document.write).\n\nPrevention Strategies:\n- Context-Aware Output Encoding: HTML entity encoding before rendering user input.\n- Modern Frameworks: React escapes string variables in JSX by default (avoid dangerouslySetInnerHTML).\n- Content Security Policy (CSP): Enforce strict CSP headers restricting script sources and disabling inline scripts (default-src self).\n- HttpOnly Cookies: Set HttpOnly flag on session cookies so JavaScript document.cookie cannot read them.',
    hints: [
      'Define Stored vs Reflected vs DOM-based XSS',
      'Mention Dangerous sinks (innerHTML, eval)',
      'Explain defense in depth: escaping, CSP headers, and HttpOnly cookies',
    ],
    keyPoints: [
      'Stored XSS persists in database; Reflected reflects via URL; DOM-based executes client-side',
      'Dangerous sinks: innerHTML, document.write, eval()',
      'React auto-escapes JSX text expressions',
      'Content Security Policy (CSP) and HttpOnly cookie flags',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // MACHINE LEARNING & AI
  // ==========================================
  {
    text: 'Explain the Transformer architecture: Self-Attention, Multi-Head Attention, and Positional Encoding.',
    category: 'ml',
    difficulty: 'hard',
    type: 'technical',
    tags: ['machine-learning', 'transformers', 'nlp', 'deep-learning', 'attention'],
    company: 'OpenAI',
    expectedAnswer:
      'Transformer Architecture ("Attention Is All You Need"):\n\n1. Self-Attention Mechanism:\n   - Maps input tokens into Query (Q), Key (K), and Value (V) vector projections using learned weight matrices.\n   - Computes attention weights: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V.\n   - Dot product (Q * K^T) measures token pairwise similarity; dividing by sqrt(d_k) prevents softmax gradient vanishing in high dimensions; softmax normalizes into probability weights that scale V.\n\n2. Multi-Head Attention (MHA):\n   - Projects Q, K, V into h distinct lower-dimensional subspaces in parallel.\n   - Allows model to simultaneously attend to information from different representation subspaces (e.g. syntactic agreement, coreference, semantic relations).\n   - Outputs concatenated and linearly projected back to model dimension d_model.\n\n3. Positional Encoding:\n   - Because Self-Attention is permutation invariant (order-agnostic), token positions must be explicitly injected.\n   - Sinusoidal encodings: PE(pos, 2i) = sin(pos / 10000^(2i/d_model)) and cos for odd indices; or learned positional embeddings (BERT) or RoPE (Rotary Position Embeddings in modern LLMs).\n\n4. Encoder-Decoder Blocks:\n   - Layer normalization (Pre-LN in modern LLMs), residual skip connections (x + Sublayer(x)), and position-wise Feed-Forward Networks (FFN).',
    hints: [
      'Break down formula: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V',
      'Explain why division by sqrt(d_k) prevents vanishing gradients',
      'Explain why positional encoding is needed due to permutation invariance',
    ],
    keyPoints: [
      'Query, Key, Value dot-product attention calculation',
      'Multi-Head Attention captures diverse semantic subspaces in parallel',
      'Positional Encoding (Sinusoidal / RoPE) solves permutation invariance',
      'Residual connections and Layer Normalization stabilize gradient flow',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How do you detect and mitigate Data Drift and Concept Drift in production ML systems?',
    category: 'ml',
    difficulty: 'medium',
    type: 'technical',
    tags: ['mlops', 'data-drift', 'monitoring', 'machine-learning', 'production'],
    company: 'Uber',
    expectedAnswer:
      "Drift in Production ML Systems:\n\n1. Distinguishing Drift Types:\n   - Covariate / Data Drift: P(X) changes while P(Y|X) remains constant. Input feature distribution shifts over time (e.g. user demographics shift, new camera hardware produces different image resolutions).\n   - Concept Drift: P(Y|X) changes while P(X) may remain constant. The true relationship between input features and target labels changes (e.g. consumer purchasing habits suddenly shift during macroeconomic crisis, fraud patterns mutate).\n\n2. Detection Techniques:\n   - Statistical Distance Tests: Kolmogorov-Smirnov (KS) test for continuous variables; Chi-Square test for categorical variables comparing inference window vs baseline training distribution.\n   - Distribution Divergence Metrics: Population Stability Index (PSI > 0.2 indicates significant drift), Wasserstein distance (Earth Mover's Distance), and Kullback-Leibler (KL) / Jensen-Shannon (JS) divergence.\n   - Model Performance Monitoring: Track delayed ground truth labels against model predictions (precision/recall, AUC-ROC drop, RMSE inflation).\n\n3. Mitigation Strategies:\n   - Automated Retraining Pipeline: Trigger CI/CD training pipeline (Kubeflow / Airflow) on drifting data with sliding window or exponential decay weighting.\n   - Shadow / Canary Deployment: Deploy newly retrained model in shadow mode before routing live traffic.\n   - Fallback Rules: Fall back to rule-based heuristics or ensemble models when outlier drift score exceeds confidence threshold.",
    hints: [
      'Differentiate P(X) shift (data drift) from P(Y|X) shift (concept drift)',
      'Mention statistical tests: KS test, Chi-Square, and PSI (Population Stability Index)',
      'Describe mitigation: sliding window retraining, shadow deployments',
    ],
    keyPoints: [
      'Data drift P(X) shift vs Concept drift P(Y|X) relationship shift',
      'Detection via PSI, KS test, and Wasserstein distance',
      'Automated retraining with sliding windows and shadow model validation',
      'Delayed ground truth tracking and fallbacks',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // BEHAVIORAL & LEADERSHIP
  // ==========================================
  {
    text: 'Tell me about a time you disagreed with an engineering decision made by leadership or a teammate. How did you resolve it?',
    category: 'behavioral',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['leadership', 'disagreement', 'communication', 'collaboration', 'star'],
    company: 'Amazon',
    expectedAnswer:
      'Framework: Amazon Leadership Principle "Have Backbone; Disagree and Commit" using STAR Method:\n\n1. Situation:\n   - Tech lead proposed migrating our customer notification service to a complex distributed microservices framework using an unproven technology stack with high operational overhead for our team of 4 engineers.\n\n2. Task:\n   - Voice technical concerns constructively while keeping team morale high and preventing unneeded architectural complexity.\n\n3. Action:\n   - Gathered Data: Built a quick prototype benchmark showing network latency overhead and calculated projected AWS infrastructure costs vs our current solution.\n   - RFC Proposal: Wrote a short, neutral Decision Matrix document comparing the proposed approach against extending our current modular architecture.\n   - Respectful Discussion: Scheduled a 1-on-1 walk-through, actively listened to the lead\'s motivations (fear of database lock contention), and demonstrated how connection pooling and read replicas resolved their core fear with 80% less effort.\n   - Disagree and Commit: We agreed on a phased hybrid approach. If team had voted for the rewrite, I would have committed 100% to making it successful without lingering resentment.\n\n4. Result:\n   - Saved an estimated 6 weeks of engineering effort; system handled Black Friday traffic with 99.99% uptime and zero contention.',
    hints: [
      'Focus on objective data and prototypes rather than subjective opinions',
      "Demonstrate respectful listening to the other party's underlying concern",
      'Show willingness to commit wholeheartedly once a decision is finalized',
    ],
    keyPoints: [
      'Objective data-driven persuasion over personal opinion',
      'Active listening to uncover underlying architectural concerns',
      'Collaborative decision matrix comparison',
      'Disagree and commit alignment once decided',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Describe a situation where you had to balance technical debt against delivering features quickly.',
    category: 'behavioral',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['technical-debt', 'product-tradeoffs', 'prioritization', 'star'],
    company: 'Meta',
    expectedAnswer:
      'Framework: Strategic Technical Debt Management using STAR Method:\n\n1. Situation:\n   - Two weeks before a critical enterprise client pilot launch, product required a custom reporting exporter. The clean long-term architecture (asynchronous worker with S3 upload) would take 3 weeks, while a synchronous API generation route would take 4 days but could cause memory spikes if report size exceeded 10,000 rows.\n\n2. Task:\n   - Meet the pilot launch milestone without permanently crippling system reliability or accumulating invisible debt.\n\n3. Action:\n   - Conscious Debt Acceptance: Implemented the faster synchronous solution with safety guardrails (hard cap on row limit, strict query timeouts, and circuit breakers).\n   - Documented Debt & Created Debt Ticket: Documented the trade-off in the PR and created an immediate sprint backlog ticket with clear acceptance criteria for the async refactor.\n   - Negotiated Maintenance Budget: Agreed with Product Manager to allocate 20% of the very next sprint to convert the exporter to the worker queue before open public rollout.\n\n4. Result:\n   - Closed enterprise pilot contract successfully on time. Shipped the async queue refactor during the subsequent sprint without customer incidents or production degradation.',
    hints: [
      'Emphasize that technical debt can be taken intentionally like financial debt, provided it is managed and paid down',
      'Show collaboration with Product Managers to allocate refactoring capacity',
      'Highlight defensive guardrails added to protect production',
    ],
    keyPoints: [
      'Deliberate technical debt trade-off aligned with business milestones',
      'Defensive safety guardrails (limits, timeouts) preventing system crashes',
      'Transparent documentation and scheduled repayment sprint budget',
      'Zero customer outage during pilot',
    ],
    recommendedTimeMinutes: 4,
    isApproved: true,
    isActive: true,
  },
];

module.exports = {
  additionalBatch2,
};
