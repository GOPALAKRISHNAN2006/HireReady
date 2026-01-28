import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, Plus, Edit2, Trash2, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Aptitude Questions</h1>
              <p className="text-gray-500">Manage aptitude test questions</p>
            </div>
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Plus className="w-5 h-5" />
            Add Question
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-white shadow-md border border-gray-200 mb-6">
          <div className="p-4 flex flex-wrap gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value} className="bg-white">{cat.label}</option>
              ))}
            </select>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Difficulties</option>
              {DIFFICULTIES.map(d => (
                <option key={d.value} value={d.value} className="bg-white">{d.label}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Questions List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {data?.questions?.map((q) => (
                <Card key={q._id} className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`bg-${getDifficultyColor(q.difficulty)}-100 text-${getDifficultyColor(q.difficulty)}-600 border border-${getDifficultyColor(q.difficulty)}-300`}>
                            {q.difficulty}
                          </Badge>
                          <Badge className="bg-indigo-100 text-indigo-600 border border-indigo-300">
                            {CATEGORIES.find(c => c.value === q.category)?.label || q.category}
                          </Badge>
                          <span className="text-gray-500 text-sm">{q.timeLimit}s • {q.points} pts</span>
                        </div>
                        <p className="text-gray-800 text-lg">{q.question}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(q)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {q.options?.map((opt, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border ${
                            opt.isCorrect
                              ? 'bg-green-100 border-green-400 text-green-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          {opt.text}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className="mt-4 text-sm text-gray-500 italic">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.pages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="border-gray-300 text-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-gray-700 flex items-center">
                  Page {page} of {data.pagination.pages}
                </span>
                <Button
                  onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                  disabled={page === data.pagination.pages}
                  variant="outline"
                  className="border-gray-300 text-gray-700 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingQuestion ? 'Edit Question' : 'Add New Question'} dark size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              >
                {DIFFICULTIES.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Options (select correct answer)</label>
            <div className="space-y-3">
              {formData.options.map((opt, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    type="radio"
                    checked={opt.isCorrect}
                    onChange={() => handleOptionChange(i, 'isCorrect', true)}
                    className="w-5 h-5 text-green-500"
                  />
                  <Input
                    value={opt.text}
                    onChange={(e) => handleOptionChange(i, 'text', e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 bg-slate-700 border-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Explanation (optional)</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Time Limit (seconds)</label>
              <Input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                min={10}
                max={300}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Points</label>
              <Input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                min={1}
                max={10}
                className="bg-slate-700 border-slate-600"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-500"
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
