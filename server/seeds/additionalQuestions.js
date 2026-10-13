/**
 * Curated additional questions for HireReady Question Bank
 * Covers DevOps & Cloud, Mobile Development, Advanced System Design, Databases, DSA, Web, ML, and Behavioral.
 */

const additionalQuestions = [
  // ==========================================
  // DEVOPS & CLOUD INFRASTRUCTURE (10 Questions)
  // ==========================================
  {
    text: 'Explain the difference between Docker containers and Virtual Machines. How does container isolation work at the Linux kernel level?',
    category: 'devops',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['docker', 'containers', 'linux', 'virtualization'],
    company: 'Google',
    expectedAnswer:
      'Virtual Machines (VMs) run on a Hypervisor (Type 1 or Type 2) and virtualize entire hardware, requiring a full guest OS with dedicated kernel and memory. Docker containers share the host Linux kernel and virtualize at the OS level.\n\nLinux Kernel Isolation Primitives:\n1. Namespaces: Provide isolation of system resources (PID for processes, NET for network interfaces/routing, MNT for filesystem mount points, IPC for shared memory, UTS for hostnames, and USER for UID/GID mapping).\n2. Control Groups (cgroups): Meter and enforce hard limits on resource consumption (CPU quotas, memory limits, disk I/O, network bandwidth).\n3. Union Filesystems (OverlayFS): Layered, copy-on-write image filesystems allowing lightweight container spins with shared read-only base layers.',
    hints: [
      'Mention kernel sharing vs guest operating systems',
      'Explain cgroups (resource limits) and namespaces (view isolation)',
      'Discuss startup time and memory overhead differences',
    ],
    keyPoints: [
      'Hypervisor hardware virtualization vs OS-level kernel sharing',
      'Linux Namespaces for process/network/filesystem isolation',
      'cgroups for resource metering and allocation caps',
      'OverlayFS / CoW layered filesystem efficiency',
    ],
    followUpQuestions: [
      'What are rootless containers and why are they important for security?',
      'Can a security exploit inside a container compromise the host system?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is Kubernetes? Explain the architecture and role of the Control Plane vs Worker Nodes.',
    category: 'devops',
    difficulty: 'medium',
    type: 'technical',
    tags: ['kubernetes', 'k8s', 'containers', 'cloud-native', 'orchestration'],
    company: 'Amazon',
    expectedAnswer:
      'Kubernetes is an open-source container orchestration platform for automating deployment, scaling, and management of containerized applications.\n\nArchitecture Breakdown:\n1. Control Plane (Master Node):\n   - kube-apiserver: REST API gateway exposing the cluster interface, validating manifests, and orchestrating state.\n   - etcd: Highly available, distributed key-value store holding the definitive source of truth for entire cluster state.\n   - kube-scheduler: Evaluates resource requests, affinity/anti-affinity, taints, and assigns unscheduled pods to optimal worker nodes.\n   - kube-controller-manager: Runs core loops (Node lifecycle, ReplicaSet scaling, Endpoint slice syncing, ServiceAccounts).\n   - cloud-controller-manager: Bridges cloud provider primitives (LoadBalancers, Volumes, Routes).\n\n2. Worker Node Components:\n   - kubelet: Agent running on each node ensuring containers described in PodSpecs are running and healthy.\n   - kube-proxy: Manages network routing tables (iptables or IPVS) for Kubernetes Services, enabling internal load balancing.\n   - Container Runtime: Engine executing container images (containerd, CRI-O).',
    hints: [
      'Break into Control Plane vs Worker Node responsibilities',
      'Explain the purpose of etcd and why it requires an odd number of replicas (quorum)',
      'Contrast kubelet vs kube-proxy roles',
    ],
    keyPoints: [
      'Control Plane components: kube-apiserver, etcd, scheduler, controller-manager',
      'Worker Node components: kubelet, kube-proxy, container runtime',
      'etcd consensus using Raft protocol for cluster state storage',
      'Declarative reconciliation loops vs imperative commands',
    ],
    followUpQuestions: [
      'What happens if the Control Plane nodes temporarily lose network connectivity?',
      'How does kube-proxy handle traffic routing using IPVS vs iptables?',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain Continuous Integration and Continuous Deployment (CI/CD). Describe how a production-grade automated deployment pipeline works.',
    category: 'devops',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['cicd', 'automation', 'gitops', 'devops', 'pipeline'],
    company: 'Microsoft',
    expectedAnswer:
      'Continuous Integration (CI) is the practice of automatically merging, building, and testing code on every commit to detect defects early. Continuous Deployment (CD) automatically releases passing builds directly to production environments (Continuous Delivery requires manual approval before production).\n\nProduction-Grade Pipeline Stages:\n1. Code & Commit Hook: Developer pushes branch; GitHub Actions/GitLab CI initiates pipeline.\n2. Static Analysis: Linting (ESLint), type-checking (TypeScript), and secrets detection (TruffleHog/GitGuardian).\n3. Testing Matrix: Parallel execution of Unit tests (Jest), Integration tests, and Component tests with code coverage thresholds (>80%).\n4. Artifact Packaging: Multi-stage Docker build, generating minimal hardened images (distroless/Alpine) tagged with Git SHA.\n5. Security Vulnerability Scan: Container image scanning via Trivy or Snyk for CVEs before pushing to Container Registry (ECR/GCR).\n6. Staging & Smoke Tests: Deployment to preview/staging environment; automated end-to-end (Playwright) and API smoke tests.\n7. Progressive Production Rollout: GitOps tool (ArgoCD/Flux) reconciles state using Blue-Green or Canary deployment with automated rollback on latency/error budget spikes.',
    hints: [
      'Distinguish Continuous Delivery from Continuous Deployment',
      'Cover testing, security scanning, multi-stage image builds, and automated rollback',
    ],
    keyPoints: [
      'Difference between CI, Continuous Delivery, and Continuous Deployment',
      'Shift-left security: static analysis, secrets detection, and container CVE scanning',
      'Multi-stage Docker builds for minimal attack surface',
      'GitOps deployment reconciliation using ArgoCD / Flux',
      'Automated rollbacks triggered by metrics / error rate thresholds',
    ],
    followUpQuestions: [
      'How do you manage database schema migrations within an automated CI/CD pipeline without downtime?',
      'How do Blue-Green deployments differ from Canary deployments?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Compare Blue-Green Deployments, Canary Releases, and Rolling Updates. What are the trade-offs of each?',
    category: 'devops',
    difficulty: 'medium',
    type: 'technical',
    tags: ['deployments', 'kubernetes', 'canary', 'blue-green', 'reliability'],
    company: 'Netflix',
    expectedAnswer:
      'Comparison of Deployment Strategies:\n1. Rolling Update:\n   - Pods are incrementally replaced one-by-one or in batches (e.g., 25% maxSurge, 25% maxUnavailable).\n   - Pros: Zero downtime, no extra server infrastructure cost.\n   - Cons: Version mixing occurs (v1 and v2 coexist simultaneously), rollbacks are slow and incremental.\n\n2. Blue-Green Deployment:\n   - Two identical production environments: Blue (active live traffic) and Green (new version standby).\n   - When Green passes validation tests, the load balancer / router flips 100% of traffic instantly to Green.\n   - Pros: Instant rollback (switch router back to Blue), no version coexistence.\n   - Cons: High cost (requires 2x compute capacity during release), stateful databases must support both schemas.\n\n3. Canary Release:\n   - New version deployed alongside old version, receiving a small fraction of real user traffic (e.g., 5% via Envoy / Istio service mesh).\n   - Telemetry (latency, HTTP 5xx errors, memory leaks) monitored. Traffic percentage is gradually ramped up (5% -> 25% -> 50% -> 100%).\n   - Pros: Lowest blast radius for production regressions, real-world user validation.\n   - Cons: Complex traffic routing (requires service mesh or smart ingress controller), version mixing during ramp.',
    hints: [
      'Focus on blast radius, rollback speed, and infrastructure cost trade-offs',
      'Address the challenge of backward database schema compatibility across version skew',
    ],
    keyPoints: [
      'Rolling Update: zero extra cost, but version mixing and slow rollback',
      'Blue-Green: 2x compute cost, but instant traffic cutover and instant rollback',
      'Canary: minimal blast radius with metric-driven progressive traffic weighting',
      'Database schema forward/backward compatibility requirement',
    ],
    followUpQuestions: [
      'How do you handle sticky sessions or WebSockets during a Blue-Green cutover?',
      'What automated metrics should trigger an immediate Canary rollback?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is Infrastructure as Code (IaC)? Compare Terraform with Ansible and explain Terraform state management.',
    category: 'devops',
    difficulty: 'medium',
    type: 'conceptual',
    tags: ['terraform', 'iac', 'ansible', 'cloud', 'aws'],
    company: 'Stripe',
    expectedAnswer:
      'Infrastructure as Code (IaC) is the practice of defining, provisioning, and managing cloud resources using declarative or imperative machine-readable configuration files stored in version control.\n\nComparison:\n1. Terraform (Provisioning / Declarative):\n   - Focus: Provisioning cloud infrastructure (VPCs, EC2, S3, RDS, Kubernetes clusters).\n   - Paradigm: Declarative (describes "what" end state should look like; Terraform plans the diff).\n   - State: State-driven (tracks provisioned resources in terraform.tfstate).\n2. Ansible (Configuration Management / Imperative):\n   - Focus: Configuring existing servers (installing packages, updating configs, user management).\n   - Paradigm: Hybrid / Procedure-oriented with idempotent tasks.\n   - State: Stateless (queries target hosts over SSH directly).\n\nTerraform State Management:\n- The state file (terraform.tfstate) maps declared code resources to real cloud resource IDs and attributes.\n- Remote State: Stored securely in cloud storage (AWS S3, GCS) with server-side encryption.\n- State Locking: Uses distributed locks (AWS DynamoDB) to prevent concurrent executions from corrupting state.',
    hints: [
      'Differentiate infrastructure provisioning (Terraform) vs server configuration (Ansible)',
      'Explain why storing terraform.tfstate locally on developer machines is dangerous',
      'Discuss state locking and remote backend architectures',
    ],
    keyPoints: [
      'Declarative provisioning (Terraform) vs configuration management (Ansible)',
      'Terraform state file purpose: tracks mapping of code to real-world cloud resources',
      'Remote backend storage in S3/GCS with encryption at rest',
      'Distributed state locking via DynamoDB to prevent concurrent writes',
    ],
    followUpQuestions: [
      'How do you manage sensitive secrets (API keys, DB passwords) in Terraform without committing them to Git?',
      'What is state drift and how does terraform refresh detect it?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // MOBILE DEVELOPMENT (10 Questions)
  // ==========================================
  {
    text: 'Explain the React Native architecture. How does the New Architecture (TurboModules & Fabric) improve on the legacy Bridge?',
    category: 'mobile',
    difficulty: 'medium',
    type: 'technical',
    tags: ['react-native', 'mobile', 'javascript', 'cross-platform', 'architecture'],
    company: 'Meta',
    expectedAnswer:
      'Legacy React Native Architecture:\n- Three threads: JS Thread, UI/Main Thread, and Shadow Thread (Yoga layout calculation).\n- Legacy Bridge: Asynchronous, JSON-serialized string communication over a single message queue.\n- Bottlenecks: JSON serialization overhead, asynchronous-only communication causing frame drops during fast scrolling (white blanks) and gesture lags.\n\nNew Architecture Improvements:\n1. JSI (JavaScript Interface):\n   - C++ abstraction layer allowing JavaScript to hold direct references to host C++ and native objects.\n   - Eliminates JSON serialization; enables synchronous calls between JS and Native.\n2. TurboModules (Native Modules):\n   - Lazy loading of native modules on-demand instead of initializing all native code at app launch, vastly improving TTI (Time to Interactive).\n3. Fabric (New Render Pipeline):\n   - Modern rendering engine that executes UI operations directly in C++.\n   - Enables concurrent rendering, synchronous layout measurements, and smooth priority-based updates aligned with React 18 Concurrent Mode.',
    hints: [
      'Identify the legacy JSON bridge serialization bottleneck',
      'Explain JSI (JavaScript Interface) enabling direct C++ host object calls',
      'Contrast TurboModules (lazy native modules) with Fabric (UI renderer)',
    ],
    keyPoints: [
      'Legacy Bridge bottleneck: asynchronous JSON serialization queue',
      'JSI allows direct C++ pointer access without string serialization',
      'TurboModules lazy-load native capabilities to improve cold startup time',
      'Fabric unified C++ render tree with synchronous layout measurements',
    ],
    followUpQuestions: [
      'Why does synchronous layout measurement matter for nested scrollable lists in mobile apps?',
      'How does Hermes JavaScript engine contribute to cold start performance in React Native?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Describe the Android Activity Lifecycle. What happens to state during screen rotation or process termination?',
    category: 'mobile',
    difficulty: 'easy',
    type: 'conceptual',
    tags: ['android', 'mobile', 'kotlin', 'lifecycle', 'architecture'],
    company: 'Google',
    expectedAnswer:
      'The Android Activity lifecycle consists of seven core callback methods representing states:\n1. onCreate(): Activity instance initialized; setup UI view hierarchy, bind ViewModels.\n2. onStart(): Activity becomes visible to user; register broadcast receivers.\n3. onResume(): Activity enters foreground, interactive with user; start animations, camera feeds.\n4. onPause(): Partially obscured (e.g., dialog, multi-window); pause heavy resources, persist draft inputs.\n5. onStop(): No longer visible; release memory-heavy assets.\n6. onDestroy(): Activity finishing or being destroyed by system; clean up remaining subscriptions.\n\nConfiguration Changes (Screen Rotation):\n- By default, Android completely destroys the Activity (onPause -> onStop -> onDestroy) and re-creates it (onCreate -> onStart -> onResume) to reload configuration-specific resources (portrait vs landscape layouts).\n- State preservation: Use Android Architecture Component ViewModel (which outlives configuration changes) and SavedStateHandle for persisting transient UI state across OS background process kills.',
    hints: [
      'Walk through onCreate, onStart, onResume, onPause, onStop, onDestroy sequence',
      'Explain why screen rotation triggers full teardown and recreate',
      'Differentiate between ViewModel survival and SavedStateHandle / onSaveInstanceState',
    ],
    keyPoints: [
      'Full lifecycle progression: onCreate, onStart, onResume, onPause, onStop, onDestroy',
      'Configuration changes trigger complete Activity destruction to reload resources',
      'ViewModel survives configuration changes (rotation)',
      'SavedStateHandle / onSaveInstanceState preserves state across low-memory OS process kills',
    ],
    followUpQuestions: [
      'What is the difference between onPause() and onStop() regarding visibility and user interaction?',
      'How does Jetpack Compose change state preservation compared to traditional XML Activities?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How does Automatic Reference Counting (ARC) work in iOS (Swift)? What are retain cycles and how do you prevent them?',
    category: 'mobile',
    difficulty: 'medium',
    type: 'technical',
    tags: ['ios', 'swift', 'arc', 'memory-management', 'mobile'],
    company: 'Apple',
    expectedAnswer:
      'Automatic Reference Counting (ARC) is compile-time memory management used in Swift and Objective-C for reference types (classes).\n\nHow ARC Works:\n- The compiler automatically injects retain (+1 count) and release (-1 count) calls during compilation.\n- When an object reference count reaches 0, its memory is deallocated immediately (deterministic deallocation, unlike tracing Garbage Collection).\n\nRetain Cycles (Memory Leaks):\n- Occurs when two or more objects hold strong references to each other, preventing their reference counts from ever reaching 0 (e.g., Parent holds Child, Child holds Parent delegate).\n- Common inside closures that capture self strongly.\n\nPrevention Strategies:\n1. weak reference: Always optional (var delegate: SomeDelegate?). Does not increment reference count. Automatically zeroes out (becomes nil) when target object is deallocated.\n2. unowned reference: Non-optional pointer. Does not increment count. Used when target object is guaranteed to have equal or longer lifetime. (Crashes with fatal error if accessed after deallocation).\n3. Capture lists in closures: [weak self] or [unowned self] in closure definitions to prevent escaping closures from retaining class instances.',
    hints: [
      'Explain that ARC is compile-time tracking, not a runtime garbage collector',
      'Contrast strong vs weak vs unowned references',
      'Explain how [weak self] inside closure capture lists breaks retain cycles',
    ],
    keyPoints: [
      'Compile-time deterministic retain/release injection',
      'Retain cycle: mutual strong references prevent reference count from reaching 0',
      'weak references are optional and zeroing on deallocation',
      'unowned references are non-optional and crash if accessed post-deallocation',
      'Capture lists ([weak self]) in closures break capture retain cycles',
    ],
    followUpQuestions: [
      'How does Xcode Memory Graph Debugger or Instruments Leaks instrument help detect retain cycles?',
      'Why do Swift structs and enums not require ARC memory management?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How do you design an offline-first mobile application with local database caching and background synchronization?',
    category: 'mobile',
    difficulty: 'hard',
    type: 'technical',
    tags: ['mobile', 'offline-first', 'sync', 'sqlite', 'architecture'],
    company: 'Uber',
    expectedAnswer:
      'Offline-First Mobile Architecture:\n1. Single Source of Truth (SSOT):\n   - UI components observe a local reactive database (SQLite, Room in Android, CoreData/Realm in iOS, WatermelonDB/SQLite in React Native) via observables/Flow.\n   - UI never queries remote network API directly for rendering.\n\n2. Read Path:\n   - UI -> Local DB (instant response, 0ms network latency).\n   - Background sync worker fetches incremental changes from server and writes to local DB, which automatically triggers reactive UI re-renders.\n\n3. Write Path & Optimistic Updates:\n   - User performs mutation: Local DB immediately writes the record with status = "PENDING_SYNC" and a client-generated UUID.\n   - UI updates instantly (optimistic UI update).\n   - Mutation action is enqueued in persistent Outbox Queue table in local DB.\n\n4. Background Sync & Conflict Resolution:\n   - Background scheduler (WorkManager in Android, BGTaskScheduler in iOS) dequeues actions and dispatches HTTP requests to server.\n   - Conflict Resolution Strategies:\n     * Last-Write-Wins (LWW) with client/server timestamps (suitable for simple data).\n     * Version vectors / CRDTs (Conflict-Free Replicated Data Types) for collaborative text.\n     * Server-adjudicated reconciliation with error rollback notifications to user.\n   - On success: Record status updated to "SYNCED". On failure: Exponential backoff with retry limit.',
    hints: [
      'Emphasize Single Source of Truth: UI always reads from local database',
      'Explain the persistent Outbox Queue pattern for mutations made while offline',
      'Discuss conflict resolution strategies when reconnecting to network',
    ],
    keyPoints: [
      'Single Source of Truth: UI observes local reactive database (Room/CoreData/WatermelonDB)',
      'Optimistic UI updates with client-side UUID generation',
      'Persistent Outbox Queue table for actions queued while offline',
      'Background sync using OS schedulers (WorkManager / BGTaskScheduler)',
      'Conflict resolution strategies (Last-Write-Wins, CRDTs, server reconciliation)',
    ],
    followUpQuestions: [
      'How do you handle binary file/image uploads queued while the device is in airplane mode?',
      'What happens if two mobile devices edit the same record offline concurrently?',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // DATABASE & STORAGE SYSTEMS (10 Questions)
  // ==========================================
  {
    text: 'Explain Database Isolation Levels and the anomalies they prevent (Dirty Read, Non-Repeatable Read, Phantom Read).',
    category: 'database',
    difficulty: 'hard',
    type: 'conceptual',
    tags: ['database', 'acid', 'isolation-levels', 'transactions', 'sql'],
    company: 'Amazon',
    expectedAnswer:
      'ANSI SQL defines 4 Transaction Isolation Levels to control how concurrent transactions see changes made by each other:\n\n1. Read Uncommitted:\n   - Permits reading uncommitted data from ongoing transactions.\n   - Vulnerable to: Dirty Reads, Non-Repeatable Reads, Phantom Reads.\n\n2. Read Committed (Default in PostgreSQL, Oracle, SQL Server):\n   - Transactions only read data committed before statement execution.\n   - Prevents: Dirty Reads.\n   - Vulnerable to: Non-Repeatable Reads (Transaction A reads row X; Transaction B updates row X and commits; Transaction A re-reads row X and sees different values) and Phantom Reads.\n\n3. Repeatable Read (Default in MySQL InnoDB):\n   - Guarantees that any row read during a transaction remains identical on subsequent reads.\n   - Prevents: Dirty Reads, Non-Repeatable Reads.\n   - Vulnerable to: Phantom Reads (Transaction A queries range WHERE age > 25; Transaction B inserts new row with age 30 and commits; Transaction A re-queries same range and sees new "phantom" row).\n\n4. Serializable:\n   - Highest isolation. Simulates strict serial transaction execution using Two-Phase Locking (2PL) or Serializable Snapshot Isolation (SSI).\n   - Prevents: All anomalies (Dirty Reads, Non-Repeatable Reads, Phantom Reads, Serialization Anomaly).\n   - Trade-off: High lock contention and high transaction abort/retry rate.',
    hints: [
      'List the 4 levels in order of strictness: Read Uncommitted, Read Committed, Repeatable Read, Serializable',
      'Clearly define Dirty Read, Non-Repeatable Read, and Phantom Read anomalies',
      'Mention Multi-Version Concurrency Control (MVCC) as the modern implementation mechanism',
    ],
    keyPoints: [
      '4 ANSI levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable',
      'Dirty Read: Reading uncommitted dirty changes that might be rolled back',
      'Non-Repeatable Read: Same row value changes between reads within a transaction',
      'Phantom Read: New rows appear in range queries between executions',
      'MVCC (Multi-Version Concurrency Control) provides snapshot isolation without read locks',
    ],
    followUpQuestions: [
      'How does PostgreSQL MVCC implement Repeatable Read using snapshot transaction IDs (xmin/xmax)?',
      'What is Write Skew anomaly and which isolation level prevents it?',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Explain B-Trees vs LSM-Trees (Log-Structured Merge-Trees). When would you choose one storage engine over the other?',
    category: 'database',
    difficulty: 'hard',
    type: 'technical',
    tags: ['database', 'storage-engine', 'b-tree', 'lsm-tree', 'indexing'],
    company: 'Meta',
    expectedAnswer:
      'Comparison of Core Storage Engine Data Structures:\n\n1. B-Tree / B+ Tree (Used in PostgreSQL, MySQL InnoDB, SQLite):\n   - Architecture: Self-balancing search tree stored on disk in fixed-size blocks/pages (typically 4KB-16KB). Updates modify pages in-place, protected by Write-Ahead Logging (WAL).\n   - Read Performance: Excellent O(log n) random reads with shallow tree depth (fanout of 100-1000 means only 3-4 disk seeks for millions of rows).\n   - Write Performance: Random writes require disk seeks and potential page splits, leading to write amplification.\n   - Best for: Read-heavy workloads, OLTP relational databases, range scans.\n\n2. LSM-Tree (Used in Cassandra, RocksDB, LevelDB, ScyllaDB, BigTable):\n   - Architecture:\n     * Writes enter an in-memory sorted structure called MemTable (Red-Black tree or SkipList) and appended sequentially to WAL.\n     * When MemTable fills, it is flushed to disk as an immutable sorted file called SSTable (Sorted String Table).\n     * Background compaction merges overlapping SSTables, deduplicating updates and removing tombstones (deletions).\n   - Write Performance: Incredible write throughput because all writes are sequential disk appends without in-place modification.\n   - Read Performance: Slower random reads because a key might be in MemTable or across multiple SSTable levels. Accelerated via Bloom Filters.\n   - Best for: Write-heavy workloads, time-series data, event logging, high-throughput distributed NoSQL.',
    hints: [
      'Highlight in-place updates (B-Tree) vs append-only immutable files (LSM-Tree)',
      'Explain SSTables, MemTable, Bloom Filters, and background compaction in LSM-Trees',
      'Contrast read-heavy OLTP vs high-throughput write-heavy workloads',
    ],
    keyPoints: [
      'B-Tree updates in-place: optimal for random reads and general relational OLTP',
      'LSM-Tree writes append-only to MemTable and flushes to SSTables: optimal for heavy writes',
      'Bloom filters accelerate LSM-Tree reads by checking if a key exists in an SSTable',
      'Background compaction merges and cleans deleted keys (tombstones) in LSM-Trees',
    ],
    followUpQuestions: [
      'What is write amplification, read amplification, and space amplification in LSM-Trees?',
      'How do Bloom filters prevent unnecessary disk I/O in RocksDB?',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What are SQL Window Functions? Explain ROW_NUMBER(), RANK(), DENSE_RANK(), and PARTITION BY with examples.',
    category: 'database',
    difficulty: 'medium',
    type: 'technical',
    tags: ['sql', 'database', 'window-functions', 'queries'],
    company: 'Google',
    expectedAnswer:
      'SQL Window Functions perform calculations across a set of table rows related to the current row, without collapsing multiple rows into a single output row like GROUP BY does.\n\nKey Concepts:\n- OVER(): Defines the window frame.\n- PARTITION BY: Divides rows into logical groups/partitions (similar to GROUP BY, but retains individual row identities).\n- ORDER BY: Specifies the sorting order within each partition.\n\nRanking Functions Comparison:\n1. ROW_NUMBER(): Assigns a unique sequential integer starting from 1 to each row within a partition. No ties.\n   Example values for salaries [100k, 100k, 80k]: 1, 2, 3.\n2. RANK(): Assigns rank with gaps for ties. Tied rows receive the same rank; next rank skips ahead.\n   Example values: 1, 1, 3.\n3. DENSE_RANK(): Assigns rank without gaps for ties. Tied rows receive the same rank; next rank is sequential.\n   Example values: 1, 1, 2.\n\nReal-World Example (Top 3 highest earners per department):\nSELECT employee_id, department_id, salary\nFROM (\n  SELECT employee_id, department_id, salary,\n         DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rank\n  FROM employees\n) ranked\nWHERE rank <= 3;',
    hints: [
      'Contrast Window functions vs GROUP BY: window functions do not collapse rows',
      'Clearly contrast the tie behavior of ROW_NUMBER vs RANK vs DENSE_RANK',
      'Write or explain the PARTITION BY salary example',
    ],
    keyPoints: [
      'Window functions retain original row granularity while calculating aggregates',
      'OVER (PARTITION BY ... ORDER BY ...)',
      'ROW_NUMBER: continuous sequential integers (1, 2, 3)',
      'RANK: tied ranks create subsequent gaps (1, 1, 3)',
      'DENSE_RANK: tied ranks without subsequent gaps (1, 1, 2)',
    ],
    followUpQuestions: [
      'How do LEAD() and LAG() window functions work for comparing chronological metrics?',
      'How does the database execute window functions internally (sorting vs hashing)?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // ADVANCED SYSTEM DESIGN (10 Questions)
  // ==========================================
  {
    text: 'Design a Collaborative Document Editing Service like Google Docs. How do you handle simultaneous real-time conflict resolution?',
    category: 'system-design',
    difficulty: 'hard',
    type: 'technical',
    tags: ['system-design', 'google-docs', 'crdt', 'operational-transformation', 'websockets'],
    company: 'Google',
    expectedAnswer:
      'Architecture Overview:\n1. Client & Real-time Connection:\n   - WebSockets for bi-directional real-time document change events and cursor positions.\n   - Client holds local document state, immediately applies local typing edits with 0ms latency, and asynchronously transmits operations.\n\n2. Conflict Resolution Algorithms:\n   - Operational Transformation (OT) (Used by Google Docs):\n     * Centralized server acts as the sequencer.\n     * When two concurrent operations arrive, server transforms Operation A against Operation B based on their execution histories before broadcasting to clients.\n     * Requires centralized state server per document session to maintain authoritative timeline.\n   - CRDTs (Conflict-Free Replicated Data Types) (e.g., Yjs, Automerge, Figma):\n     * Decentralized, mathematically guaranteed eventual consistency.\n     * Every character inserted is assigned a globally unique, fractional index ID.\n     * Commutative operations merge seamlessly in any arrival order without centralized transformation.\n\n3. High-Level System Architecture:\n   - Gateway / WebSocket Servers: Sticky session routed by document_id (via Consistent Hashing) to Document Editing Server cluster.\n   - Document Memory Server: Holds active document state in memory (Redis / RAM) and buffers edit operations.\n   - Snapshot & Persistence Service: Periodically takes document snapshots and appends mutation changelogs to PostgreSQL/S3.\n   - Document Permissions & History: Microservice managing read/write RBAC and point-in-time version restoration.',
    hints: [
      'Compare Operational Transformation (OT) vs Conflict-Free Replicated Data Types (CRDT)',
      'Explain how consistent hashing routes editors of the same document to the same server node',
      'Discuss snapshotting and changelog storage for version history',
    ],
    keyPoints: [
      'OT (centralized server transformation) vs CRDT (commutative decentralized fractional indexing)',
      'WebSocket gateway with document-affinity routing using Consistent Hashing',
      'In-memory document session cache with periodic snapshot persistence to S3/DB',
      'Optimistic local typing with background synchronization',
      'Presence system for live multi-user cursor coordinates',
    ],
    followUpQuestions: [
      'Why did Figma choose CRDTs over Operational Transformation for design canvas sync?',
      'How do you manage memory consumption for active documents open for weeks by thousands of users?',
    ],
    recommendedTimeMinutes: 7,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'Design a Ride-Hailing Service like Uber or Lyft. How do you track driver locations and match drivers with riders?',
    category: 'system-design',
    difficulty: 'hard',
    type: 'technical',
    tags: ['system-design', 'uber', 'geospatial', 'redis', 'quadtree'],
    company: 'Uber',
    expectedAnswer:
      'Architecture Overview:\n1. Geospatial Indexing & Location Ingestion:\n   - Driver apps emit GPS coordinates (lat, lon, driver_id, status) every 3-5 seconds over WebSockets/gRPC.\n   - High-throughput location ingestion service writes to in-memory geospatial indexes:\n     * Uber H3 (Hexagonal hierarchical spatial index) or Google S2 (Hilbert curve space-filling tiles) or Redis GEO (Geohashing).\n     * Earth surface partitioned into discrete cells (resolution 8-9 corresponds to ~500m radius).\n     * Driver locations stored in Redis/RAM: key = cell_id, value = set of active driver IDs.\n\n2. Ride Request & Dispatch Matching:\n   - Rider requests pickup at GPS coordinate.\n   - Match Service determines rider H3 cell and queries neighboring concentric rings of cells (k-ring lookup).\n   - Filter eligible drivers (status = IDLE, vehicle category match, heading towards rider).\n   - Rank drivers using ETA calculation (routing engine factoring real-time traffic and distance).\n   - Dispatch notification sent via Push/WebSocket to closest driver with a 15-second acceptance lease.\n\n3. Storage Architecture:\n   - Location tracking (high-frequency ephemeral data): Redis cluster partitioned by geography.\n   - Trip state & payments: PostgreSQL with ACID guarantees (Trips, Invoices, Payment history).\n   - Trip routes: S3 / Cassandra for historical ride telemetry.',
    hints: [
      'Explain why traditional relational DB queries (ST_DWithin) fail at 1M+ simultaneous location updates/sec',
      'Describe Geohashing / Uber H3 hexagonal spatial indexing',
      'Walk through the dispatch matching algorithm and acceptance lease lock',
    ],
    keyPoints: [
      'Geospatial indexing using Uber H3 / Google S2 / Redis GEO rather than slow relational queries',
      'Frequent 3s GPS telemetry streams over WebSocket/gRPC to in-memory cache',
      'Concentric k-ring neighboring cell searches for candidate driver pooling',
      'Dispatch assignment with short distributed locks (15s acceptance window)',
      'Decoupling hot geospatial cache from transactional trip state (PostgreSQL)',
    ],
    followUpQuestions: [
      'How would you design dynamic surge pricing based on local supply and demand imbalances?',
      'How do you handle driver reassignment if a driver rejects or ignores a dispatched ride?',
    ],
    recommendedTimeMinutes: 7,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // MACHINE LEARNING & AI (10 Questions)
  // ==========================================
  {
    text: 'Explain the Transformer architecture. How does the Multi-Head Self-Attention mechanism work mathematically?',
    category: 'ml',
    difficulty: 'hard',
    type: 'technical',
    tags: ['machine-learning', 'transformers', 'attention', 'nlp', 'deep-learning'],
    company: 'Google',
    expectedAnswer:
      'The Transformer (Vaswani et al., 2017) discarded recurrent and convolutional layers in favor of self-attention, enabling massive parallelization during training.\n\n1. Self-Attention Formulation:\n   - Input embeddings X are projected into three vectors per token via learnable weight matrices:\n     * Queries (Q = X * W_Q)\n     * Keys (K = X * W_K)\n     * Values (V = X * W_V)\n   - Attention Score Formula:\n     Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V\n   - Explanation:\n     * Q * K^T computes dot-product similarity between every token pair.\n     * Scaling by sqrt(d_k) prevents dot products from growing excessively large for high dimensions, avoiding vanishing gradients in softmax.\n     * Softmax normalizes similarities into attention weight distribution summing to 1.\n     * Multiplied by V to produce context-aware representation.\n\n2. Multi-Head Attention:\n   - Rather than computing a single attention function, Q, K, V are linearly projected h times into lower-dimensional subspaces.\n   - Attention computed in parallel across all heads and concatenated: MultiHead = Concat(head_1, ..., head_h) * W_O.\n   - Advantage: Allows the model to jointly attend to information from different representation subspaces (e.g., grammatical dependencies in one head, semantic context in another).\n\n3. Positional Encoding:\n   - Because attention is permutation-invariant, positional embeddings (sinusoidal or learned RoPE/ALiBi) are added to inject word order.',
    hints: [
      'Write and explain the Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V formula',
      'Explain why scaling by sqrt(d_k) is required',
      'Explain why Multi-Head attention is better than single-head attention',
    ],
    keyPoints: [
      'Attention formula: softmax((Q * K^T) / sqrt(d_k)) * V',
      'Scaling factor sqrt(d_k) prevents vanishing gradients in softmax',
      'Multi-Head attention attends to diverse relational subspaces in parallel',
      'Positional encodings inject sequential token order into permutation-invariant attention',
    ],
    followUpQuestions: [
      'What is FlashAttention and how does it optimize GPU SRAM memory access?',
      'What is the difference between Encoder-only (BERT), Decoder-only (GPT), and Encoder-Decoder (T5) architectures?',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is Retrieval-Augmented Generation (RAG)? Design a production RAG pipeline for enterprise documents.',
    category: 'ml',
    difficulty: 'medium',
    type: 'technical',
    tags: ['rag', 'llm', 'vector-database', 'embeddings', 'ai'],
    company: 'Microsoft',
    expectedAnswer:
      'Retrieval-Augmented Generation (RAG) is an AI architecture that enhances Large Language Models (LLMs) by retrieving relevant external proprietary knowledge from a vector store and injecting it into the prompt context before generation, reducing hallucinations and grounding answers in enterprise data.\n\nProduction RAG Pipeline Architecture:\n1. Offline Ingestion Pipeline:\n   - Document Parsing: Ingest PDFs, Markdown, Word docs using semantic chunking.\n   - Chunking Strategy: Recursive chunking (e.g., 500 tokens with 50 token overlap) to preserve contextual boundaries.\n   - Embedding Generation: Text chunks passed through embedding model (OpenAI text-embedding-3, BGE, Voyage AI).\n   - Storage: Vectors and metadata stored in Vector Database (Pinecone, Qdrant, Milvus, pgvector) with HNSW (Hierarchical Navigable Small World) index.\n\n2. Online Retrieval Pipeline:\n   - Query Enhancement: User query rewritten / expanded via HyDE (Hypothetical Document Embeddings).\n   - Hybrid Search: Combines Dense Vector Search (semantic similarity via cosine distance) with Sparse Lexical Search (BM25 keyword matching) using Reciprocal Rank Fusion (RRF).\n   - Re-ranking: Cross-encoder re-ranker model (Cohere Re-ranker) scores top 25 retrieved passages down to top 5 most relevant.\n\n3. Generation & Guardrails:\n   - Context Injection: System prompt formatted with strict grounding instructions ("Answer solely using provided excerpts; cite source IDs").\n   - LLM Generation: Streaming response generated with source citations.',
    hints: [
      'Distinguish ingestion pipeline (chunking + embedding) from retrieval pipeline',
      'Explain Hybrid Search (Vector + BM25 keyword matching)',
      'Discuss Re-ranking and mitigation of hallucinations',
    ],
    keyPoints: [
      'RAG grounds LLM generation in external retrieved documents to eliminate hallucinations',
      'Ingestion: semantic chunking with overlap + vector database indexing (HNSW)',
      'Retrieval: Hybrid Search (Dense vectors + Sparse BM25) with Reciprocal Rank Fusion',
      'Re-ranking top passages using cross-encoder models before prompt injection',
    ],
    followUpQuestions: [
      'How do you evaluate RAG quality using metrics like RAGAS (faithfulness, answer relevance, context recall)?',
      'How do you handle multi-hop reasoning where an answer requires synthesizing information across multiple documents?',
    ],
    recommendedTimeMinutes: 6,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // ADVANCED DSA (Algorithms & Coding)
  // ==========================================
  {
    text: 'Explain the Sliding Window technique. What is the difference between fixed-size and dynamic-size sliding windows?',
    category: 'dsa',
    difficulty: 'medium',
    type: 'coding',
    tags: ['dsa', 'sliding-window', 'arrays', 'two-pointers', 'algorithms'],
    company: 'Amazon',
    expectedAnswer:
      'The Sliding Window technique is an algorithmic optimization using two pointers (left and right) to maintain a contiguous subsegment of an array or string. It reduces brute-force O(n²) or O(n³) subarray problems to linear O(n) time.\n\n1. Fixed-Size Sliding Window:\n   - Window size k is constant.\n   - Approach: Initialize window with first k elements. As right pointer expands right by 1, left pointer contracts by 1 (add nums[right], subtract nums[left]).\n   - Example: Maximum sum subarray of size k.\n\n2. Dynamic-Size Sliding Window:\n   - Window expands and contracts based on a validity condition.\n   - Approach:\n     * Expand right pointer to include elements until window violates the target constraint (e.g., at most k distinct characters).\n     * Contract left pointer one element at a time until window becomes valid again.\n     * Update global optimal result (e.g., max or min window length) at each valid window state.\n   - Example: Longest Substring Without Repeating Characters (LeetCode 3), Minimum Size Subarray Sum (LeetCode 209).',
    hints: [
      'Highlight how sliding window converts nested loops into single O(n) pass',
      'Contrast fixed size k window vs dynamic condition-based window',
      'Explain why both pointers only move forward, ensuring O(n) time',
    ],
    keyPoints: [
      'Reduces brute-force O(n²) subarray scanning to linear O(n) time',
      'Fixed-size window: constant size k, slides by adding right and removing left',
      'Dynamic-size window: expands right to explore, contracts left to restore validity',
      'Pointers move strictly forward; amortized 2n operations total',
    ],
    followUpQuestions: [
      'How would you solve the Sliding Window Maximum problem in O(n) time using a Monotonic Deque?',
      'Why does the sliding window technique fail when array elements can be negative?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'What is a Trie (Prefix Tree)? How do you implement insert, search, and startsWith operations?',
    category: 'dsa',
    difficulty: 'medium',
    type: 'coding',
    tags: ['dsa', 'trie', 'trees', 'strings', 'autocomplete'],
    company: 'Google',
    expectedAnswer:
      'A Trie (Prefix Tree) is an efficient tree-like data structure used for storing and searching strings where each node represents a single character.\n\nNode Structure:\n- children: Array of size 26 (for lowercase English letters) or HashMap<Character, TrieNode>.\n- isEndOfWord: Boolean flag indicating if this node terminates a complete stored word.\n\nCore Operations:\n1. insert(word):\n   - Start at root. For each character c in word, check if children[c] exists.\n   - If not, create new TrieNode. Advance current pointer to child node.\n   - Set current.isEndOfWord = true at last character.\n   - Time Complexity: O(L) where L is word length.\n\n2. search(word):\n   - Traverse character by character from root.\n   - If any character node is missing, return false.\n   - At end of word, return current.isEndOfWord.\n   - Time Complexity: O(L).\n\n3. startsWith(prefix):\n   - Traverse prefix characters from root.\n   - If all characters exist, return true (does not require isEndOfWord to be true).\n   - Time Complexity: O(P) where P is prefix length.\n\nSpace Complexity: O(N * L) in worst case where N is number of words and L is average length, with substantial prefix sharing.',
    hints: [
      'Explain the node structure (children map/array + isEndOfWord boolean)',
      'Explain why startsWith differs from search',
      'Highlight O(L) lookup speed independent of the total number of words N in the dataset',
    ],
    keyPoints: [
      'TrieNode contains children references and an isEndOfWord terminal flag',
      'O(L) time complexity for insert, search, and prefix matching',
      'Optimal for search autocomplete, spell-checking, and IP routing tables',
      'Substantial space savings when large sets of words share identical prefixes',
    ],
    followUpQuestions: [
      'How would you implement a Radix Tree (Compressed Trie) to save memory on long non-branching paths?',
      'How can a Trie be used to solve the Maximum XOR of Two Numbers problem?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },

  // ==========================================
  // BEHAVIORAL & ENGINEERING LEADERSHIP (5 Questions)
  // ==========================================
  {
    text: 'Tell me about a time you had to lead a technical project with tight deadlines and ambiguous requirements.',
    category: 'behavioral',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['behavioral', 'leadership', 'ambiguity', 'project-management'],
    company: 'Google',
    expectedAnswer:
      'Structure using the STAR framework (Situation, Task, Action, Result):\n\n1. Situation:\n   - Set context: "Our engineering organization needed to implement a GDPR-compliant Data Deletion service across 12 distributed microservices within 6 weeks before a strict compliance deadline, but the initial technical requirements were vague."\n\n2. Task:\n   - Define objective: "As the lead engineer, I was responsible for de-risking the architectural requirements, coordinating dependencies across 3 teams, and delivering the service without delaying core product roadmap features."\n\n3. Action:\n   - Break ambiguity into assumptions: Drafted a 2-page RFC detailing proposed event-driven deletion workflow using Kafka tombstones.\n   - Facilitated alignment: Held a 45-minute sync with security and product managers to agree on exact SLA expectations (30-day deletion grace period).\n   - Milestone decomposition: Divided work into 3 phased milestones (Audit logging -> Dry-run soft delete -> Hard delete cascade). Held daily 10-minute async blockers check-in.\n\n4. Result & Reflection:\n   - Successfully deployed 1 week ahead of deadline with zero production regressions. Established the architecture RFC template that became standard across the engineering department.',
    hints: [
      'Focus on HOW you transformed ambiguity into actionable technical tasks',
      'Demonstrate proactive stakeholder alignment and dependency management',
      'Quantify results and reflect on leadership growth',
    ],
    keyPoints: [
      'STAR framework with explicit focus on technical leadership',
      'De-risked ambiguity through documentation (RFC) and stakeholder alignment',
      'Structured milestones into incremental, low-risk deliverables',
      'Delivered ahead of schedule with lasting organizational impact',
    ],
    followUpQuestions: [
      'How did you ensure junior engineers on the team did not feel overwhelmed by the tight deadline?',
      'If you had to run the project again, what would you do differently?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
  {
    text: 'How do you handle production outages? Describe a specific critical incident you resolved and your post-mortem process.',
    category: 'behavioral',
    difficulty: 'hard',
    type: 'behavioral',
    tags: ['behavioral', 'incident-response', 'devops', 'post-mortem'],
    company: 'Amazon',
    expectedAnswer:
      'Production Incident Management Framework:\n\n1. Real-Time Triage & Mitigation (During Outage):\n   - Immediate containment > finding root cause: The priority is restoring customer availability immediately (e.g., rollback deployment, toggle feature flag, scale up instances, enable fallback cache), not debugging complex root causes on production servers.\n   - Incident Command: Appoint an Incident Commander to coordinate actions and a Communications Lead to provide 15-minute status updates on status pages and Slack channels.\n\n2. Specific Example (STAR):\n   - Situation: A payment service memory leak caused API 500 errors to spike to 18% during peak Black Friday sales traffic.\n   - Action: Implemented instant traffic shed via rate-limiting non-essential endpoints, rolled back the last canary release within 8 minutes, and verified error rate dropped back to 0.02%.\n\n3. Blameless Post-Mortem Process (After Outage):\n   - Blameless Culture: Focus on systemic flaws, tooling gaps, and monitoring blind spots, never blaming individual engineers.\n   - 5 Whys Root Cause Analysis: Traced the leak to an un-closed database cursor in a newly introduced reporting query.\n   - Action Items: Created automated CI memory profiling tests, added Prometheus alerts for memory slope increases > 20%/hr, and added automated circuit breakers.',
    hints: [
      'Emphasize that during an outage, restoring availability comes before debugging',
      'Highlight blameless post-mortem culture and the 5 Whys method',
      'Show that lasting automated guardrails were built from the incident',
    ],
    keyPoints: [
      'Availability mitigation takes priority over root cause investigation',
      'Clear incident command and stakeholder communication protocols',
      'Blameless post-mortem culture focusing on systems rather than individuals',
      '5 Whys analysis leading to tangible automated preventive actions in CI/CD',
    ],
    followUpQuestions: [
      'How do you balance post-mortem remediation tickets against ongoing product roadmap pressure?',
      'What alerts do you monitor to catch memory leaks before they impact customers?',
    ],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true,
  },
];

module.exports = {
  additionalQuestions,
};
