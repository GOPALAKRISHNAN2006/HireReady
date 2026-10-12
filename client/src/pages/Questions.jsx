import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { LoadingCard } from '../components/ui/Spinner';
import api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../store/authStore';
import {
  Search,
  BookOpen,
  Code,
  Users,
  Database,
  Server,
  Brain,
  Layers,
  Terminal,
  Smartphone,
  ChevronDown,
  Eye,
  Bookmark,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Clock,
  Building2,
  Tag,
} from 'lucide-react';

const Questions = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Fetch saved questions for bookmark status
  const { data: savedQuestionsData } = useQuery({
    queryKey: ['saved-questions'],
    queryFn: async () => {
      try {
        const response = await api.get('/questions/saved');
        return response.data?.data?.questions || [];
      } catch (e) {
        return [];
      }
    },
    enabled: !!user,
  });

  const savedQuestionIds = new Set(
    (savedQuestionsData || []).map(sq =>
      (sq._id || sq.id || sq.question?._id || sq.question)?.toString()
    )
  );

  // Save / Unsave question mutations
  const saveMutation = useMutation({
    mutationFn: async questionId => {
      await api.post(`/questions/${questionId}/save`);
    },
    onSuccess: () => {
      toast.success('Question saved to your Question Bank bookmarks');
      queryClient.invalidateQueries(['saved-questions']);
    },
    onError: error => {
      toast.error(error.response?.data?.message || 'Failed to save question');
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async questionId => {
      await api.delete(`/questions/${questionId}/save`);
    },
    onSuccess: () => {
      toast.success('Question removed from bookmarks');
      queryClient.invalidateQueries(['saved-questions']);
    },
    onError: error => {
      toast.error(error.response?.data?.message || 'Failed to remove question');
    },
  });

  const handleToggleBookmark = (e, questionId) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to save questions');
      return;
    }
    if (savedQuestionIds.has(questionId.toString())) {
      unsaveMutation.mutate(questionId);
    } else {
      saveMutation.mutate(questionId);
    }
  };

  const handleCopyQuestion = (e, text, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Question copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Fetch questions from question bank
  const { data, isLoading } = useQuery({
    queryKey: ['questions', filters.category, filters.difficulty, debouncedSearch, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 15);
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await api.get(`/questions?${params.toString()}`);
      return response.data?.data || response.data;
    },
  });

  const questionsList = data?.questions || data?.data?.questions || [];
  const pagination = data?.pagination || data?.data?.pagination || { page: 1, pages: 1, total: 0 };

  const categories = [
    { id: '', name: 'All Categories', icon: BookOpen },
    { id: 'dsa', name: 'DSA / Algorithms', icon: Code },
    { id: 'web', name: 'Web Development', icon: Server },
    { id: 'behavioral', name: 'Behavioral / HR', icon: Users },
    { id: 'system-design', name: 'System Design', icon: Layers },
    { id: 'database', name: 'Database & SQL', icon: Database },
    { id: 'ml', name: 'Machine Learning / AI', icon: Brain },
    { id: 'devops', name: 'DevOps & Cloud', icon: Terminal },
    { id: 'mobile', name: 'Mobile Development', icon: Smartphone },
  ];

  const difficulties = [
    { id: '', name: 'All Levels' },
    { id: 'easy', name: 'Easy', color: 'success' },
    { id: 'medium', name: 'Medium', color: 'warning' },
    { id: 'hard', name: 'Hard', color: 'danger' },
  ];

  const getCategoryIcon = category => {
    const normalized =
      category === 'web-development' ? 'web' : category === 'machine-learning' ? 'ml' : category;
    const cat = categories.find(c => c.id === normalized);
    return cat?.icon || BookOpen;
  };

  const getCategoryLabel = category => {
    const normalized =
      category === 'web-development' ? 'web' : category === 'machine-learning' ? 'ml' : category;
    const cat = categories.find(c => c.id === normalized);
    return cat?.name || category;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 p-8 md:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3.5 py-1.5 bg-white/20 rounded-full text-xs font-semibold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-300" />
              Practice & Master Interviews
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
              Interview Question Bank
            </h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Curated technical and behavioral questions curated by hiring managers and
              administrators. Explore expected answers, hints, and core evaluation criteria.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[110px]">
              <span className="block text-2xl font-black">
                {pagination.total || questionsList.length}
              </span>
              <span className="text-xs text-white/80 font-medium">Available</span>
            </div>
            {user && (
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[110px]">
                <span className="block text-2xl font-black">{savedQuestionIds.size}</span>
                <span className="text-xs text-white/80 font-medium">Bookmarked</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Search className="w-4 h-4 text-white" />
            </div>
            <input
              type="text"
              placeholder="Search interview questions by keywords, concepts, or tags..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-16 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative min-w-[200px]">
            <select
              value={filters.category}
              onChange={e => {
                setFilters(prev => ({ ...prev, category: e.target.value }));
                setPage(1);
              }}
              className="appearance-none w-full px-4 py-3 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Difficulty Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={filters.difficulty}
              onChange={e => {
                setFilters(prev => ({ ...prev, difficulty: e.target.value }));
                setPage(1);
              }}
              className="appearance-none w-full px-4 py-3 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              {difficulties.map(diff => (
                <option key={diff.id} value={diff.id}>
                  {diff.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-12">
            <LoadingCard message="Fetching question bank..." />
          </div>
        ) : questionsList.length > 0 ? (
          questionsList.map(question => {
            const CategoryIcon = getCategoryIcon(question.category);
            const isExpanded = selectedQuestion === question._id;
            const isBookmarked = savedQuestionIds.has((question._id || question.id)?.toString());

            return (
              <div
                key={question._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-800/60 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setSelectedQuestion(isExpanded ? null : question._id)}
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500/10 to-indigo-500/10 dark:from-primary-500/20 dark:to-indigo-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary-100 dark:border-primary-800/30 shadow-sm">
                        <CategoryIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Meta Tags */}
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                              question.difficulty === 'easy'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : question.difficulty === 'medium'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                            }`}
                          >
                            {question.difficulty}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800/40 rounded-lg text-xs font-bold">
                            {getCategoryLabel(question.category)}
                          </span>
                          {question.type && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium capitalize">
                              {question.type}
                            </span>
                          )}
                          {question.company && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium">
                              <Building2 className="w-3 h-3" />
                              {question.company}
                            </span>
                          )}
                          {question.isAIGenerated && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-bold">
                              <Brain className="w-3 h-3 mr-1" />
                              AI Curated
                            </span>
                          )}
                          {question.recommendedTimeMinutes && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-auto">
                              <Clock className="w-3.5 h-3.5" />
                              {question.recommendedTimeMinutes} min
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <h3 className="font-semibold text-base md:text-lg text-slate-900 dark:text-white mb-2 leading-relaxed">
                          {question.text}
                        </h3>

                        {/* Tags */}
                        {question.tags && question.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {question.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-md font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        title="Copy question"
                        onClick={e => handleCopyQuestion(e, question.text, question._id)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        {copiedId === question._id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {user && (
                        <button
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                          onClick={e => handleToggleBookmark(e, question._id)}
                          className={`p-2 rounded-xl transition-colors ${
                            isBookmarked
                              ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100'
                              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      )}

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedQuestion(isExpanded ? null : question._id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors ml-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {isExpanded ? 'Hide Answer' : 'View Answer'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Section */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 space-y-5">
                    {/* Expected Answer */}
                    {question.expectedAnswer ? (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          Expected Answer / Ideal Response
                        </h4>
                        <div className="text-sm text-slate-800 dark:text-slate-200 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200/70 dark:border-emerald-800/40 leading-relaxed whitespace-pre-line font-normal">
                          {question.expectedAnswer}
                        </div>
                      </div>
                    ) : null}

                    {/* Key Points */}
                    {question.keyPoints && question.keyPoints.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">
                          Key Evaluation Criteria
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.keyPoints.map((point, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 bg-purple-50/40 dark:bg-purple-950/20 p-2.5 rounded-lg border border-purple-100/60 dark:border-purple-900/30"
                            >
                              <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5">
                                ✓
                              </span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Hints */}
                    {question.hints && question.hints.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                          Hints & Thinking Process
                        </h4>
                        <ul className="space-y-1.5">
                          {question.hints.map((hint, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                            >
                              <span className="text-amber-500 mt-0.5 font-bold">•</span>
                              {hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Explanation */}
                    {question.explanation && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                          Concept Explanation
                        </h4>
                        <div className="text-sm text-slate-700 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200/60 dark:border-blue-800/40 leading-relaxed">
                          {question.explanation}
                        </div>
                      </div>
                    )}

                    {/* Follow Up Questions */}
                    {question.followUpQuestions && question.followUpQuestions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                          Potential Follow-up Questions
                        </h4>
                        <ul className="space-y-1.5">
                          {question.followUpQuestions.map((fq, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                            >
                              <span className="text-indigo-500 mt-0.5 font-bold">→</span>
                              {fq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm text-center py-16 px-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No Questions Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6">
              Try adjusting your category, difficulty filters, or search terms to explore more
              interview questions.
            </p>
            {(filters.category || filters.difficulty || searchTerm) && (
              <button
                onClick={() => {
                  setFilters({ category: '', difficulty: '' });
                  setSearchTerm('');
                  setPage(1);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page <= 1}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => {
            const pageNum = i + 1;
            const isCurrent = pageNum === page;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage(prev => Math.min(prev + 1, pagination.pages))}
            disabled={page >= pagination.pages}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Questions;
