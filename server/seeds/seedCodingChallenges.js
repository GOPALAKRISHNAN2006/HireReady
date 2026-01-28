/**
 * ===========================================
 * Seed Coding Challenges - LeetCode-Style Problems
 * ===========================================
 * 
 * Run with: node seeds/seedCodingChallenges.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { DailyChallenge } = require('../models/DailyChallenge.model');

const codingChallenges = [
  // Easy Problems
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    category: "coding",
    difficulty: "easy",
    points: 100,
    timeLimit: 20,
    question: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
    sampleInput: `nums = [2, 7, 11, 15], target = 9`,
    sampleOutput: `[0, 1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    expectedAnswer: "Use a hash map to store each number and its index as you iterate through the array. For each number, check if (target - current number) exists in the hash map.",
    hints: [
      "A brute force approach would check every pair of numbers - O(n²) time complexity.",
      "Can you reduce the time complexity using a hash map?",
      "For each number, calculate what number you need to find (target - current).",
      "Store each number and its index in a hash map for O(1) lookup."
    ],
    solution: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
    testCases: [
      { input: "[2, 7, 11, 15], 9", expectedOutput: "[0, 1]", isHidden: false },
      { input: "[3, 2, 4], 6", expectedOutput: "[1, 2]", isHidden: false },
      { input: "[3, 3], 6", expectedOutput: "[0, 1]", isHidden: true },
      { input: "[1, 5, 8, 3, 9], 12", expectedOutput: "[2, 3]", isHidden: true }
    ],
    tags: ["array", "hash-table", "easy"],
    activeDate: new Date(),
    isActive: true
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    category: "coding",
    difficulty: "easy",
    points: 100,
    timeLimit: 15,
    question: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Constraints:
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'`,
    sampleInput: `s = "()[]{}"`,
    sampleOutput: `true`,
    expectedAnswer: "Use a stack to keep track of opening brackets. When you encounter a closing bracket, check if it matches the top of the stack.",
    hints: [
      "Think about using a stack data structure.",
      "Push opening brackets onto the stack.",
      "When you see a closing bracket, the top of the stack should be its matching opening bracket.",
      "At the end, the stack should be empty for a valid string."
    ],
    solution: `function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    
    for (const char of s) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            if (stack.pop() !== map[char]) {
                return false;
            }
        }
    }
    return stack.length === 0;
}`,
    testCases: [
      { input: '"()"', expectedOutput: "true", isHidden: false },
      { input: '"()[]{}"', expectedOutput: "true", isHidden: false },
      { input: '"(]"', expectedOutput: "false", isHidden: false },
      { input: '"([)]"', expectedOutput: "false", isHidden: true },
      { input: '"{[]}"', expectedOutput: "true", isHidden: true }
    ],
    tags: ["string", "stack", "easy"],
    activeDate: new Date(Date.now() + 86400000), // Tomorrow
    isActive: true
  },
  {
    title: "Reverse Linked List",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    category: "coding",
    difficulty: "easy",
    points: 100,
    timeLimit: 20,
    question: `Given the head of a singly linked list, reverse the list, and return the reversed list.

Constraints:
- The number of nodes in the list is in the range [0, 5000].
- -5000 <= Node.val <= 5000

Follow up: A linked list can be reversed either iteratively or recursively. Could you implement both?`,
    sampleInput: `head = [1, 2, 3, 4, 5]`,
    sampleOutput: `[5, 4, 3, 2, 1]`,
    expectedAnswer: "Use three pointers: prev, current, and next. Iterate through the list and reverse each link.",
    hints: [
      "Keep track of the previous node as you traverse.",
      "Before changing next of current, store next node.",
      "Change next of current to previous.",
      "Move prev and current one step forward."
    ],
    solution: `function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current !== null) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}`,
    testCases: [
      { input: "[1, 2, 3, 4, 5]", expectedOutput: "[5, 4, 3, 2, 1]", isHidden: false },
      { input: "[1, 2]", expectedOutput: "[2, 1]", isHidden: false },
      { input: "[]", expectedOutput: "[]", isHidden: true }
    ],
    tags: ["linked-list", "recursion", "easy"],
    activeDate: new Date(Date.now() + 172800000), // Day after tomorrow
    isActive: true
  },

  // Medium Problems
  {
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    category: "coding",
    difficulty: "medium",
    points: 200,
    timeLimit: 30,
    question: `Given a string s, find the length of the longest substring without repeating characters.

Constraints:
- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.`,
    sampleInput: `s = "abcabcbb"`,
    sampleOutput: `3
Explanation: The answer is "abc", with the length of 3.`,
    expectedAnswer: "Use the sliding window technique with a hash set to track characters in the current window.",
    hints: [
      "Use a sliding window approach with two pointers.",
      "Use a Set or Map to track characters in the current window.",
      "When you find a duplicate, shrink the window from the left.",
      "Keep track of the maximum length seen."
    ],
    solution: `function lengthOfLongestSubstring(s) {
    let maxLength = 0;
    let left = 0;
    const charSet = new Set();
    
    for (let right = 0; right < s.length; right++) {
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
    testCases: [
      { input: '"abcabcbb"', expectedOutput: "3", isHidden: false },
      { input: '"bbbbb"', expectedOutput: "1", isHidden: false },
      { input: '"pwwkew"', expectedOutput: "3", isHidden: false },
      { input: '""', expectedOutput: "0", isHidden: true },
      { input: '"dvdf"', expectedOutput: "3", isHidden: true }
    ],
    tags: ["hash-table", "string", "sliding-window", "medium"],
    activeDate: new Date(Date.now() + 259200000),
    isActive: true
  },
  {
    title: "Binary Tree Level Order Traversal",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    category: "coding",
    difficulty: "medium",
    points: 200,
    timeLimit: 25,
    question: `Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

Constraints:
- The number of nodes in the tree is in the range [0, 2000].
- -1000 <= Node.val <= 1000`,
    sampleInput: `root = [3, 9, 20, null, null, 15, 7]`,
    sampleOutput: `[[3], [9, 20], [15, 7]]`,
    expectedAnswer: "Use Breadth-First Search (BFS) with a queue to traverse the tree level by level.",
    hints: [
      "Use BFS (Breadth-First Search) approach.",
      "Use a queue to process nodes level by level.",
      "For each level, process all nodes currently in the queue.",
      "Add children of processed nodes for the next level."
    ],
    solution: `function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}`,
    testCases: [
      { input: "[3, 9, 20, null, null, 15, 7]", expectedOutput: "[[3], [9, 20], [15, 7]]", isHidden: false },
      { input: "[1]", expectedOutput: "[[1]]", isHidden: false },
      { input: "[]", expectedOutput: "[]", isHidden: true }
    ],
    tags: ["tree", "bfs", "binary-tree", "medium"],
    activeDate: new Date(Date.now() + 345600000),
    isActive: true
  },
  {
    title: "Container With Most Water",
    description: "You are given an integer array height of length n. Find two lines that together with the x-axis form a container that contains the most water.",
    category: "coding",
    difficulty: "medium",
    points: 200,
    timeLimit: 25,
    question: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.

Constraints:
- n == height.length
- 2 <= n <= 10^5
- 0 <= height[i] <= 10^4`,
    sampleInput: `height = [1, 8, 6, 2, 5, 4, 8, 3, 7]`,
    sampleOutput: `49
Explanation: The max area is between indices 1 and 8 (height 8 and 7) = min(8, 7) * (8 - 1) = 49`,
    expectedAnswer: "Use two pointers starting from both ends. Move the pointer pointing to the shorter line inward.",
    hints: [
      "Area = width × min(height[left], height[right])",
      "Start with maximum width (left at 0, right at end).",
      "Always move the pointer pointing to the shorter line.",
      "The shorter line limits the height, so moving it might find a taller one."
    ],
    solution: `function maxArea(height) {
    let maxWater = 0;
    let left = 0;
    let right = height.length - 1;
    
    while (left < right) {
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        maxWater = Math.max(maxWater, width * h);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}`,
    testCases: [
      { input: "[1, 8, 6, 2, 5, 4, 8, 3, 7]", expectedOutput: "49", isHidden: false },
      { input: "[1, 1]", expectedOutput: "1", isHidden: false },
      { input: "[4, 3, 2, 1, 4]", expectedOutput: "16", isHidden: true },
      { input: "[1, 2, 1]", expectedOutput: "2", isHidden: true }
    ],
    tags: ["array", "two-pointers", "greedy", "medium"],
    activeDate: new Date(Date.now() + 432000000),
    isActive: true
  },

  // Hard Problems
  {
    title: "Merge K Sorted Lists",
    description: "You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    category: "coding",
    difficulty: "hard",
    points: 300,
    timeLimit: 45,
    question: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

Constraints:
- k == lists.length
- 0 <= k <= 10^4
- 0 <= lists[i].length <= 500
- -10^4 <= lists[i][j] <= 10^4
- lists[i] is sorted in ascending order.
- The sum of lists[i].length will not exceed 10^4.`,
    sampleInput: `lists = [[1, 4, 5], [1, 3, 4], [2, 6]]`,
    sampleOutput: `[1, 1, 2, 3, 4, 4, 5, 6]`,
    expectedAnswer: "Use a min-heap (priority queue) to efficiently get the smallest element among all list heads, or use divide and conquer to merge pairs of lists.",
    hints: [
      "Compare all k list heads and pick the smallest - but this is O(kN).",
      "Use a min-heap to optimize getting the minimum to O(log k).",
      "Alternatively, use divide and conquer: merge pairs of lists recursively.",
      "Divide and conquer: merge lists[0] with lists[k/2], lists[1] with lists[k/2+1], etc."
    ],
    solution: `function mergeKLists(lists) {
    if (lists.length === 0) return null;
    
    // Divide and conquer approach
    while (lists.length > 1) {
        const mergedLists = [];
        for (let i = 0; i < lists.length; i += 2) {
            const l1 = lists[i];
            const l2 = i + 1 < lists.length ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(l1, l2));
        }
        lists = mergedLists;
    }
    
    return lists[0];
}

function mergeTwoLists(l1, l2) {
    const dummy = { next: null };
    let current = dummy;
    
    while (l1 && l2) {
        if (l1.val <= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    
    current.next = l1 || l2;
    return dummy.next;
}`,
    testCases: [
      { input: "[[1, 4, 5], [1, 3, 4], [2, 6]]", expectedOutput: "[1, 1, 2, 3, 4, 4, 5, 6]", isHidden: false },
      { input: "[]", expectedOutput: "[]", isHidden: false },
      { input: "[[]]", expectedOutput: "[]", isHidden: true }
    ],
    tags: ["linked-list", "heap", "divide-and-conquer", "hard"],
    activeDate: new Date(Date.now() + 518400000),
    isActive: true
  },
  {
    title: "Trapping Rain Water",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    category: "coding",
    difficulty: "hard",
    points: 300,
    timeLimit: 40,
    question: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

Constraints:
- n == height.length
- 1 <= n <= 2 * 10^4
- 0 <= height[i] <= 10^5`,
    sampleInput: `height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`,
    sampleOutput: `6
Explanation: The elevation map can trap 6 units of rain water.`,
    expectedAnswer: "For each position, water trapped = min(maxLeft, maxRight) - height[i]. Use two pointers or precompute max arrays.",
    hints: [
      "Water at position i depends on the minimum of max heights on left and right.",
      "Brute force: for each position, find max on left and right - O(n²).",
      "Optimization: precompute left max and right max arrays - O(n) space.",
      "Best: use two pointers from both ends - O(1) space."
    ],
    solution: `function trap(height) {
    if (height.length === 0) return 0;
    
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let water = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                water += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                water += rightMax - height[right];
            }
            right--;
        }
    }
    
    return water;
}`,
    testCases: [
      { input: "[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]", expectedOutput: "6", isHidden: false },
      { input: "[4, 2, 0, 3, 2, 5]", expectedOutput: "9", isHidden: false },
      { input: "[1, 2, 3, 4, 5]", expectedOutput: "0", isHidden: true },
      { input: "[5, 4, 3, 2, 1]", expectedOutput: "0", isHidden: true }
    ],
    tags: ["array", "two-pointers", "dynamic-programming", "hard"],
    activeDate: new Date(Date.now() + 604800000),
    isActive: true
  },
  {
    title: "Median of Two Sorted Arrays",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    category: "coding",
    difficulty: "hard",
    points: 350,
    timeLimit: 45,
    question: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).

Constraints:
- nums1.length == m
- nums2.length == n
- 0 <= m <= 1000
- 0 <= n <= 1000
- 1 <= m + n <= 2000
- -10^6 <= nums1[i], nums2[i] <= 10^6`,
    sampleInput: `nums1 = [1, 3], nums2 = [2]`,
    sampleOutput: `2.0
Explanation: merged array = [1, 2, 3] and median is 2.`,
    expectedAnswer: "Use binary search on the smaller array to find the correct partition where left elements of both arrays are smaller than right elements of both arrays.",
    hints: [
      "Merging arrays and finding median is O(m+n) - can we do better?",
      "Binary search can achieve O(log(min(m,n))).",
      "Partition both arrays such that left half has (m+n+1)/2 elements.",
      "Binary search for the partition position in the smaller array."
    ],
    solution: `function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) {
        [nums1, nums2] = [nums2, nums1];
    }
    
    const m = nums1.length, n = nums2.length;
    let low = 0, high = m;
    
    while (low <= high) {
        const partitionX = Math.floor((low + high) / 2);
        const partitionY = Math.floor((m + n + 1) / 2) - partitionX;
        
        const maxLeftX = partitionX === 0 ? -Infinity : nums1[partitionX - 1];
        const minRightX = partitionX === m ? Infinity : nums1[partitionX];
        const maxLeftY = partitionY === 0 ? -Infinity : nums2[partitionY - 1];
        const minRightY = partitionY === n ? Infinity : nums2[partitionY];
        
        if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
            if ((m + n) % 2 === 0) {
                return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2;
            }
            return Math.max(maxLeftX, maxLeftY);
        } else if (maxLeftX > minRightY) {
            high = partitionX - 1;
        } else {
            low = partitionX + 1;
        }
    }
}`,
    testCases: [
      { input: "[1, 3], [2]", expectedOutput: "2.0", isHidden: false },
      { input: "[1, 2], [3, 4]", expectedOutput: "2.5", isHidden: false },
      { input: "[0, 0], [0, 0]", expectedOutput: "0.0", isHidden: true },
      { input: "[], [1]", expectedOutput: "1.0", isHidden: true }
    ],
    tags: ["array", "binary-search", "divide-and-conquer", "hard"],
    activeDate: new Date(Date.now() + 691200000),
    isActive: true
  },
  {
    title: "N-Queens",
    description: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return all distinct solutions.",
    category: "coding",
    difficulty: "hard",
    points: 350,
    timeLimit: 50,
    question: `The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.

Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.

Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.

Constraints:
- 1 <= n <= 9`,
    sampleInput: `n = 4`,
    sampleOutput: `[[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]]
Explanation: There are two distinct solutions to the 4-queens puzzle.`,
    expectedAnswer: "Use backtracking. Place queens row by row, checking column, diagonal, and anti-diagonal conflicts using sets.",
    hints: [
      "Use backtracking to try placing a queen in each column of each row.",
      "Track which columns are occupied.",
      "Track diagonals: row - col is constant for each diagonal.",
      "Track anti-diagonals: row + col is constant for each anti-diagonal."
    ],
    solution: `function solveNQueens(n) {
    const result = [];
    const cols = new Set();
    const diag1 = new Set();  // row - col
    const diag2 = new Set();  // row + col
    const board = Array(n).fill().map(() => Array(n).fill('.'));
    
    function backtrack(row) {
        if (row === n) {
            result.push(board.map(r => r.join('')));
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
                continue;
            }
            
            board[row][col] = 'Q';
            cols.add(col);
            diag1.add(row - col);
            diag2.add(row + col);
            
            backtrack(row + 1);
            
            board[row][col] = '.';
            cols.delete(col);
            diag1.delete(row - col);
            diag2.delete(row + col);
        }
    }
    
    backtrack(0);
    return result;
}`,
    testCases: [
      { input: "4", expectedOutput: '[[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]]', isHidden: false },
      { input: "1", expectedOutput: '[["Q"]]', isHidden: false },
      { input: "8", expectedOutput: "92 solutions", isHidden: true }
    ],
    tags: ["array", "backtracking", "hard"],
    activeDate: new Date(Date.now() + 777600000),
    isActive: true
  }
];

const seedChallenges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview-portal');
    console.log('Connected to MongoDB');

    // Clear existing challenges
    await DailyChallenge.deleteMany({});
    console.log('Cleared existing challenges');

    // Insert new challenges
    const inserted = await DailyChallenge.insertMany(codingChallenges);
    console.log(`✅ Successfully seeded ${inserted.length} coding challenges!`);

    // Log summary
    const summary = {
      easy: inserted.filter(c => c.difficulty === 'easy').length,
      medium: inserted.filter(c => c.difficulty === 'medium').length,
      hard: inserted.filter(c => c.difficulty === 'hard').length
    };
    console.log('Challenge difficulty distribution:', summary);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding challenges:', error);
    process.exit(1);
  }
};

seedChallenges();
