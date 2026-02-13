import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, Plus, Edit2, Trash2, Save, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import api from '../../services/api';
import { Card, Button, Input, Spinner, Modal, Badge } from '../../components/ui';

const CATEGORIES = [
  { value: 'logical', label: 'Logical Reasoning' },
  { value: 'quantitative', label: 'Quantitative Aptitude' },
  { value: 'verbal', label: 'Verbal Ability' },
  { value: 'data-interpretation', label: 'Data Interpretation' },
  { value: 'general-knowledge', label: 'General Knowledge' },
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'hard', label: 'Hard', color: 'red' },
];

export default function AdminAptitude() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ category: '', difficulty: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    category: 'logical',
    question: '',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
    explanation: '',
    difficulty: 'medium',
    timeLimit: 60,
    points: 1,
  });

  // Fetch aptitude questions
  const { data, isLoading } = useQuery({
    queryKey: ['admin-aptitude', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 10 });
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      const response = await api.get(`/admin/aptitude?${params}`);
      return response.data.data;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/aptitude', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-aptitude']);
      closeModal();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/aptitude/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-aptitude']);
      closeModal();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/aptitude/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-aptitude']);
    },
  });

  const openModal = (question = null) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        category: question.category,
        question: question.question,
        options: question.options.length >= 4 ? question.options : [
          ...question.options,
          ...Array(4 - question.options.length).fill({ text: '', isCorrect: false })
        ],
        explanation: question.explanation || '',
        difficulty: question.difficulty,
        timeLimit: question.timeLimit || 60,
        points: question.points || 1,
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        category: 'logical',
        question: '',
        options: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
        explanation: '',
        difficulty: 'medium',
        timeLimit: 60,
        points: 1,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect') {
      // Only one correct answer
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value };
    }
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validOptions = formData.options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    const submitData = {
      ...formData,
      options: validOptions,
    };

    if (editingQuestion) {
      updateMutation.mutate({ id: editingQuestion._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteMutation.mutate(id);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const d = DIFFICULTIES.find(d => d.value === difficulty);
    return d?.color || 'gray';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Aptitude Questions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage aptitude test questions</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer transition-all"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer transition-all"
          >
            <option value="">All Difficulties</option>
            {DIFFICULTIES.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
      </div>

        {/* Questions List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {data?.questions?.map((q) => (
                <div key={q._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all p-5 group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' :
                          q.difficulty === 'hard' ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30' :
                          'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30'
                        }`}>
                          {q.difficulty}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30">
                          {CATEGORIES.find(c => c.value === q.category)?.label || q.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{q.timeLimit}s • {q.points} pts</span>
                      </div>
                      <p className="text-slate-900 dark:text-white font-semibold leading-relaxed">{q.question}</p>
                    </div>
                    <div className="flex gap-1 ml-4 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(q)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {q.options?.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-sm ${
                          opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/30 dark:text-emerald-400 font-medium'
                            : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                        }`}
                      >
                        {opt.text}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 italic">
                      <strong className="text-slate-700 dark:text-slate-300">Explanation:</strong> {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                  Page {page} of {data.pagination.pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                  disabled={page === data.pagination.pages}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingQuestion ? 'Edit Question' : 'Add New Question'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer transition-all"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer transition-all"
              >
                {DIFFICULTIES.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Question</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Options (select correct answer)</label>
            <div className="space-y-2.5">
              {formData.options.map((opt, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    type="radio"
                    checked={opt.isCorrect}
                    onChange={() => handleOptionChange(i, 'isCorrect', true)}
                    className="w-5 h-5 text-indigo-600 border-slate-300 dark:border-slate-600"
                  />
                  <Input
                    value={opt.text}
                    onChange={(e) => handleOptionChange(i, 'text', e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Explanation (optional)</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Time Limit (seconds)</label>
              <Input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                min={10}
                max={300}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Points</label>
              <Input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                min={1}
                max={10}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {editingQuestion ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
