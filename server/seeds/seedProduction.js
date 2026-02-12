/**
 * ===========================================
 * Production Seed Script
 * ===========================================
 * 
 * Seeds real data for Daily Challenges, Interview Tips,
 * Career Paths, Skill Categories, Questions, and Community Posts.
 * 
 * Safe to run multiple times - uses upsert logic.
 * Run: cd server && node seeds/seedProduction.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { DailyChallenge } = require('../models/DailyChallenge.model');
const Question = require('../models/Question.model');

// ===========================
// DAILY CHALLENGES (30 days)
// ===========================
const dailyChallenges = [
  // Day 1 - Easy
  {
    title: 'Two Sum',
    description: 'Find two numbers in an array that add up to a target sum.',
    category: 'coding',
    difficulty: 'easy',
    points: 100,
    timeLimit: 20,
    question: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] == 9\n\nConstraints:\n- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9`,
    sampleInput: 'nums = [2,7,11,15], target = 9',
    sampleOutput: '[0, 1]',
    expectedAnswer: 'Use a hash map to store each number and its index. For each number, check if (target - current) exists in the map.',
    hints: ['A brute force O(n²) checks every pair.', 'Use a hash map for O(1) lookup.', 'For each num, check if target-num is already in the map.'],
    solution: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}`,
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', isHidden: false },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]', isHidden: false },
      { input: '[3,3], 6', expectedOutput: '[0,1]', isHidden: true },
    ],
    tags: ['array', 'hash-table', 'easy'],
    activeDate: getDay(0),
    isActive: true
  },
  // Day 2 - Easy
  {
    title: 'Valid Parentheses',
    description: 'Check if a string of brackets is valid.',
    category: 'coding',
    difficulty: 'easy',
    points: 100,
    timeLimit: 15,
    question: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nRules:\n1. Open brackets must be closed by the same type.\n2. Open brackets must be closed in the correct order.\n\nExample:\nInput: s = "()[]{}" → Output: true\nInput: s = "(]" → Output: false`,
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
    expectedAnswer: 'Use a stack. Push opening brackets, pop and check match for closing brackets.',
    hints: ['Use a stack data structure.', 'Map closing brackets to their opening counterpart.', 'Stack should be empty at the end if valid.'],
    solution: `function isValid(s) {\n  const stack = [];\n  const map = { ')':'(', '}':'{', ']':'[' };\n  for (const c of s) {\n    if (c in map) { if (stack.pop() !== map[c]) return false; }\n    else stack.push(c);\n  }\n  return stack.length === 0;\n}`,
    tags: ['string', 'stack'],
    activeDate: getDay(1),
    isActive: true
  },
  // Day 3 - Easy
  {
    title: 'Reverse Linked List',
    description: 'Reverse a singly linked list iteratively or recursively.',
    category: 'coding',
    difficulty: 'easy',
    points: 100,
    timeLimit: 20,
    question: `Given the head of a singly linked list, reverse the list and return the reversed list.\n\nExample:\nInput: [1,2,3,4,5] → Output: [5,4,3,2,1]\n\nConstraints: 0 <= number of nodes <= 5000`,
    sampleInput: 'head = [1,2,3,4,5]',
    sampleOutput: '[5,4,3,2,1]',
    expectedAnswer: 'Use three pointers: prev, current, next. Iterate and reverse each link.',
    hints: ['Track prev, current, and next pointers.', 'Save next before changing the link.', 'Move prev and current forward each step.'],
    solution: `function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}`,
    tags: ['linked-list', 'recursion'],
    activeDate: getDay(2),
    isActive: true
  },
  // Day 4 - Easy
  {
    title: 'Best Time to Buy and Sell Stock',
    description: 'Find the maximum profit from buying and selling a stock once.',
    category: 'coding',
    difficulty: 'easy',
    points: 100,
    timeLimit: 15,
    question: `Given an array prices where prices[i] is the price of a stock on the ith day, find the maximum profit you can achieve from one transaction (buy one day, sell a later day).\n\nReturn 0 if no profit is possible.\n\nExample:\nInput: [7,1,5,3,6,4] → Output: 5 (buy at 1, sell at 6)`,
    sampleInput: 'prices = [7,1,5,3,6,4]',
    sampleOutput: '5',
    expectedAnswer: 'Track the minimum price seen so far and the maximum profit at each step.',
    hints: ['Track min price as you iterate.', 'At each price, calculate profit = price - minPrice.', 'Update maxProfit if current profit is higher.'],
    solution: `function maxProfit(prices) {\n  let minPrice = Infinity, maxProfit = 0;\n  for (const price of prices) {\n    minPrice = Math.min(minPrice, price);\n    maxProfit = Math.max(maxProfit, price - minPrice);\n  }\n  return maxProfit;\n}`,
    tags: ['array', 'dynamic-programming', 'greedy'],
    activeDate: getDay(3),
    isActive: true
  },
  // Day 5 - Easy
  {
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    description: 'Find the contiguous subarray with the largest sum.',
    category: 'coding',
    difficulty: 'easy',
    points: 100,
    timeLimit: 15,
    question: `Given an integer array nums, find the subarray with the largest sum and return its sum.\n\nExample:\nInput: [-2,1,-3,4,-1,2,1,-5,4] → Output: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.`,
    sampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
    sampleOutput: '6',
    expectedAnswer: 'Use Kadane\'s algorithm: track currentSum and maxSum. Reset currentSum to 0 when it goes negative.',
    hints: ['At each element, decide: extend current subarray or start new.', 'currentSum = max(num, currentSum + num)', 'Track the global maximum.'],
    solution: `function maxSubArray(nums) {\n  let current = nums[0], max = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    current = Math.max(nums[i], current + nums[i]);\n    max = Math.max(max, current);\n  }\n  return max;\n}`,
    tags: ['array', 'dynamic-programming', 'divide-and-conquer'],
    activeDate: getDay(4),
    isActive: true
  },
  // Day 6 - Easy
  {
    title: 'Merge Two Sorted Lists',
    description: 'Merge two sorted linked lists into one sorted list.',
    category: 'coding',
    difficulty: 'easy',
    points: 100,
    timeLimit: 15,
    question: `Merge two sorted linked lists and return it as a sorted list built by splicing together the nodes of the input lists.\n\nExample:\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]`,
    sampleInput: 'list1 = [1,2,4], list2 = [1,3,4]',
    sampleOutput: '[1,1,2,3,4,4]',
    expectedAnswer: 'Use a dummy head node and iterate, picking the smaller value each time.',
    hints: ['Create a dummy node to start the merged list.', 'Compare heads of both lists, pick smaller.', 'Attach remaining nodes when one list is exhausted.'],
    solution: `function mergeTwoLists(l1, l2) {\n  const dummy = { next: null };\n  let curr = dummy;\n  while (l1 && l2) {\n    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }\n    else { curr.next = l2; l2 = l2.next; }\n    curr = curr.next;\n  }\n  curr.next = l1 || l2;\n  return dummy.next;\n}`,
    tags: ['linked-list', 'recursion'],
    activeDate: getDay(5),
    isActive: true
  },
  // Day 7 - Medium (Behavioral)
  {
    title: 'Tell Me About Yourself',
    description: 'Practice the most common behavioral interview question.',
    category: 'behavioral',
    difficulty: 'easy',
    points: 100,
    timeLimit: 10,
    question: `Practice answering "Tell me about yourself" — the most common interview opener.\n\nGuidelines:\n1. Use Present → Past → Future format\n2. Keep it 1-2 minutes\n3. Highlight relevant achievements\n4. Connect to the target role\n\nWrite a structured response for a software engineering role.`,
    hints: ['Start with your current role/studies.', 'Mention 2-3 key accomplishments.', 'End with why this role excites you.'],
    expectedAnswer: 'A structured 1-2 minute response using Present-Past-Future format, highlighting relevant technical skills and achievements.',
    tags: ['behavioral', 'introduction', 'soft-skills'],
    activeDate: getDay(6),
    isActive: true
  },
  // Day 8 - Medium
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Find the length of the longest substring without repeating characters.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 30,
    question: `Given a string s, find the length of the longest substring without repeating characters.\n\nExample:\nInput: "abcabcbb" → Output: 3 ("abc")\nInput: "bbbbb" → Output: 1 ("b")\nInput: "pwwkew" → Output: 3 ("wke")\n\nConstraints: 0 <= s.length <= 5 × 10^4`,
    sampleInput: 's = "abcabcbb"',
    sampleOutput: '3',
    expectedAnswer: 'Sliding window with a hash set. Expand right, shrink left when duplicate found.',
    hints: ['Use two pointers (sliding window).', 'A Set tracks characters in current window.', 'When duplicate found, shrink from left.', 'Track max length throughout.'],
    solution: `function lengthOfLongestSubstring(s) {\n  const set = new Set();\n  let left = 0, max = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) { set.delete(s[left]); left++; }\n    set.add(s[right]);\n    max = Math.max(max, right - left + 1);\n  }\n  return max;\n}`,
    tags: ['string', 'sliding-window', 'hash-table'],
    activeDate: getDay(7),
    isActive: true
  },
  // Day 9 - Medium
  {
    title: 'Container With Most Water',
    description: 'Find two lines forming a container that holds the most water.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 25,
    question: `Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container holding the most water.\n\nExample:\nInput: [1,8,6,2,5,4,8,3,7] → Output: 49\n\nArea = width × min(height[left], height[right])`,
    sampleInput: 'height = [1,8,6,2,5,4,8,3,7]',
    sampleOutput: '49',
    expectedAnswer: 'Two pointers from both ends. Move the pointer pointing to the shorter line.',
    hints: ['Start with maximum width (both ends).', 'The shorter line limits the height.', 'Move the shorter pointer inward.', 'Track max area throughout.'],
    solution: `function maxArea(height) {\n  let left = 0, right = height.length - 1, max = 0;\n  while (left < right) {\n    max = Math.max(max, (right - left) * Math.min(height[left], height[right]));\n    if (height[left] < height[right]) left++; else right--;\n  }\n  return max;\n}`,
    tags: ['array', 'two-pointers', 'greedy'],
    activeDate: getDay(8),
    isActive: true
  },
  // Day 10 - Medium
  {
    title: 'Binary Tree Level Order Traversal',
    description: 'Return the level order traversal of a binary tree.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 25,
    question: `Given the root of a binary tree, return the level order traversal of its nodes' values (left to right, level by level).\n\nExample:\nInput: [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]`,
    sampleInput: 'root = [3,9,20,null,null,15,7]',
    sampleOutput: '[[3],[9,20],[15,7]]',
    expectedAnswer: 'BFS using a queue. Process all nodes at each level before moving to the next.',
    hints: ['Use BFS with a queue.', 'Process all nodes at current level (queue.length).', 'Add children of processed nodes for next level.'],
    solution: `function levelOrder(root) {\n  if (!root) return [];\n  const result = [], queue = [root];\n  while (queue.length) {\n    const level = [], size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(level);\n  }\n  return result;\n}`,
    tags: ['tree', 'bfs', 'binary-tree'],
    activeDate: getDay(9),
    isActive: true
  },
  // Day 11 - Medium
  {
    title: '3Sum',
    description: 'Find all unique triplets that sum to zero.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 30,
    question: `Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i ≠ j ≠ k and nums[i] + nums[j] + nums[k] == 0.\n\nNo duplicate triplets in the output.\n\nExample:\nInput: [-1,0,1,2,-1,-4] → Output: [[-1,-1,2],[-1,0,1]]`,
    sampleInput: 'nums = [-1,0,1,2,-1,-4]',
    sampleOutput: '[[-1,-1,2],[-1,0,1]]',
    expectedAnswer: 'Sort array, fix one element, use two pointers for the remaining two. Skip duplicates.',
    hints: ['Sort the array first.', 'Fix one number and use two pointers for the other two.', 'Skip duplicates to avoid repeats.', 'Early termination if first number > 0.'],
    solution: `function threeSum(nums) {\n  nums.sort((a,b) => a - b);\n  const result = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i-1]) continue;\n    let left = i + 1, right = nums.length - 1;\n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        while (left < right && nums[left] === nums[left+1]) left++;\n        while (left < right && nums[right] === nums[right-1]) right--;\n        left++; right--;\n      } else if (sum < 0) left++;\n      else right--;\n    }\n  }\n  return result;\n}`,
    tags: ['array', 'two-pointers', 'sorting'],
    activeDate: getDay(10),
    isActive: true
  },
  // Day 12 - Medium
  {
    title: 'Number of Islands',
    description: 'Count the number of islands in a 2D grid.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 30,
    question: `Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.\n\nExample:\nInput: [["1","1","0","0","0"],\n       ["1","1","0","0","0"],\n       ["0","0","1","0","0"],\n       ["0","0","0","1","1"]]\nOutput: 3`,
    sampleInput: 'grid (see above)',
    sampleOutput: '3',
    expectedAnswer: 'Iterate grid, when finding a "1", increment count and DFS/BFS to mark all connected land as visited.',
    hints: ['Iterate through every cell.', 'When you find "1", do DFS/BFS to mark entire island.', 'Mark visited cells as "0" to avoid recounting.'],
    solution: `function numIslands(grid) {\n  let count = 0;\n  for (let i = 0; i < grid.length; i++) {\n    for (let j = 0; j < grid[0].length; j++) {\n      if (grid[i][j] === '1') {\n        count++;\n        dfs(grid, i, j);\n      }\n    }\n  }\n  return count;\n}\nfunction dfs(grid, i, j) {\n  if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] === '0') return;\n  grid[i][j] = '0';\n  dfs(grid, i+1, j); dfs(grid, i-1, j); dfs(grid, i, j+1); dfs(grid, i, j-1);\n}`,
    tags: ['graph', 'dfs', 'bfs', 'matrix'],
    activeDate: getDay(11),
    isActive: true
  },
  // Day 13 - Medium
  {
    title: 'Product of Array Except Self',
    description: 'Return an array where each element is the product of all elements except itself.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 25,
    question: `Given an integer array nums, return an array answer where answer[i] equals the product of all elements of nums except nums[i], without using division and in O(n) time.\n\nExample:\nInput: [1,2,3,4] → Output: [24,12,8,6]\nInput: [-1,1,0,-3,3] → Output: [0,0,9,0,0]`,
    sampleInput: 'nums = [1,2,3,4]',
    sampleOutput: '[24,12,8,6]',
    expectedAnswer: 'Two-pass approach: left prefix products, then right prefix products.',
    hints: ['You cannot use division.', 'Compute prefix products from left.', 'Then multiply by suffix products from right.', 'Can be done in O(1) extra space.'],
    solution: `function productExceptSelf(nums) {\n  const n = nums.length, result = new Array(n).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < n; i++) { result[i] = prefix; prefix *= nums[i]; }\n  let suffix = 1;\n  for (let i = n - 1; i >= 0; i--) { result[i] *= suffix; suffix *= nums[i]; }\n  return result;\n}`,
    tags: ['array', 'prefix-sum'],
    activeDate: getDay(12),
    isActive: true
  },
  // Day 14 - System Design
  {
    title: 'Design a URL Shortener',
    description: 'System design: Design a URL shortening service like bit.ly.',
    category: 'system-design',
    difficulty: 'medium',
    points: 250,
    timeLimit: 45,
    question: `Design a URL shortening service (like bit.ly or TinyURL).\n\nRequirements:\n1. Given a long URL, generate a short unique URL\n2. Given a short URL, redirect to the original URL\n3. Handle 100M URLs, 10:1 read/write ratio\n4. Short URLs should be 7 characters\n\nDiscuss:\n- Database design\n- URL encoding strategy\n- Scalability approach\n- Collision handling`,
    hints: ['Use Base62 encoding for short codes.', 'Consider auto-incrementing ID vs random hash.', 'Think about caching for popular URLs.', 'Discuss database choice: SQL vs NoSQL.'],
    expectedAnswer: 'Use Base62 encoding of auto-incrementing IDs. Store in DB with index on short code. Cache popular URLs in Redis. Use consistent hashing for horizontal scaling.',
    tags: ['system-design', 'database', 'scalability'],
    activeDate: getDay(13),
    isActive: true
  },
  // Day 15 - Medium
  {
    title: 'Coin Change',
    description: 'Find the minimum number of coins to make a given amount.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 30,
    question: `Given an array of coin denominations and a total amount, return the fewest number of coins needed to make up that amount. If it cannot be made, return -1.\n\nExample:\nInput: coins = [1,5,10,25], amount = 30\nOutput: 2 (25 + 5)\n\nInput: coins = [2], amount = 3\nOutput: -1`,
    sampleInput: 'coins = [1,5,10,25], amount = 30',
    sampleOutput: '2',
    expectedAnswer: 'Bottom-up DP. dp[i] = min coins needed to make amount i. For each amount, try every coin.',
    hints: ['This is a classic DP problem.', 'dp[0] = 0, dp[i] = Infinity initially.', 'For each amount i, try subtracting each coin.', 'dp[i] = min(dp[i], dp[i-coin] + 1) for each coin.'],
    solution: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
    tags: ['dynamic-programming', 'bfs'],
    activeDate: getDay(14),
    isActive: true
  },
  // Day 16 - Medium
  {
    title: 'Group Anagrams',
    description: 'Group strings that are anagrams of each other.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 25,
    question: `Given an array of strings, group the anagrams together. You can return the answer in any order.\n\nAnagram: a word formed by rearranging the letters of another.\n\nExample:\nInput: ["eat","tea","tan","ate","nat","bat"]\nOutput: [["bat"],["nat","tan"],["ate","eat","tea"]]`,
    sampleInput: '["eat","tea","tan","ate","nat","bat"]',
    sampleOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
    expectedAnswer: 'Sort each string as key, use a map to group strings with the same sorted key.',
    hints: ['Anagrams have the same letters when sorted.', 'Use sorted string as a hash map key.', 'Group all strings with the same key.'],
    solution: `function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split('').sort().join('');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return [...map.values()];\n}`,
    tags: ['string', 'hash-table', 'sorting'],
    activeDate: getDay(15),
    isActive: true
  },
  // Day 17 - Medium
  {
    title: 'Validate Binary Search Tree',
    description: 'Check if a binary tree is a valid BST.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 25,
    question: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST:\n- Left subtree contains only nodes less than root\n- Right subtree contains only nodes greater than root\n- Both left and right subtrees are also BSTs\n\nExample:\nInput: [2,1,3] → Output: true\nInput: [5,1,4,null,null,3,6] → Output: false`,
    sampleInput: 'root = [2,1,3]',
    sampleOutput: 'true',
    expectedAnswer: 'Recursive validation passing min and max bounds down. Each node must be within (min, max).',
    hints: ['Just checking left < root < right is not enough.', 'Pass down valid range (min, max) for each node.', 'Left child range: (min, node.val), Right: (node.val, max).', 'Or use in-order traversal — values should be increasing.'],
    solution: `function isValidBST(root, min = -Infinity, max = Infinity) {\n  if (!root) return true;\n  if (root.val <= min || root.val >= max) return false;\n  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);\n}`,
    tags: ['tree', 'binary-search-tree', 'dfs'],
    activeDate: getDay(16),
    isActive: true
  },
  // Day 18 - Medium
  {
    title: 'LRU Cache',
    description: 'Implement a Least Recently Used (LRU) cache.',
    category: 'coding',
    difficulty: 'medium',
    points: 250,
    timeLimit: 35,
    question: `Design a data structure for an LRU (Least Recently Used) cache.\n\nImplement:\n- get(key): Return value if key exists, else -1\n- put(key, value): Insert or update. If at capacity, evict the least recently used item.\n\nBoth operations must be O(1) time.\n\nExample:\ncache = LRUCache(2)\ncache.put(1,1) → cache.put(2,2) → cache.get(1) returns 1\ncache.put(3,3) → evicts key 2 → cache.get(2) returns -1`,
    sampleInput: 'capacity = 2, operations: put(1,1), put(2,2), get(1), put(3,3), get(2)',
    sampleOutput: 'get(1)→1, get(2)→-1',
    expectedAnswer: 'Combine a hash map with a doubly linked list. Map gives O(1) lookup, linked list gives O(1) insertion/deletion.',
    hints: ['HashMap alone cannot track order.', 'Linked list alone cannot do O(1) lookup.', 'Combine both: Map<key, node> + doubly linked list.', 'Move accessed nodes to the front (most recent).'],
    solution: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.capacity) {\n      this.map.delete(this.map.keys().next().value);\n    }\n  }\n}`,
    tags: ['design', 'hash-table', 'linked-list'],
    activeDate: getDay(17),
    isActive: true
  },
  // Day 19 - Medium
  {
    title: 'Word Search',
    description: 'Find if a word exists in a grid by following adjacent cells.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 30,
    question: `Given an m×n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be formed from sequentially adjacent cells (horizontally or vertically). Each cell may be used only once.\n\nExample:\nboard = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nword = "ABCCED" → true\nword = "SEE" → true\nword = "ABCB" → false`,
    sampleInput: 'board, word = "ABCCED"',
    sampleOutput: 'true',
    expectedAnswer: 'Backtracking DFS from each cell. Mark cells as visited, explore all 4 directions, unmark on backtrack.',
    hints: ['Try starting from every cell.', 'DFS with backtracking.', 'Mark visited cells to avoid reuse.', 'Unmark when backtracking.'],
    solution: `function exist(board, word) {\n  for (let i = 0; i < board.length; i++)\n    for (let j = 0; j < board[0].length; j++)\n      if (dfs(board, word, i, j, 0)) return true;\n  return false;\n}\nfunction dfs(board, word, i, j, k) {\n  if (k === word.length) return true;\n  if (i < 0 || j < 0 || i >= board.length || j >= board[0].length) return false;\n  if (board[i][j] !== word[k]) return false;\n  const temp = board[i][j];\n  board[i][j] = '#';\n  const found = dfs(board,word,i+1,j,k+1)||dfs(board,word,i-1,j,k+1)||dfs(board,word,i,j+1,k+1)||dfs(board,word,i,j-1,k+1);\n  board[i][j] = temp;\n  return found;\n}`,
    tags: ['backtracking', 'dfs', 'matrix'],
    activeDate: getDay(18),
    isActive: true
  },
  // Day 20 - Medium
  {
    title: 'Course Schedule',
    description: 'Determine if you can finish all courses given prerequisites.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 30,
    question: `There are numCourses courses labeled 0 to numCourses-1. prerequisites[i] = [a,b] means you must take course b before course a.\n\nReturn true if you can finish all courses.\n\nExample:\nInput: numCourses = 2, prerequisites = [[1,0]] → true\nInput: numCourses = 2, prerequisites = [[1,0],[0,1]] → false (cycle!)`,
    sampleInput: 'numCourses = 2, prerequisites = [[1,0]]',
    sampleOutput: 'true',
    expectedAnswer: 'Detect cycle in directed graph using topological sort (BFS with in-degree) or DFS with visited states.',
    hints: ['This is a cycle detection problem in a directed graph.', 'Build an adjacency list from prerequisites.', 'Use topological sort (Kahn\'s algorithm) with in-degree.', 'If all courses are processed, no cycle exists.'],
    solution: `function canFinish(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const graph = new Map();\n  for (const [a,b] of prerequisites) {\n    inDegree[a]++;\n    if (!graph.has(b)) graph.set(b, []);\n    graph.get(b).push(a);\n  }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);\n  let count = 0;\n  while (queue.length) {\n    const course = queue.shift();\n    count++;\n    for (const next of (graph.get(course) || [])) {\n      if (--inDegree[next] === 0) queue.push(next);\n    }\n  }\n  return count === numCourses;\n}`,
    tags: ['graph', 'topological-sort', 'bfs', 'dfs'],
    activeDate: getDay(19),
    isActive: true
  },
  // Day 21 - Behavioral
  {
    title: 'Describe a Time You Overcame a Challenge',
    description: 'Practice the STAR method for common behavioral questions.',
    category: 'behavioral',
    difficulty: 'medium',
    points: 150,
    timeLimit: 15,
    question: `Practice answering: "Tell me about a time you faced a significant challenge and how you overcame it."\n\nUse the STAR method:\n- Situation: What was the context?\n- Task: What was your responsibility?\n- Action: What specific steps did YOU take?\n- Result: What was the outcome? (quantify!)\n\nTips:\n- Choose a professional example\n- Focus on YOUR actions, not the team\n- Quantify results (saved X hours, improved Y%)\n- Show what you learned`,
    hints: ['Pick a real professional challenge.', 'Focus on YOUR specific actions.', 'Quantify the result.', 'End with what you learned.'],
    expectedAnswer: 'A structured STAR response with a specific professional challenge, clear individual actions, quantified results, and lessons learned.',
    tags: ['behavioral', 'star-method', 'communication'],
    activeDate: getDay(20),
    isActive: true
  },
  // Day 22 - Hard
  {
    title: 'Merge K Sorted Lists',
    description: 'Merge k sorted linked lists into one sorted list.',
    category: 'coding',
    difficulty: 'hard',
    points: 300,
    timeLimit: 40,
    question: `Given an array of k sorted linked-lists, merge all into one sorted linked-list.\n\nExample:\nInput: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]\n\nConstraints:\n- 0 <= k <= 10^4\n- 0 <= list length <= 500`,
    sampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
    sampleOutput: '[1,1,2,3,4,4,5,6]',
    expectedAnswer: 'Divide and conquer: merge pairs of lists recursively. Or use a min-heap for O(N log k).',
    hints: ['Brute force: merge one by one is O(kN).', 'Divide and conquer: merge pairs → O(N log k).', 'Min-heap: always pick smallest head → O(N log k).'],
    solution: `function mergeKLists(lists) {\n  if (!lists.length) return null;\n  while (lists.length > 1) {\n    const merged = [];\n    for (let i = 0; i < lists.length; i += 2) {\n      const l1 = lists[i], l2 = lists[i+1] || null;\n      merged.push(mergeTwoLists(l1, l2));\n    }\n    lists = merged;\n  }\n  return lists[0];\n}`,
    tags: ['linked-list', 'heap', 'divide-and-conquer'],
    activeDate: getDay(21),
    isActive: true
  },
  // Day 23 - Hard
  {
    title: 'Trapping Rain Water',
    description: 'Compute how much water is trapped between bars after raining.',
    category: 'coding',
    difficulty: 'hard',
    points: 300,
    timeLimit: 35,
    question: `Given n non-negative integers representing an elevation map (bar width = 1), compute how much water it can trap after raining.\n\nExample:\nInput: [0,1,0,2,1,0,1,3,2,1,2,1] → Output: 6\n\nWater at each position = min(maxLeft, maxRight) - height`,
    sampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    sampleOutput: '6',
    expectedAnswer: 'Two pointers from both ends. Track leftMax and rightMax. Process the shorter side.',
    hints: ['Water at i = min(maxLeft, maxRight) - height[i].', 'Precompute left max and right max arrays.', 'Or use two pointers for O(1) space.'],
    solution: `function trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0, water = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      height[left] >= leftMax ? leftMax = height[left] : water += leftMax - height[left];\n      left++;\n    } else {\n      height[right] >= rightMax ? rightMax = height[right] : water += rightMax - height[right];\n      right--;\n    }\n  }\n  return water;\n}`,
    tags: ['array', 'two-pointers', 'dynamic-programming'],
    activeDate: getDay(22),
    isActive: true
  },
  // Day 24 - Medium
  {
    title: 'Rotate Image',
    description: 'Rotate an n×n matrix 90 degrees clockwise in-place.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 25,
    question: `Rotate a given n×n 2D matrix 90 degrees clockwise. Do it in-place.\n\nExample:\nInput: [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [[7,4,1],[8,5,2],[9,6,3]]`,
    sampleInput: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
    sampleOutput: '[[7,4,1],[8,5,2],[9,6,3]]',
    expectedAnswer: 'Transpose the matrix (swap rows and columns), then reverse each row.',
    hints: ['First transpose: swap matrix[i][j] with matrix[j][i].', 'Then reverse each row.', 'This achieves 90° clockwise rotation.'],
    solution: `function rotate(matrix) {\n  const n = matrix.length;\n  // Transpose\n  for (let i = 0; i < n; i++)\n    for (let j = i; j < n; j++)\n      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];\n  // Reverse each row\n  for (const row of matrix) row.reverse();\n}`,
    tags: ['array', 'matrix', 'math'],
    activeDate: getDay(23),
    isActive: true
  },
  // Day 25 - Medium
  {
    title: 'Climbing Stairs',
    description: 'Count ways to climb n stairs taking 1 or 2 steps at a time.',
    category: 'coding',
    difficulty: 'easy',
    points: 100,
    timeLimit: 15,
    question: `You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top?\n\nExample:\nInput: n = 3 → Output: 3 (1+1+1, 1+2, 2+1)\nInput: n = 5 → Output: 8`,
    sampleInput: 'n = 3',
    sampleOutput: '3',
    expectedAnswer: 'This is the Fibonacci sequence! dp[i] = dp[i-1] + dp[i-2].',
    hints: ['This follows the Fibonacci pattern.', 'Ways to reach step i = ways to (i-1) + ways to (i-2).', 'Base cases: dp[1] = 1, dp[2] = 2.'],
    solution: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev = 1, curr = 2;\n  for (let i = 3; i <= n; i++) {\n    [prev, curr] = [curr, prev + curr];\n  }\n  return curr;\n}`,
    tags: ['dynamic-programming', 'math', 'fibonacci'],
    activeDate: getDay(24),
    isActive: true
  },
  // Day 26 - Medium
  {
    title: 'Find Minimum in Rotated Sorted Array',
    description: 'Find the minimum element in a rotated sorted array.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 20,
    question: `An array sorted in ascending order is rotated between 1 and n times. Find the minimum element.\n\nThe array has unique elements.\n\nExample:\nInput: [3,4,5,1,2] → Output: 1\nInput: [4,5,6,7,0,1,2] → Output: 0\nInput: [11,13,15,17] → Output: 11 (not rotated)`,
    sampleInput: 'nums = [3,4,5,1,2]',
    sampleOutput: '1',
    expectedAnswer: 'Binary search. If mid > right, minimum is in right half. Otherwise, it\'s in left half.',
    hints: ['Use modified binary search.', 'Compare nums[mid] with nums[right].', 'If nums[mid] > nums[right], min is in right half.', 'Otherwise min is in left half (including mid).'],
    solution: `function findMin(nums) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] > nums[right]) left = mid + 1;\n    else right = mid;\n  }\n  return nums[left];\n}`,
    tags: ['array', 'binary-search'],
    activeDate: getDay(25),
    isActive: true
  },
  // Day 27 - Hard
  {
    title: 'Longest Increasing Subsequence',
    description: 'Find the length of the longest strictly increasing subsequence.',
    category: 'coding',
    difficulty: 'medium',
    points: 250,
    timeLimit: 30,
    question: `Given an integer array nums, return the length of the longest strictly increasing subsequence.\n\nA subsequence is derived by deleting some elements without changing the order of remaining elements.\n\nExample:\nInput: [10,9,2,5,3,7,101,18] → Output: 4\nThe LIS is [2,3,7,101] or [2,5,7,101]`,
    sampleInput: 'nums = [10,9,2,5,3,7,101,18]',
    sampleOutput: '4',
    expectedAnswer: 'DP: dp[i] = length of LIS ending at index i. Or use binary search with patience sorting for O(n log n).',
    hints: ['DP approach: dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i].', 'O(n²) DP works but can be slow.', 'O(n log n): maintain a "tails" array and use binary search.'],
    solution: `function lengthOfLIS(nums) {\n  const tails = [];\n  for (const num of nums) {\n    let lo = 0, hi = tails.length;\n    while (lo < hi) {\n      const mid = (lo + hi) >> 1;\n      if (tails[mid] < num) lo = mid + 1; else hi = mid;\n    }\n    tails[lo] = num;\n  }\n  return tails.length;\n}`,
    tags: ['dynamic-programming', 'binary-search'],
    activeDate: getDay(26),
    isActive: true
  },
  // Day 28 - System Design
  {
    title: 'Design a Chat Application',
    description: 'System design: Design a real-time messaging system.',
    category: 'system-design',
    difficulty: 'hard',
    points: 300,
    timeLimit: 45,
    question: `Design a real-time chat application like WhatsApp/Slack.\n\nFeatures:\n1. 1-on-1 and group messaging\n2. Online/offline status\n3. Message delivery receipts (sent, delivered, read)\n4. File/image sharing\n5. Support 500M daily active users\n\nDiscuss:\n- WebSocket vs Long Polling\n- Message storage and retrieval\n- Push notifications for offline users\n- Message ordering and consistency\n- Media storage\n- End-to-end encryption approach`,
    hints: ['WebSocket for real-time, with fallback to long polling.', 'Separate chat service and notification service.', 'Use message queues for reliability.', 'Consider CDN for media files.'],
    expectedAnswer: 'WebSocket connections, message queue for reliability, separate storage for messages and media, push notifications via FCM/APNs, horizontal scaling with consistent hashing.',
    tags: ['system-design', 'websocket', 'distributed-systems', 'messaging'],
    activeDate: getDay(27),
    isActive: true
  },
  // Day 29 - Medium
  {
    title: 'Subsets',
    description: 'Generate all possible subsets (the power set) of an array.',
    category: 'coding',
    difficulty: 'medium',
    points: 200,
    timeLimit: 25,
    question: `Given an integer array nums of unique elements, return all possible subsets (the power set). No duplicate subsets.\n\nExample:\nInput: [1,2,3]\nOutput: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]`,
    sampleInput: 'nums = [1,2,3]',
    sampleOutput: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
    expectedAnswer: 'Backtracking: for each element, choose to include or exclude. Or iteratively build by adding each num to existing subsets.',
    hints: ['Each element has 2 choices: include or exclude.', 'Total subsets = 2^n.', 'Backtracking or iterative approach both work.', 'Iterative: start with [[]], for each num, add num to copies of existing subsets.'],
    solution: `function subsets(nums) {\n  const result = [[]];\n  for (const num of nums) {\n    const len = result.length;\n    for (let i = 0; i < len; i++) {\n      result.push([...result[i], num]);\n    }\n  }\n  return result;\n}`,
    tags: ['backtracking', 'bit-manipulation', 'array'],
    activeDate: getDay(28),
    isActive: true
  },
  // Day 30 - Hard
  {
    title: 'Median of Two Sorted Arrays',
    description: 'Find the median of two sorted arrays in O(log(m+n)) time.',
    category: 'coding',
    difficulty: 'hard',
    points: 350,
    timeLimit: 45,
    question: `Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays.\n\nThe overall runtime complexity should be O(log(m+n)).\n\nExample:\nInput: nums1 = [1,3], nums2 = [2] → Output: 2.0\nInput: nums1 = [1,2], nums2 = [3,4] → Output: 2.5`,
    sampleInput: 'nums1 = [1,3], nums2 = [2]',
    sampleOutput: '2.0',
    expectedAnswer: 'Binary search on the smaller array to find the correct partition point.',
    hints: ['Merging is O(m+n) — can we do better?', 'Binary search on the smaller array.', 'Find partition where all left elements < all right elements.', 'Partition1 + Partition2 = (m+n+1)/2.'],
    solution: `function findMedianSortedArrays(nums1, nums2) {\n  if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];\n  const m = nums1.length, n = nums2.length;\n  let lo = 0, hi = m;\n  while (lo <= hi) {\n    const px = (lo + hi) >> 1;\n    const py = ((m + n + 1) >> 1) - px;\n    const lx = px === 0 ? -Infinity : nums1[px-1];\n    const rx = px === m ? Infinity : nums1[px];\n    const ly = py === 0 ? -Infinity : nums2[py-1];\n    const ry = py === n ? Infinity : nums2[py];\n    if (lx <= ry && ly <= rx) {\n      return (m+n) % 2 === 0\n        ? (Math.max(lx,ly) + Math.min(rx,ry)) / 2\n        : Math.max(lx, ly);\n    } else if (lx > ry) hi = px - 1;\n    else lo = px + 1;\n  }\n}`,
    tags: ['array', 'binary-search', 'divide-and-conquer'],
    activeDate: getDay(29),
    isActive: true
  },
];

// Helper: get date for day N from today
function getDay(offset) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}

// ===========================
// INTERVIEW QUESTIONS (seed for /questions page)
// ===========================
const interviewQuestions = [
  // DSA
  { text: 'Explain the difference between an Array and a Linked List. When would you use one over the other?', category: 'dsa', difficulty: 'easy', type: 'conceptual', tags: ['arrays', 'linked-list', 'data-structures'], expectedAnswer: 'Arrays: contiguous memory, O(1) random access, O(n) insert. Linked Lists: non-contiguous, O(1) insert at head, O(n) access. Use arrays for random access, linked lists for frequent insertions/deletions.', keyPoints: ['Memory layout', 'Time complexity', 'Use cases'], hints: ['Think about memory allocation', 'Consider access patterns'], recommendedTimeMinutes: 5, isApproved: true },
  { text: 'Implement a function to reverse a linked list. What is the time and space complexity?', category: 'dsa', difficulty: 'medium', type: 'coding', tags: ['linked-list', 'pointers'], expectedAnswer: 'Use three pointers: prev, current, next. Iterate and reverse each link. O(n) time, O(1) space.', keyPoints: ['Three pointer technique', 'O(n) time'], hints: ['Track previous node', 'Save next before changing link'], recommendedTimeMinutes: 10, isApproved: true },
  { text: 'What is the difference between BFS and DFS? When would you use each?', category: 'dsa', difficulty: 'medium', type: 'conceptual', tags: ['graph', 'bfs', 'dfs'], expectedAnswer: 'BFS: Level-by-level using queue. Good for shortest path in unweighted graphs. DFS: Depth-first using stack/recursion. Good for cycle detection, topological sort.', keyPoints: ['Queue vs Stack', 'Shortest path vs exhaustive search'], hints: ['Think about when order matters', 'Consider memory usage'], recommendedTimeMinutes: 5, isApproved: true },
  { text: 'Explain Dynamic Programming. What are memoization and tabulation?', category: 'dsa', difficulty: 'hard', type: 'conceptual', tags: ['dynamic-programming', 'memoization'], expectedAnswer: 'DP solves problems with overlapping subproblems and optimal substructure. Memoization: top-down with caching. Tabulation: bottom-up iterative approach.', keyPoints: ['Overlapping subproblems', 'Optimal substructure', 'Top-down vs bottom-up'], hints: ['When does recursion repeat work?', 'How to store results?'], recommendedTimeMinutes: 8, isApproved: true },
  { text: 'How does a hash table work? How are collisions handled?', category: 'dsa', difficulty: 'medium', type: 'conceptual', tags: ['hash-table', 'data-structures'], expectedAnswer: 'Hash function maps keys to indices. Collisions handled via chaining (linked lists at each bucket) or open addressing (probing for next empty slot). Average O(1) operations.', keyPoints: ['Hash function', 'Chaining vs open addressing', 'Load factor'], hints: ['What happens when two keys map to same index?', 'What is the load factor?'], recommendedTimeMinutes: 5, isApproved: true },
  // Technical
  { text: 'Explain the difference between SQL and NoSQL databases. Give examples of when to use each.', category: 'database', difficulty: 'medium', type: 'conceptual', tags: ['database', 'sql', 'nosql'], expectedAnswer: 'SQL: Structured, ACID-compliant, relational (PostgreSQL, MySQL). NoSQL: Flexible schema, horizontally scalable, various models (MongoDB, Redis, Cassandra). Use SQL for complex queries and transactions; NoSQL for high scalability and flexible data.', keyPoints: ['ACID vs BASE', 'Schema flexibility', 'Scalability'], hints: ['Consider data relationships', 'Think about scale requirements'], recommendedTimeMinutes: 5, isApproved: true },
  { text: 'What is REST? What are the key principles of RESTful API design?', category: 'web', difficulty: 'easy', type: 'conceptual', tags: ['api', 'rest', 'web'], expectedAnswer: 'REST: Representational State Transfer. Principles: stateless, client-server, cacheable, uniform interface (HTTP methods: GET, POST, PUT, DELETE), resource-based URLs.', keyPoints: ['Stateless', 'HTTP methods', 'Resource-based URLs', 'Status codes'], hints: ['Think about HTTP verbs', 'Resources are nouns, not verbs'], recommendedTimeMinutes: 5, isApproved: true },
  { text: 'Explain the concept of microservices vs monolithic architecture.', category: 'system-design', difficulty: 'medium', type: 'conceptual', tags: ['architecture', 'microservices', 'system-design'], expectedAnswer: 'Monolithic: single deployable unit, simpler initially but harder to scale. Microservices: independent services communicating via APIs, independently deployable and scalable, but adds complexity (orchestration, monitoring, data consistency).', keyPoints: ['Independent deployment', 'Service communication', 'Data management', 'Trade-offs'], hints: ['Consider team size and project complexity', 'Think about deployment frequency'], recommendedTimeMinutes: 8, isApproved: true },
  { text: 'What is the virtual DOM in React and how does it improve performance?', category: 'web', difficulty: 'medium', type: 'conceptual', tags: ['react', 'frontend', 'performance'], expectedAnswer: 'Virtual DOM is a lightweight in-memory representation of the actual DOM. React creates a virtual copy, diffs it with the previous version (reconciliation), and batch-updates only the changed parts of the real DOM. This minimizes expensive DOM operations.', keyPoints: ['Reconciliation algorithm', 'Batch updates', 'Diffing process'], hints: ['DOM operations are expensive', 'How does React know what changed?'], recommendedTimeMinutes: 5, isApproved: true },
  { text: 'Explain the event loop in Node.js. How does it handle asynchronous operations?', category: 'web', difficulty: 'hard', type: 'conceptual', tags: ['nodejs', 'javascript', 'async'], expectedAnswer: 'Node.js uses a single-threaded event loop with a non-blocking I/O model. The event loop processes callbacks from the callback queue when the call stack is empty. Async operations (I/O, timers) are offloaded to the system kernel or thread pool (libuv). Phases: timers, pending callbacks, poll, check, close callbacks.', keyPoints: ['Single-threaded', 'Non-blocking I/O', 'Event loop phases', 'Callback queue'], hints: ['What happens when an async operation completes?', 'How are phases ordered?'], recommendedTimeMinutes: 8, isApproved: true },
  // Behavioral
  { text: 'Tell me about a time you had to work with a difficult team member. How did you handle it?', category: 'behavioral', difficulty: 'medium', type: 'behavioral', tags: ['teamwork', 'conflict', 'communication'], expectedAnswer: 'Use STAR method. Show empathy, active listening, professional approach to resolving the conflict, and a positive outcome.', keyPoints: ['Professional approach', 'Active listening', 'Resolution', 'Outcome'], hints: ['Use STAR method', 'Focus on YOUR actions'], recommendedTimeMinutes: 5, isApproved: true },
  { text: 'Describe a project you are most proud of. What was your role and what impact did it have?', category: 'behavioral', difficulty: 'easy', type: 'behavioral', tags: ['achievement', 'impact', 'leadership'], expectedAnswer: 'Describe a specific project with clear scope, your individual contributions, technologies used, challenges overcome, and quantifiable impact (users served, performance improved, revenue generated).', keyPoints: ['Specific contributions', 'Quantifiable impact', 'Challenges overcome'], hints: ['Pick a project with measurable results', 'Highlight YOUR role specifically'], recommendedTimeMinutes: 5, isApproved: true },
  { text: 'How do you handle tight deadlines and pressure?', category: 'behavioral', difficulty: 'easy', type: 'behavioral', tags: ['time-management', 'pressure', 'prioritization'], expectedAnswer: 'Discuss prioritization strategies, breaking tasks into milestones, communicating with stakeholders about timelines, and staying calm under pressure. Give a specific example.', keyPoints: ['Prioritization', 'Communication', 'Time management'], hints: ['Give a specific example', 'Show your process'], recommendedTimeMinutes: 5, isApproved: true },
  // System Design
  { text: 'Design a notification system that can handle millions of users.', category: 'system-design', difficulty: 'hard', type: 'system-design', tags: ['system-design', 'distributed-systems', 'messaging'], expectedAnswer: 'Use message queue for decoupling. Separate services for different channels (push, email, SMS). Template engine for content. Priority system for urgent vs regular. Rate limiting per user. User preference storage. Retry mechanism with exponential backoff.', keyPoints: ['Message queue', 'Channel-specific services', 'Rate limiting', 'Retry mechanism'], hints: ['Think about different notification channels', 'Consider scale and reliability'], recommendedTimeMinutes: 30, isApproved: true },
  { text: 'Design a URL shortening service like TinyURL.', category: 'system-design', difficulty: 'medium', type: 'system-design', tags: ['system-design', 'database', 'api'], expectedAnswer: 'Base62 encoding of auto-incrementing IDs. Database with index on short code. Redis cache for popular URLs. Load balancer + multiple app servers. 301 redirect for SEO.', keyPoints: ['Encoding strategy', 'Database design', 'Caching', 'Redirect type'], hints: ['How to generate unique short codes?', 'How to handle high read traffic?'], recommendedTimeMinutes: 25, isApproved: true },
];

// ===========================
// MAIN SEED FUNCTION
// ===========================
async function seedProduction() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI not found in .env');
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // 1. Seed Daily Challenges
    console.log('\n📝 Seeding Daily Challenges...');
    const existingChallenges = await DailyChallenge.countDocuments();
    if (existingChallenges > 0) {
      console.log(`  Found ${existingChallenges} existing challenges. Clearing and re-seeding...`);
      await DailyChallenge.deleteMany({});
    }
    const insertedChallenges = await DailyChallenge.insertMany(dailyChallenges);
    console.log(`  ✅ Seeded ${insertedChallenges.length} daily challenges`);
    const easy = insertedChallenges.filter(c => c.difficulty === 'easy').length;
    const med = insertedChallenges.filter(c => c.difficulty === 'medium').length;
    const hard = insertedChallenges.filter(c => c.difficulty === 'hard').length;
    console.log(`  Distribution: ${easy} easy, ${med} medium, ${hard} hard`);

    // 2. Seed Interview Questions
    console.log('\n📋 Seeding Interview Questions...');
    const existingQs = await Question.countDocuments();
    if (existingQs === 0) {
      const insertedQs = await Question.insertMany(interviewQuestions);
      console.log(`  ✅ Seeded ${insertedQs.length} interview questions`);
    } else {
      console.log(`  ⏭️  Skipped — ${existingQs} questions already exist`);
    }

    // 3. Seed Tips, Career Paths, Skills if models exist
    try {
      const { InterviewTip } = require('../models/Tip.model');
      const existingTips = await InterviewTip.countDocuments();
      if (existingTips === 0) {
        const tips = [
          { title: 'Master the STAR Method', content: 'The STAR method (Situation, Task, Action, Result) is your go-to framework for behavioral interviews. Prepare 5-7 stories that can be adapted to different questions. Always quantify results when possible.', summary: 'Structure behavioral answers with STAR', category: 'behavioral', tags: ['star-method', 'behavioral'], difficulty: 'beginner', isFeatured: true },
          { title: 'Think Out Loud', content: 'Interviewers want to see your thought process, not just the answer. Narrate as you solve: clarify the problem, discuss approaches, explain trade-offs, then code step by step.', summary: 'Verbalize your problem-solving process', category: 'technical', tags: ['communication', 'coding'], difficulty: 'intermediate', isFeatured: true },
          { title: 'Research the Company', content: 'Go beyond the About page. Study recent news, tech blog, products, competitors, and company values. Tailor your examples and questions to show genuine interest.', summary: 'Deep research helps you stand out', category: 'preparation', tags: ['research', 'preparation'], difficulty: 'beginner', isFeatured: true },
          { title: 'Handle "I Don\'t Know" Gracefully', content: 'It\'s okay not to know everything. Say "I haven\'t worked with X, but here\'s what I do know..." or "I\'d approach learning this by..." Interviewers value honesty and learning ability.', summary: 'Turn gaps into learning opportunities', category: 'communication', tags: ['honesty', 'soft-skills'], difficulty: 'intermediate' },
          { title: 'Salary Negotiation 101', content: 'Research market rates on Levels.fyi and Glassdoor. Let them make the first offer. Express enthusiasm before negotiating. Consider total compensation. Use ranges, not specific numbers.', summary: 'Research, prepare, and negotiate confidently', category: 'negotiation', tags: ['salary', 'negotiation'], difficulty: 'advanced', isFeatured: true },
          { title: 'Virtual Interview Setup', content: 'Test camera, mic, and internet beforehand. Use headphones, choose a quiet well-lit space, position camera at eye level. Have water nearby. Close unnecessary apps. Look at the camera when speaking.', summary: 'Technical and environment setup for remote interviews', category: 'remote', tags: ['remote', 'video-interview'], difficulty: 'beginner' },
        ];
        await InterviewTip.insertMany(tips);
        console.log(`  ✅ Seeded ${tips.length} interview tips`);
      } else {
        console.log(`  ⏭️  Skipped tips — ${existingTips} already exist`);
      }
    } catch (e) { console.log('  ⏭️  Tips model not available, skipping'); }

    try {
      const { SkillCategory } = require('../models/Skill.model');
      const existingSkills = await SkillCategory.countDocuments();
      if (existingSkills === 0) {
        const skills = [
          { name: 'data-structures', displayName: 'Data Structures', description: 'Arrays, linked lists, trees, graphs', icon: '🏗️', color: '#3B82F6', subSkills: [{ name: 'Arrays', weight: 1 }, { name: 'Linked Lists', weight: 1 }, { name: 'Trees', weight: 1.5 }, { name: 'Graphs', weight: 1.5 }, { name: 'Hash Tables', weight: 1 }] },
          { name: 'algorithms', displayName: 'Algorithms', description: 'Sorting, searching, dynamic programming', icon: '⚡', color: '#10B981', subSkills: [{ name: 'Sorting', weight: 1 }, { name: 'Searching', weight: 1 }, { name: 'Dynamic Programming', weight: 2 }, { name: 'Recursion', weight: 1 }, { name: 'Greedy', weight: 1 }] },
          { name: 'system-design', displayName: 'System Design', description: 'Designing scalable distributed systems', icon: '🏢', color: '#8B5CF6', subSkills: [{ name: 'Scalability', weight: 1.5 }, { name: 'Database Design', weight: 1 }, { name: 'Caching', weight: 1 }, { name: 'Load Balancing', weight: 1 }] },
          { name: 'problem-solving', displayName: 'Problem Solving', description: 'Breaking down complex problems', icon: '🧩', color: '#F59E0B', subSkills: [{ name: 'Analysis', weight: 1 }, { name: 'Pattern Recognition', weight: 1.5 }, { name: 'Optimization', weight: 1 }] },
          { name: 'communication', displayName: 'Communication', description: 'Explaining your thought process', icon: '💬', color: '#EC4899', subSkills: [{ name: 'Clarity', weight: 1 }, { name: 'Technical Explanation', weight: 1.5 }, { name: 'Active Listening', weight: 1 }] },
          { name: 'behavioral', displayName: 'Behavioral', description: 'STAR method and soft skills', icon: '🤝', color: '#6366F1', subSkills: [{ name: 'STAR Method', weight: 1.5 }, { name: 'Leadership', weight: 1 }, { name: 'Teamwork', weight: 1 }] },
        ];
        await SkillCategory.insertMany(skills);
        console.log(`  ✅ Seeded ${skills.length} skill categories`);
      } else {
        console.log(`  ⏭️  Skipped skills — ${existingSkills} already exist`);
      }
    } catch (e) { console.log('  ⏭️  Skill model not available, skipping'); }

    try {
      const { CareerPath } = require('../models/Career.model');
      const existingPaths = await CareerPath.countDocuments();
      if (existingPaths === 0) {
        const paths = [
          { name: 'Frontend Developer', description: 'Build beautiful, responsive UIs', icon: '🎨', color: '#3B82F6', estimatedDuration: '6-9 months', salaryRange: { min: 60000, max: 150000, currency: 'USD' }, demandLevel: 'very-high', milestones: [{ order: 1, title: 'HTML & CSS', description: 'Master web fundamentals', skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid'], estimatedTime: '3 weeks', isRequired: true }, { order: 2, title: 'JavaScript', description: 'Learn modern ES6+', skills: ['JavaScript', 'ES6+', 'DOM', 'Async'], estimatedTime: '5 weeks', isRequired: true }, { order: 3, title: 'React', description: 'Build apps with React', skills: ['React', 'Hooks', 'State Management'], estimatedTime: '5 weeks', isRequired: true }, { order: 4, title: 'Portfolio', description: 'Build showcase projects', skills: ['Git', 'Deployment', 'Testing'], estimatedTime: '6 weeks', isRequired: true }], prerequisites: ['Basic computer skills'] },
          { name: 'Backend Developer', description: 'Build scalable server-side apps', icon: '⚙️', color: '#10B981', estimatedDuration: '8-12 months', salaryRange: { min: 70000, max: 180000, currency: 'USD' }, demandLevel: 'very-high', milestones: [{ order: 1, title: 'Programming Fundamentals', description: 'Master a backend language', skills: ['Node.js', 'Data Structures', 'Algorithms'], estimatedTime: '7 weeks', isRequired: true }, { order: 2, title: 'Databases', description: 'SQL and NoSQL', skills: ['PostgreSQL', 'MongoDB', 'Redis'], estimatedTime: '5 weeks', isRequired: true }, { order: 3, title: 'API Development', description: 'REST and GraphQL', skills: ['REST', 'GraphQL', 'Auth'], estimatedTime: '5 weeks', isRequired: true }, { order: 4, title: 'System Design', description: 'Scalable architecture', skills: ['Microservices', 'Caching', 'Load Balancing'], estimatedTime: '7 weeks', isRequired: true }], prerequisites: ['Basic programming'] },
          { name: 'Full Stack Developer', description: 'Master frontend and backend', icon: '🚀', color: '#8B5CF6', estimatedDuration: '12-18 months', salaryRange: { min: 80000, max: 200000, currency: 'USD' }, demandLevel: 'very-high', milestones: [{ order: 1, title: 'Frontend', description: 'HTML/CSS/JS + React', skills: ['HTML', 'CSS', 'JavaScript', 'React'], estimatedTime: '10 weeks', isRequired: true }, { order: 2, title: 'Backend', description: 'Node.js + Databases', skills: ['Node.js', 'Express', 'MongoDB'], estimatedTime: '10 weeks', isRequired: true }, { order: 3, title: 'DevOps', description: 'Deployment + CI/CD', skills: ['Docker', 'CI/CD', 'Cloud'], estimatedTime: '5 weeks', isRequired: true }, { order: 4, title: 'Projects', description: 'Full-stack apps', skills: ['E2E Testing', 'Performance'], estimatedTime: '10 weeks', isRequired: true }], prerequisites: ['Dedication to learn'] },
          { name: 'Data Scientist', description: 'Extract insights with ML', icon: '📊', color: '#F59E0B', estimatedDuration: '9-15 months', salaryRange: { min: 90000, max: 200000, currency: 'USD' }, demandLevel: 'high', milestones: [{ order: 1, title: 'Python & Stats', description: 'Foundation', skills: ['Python', 'NumPy', 'Pandas', 'Statistics'], estimatedTime: '7 weeks', isRequired: true }, { order: 2, title: 'Machine Learning', description: 'ML algorithms', skills: ['Scikit-learn', 'TensorFlow', 'ML Algorithms'], estimatedTime: '10 weeks', isRequired: true }, { order: 3, title: 'Data Viz', description: 'Communicate insights', skills: ['Matplotlib', 'Seaborn', 'Tableau'], estimatedTime: '5 weeks', isRequired: true }], prerequisites: ['Math background helpful'] },
        ];
        const created = await CareerPath.insertMany(paths);
        for (const p of created) { p.totalMilestones = p.milestones.length; await p.save(); }
        console.log(`  ✅ Seeded ${paths.length} career paths`);
      } else {
        console.log(`  ⏭️  Skipped career paths — ${existingPaths} already exist`);
      }
    } catch (e) { console.log('  ⏭️  Career model not available, skipping'); }

    console.log('\n🎉 Production seed completed successfully!');
    console.log('='.repeat(50));
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedProduction();
