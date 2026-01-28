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
    { id: 'classic', name: 'Classic', color: 'bg-gray-500' },
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
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-600 mt-1">Create professional resumes with ease</p>
        </div>
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
              className="p-4 border rounded-lg hover:border-primary-500 hover:shadow-md transition-all group"
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
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-4">Create your first resume to get started</p>
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
                    <h3 className="font-semibold text-gray-900">{resume.title}</h3>
                    <Badge variant="secondary" className="mt-1">{resume.template}</Badge>
                  </div>
                  <FileText className="w-8 h-8 text-primary-500" />
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
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
