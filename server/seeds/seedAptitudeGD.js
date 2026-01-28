/**
 * Seed Data for Aptitude and GD
 */

const mongoose = require('mongoose');
require('dotenv').config();
const { AptitudeQuestion } = require('../models/Aptitude.model');
const { GDTopic } = require('../models/GroupDiscussion.model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const aptitudeQuestions = [
  // Quantitative
  { category: 'quantitative', question: 'If 15% of a number is 45, what is the number?', options: [{ text: '300', isCorrect: true }, { text: '250', isCorrect: false }, { text: '350', isCorrect: false }, { text: '400', isCorrect: false }], explanation: '15% of x = 45, so x = 45 × (100/15) = 300', difficulty: 'easy' },
  { category: 'quantitative', question: 'A train travels 360 km in 4 hours. What is its speed in m/s?', options: [{ text: '25 m/s', isCorrect: true }, { text: '20 m/s', isCorrect: false }, { text: '30 m/s', isCorrect: false }, { text: '15 m/s', isCorrect: false }], explanation: 'Speed = 360/4 = 90 km/hr = 90 × (5/18) = 25 m/s', difficulty: 'medium' },
  { category: 'quantitative', question: 'Find the compound interest on Rs. 10000 at 10% per annum for 2 years.', options: [{ text: 'Rs. 2100', isCorrect: true }, { text: 'Rs. 2000', isCorrect: false }, { text: 'Rs. 2200', isCorrect: false }, { text: 'Rs. 1900', isCorrect: false }], explanation: 'CI = P[(1+r/100)^n - 1] = 10000[(1.1)^2 - 1] = 2100', difficulty: 'medium' },
  { category: 'quantitative', question: 'The average of 5 numbers is 20. If one number is excluded, the average becomes 18. What is the excluded number?', options: [{ text: '28', isCorrect: true }, { text: '24', isCorrect: false }, { text: '30', isCorrect: false }, { text: '26', isCorrect: false }], explanation: 'Sum = 5×20 = 100. New sum = 4×18 = 72. Excluded = 100-72 = 28', difficulty: 'medium' },
  { category: 'quantitative', question: 'If x + 1/x = 5, find x² + 1/x²', options: [{ text: '23', isCorrect: true }, { text: '25', isCorrect: false }, { text: '21', isCorrect: false }, { text: '27', isCorrect: false }], explanation: '(x + 1/x)² = x² + 1/x² + 2. So x² + 1/x² = 25 - 2 = 23', difficulty: 'hard' },
  
  // Logical
  { category: 'logical', question: 'Find the next number: 2, 6, 12, 20, 30, ?', options: [{ text: '42', isCorrect: true }, { text: '40', isCorrect: false }, { text: '44', isCorrect: false }, { text: '38', isCorrect: false }], explanation: 'Pattern: +4, +6, +8, +10, +12. Next: 30+12 = 42', difficulty: 'easy' },
  { category: 'logical', question: 'If COMPUTER is coded as RFUVQNPC, how is MEDICINE coded?', options: [{ text: 'EDJDJOFM', isCorrect: true }, { text: 'EFEJDJOF', isCorrect: false }, { text: 'EDJDOFMJ', isCorrect: false }, { text: 'EDMJCJOF', isCorrect: false }], explanation: 'First letter -2, reverse the word', difficulty: 'hard' },
  { category: 'logical', question: 'All roses are flowers. Some flowers are red. Conclusion: Some roses are red.', options: [{ text: 'Does not follow', isCorrect: true }, { text: 'Follows', isCorrect: false }, { text: 'Cannot be determined', isCorrect: false }, { text: 'Partially follows', isCorrect: false }], explanation: 'The red flowers may not be roses', difficulty: 'medium' },
  { category: 'logical', question: 'A is B\'s brother. C is D\'s father. E is B\'s mother. A and D are brothers. How is E related to C?', options: [{ text: 'Wife', isCorrect: true }, { text: 'Sister', isCorrect: false }, { text: 'Mother', isCorrect: false }, { text: 'Daughter', isCorrect: false }], explanation: 'E is mother of A and B. A and D are brothers. C is D\'s father. So C is also A\'s father. E is C\'s wife.', difficulty: 'hard' },
  { category: 'logical', question: 'If in a certain code, PALE is coded as 2134 and EARTH is coded as 41590, how is PEARL coded?', options: [{ text: '24153', isCorrect: true }, { text: '25143', isCorrect: false }, { text: '24513', isCorrect: false }, { text: '21453', isCorrect: false }], explanation: 'P=2, E=4, A=1, R=5, L=3', difficulty: 'medium' },
  
  // Verbal
  { category: 'verbal', question: 'Choose the synonym of "Ubiquitous":', options: [{ text: 'Omnipresent', isCorrect: true }, { text: 'Rare', isCorrect: false }, { text: 'Unique', isCorrect: false }, { text: 'Hidden', isCorrect: false }], explanation: 'Ubiquitous means present everywhere', difficulty: 'medium' },
  { category: 'verbal', question: 'Choose the antonym of "Benevolent":', options: [{ text: 'Malevolent', isCorrect: true }, { text: 'Kind', isCorrect: false }, { text: 'Generous', isCorrect: false }, { text: 'Charitable', isCorrect: false }], explanation: 'Benevolent means well-meaning; Malevolent is the opposite', difficulty: 'easy' },
  { category: 'verbal', question: 'Fill in the blank: The committee _____ divided in their opinions.', options: [{ text: 'were', isCorrect: true }, { text: 'was', isCorrect: false }, { text: 'is', isCorrect: false }, { text: 'has', isCorrect: false }], explanation: 'When committee members are divided, use plural verb', difficulty: 'medium' },
  { category: 'verbal', question: 'Identify the error: "Neither the students nor the teacher were present."', options: [{ text: 'were should be was', isCorrect: true }, { text: 'No error', isCorrect: false }, { text: 'nor should be or', isCorrect: false }, { text: 'Neither should be Either', isCorrect: false }], explanation: 'With neither...nor, verb agrees with the nearer subject (teacher)', difficulty: 'hard' },
  { category: 'verbal', question: 'Choose the correctly spelled word:', options: [{ text: 'Occurrence', isCorrect: true }, { text: 'Occurence', isCorrect: false }, { text: 'Occurance', isCorrect: false }, { text: 'Ocurrence', isCorrect: false }], explanation: 'Occurrence is the correct spelling', difficulty: 'easy' },
  
  // Data Interpretation
  { category: 'data-interpretation', question: 'If a pie chart shows 25% for Category A and the total is 800, what is the value for Category A?', options: [{ text: '200', isCorrect: true }, { text: '250', isCorrect: false }, { text: '175', isCorrect: false }, { text: '225', isCorrect: false }], explanation: '25% of 800 = 200', difficulty: 'easy' },
  { category: 'data-interpretation', question: 'Sales in 2020: 500, Sales in 2021: 650. What is the percentage increase?', options: [{ text: '30%', isCorrect: true }, { text: '25%', isCorrect: false }, { text: '35%', isCorrect: false }, { text: '20%', isCorrect: false }], explanation: 'Increase = (650-500)/500 × 100 = 30%', difficulty: 'easy' },
  { category: 'data-interpretation', question: 'A bar graph shows values 40, 60, 80, 100, 120 for 5 years. What is the average?', options: [{ text: '80', isCorrect: true }, { text: '75', isCorrect: false }, { text: '85', isCorrect: false }, { text: '90', isCorrect: false }], explanation: 'Average = (40+60+80+100+120)/5 = 80', difficulty: 'easy' },
  
  // General Knowledge
  { category: 'general-knowledge', question: 'Which planet is known as the Red Planet?', options: [{ text: 'Mars', isCorrect: true }, { text: 'Venus', isCorrect: false }, { text: 'Jupiter', isCorrect: false }, { text: 'Saturn', isCorrect: false }], explanation: 'Mars appears red due to iron oxide on its surface', difficulty: 'easy' },
  { category: 'general-knowledge', question: 'Who is known as the Father of Computers?', options: [{ text: 'Charles Babbage', isCorrect: true }, { text: 'Alan Turing', isCorrect: false }, { text: 'Bill Gates', isCorrect: false }, { text: 'Steve Jobs', isCorrect: false }], explanation: 'Charles Babbage designed the first mechanical computer', difficulty: 'easy' },
  { category: 'general-knowledge', question: 'What is the capital of Australia?', options: [{ text: 'Canberra', isCorrect: true }, { text: 'Sydney', isCorrect: false }, { text: 'Melbourne', isCorrect: false }, { text: 'Perth', isCorrect: false }], explanation: 'Canberra is the capital, not Sydney', difficulty: 'medium' },
];

const gdTopics = [
  // Current Affairs
  { title: 'Impact of AI on Employment', description: 'Discuss how artificial intelligence is changing the job market and what it means for future workers.', category: 'current-affairs', difficulty: 'medium', keyPoints: ['Automation of routine tasks', 'New job creation', 'Skill requirements', 'Economic impact'], forArguments: ['Increases productivity', 'Creates new industries', 'Eliminates dangerous jobs'], againstArguments: ['Mass unemployment risk', 'Widens inequality', 'Loss of human touch'] },
  { title: 'Work From Home: The New Normal?', description: 'Is remote work sustainable long-term for businesses and employees?', category: 'current-affairs', difficulty: 'easy', keyPoints: ['Productivity levels', 'Work-life balance', 'Company culture', 'Infrastructure needs'], forArguments: ['Better work-life balance', 'Cost savings', 'Environmental benefits'], againstArguments: ['Collaboration challenges', 'Mental health concerns', 'Career growth issues'] },
  { title: 'Digital Currency vs Traditional Banking', description: 'Explore the future of money and the role of cryptocurrencies in the global economy.', category: 'current-affairs', difficulty: 'hard', keyPoints: ['Decentralization', 'Regulation', 'Adoption rates', 'Security concerns'], forArguments: ['Financial inclusion', 'Lower transaction costs', 'Transparency'], againstArguments: ['Volatility', 'Criminal use', 'Environmental concerns'] },
  
  // Social Issues
  { title: 'Social Media: Boon or Bane?', description: 'Analyze the positive and negative impacts of social media on society.', category: 'social-issues', difficulty: 'easy', keyPoints: ['Information sharing', 'Mental health', 'Privacy', 'Democracy'], forArguments: ['Connectivity', 'Awareness', 'Business opportunities'], againstArguments: ['Addiction', 'Misinformation', 'Cyberbullying'] },
  { title: 'Should Education Be Free for All?', description: 'Debate the merits of universal free education and its feasibility.', category: 'social-issues', difficulty: 'medium', keyPoints: ['Equal opportunity', 'Economic burden', 'Quality concerns', 'Global examples'], forArguments: ['Reduces inequality', 'Skilled workforce', 'Social mobility'], againstArguments: ['High costs', 'Quality concerns', 'Value perception'] },
  { title: 'Mental Health in the Workplace', description: 'How should organizations address mental health issues among employees?', category: 'social-issues', difficulty: 'medium', keyPoints: ['Awareness', 'Support systems', 'Productivity', 'Stigma'], forArguments: ['Improves productivity', 'Reduces turnover', 'Employee wellbeing'], againstArguments: ['Privacy concerns', 'Cost of programs', 'Measurement challenges'] },
  
  // Technology
  { title: 'Privacy vs Security in Digital Age', description: 'Where should the line be drawn between national security and personal privacy?', category: 'technology', difficulty: 'hard', keyPoints: ['Surveillance', 'Data protection', 'Government access', 'Individual rights'], forArguments: ['Prevents crime', 'National security', 'Nothing to hide'], againstArguments: ['Civil liberties', 'Data misuse', 'Chilling effect'] },
  { title: 'Should Social Media Be Regulated?', description: 'Discuss government regulation of social media platforms.', category: 'technology', difficulty: 'medium', keyPoints: ['Free speech', 'Misinformation', 'Platform power', 'International standards'], forArguments: ['Reduces harm', 'Accountability', 'Protects users'], againstArguments: ['Censorship risk', 'Innovation impact', 'Enforcement challenges'] },
  
  // Business
  { title: 'Startups vs Corporate Jobs', description: 'Which career path offers better growth and satisfaction?', category: 'business', difficulty: 'easy', keyPoints: ['Risk vs stability', 'Learning opportunities', 'Financial rewards', 'Work culture'], forArguments: ['Startup: Innovation, ownership, rapid growth', 'Corporate: Stability, resources, structure'], againstArguments: ['Startup: Uncertainty, burnout', 'Corporate: Bureaucracy, limited growth'] },
  { title: 'Is MBA Still Relevant?', description: 'Evaluate the value of MBA education in today\'s entrepreneurial world.', category: 'business', difficulty: 'medium', keyPoints: ['ROI', 'Network value', 'Skill development', 'Career switching'], forArguments: ['Structured learning', 'Network', 'Career transition'], againstArguments: ['High cost', 'Outdated curriculum', 'Experience matters more'] },
  
  // Abstract
  { title: 'Red is the New Black', description: 'An abstract topic to test creative thinking and interpretation.', category: 'abstract', difficulty: 'hard', keyPoints: ['Color symbolism', 'Change', 'Innovation', 'Perception'], forArguments: ['Revolution', 'Energy', 'Passion'], againstArguments: ['Danger', 'Aggression', 'Risk'] },
  { title: 'Nothing is Permanent', description: 'Discuss the philosophical concept of impermanence.', category: 'abstract', difficulty: 'medium', keyPoints: ['Change', 'Adaptation', 'Growth', 'Acceptance'], forArguments: ['Embracing change', 'Continuous improvement', 'Resilience'], againstArguments: ['Need for stability', 'Value of traditions', 'Planning importance'] },
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await AptitudeQuestion.deleteMany({});
    await GDTopic.deleteMany({});
    
    // Insert aptitude questions
    await AptitudeQuestion.insertMany(aptitudeQuestions);
    console.log(`✅ ${aptitudeQuestions.length} aptitude questions added`);
    
    // Insert GD topics
    await GDTopic.insertMany(gdTopics);
    console.log(`✅ ${gdTopics.length} GD topics added`);
    
    console.log('✅ Seed data complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
