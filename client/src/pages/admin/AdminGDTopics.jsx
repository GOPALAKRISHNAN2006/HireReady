import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Plus, Edit2, Trash2, Save, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">GD Topics</h1>
              <p className="text-gray-500">Manage group discussion topics</p>
            </div>
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
          >
            <Plus className="w-5 h-5" />
            Add Topic
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

        {/* Topics List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {data?.topics?.map((topic) => (
                <Card key={topic._id} className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`bg-${getDifficultyColor(topic.difficulty)}-100 text-${getDifficultyColor(topic.difficulty)}-600 border border-${getDifficultyColor(topic.difficulty)}-300`}>
                            {topic.difficulty}
                          </Badge>
                          <Badge className="bg-indigo-100 text-indigo-600 border border-indigo-300">
                            {CATEGORIES.find(c => c.value === topic.category)?.label || topic.category}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{topic.title}</h3>
                        {topic.description && (
                          <p className="text-gray-500">{topic.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(topic)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(topic._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Key Points */}
                    {topic.keyPoints?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Key Points:</h4>
                        <div className="flex flex-wrap gap-2">
                          {topic.keyPoints.map((point, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                              {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Arguments */}
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {topic.forArguments?.length > 0 && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                            <h4 className="text-sm font-medium text-green-600">For Arguments</h4>
                          </div>
                          <ul className="space-y-1">
                            {topic.forArguments.map((arg, i) => (
                              <li key={i} className="text-sm text-gray-600">• {arg}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {topic.againstArguments?.length > 0 && (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <ThumbsDown className="w-4 h-4 text-red-600" />
                            <h4 className="text-sm font-medium text-red-600">Against Arguments</h4>
                          </div>
                          <ul className="space-y-1">
                            {topic.againstArguments.map((arg, i) => (
                              <li key={i} className="text-sm text-gray-600">• {arg}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
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
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTopic ? 'Edit Topic' : 'Add New Topic'} size="2xl" dark>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter topic title"
              className="bg-slate-700 border-slate-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white resize-none"
              rows={3}
              placeholder="Brief description of the topic"
            />
          </div>

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

          {/* Key Points */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Key Points</label>
            <div className="space-y-2">
              {formData.keyPoints.map((point, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={point}
                    onChange={(e) => handleArrayChange('keyPoints', i, e.target.value)}
                    placeholder="Key point"
                    className="flex-1 bg-slate-700 border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('keyPoints', i)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('keyPoints')}
                className="text-sm text-green-400 hover:text-green-300"
              >
                + Add Key Point
              </button>
            </div>
          </div>

          {/* For Arguments */}
          <div>
            <label className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" /> For Arguments
            </label>
            <div className="space-y-2">
              {formData.forArguments.map((arg, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={arg}
                    onChange={(e) => handleArrayChange('forArguments', i, e.target.value)}
                    placeholder="Supporting argument"
                    className="flex-1 bg-slate-700 border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('forArguments', i)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('forArguments')}
                className="text-sm text-green-400 hover:text-green-300"
              >
                + Add For Argument
              </button>
            </div>
          </div>

          {/* Against Arguments */}
          <div>
            <label className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
              <ThumbsDown className="w-4 h-4" /> Against Arguments
            </label>
            <div className="space-y-2">
              {formData.againstArguments.map((arg, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={arg}
                    onChange={(e) => handleArrayChange('againstArguments', i, e.target.value)}
                    placeholder="Opposing argument"
                    className="flex-1 bg-slate-700 border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('againstArguments', i)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('againstArguments')}
                className="text-sm text-red-400 hover:text-red-300"
              >
                + Add Against Argument
              </button>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-slate-600">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-blue-500"
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
