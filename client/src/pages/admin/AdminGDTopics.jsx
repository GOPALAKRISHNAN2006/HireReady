import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Plus, Edit2, Trash2, Save, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Filter } from 'lucide-react';
import api from '../../services/api';
import { Card, Button, Input, Spinner, Modal, Badge } from '../../components/ui';

const CATEGORIES = [
  { value: 'current-affairs', label: 'Current Affairs' },
  { value: 'social-issues', label: 'Social Issues' },
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'abstract', label: 'Abstract Topics' },
  { value: 'case-study', label: 'Case Study' },
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'hard', label: 'Hard', color: 'red' },
];

export default function AdminGDTopics() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ category: '', difficulty: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'current-affairs',
    difficulty: 'medium',
    keyPoints: [''],
    forArguments: [''],
    againstArguments: [''],
  });

  // Fetch GD topics
  const { data, isLoading } = useQuery({
    queryKey: ['admin-gd-topics', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 10 });
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      const response = await api.get(`/admin/gd-topics?${params}`);
      return response.data.data;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/gd-topics', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-gd-topics']);
      closeModal();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/gd-topics/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-gd-topics']);
      closeModal();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/gd-topics/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-gd-topics']);
    },
  });

  const openModal = (topic = null) => {
    if (topic) {
      setEditingTopic(topic);
      setFormData({
        title: topic.title,
        description: topic.description || '',
        category: topic.category,
        difficulty: topic.difficulty,
        keyPoints: topic.keyPoints?.length ? topic.keyPoints : [''],
        forArguments: topic.forArguments?.length ? topic.forArguments : [''],
        againstArguments: topic.againstArguments?.length ? topic.againstArguments : [''],
      });
    } else {
      setEditingTopic(null);
      setFormData({
        title: '',
        description: '',
        category: 'current-affairs',
        difficulty: 'medium',
        keyPoints: [''],
        forArguments: [''],
        againstArguments: [''],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTopic(null);
  };

  const handleArrayChange = (field, index, value) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const newArr = formData[field].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: newArr });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      keyPoints: formData.keyPoints.filter(p => p.trim()),
      forArguments: formData.forArguments.filter(a => a.trim()),
      againstArguments: formData.againstArguments.filter(a => a.trim()),
    };

    if (editingTopic) {
      updateMutation.mutate({ id: editingTopic._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this topic?')) {
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">GD Topics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage group discussion topics</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Topic
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

      {/* Topics List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data?.topics?.map((topic) => (
              <div key={topic._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all p-5 group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        topic.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' :
                        topic.difficulty === 'hard' ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30' :
                        'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30'
                      }`}>
                        {topic.difficulty}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30">
                        {CATEGORIES.find(c => c.value === topic.category)?.label || topic.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{topic.title}</h3>
                    {topic.description && (
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{topic.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(topic)}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(topic._id)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Key Points */}
                {topic.keyPoints?.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Key Points</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {topic.keyPoints.map((point, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Arguments */}
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {topic.forArguments?.length > 0 && (
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <h4 className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">For Arguments</h4>
                      </div>
                      <ul className="space-y-1">
                        {topic.forArguments.map((arg, i) => (
                          <li key={i} className="text-xs text-slate-600 dark:text-slate-400">• {arg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {topic.againstArguments?.length > 0 && (
                    <div className="p-3.5 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <h4 className="text-xs font-semibold text-rose-700 dark:text-rose-400">Against Arguments</h4>
                      </div>
                      <ul className="space-y-1">
                        {topic.againstArguments.map((arg, i) => (
                          <li key={i} className="text-xs text-slate-600 dark:text-slate-400">• {arg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
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
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTopic ? 'Edit Topic' : 'Add New Topic'} size="2xl">
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter topic title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
              rows={3}
              placeholder="Brief description of the topic"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer transition-all"
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
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer transition-all"
              >
                {DIFFICULTIES.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Key Points */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Key Points</label>
            <div className="space-y-2">
              {formData.keyPoints.map((point, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={point}
                    onChange={(e) => handleArrayChange('keyPoints', i, e.target.value)}
                    placeholder="Key point"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('keyPoints', i)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('keyPoints')}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                + Add Key Point
              </button>
            </div>
          </div>

          {/* For Arguments */}
          <div>
            <label className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" /> For Arguments
            </label>
            <div className="space-y-2">
              {formData.forArguments.map((arg, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={arg}
                    onChange={(e) => handleArrayChange('forArguments', i, e.target.value)}
                    placeholder="Supporting argument"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('forArguments', i)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('forArguments')}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
              >
                + Add For Argument
              </button>
            </div>
          </div>

          {/* Against Arguments */}
          <div>
            <label className="text-sm font-semibold text-rose-700 dark:text-rose-400 mb-1.5 flex items-center gap-2">
              <ThumbsDown className="w-4 h-4" /> Against Arguments
            </label>
            <div className="space-y-2">
              {formData.againstArguments.map((arg, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={arg}
                    onChange={(e) => handleArrayChange('againstArguments', i, e.target.value)}
                    placeholder="Opposing argument"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('againstArguments', i)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('againstArguments')}
                className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium"
              >
                + Add Against Argument
              </button>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {editingTopic ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
