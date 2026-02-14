import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Button, Card, Spinner, Badge } from '../components/ui'
import { FileText, Plus, Copy, Trash2, Download, Edit, Eye } from 'lucide-react'

const ResumeBuilder = () => {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const response = await api.get('/resumes')
      setResumes(response.data.data || [])
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const createResume = async () => {
    setCreating(true)
    try {
      const response = await api.post('/resumes', {
        title: `Resume ${resumes.length + 1}`,
        template: 'modern'
      })
      setResumes([response.data.data, ...resumes])
    } catch (error) {
      console.error('Error creating resume:', error)
    } finally {
      setCreating(false)
    }
  }

  const duplicateResume = async (id) => {
    try {
      const response = await api.post(`/resumes/${id}/duplicate`)
      setResumes([response.data.data, ...resumes])
    } catch (error) {
      console.error('Error duplicating resume:', error)
    }
  }

  const deleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    try {
      await api.delete(`/resumes/${id}`)
      setResumes(resumes.filter(r => r._id !== id))
    } catch (error) {
      console.error('Error deleting resume:', error)
    }
  }

  const templates = [
    { id: 'modern', name: 'Modern', color: 'bg-blue-500' },
    { id: 'classic', name: 'Classic', color: 'bg-slate-500' },
    { id: 'minimal', name: 'Minimal', color: 'bg-green-500' },
    { id: 'professional', name: 'Professional', color: 'bg-purple-500' },
    { id: 'creative', name: 'Creative', color: 'bg-orange-500' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <FileText className="w-4 h-4 mr-2" />
            Build & Share
          </div>
          <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
          <p className="text-white/70 max-w-lg">Create professional resumes tailored for your dream job</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={createResume} isLoading={creating}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Resume
        </Button>
      </div>

      {/* Templates Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Choose a Template</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                api.post('/resumes', { title: `${template.name} Resume`, template: template.id })
                  .then(res => setResumes([res.data.data, ...resumes]))
              }}
              className="p-4 border dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <div className={`w-full h-24 ${template.color} rounded mb-2 flex items-center justify-center`}>
                <FileText className="w-10 h-10 text-white" />
              </div>
              <p className="text-sm font-medium text-center">{template.name}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Resumes List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Resumes ({resumes.length})</h2>
        {resumes.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No resumes yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Create your first resume to get started</p>
            <Button onClick={createResume} isLoading={creating}>
              <Plus className="w-4 h-4 mr-2" />
              Create Resume
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <Card key={resume._id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{resume.title}</h3>
                    <Badge variant="secondary" className="mt-1">{resume.template}</Badge>
                  </div>
                  <FileText className="w-8 h-8 text-indigo-500" />
                </div>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <Link to={`/resume/${resume._id}`} className="flex-1">
                    <Button size="sm" variant="outline" fullWidth>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => duplicateResume(resume._id)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => deleteResume(resume._id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeBuilder
