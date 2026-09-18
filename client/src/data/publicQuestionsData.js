// Curated high-quality technical interview questions for HireReady public SEO pages

export const TECH_CATEGORIES = {
  java: {
    slug: 'java',
    title: 'Java Interview Questions',
    h1Title: 'Java Technical Interview Questions & Answers',
    topicName: 'Java',
    metaTitle: 'Java Technical Interview Questions & Answers | HireReady',
    metaDescription:
      'Master Java technical interview questions with expert answers covering OOP, Collections framework, Multithreading, Exception Handling, and JVM memory concepts.',
    iconName: 'Coffee',
    badge: 'Popular',
    description:
      'Master core Java, object-oriented programming, collections framework, exception handling, and concurrent multithreading concepts with curated interview questions.',
    sections: [
      'Core Java & OOP',
      'Collections Framework',
      'Exceptions & Multithreading',
      'Memory & JVM',
    ],
  },
  javascript: {
    slug: 'javascript',
    title: 'JavaScript Interview Questions',
    h1Title: 'JavaScript Technical Interview Questions & Answers',
    topicName: 'JavaScript',
    metaTitle: 'JavaScript Interview Questions & Answers (2026) | HireReady',
    metaDescription:
      'Practice top JavaScript technical interview questions and answers. Master closures, Event Loop, promises, ES6+ coding snippets, and core JS concepts for freshers & pros.',
    iconName: 'Code',
    badge: 'Trending',
    description:
      'Prepare for JavaScript technical interviews with curated questions and detailed explanations covering core JavaScript fundamentals, closures, the Event Loop, promises, async/await, prototypal inheritance, ES6+ features, and practical coding challenges for freshers and experienced developers.',
    sections: [
      'Execution & Closures',
      'Asynchronous JS & Promises',
      'Prototypes & Objects',
      'ES6+ Features',
    ],
  },
  react: {
    slug: 'react',
    title: 'React Interview Questions',
    h1Title: 'React Technical Interview Questions & Answers',
    topicName: 'React',
    metaTitle: 'React Interview Questions & Answers (2026) | HireReady',
    metaDescription:
      'Practice React technical interview questions and answers covering Hooks, components, state management, Virtual DOM, performance, and modern React concepts.',
    iconName: 'Atom',
    badge: 'High Demand',
    description:
      'Prepare for React technical interviews with curated questions and detailed explanations covering components, props, state, custom Hooks, Context API, Virtual DOM reconciliation, performance optimization, and modern coding-oriented interview questions for freshers and experienced developers.',
    sections: [
      'React Fundamentals',
      'Components, Props & State',
      'React Hooks',
      'State Management & Context',
      'Virtual DOM & Performance',
    ],
  },
  nodejs: {
    slug: 'nodejs',
    title: 'Node.js Interview Questions',
    h1Title: 'Node.js Technical Interview Questions & Answers',
    topicName: 'Node.js',
    metaTitle: 'Node.js Interview Questions & Answers (2026) | HireReady',
    metaDescription:
      'Practice Node.js technical interview questions covering the Event Loop, Express.js, REST APIs, asynchronous programming, streams, authentication, and backend concepts.',
    iconName: 'Server',
    badge: 'Backend',
    description:
      'Prepare for Node.js backend technical interviews with curated questions and detailed explanations covering Node.js fundamentals, the libuv Event Loop, asynchronous programming, Express.js middleware, REST APIs, authentication, streams, and backend architectural concepts for freshers and experienced developers.',
    sections: [
      'Node.js Fundamentals',
      'Event Loop & Asynchronous Programming',
      'Express.js & Middleware',
      'REST APIs & Authentication',
      'Streams & Backend Performance',
    ],
  },
  sql: {
    slug: 'sql',
    title: 'SQL & Database Interview Questions',
    h1Title: 'SQL & Database Interview Questions & Answers',
    topicName: 'SQL & Database',
    metaTitle: 'SQL Database Interview Questions & Answers | HireReady',
    metaDescription:
      'Master database technical interviews with top SQL questions on Joins, Indexes, ACID Transactions, Grouping, Subqueries, and Query Optimization.',
    iconName: 'Database',
    badge: 'Essential',
    description:
      'Sharpen relational database skills with questions covering complex SQL joins, indexing strategies, ACID compliance, subqueries, and aggregation.',
    sections: [
      'Queries & Joins',
      'Database Indexing',
      'ACID & Transactions',
      'Aggregation & Subqueries',
    ],
  },
};

export const PUBLIC_QUESTIONS = {
  java: [
    {
      id: 'java-1',
      section: 'Core Java & OOP',
      difficulty: 'Easy',
      question: 'What is the difference between == and equals() in Java?',
      answer:
        'In Java, the == operator performs reference comparison (checks if both variables refer to the exact same memory location on the heap), whereas the equals() method evaluates object value equality (checks if the contents/attributes of the two objects are logically equal).',
      explanation:
        'Primitive types always use == for value comparison. For objects, String class overrides equals() to compare characters, whereas the default implementation in Object class uses reference equality (same as ==).',
      codeSnippet: `String s1 = new String("HireReady");
String s2 = new String("HireReady");

System.out.println(s1 == s2);      // false (different memory references)
System.out.println(s1.equals(s2)); // true  (same string content)`,
    },
    {
      id: 'java-2',
      section: 'Core Java & OOP',
      difficulty: 'Medium',
      question: 'What is the difference between Method Overloading and Method Overriding?',
      answer:
        'Method Overloading happens within the same class when multiple methods share the same name but have different parameter lists (compile-time polymorphism). Method Overriding occurs in a subclass when a method has the exact same name, return type, and signature as in the superclass (runtime polymorphism).',
      explanation:
        'Overloaded methods are selected at compile time based on argument types. Overridden methods are determined dynamically at runtime based on the actual object instance type created.',
      codeSnippet: `class Animal {
    void speak() { System.out.println("Animal speaks"); }
}

class Dog extends Animal {
    @Override
    void speak() { System.out.println("Dog barks"); } // Overriding
    
    void speak(int times) { // Overloading
        for(int i=0; i<times; i++) System.out.println("Bark!");
    }
}`,
    },
    {
      id: 'java-3',
      section: 'Collections Framework',
      difficulty: 'Medium',
      question: 'What is the internal working mechanism of HashMap in Java?',
      answer:
        'HashMap stores key-value pairs using an array of Node buckets. When a key is inserted, hashCode() calculates an integer hash, which is mapped to an array index. If collisions occur (multiple keys hash to the same bucket index), entries form a LinkedList. Since Java 8, if a bucket LinkedList exceeds 8 nodes, it transforms into a Red-Black Tree to optimize worst-case search time from O(n) to O(log n).',
      explanation:
        'Keys placed in a HashMap must implement both hashCode() and equals() correctly to prevent bucket mismatch or lost updates.',
    },
    {
      id: 'java-4',
      section: 'Exceptions & Multithreading',
      difficulty: 'Medium',
      question: 'What is the difference between Checked and Unchecked exceptions?',
      answer:
        'Checked exceptions (derived directly from Exception, e.g., IOException, SQLException) are inspected by the compiler at compile time and must be explicitly handled with try-catch or declared with a throws keyword. Unchecked exceptions (derived from RuntimeException, e.g., NullPointerException, ArrayIndexOutOfBoundsException) occur at runtime and do not require mandatory compile-time handling.',
      explanation:
        'Checked exceptions represent recoverable scenarios external to application control, while unchecked exceptions reflect logic errors or improper programming practices.',
    },
    {
      id: 'java-5',
      section: 'Memory & JVM',
      difficulty: 'Hard',
      question: 'Explain Garbage Collection generations in Java JVM memory.',
      answer:
        'JVM heap memory is segregated into Young Generation (Eden space, Survivor spaces S0 and S1) and Old Generation. New objects are allocated in Eden. Minor GC frequently clears dead objects from Young Gen and promotes surviving long-lived objects to Old Gen. Major/Full GC runs periodically on Old Gen when space runs low.',
      explanation:
        'Generational GC is built on the empirical observation that most objects die short-lived soon after allocation.',
    },
  ],
  javascript: [
    {
      id: 'js-1',
      section: 'Execution & Closures',
      difficulty: 'Medium',
      question: 'What is a Closure in JavaScript and how is it useful?',
      answer:
        'A closure is the combination of a function bundled together with references to its surrounding lexical environment. In JavaScript, closures give inner functions access to an outer function’s scope variables even after the outer function has finished executing.',
      explanation:
        'Closures enable data privacy (emulating private instance variables), partial application, currying, and maintaining state across asynchronous callbacks.',
      codeSnippet: `function createCounter() {
    let count = 0; // Private variable enclosed in lexical scope
    return {
        increment: () => ++count,
        getValue: () => count
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getValue());  // 1`,
    },
    {
      id: 'js-2',
      section: 'Asynchronous JS & Promises',
      difficulty: 'Medium',
      question: 'Explain how the Event Loop handles Microtasks vs Macrotasks.',
      answer:
        'The JavaScript event loop continuously monitors the Call Stack and Task Queues. When the Call Stack clears, the event loop drains ALL pending Microtasks (Promise.then callbacks, process.nextTick, queueMicrotask) BEFORE pulling the next Macrotask (setTimeout, setInterval, I/O events, setImmediate).',
      explanation:
        'Because microtask queues must be completely emptied prior to picking up macrotasks, recursive microtask scheduling can starve rendering and macrotask execution.',
    },
    {
      id: 'js-3',
      section: 'Prototypes & Objects',
      difficulty: 'Medium',
      question: 'What is Prototypal Inheritance in JavaScript?',
      answer:
        'In JavaScript, every object possesses a hidden internal link [[Prototype]] pointing to another object (its prototype). When accessing a property on an object, JS first looks at the object itself; if missing, it traverses up the prototype chain until it finds the property or reaches null.',
      explanation:
        'ES6 class syntax is syntactic sugar built directly over JavaScript’s prototypal inheritance model.',
    },
    {
      id: 'js-4',
      section: 'Execution & Closures',
      difficulty: 'Easy',
      question: 'What is the difference between var, let, and const?',
      answer:
        'var is function-scoped, re-declarable, and hoisted with an initial value of undefined. let and const are block-scoped and hoisted into a "Temporal Dead Zone" (TDZ) where accessing them prior to declaration throws a ReferenceError. const variable bindings cannot be reassigned after declaration.',
      explanation:
        'Modern JavaScript best practice favors const by default and let when reassignment is explicitly required.',
    },
    {
      id: 'js-5',
      section: 'ES6+ Features',
      difficulty: 'Easy',
      question: 'What is Arrow Function syntax and how does it handle the "this" keyword?',
      answer:
        'Arrow functions provide a concise syntax for function expressions. Unlike standard functions, arrow functions do NOT bind their own "this" context; instead, they lexically capture the "this" value of their enclosing scope at definition time.',
      explanation:
        'Arrow functions cannot be used as constructors (calling them with new throws TypeError) and do not possess an arguments object.',
    },
  ],
  react: [
    {
      id: 'react-1',
      section: 'Core Concepts & Virtual DOM',
      difficulty: 'Medium',
      question: 'What is the Virtual DOM and how does React reconciliation work?',
      answer:
        'The Virtual DOM is an in-memory lightweight Javascript representation of the real DOM tree. When component state changes, React constructs a new Virtual DOM tree, performs a diffing algorithm (Reconciliation) against the previous snapshot, and computes the minimal set of DOM operations required to update the browser efficiently.',
      explanation:
        'React diffing operates in O(n) time complexity by assuming components of different element types build different trees and using keys to match children across renders.',
    },
    {
      id: 'react-2',
      section: 'Hooks & State',
      difficulty: 'Medium',
      question: 'What are the rules of React Hooks and why do they exist?',
      answer:
        '1. Only call Hooks at the top level of React functions (not inside loops, conditions, or nested functions).\n2. Only call Hooks from React function components or custom Hooks.\nThese rules guarantee that Hooks execute in the exact same sequential order on every render, allowing React to correctly pair local state with the component instance.',
    },
    {
      id: 'react-3',
      section: 'Hooks & State',
      difficulty: 'Hard',
      question: 'When should you use useMemo and useCallback Hooks?',
      answer:
        'useMemo caches the evaluated result of an expensive computation across renders. useCallback caches a function instance reference across renders. Use them when passing callbacks to optimized child components relying on reference equality (React.memo) or when performing CPU-heavy data transformations.',
      explanation:
        'Avoid overusing useMemo and useCallback for simple calculations, as the memory overhead of dependency array checks can exceed the saved execution time.',
      codeSnippet: `const memoizedValue = useMemo(() => computeHeavyData(items), [items]);
const memoizedCallback = useCallback(() => handleSelect(id), [id]);`,
    },
    {
      id: 'react-4',
      section: 'Component Lifecycle',
      difficulty: 'Medium',
      question: 'How does the cleanup function in useEffect work?',
      answer:
        'The cleanup function returned inside a useEffect callback runs before the component unmounts and prior to re-running the effect on subsequent render updates. It is used to cancel network subscriptions, clear timers, or detach global DOM event listeners to prevent memory leaks.',
    },
    {
      id: 'react-5',
      section: 'Performance Optimization',
      difficulty: 'Medium',
      question: 'What is React.memo and how does it prevent unnecessary renders?',
      answer:
        'React.memo is a higher-order component (HOC) that wraps a functional component. It memoizes the rendered output and skips re-rendering if incoming props have not changed according to shallow equality check.',
    },
  ],
  nodejs: [
    {
      id: 'node-1',
      section: 'Node.js Architecture',
      difficulty: 'Medium',
      question: 'What is Node.js and why is it single-threaded non-blocking?',
      answer:
        'Node.js is an asynchronous, event-driven JavaScript runtime built on Chrome V8 engine and libuv library. It uses a single main thread to process incoming requests and delegates heavy file/network I/O operations to OS kernel mechanisms or a background C++ thread pool, allowing high concurrency without heavy thread context switching.',
    },
    {
      id: 'node-2',
      section: 'Event Loop & Async I/O',
      difficulty: 'Hard',
      question: 'What are the main phases of the Node.js libuv Event Loop?',
      answer:
        'The libuv event loop consists of 6 primary phases:\n1. Timers (setTimeout, setInterval)\n2. Pending Callbacks (I/O callbacks)\n3. Idle, Prepare (internal use)\n4. Poll (retrieve new I/O events)\n5. Check (setImmediate callbacks)\n6. Close Callbacks (e.g. socket.on("close"))',
    },
    {
      id: 'node-3',
      section: 'Streams & Buffers',
      difficulty: 'Medium',
      question: 'What are Streams in Node.js and what are their types?',
      answer:
        'Streams are objects that enable reading or writing data sequentially in chunks rather than buffering entire files into memory. Node.js supports 4 fundamental stream types: Readable, Writable, Duplex (both read & write like TCP socket), and Transform (modifies data while reading/writing like zlib compression).',
    },
    {
      id: 'node-4',
      section: 'API & Express Patterns',
      difficulty: 'Easy',
      question: 'How does middleware work in Express.js?',
      answer:
        'Express middleware functions have access to the Request object (req), Response object (res), and the next middleware function (next) in the application cycle. Middleware can execute code, modify request objects, end the response cycle, or call next() to pass control to downstream handlers.',
    },
  ],
  sql: [
    {
      id: 'sql-1',
      section: 'Queries & Joins',
      difficulty: 'Easy',
      question: 'What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN?',
      answer:
        'INNER JOIN returns only rows with matching key values in both tables. LEFT JOIN returns all records from the left table along with matching records from the right table (filling NULLs when no match exists). RIGHT JOIN returns all records from the right table and matching records from the left.',
      codeSnippet: `SELECT u.name, o.total_amount
FROM Users u
INNER JOIN Orders o ON u.id = o.user_id;`,
    },
    {
      id: 'sql-2',
      section: 'Database Indexing',
      difficulty: 'Medium',
      question: 'How do Database Indexes improve query performance and what are the trade-offs?',
      answer:
        'Indexes create B-Tree or Hash data structures that enable the database engine to find specific rows in O(log n) time instead of performing expensive full table scans (O(n)). The trade-offs include additional disk storage consumption and slower write performance (INSERT/UPDATE/DELETE) because indexes must be updated on every mutation.',
    },
    {
      id: 'sql-3',
      section: 'ACID & Transactions',
      difficulty: 'Medium',
      question: 'Explain ACID properties in database transactions.',
      answer:
        '• Atomicity: All operations in a transaction commit completely or roll back entirely.\n• Consistency: Transactions move the database from one valid state to another, enforcing constraints.\n• Isolation: Concurrent transactions execute independently without reading uncommitted dirty data.\n• Durability: Once a transaction commits, its changes persist permanently even through system crashes.',
    },
    {
      id: 'sql-4',
      section: 'Aggregation & Subqueries',
      difficulty: 'Easy',
      question: 'What is the difference between WHERE and HAVING clauses in SQL?',
      answer:
        'WHERE filters individual rows BEFORE aggregate operations (GROUP BY) take place. HAVING filters aggregated group results AFTER the GROUP BY clause has been evaluated.',
      codeSnippet: `SELECT department, COUNT(*) as employee_count
FROM Employees
WHERE salary > 50000
GROUP BY department
HAVING COUNT(*) > 5;`,
    },
  ],
};
