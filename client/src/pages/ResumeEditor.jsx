import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Button, Card, Input, Spinner } from '../components/ui'
import { Save, ArrowLeft, Plus, Trash2, Download } from 'lucide-react'

const ResumeEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('personal')

  useEffect(() => {
    fetchResume()
  }, [id])

  const fetchResume = async () => {
    try {
      const response = await api.get(`/resumes/${id}`)
      setResume(response.data.data)
    } catch (error) {
      console.error('Error fetching resume:', error)
      navigate('/resume')
    } finally {
      setLoading(false)
    }
  }

  const saveResume = async () => {
    setSaving(true)
    try {
      await api.put(`/resumes/${id}`, resume)
    } catch (error) {
      console.error('Error saving resume:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (section, field, value) => {
    setResume(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }))
  }

  const addItem = (section) => {
    const newItem = section === 'education' 
      ? { institution: '', degree: '', field: '', startDate: '', endDate: '', current: false }
      : section === 'experience'
      ? { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: [] }
      : section === 'projects'
      ? { name: '', description: '', technologies: [], link: '' }
      : section === 'skills'
      ? { category: '', items: [] }
      : { name: '', issuer: '', date: '' }

    setResume(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }))
  }

  const removeItem = (section, index) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  const updateItem = (section, index, field, value) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const exportToPDF = () => {
    // Create a printable version of the resume
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${resume.title || 'Resume'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; line-height: 1.6; }
          h1 { font-size: 28px; color: #1a1a1a; margin-bottom: 5px; }
          h2 { font-size: 18px; color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 5px; margin: 25px 0 15px 0; }
          h3 { font-size: 16px; color: #1a1a1a; margin-bottom: 3px; }
          p { margin-bottom: 8px; }
          .header { text-align: center; margin-bottom: 30px; }
          .contact { color: #666; font-size: 14px; }
          .contact span { margin: 0 10px; }
          .section { margin-bottom: 20px; }
          .item { margin-bottom: 15px; padding-left: 15px; border-left: 3px solid #e5e5e5; }
          .item-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .company { font-weight: 600; }
          .date { color: #666; font-size: 14px; }
          .description { color: #555; font-size: 14px; }
          .skills { display: flex; flex-wrap: wrap; gap: 8px; }
          .skill { background: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 13px; }
          .summary { font-style: italic; color: #555; margin-bottom: 20px; }
          ul { padding-left: 20px; margin-top: 5px; }
          li { font-size: 14px; color: #555; margin-bottom: 3px; }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${resume.personalInfo?.fullName || 'Your Name'}</h1>
          <p class="contact">
            ${resume.personalInfo?.email ? `<span>${resume.personalInfo.email}</span>` : ''}
            ${resume.personalInfo?.phone ? `<span>| ${resume.personalInfo.phone}</span>` : ''}
            ${resume.personalInfo?.location ? `<span>| ${resume.personalInfo.location}</span>` : ''}
          </p>
          ${resume.personalInfo?.linkedin ? `<p class="contact"><span>LinkedIn: ${resume.personalInfo.linkedin}</span></p>` : ''}
        </div>

        ${resume.personalInfo?.summary ? `
          <div class="section">
            <h2>Professional Summary</h2>
            <p class="summary">${resume.personalInfo.summary}</p>
          </div>
        ` : ''}

        ${resume.experience?.length ? `
          <div class="section">
            <h2>Experience</h2>
            ${resume.experience.map(exp => `
              <div class="item">
                <div class="item-header">
                  <h3>${exp.position || 'Position'} at ${exp.company || 'Company'}</h3>
                  <span class="date">${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}</span>
                </div>
                ${exp.location ? `<p class="description">${exp.location}</p>` : ''}
                ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                ${exp.achievements?.length ? `
                  <ul>
                    ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resume.education?.length ? `
          <div class="section">
            <h2>Education</h2>
            ${resume.education.map(edu => `
              <div class="item">
                <div class="item-header">
                  <h3>${edu.degree || 'Degree'} in ${edu.field || 'Field'}</h3>
                  <span class="date">${edu.startDate || ''} - ${edu.current ? 'Present' : edu.endDate || ''}</span>
                </div>
                <p class="company">${edu.institution || 'Institution'}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resume.skills?.length ? `
          <div class="section">
            <h2>Skills</h2>
            ${resume.skills.map(skillGroup => `
              <div style="margin-bottom: 10px;">
                ${skillGroup.category ? `<strong>${skillGroup.category}:</strong>` : ''}
                <div class="skills">
                  ${(skillGroup.items || []).map(skill => `<span class="skill">${skill}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resume.projects?.length ? `
          <div class="section">
            <h2>Projects</h2>
            ${resume.projects.map(project => `
              <div class="item">
                <h3>${project.name || 'Project Name'}</h3>
                ${project.description ? `<p class="description">${project.description}</p>` : ''}
                ${project.technologies?.length ? `
                  <div class="skills" style="margin-top: 5px;">
                    ${project.technologies.map(tech => `<span class="skill">${tech}</span>`).join('')}
                  </div>
                ` : ''}
                ${project.link ? `<p style="font-size: 13px; color: #4f46e5;">${project.link}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resume.certifications?.length ? `
          <div class="section">
            <h2>Certifications</h2>
            ${resume.certifications.map(cert => `
              <div class="item">
                <div class="item-header">
                  <h3>${cert.name || 'Certification'}</h3>
                  <span class="date">${cert.date || ''}</span>
                </div>
                ${cert.issuer ? `<p class="company">${cert.issuer}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!resume) return null

  const sections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
  ]

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/resume')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <input
              type="text"
              value={resume.title}
              onChange={(e) => setResume({ ...resume, title: e.target.value })}
              className="text-2xl font-bold text-gray-900 dark:text-white border-none outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 dark:bg-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={saveResume} isLoading={saving}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-4">
            <h3 className="font-semibold mb-4">Sections</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {activeSection === 'personal' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={resume.personalInfo?.fullName || ''}
                    onChange={(e) => updateField('personalInfo', 'fullName', e.target.value)}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={resume.personalInfo?.email || ''}
                    onChange={(e) => updateField('personalInfo', 'email', e.target.value)}
                  />
                  <Input
                    label="Phone"
                    value={resume.personalInfo?.phone || ''}
                    onChange={(e) => updateField('personalInfo', 'phone', e.target.value)}
                  />
                  <Input
                    label="Location"
                    value={resume.personalInfo?.location || ''}
                    onChange={(e) => updateField('personalInfo', 'location', e.target.value)}
                  />
                  <Input
                    label="LinkedIn URL"
                    value={resume.personalInfo?.linkedin || ''}
                    onChange={(e) => updateField('personalInfo', 'linkedin', e.target.value)}
                  />
                  <Input
                    label="GitHub URL"
                    value={resume.personalInfo?.github || ''}
                    onChange={(e) => updateField('personalInfo', 'github', e.target.value)}
                  />
                  <Input
                    label="Portfolio URL"
                    value={resume.personalInfo?.portfolio || ''}
                    onChange={(e) => updateField('personalInfo', 'portfolio', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
                  <textarea
                    rows={4}
                    value={resume.personalInfo?.summary || ''}
                    onChange={(e) => updateField('personalInfo', 'summary', e.target.value)}
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Brief professional summary..."
                  />
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Education</h2>
                  <Button size="sm" onClick={() => addItem('education')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {(resume.education || []).map((edu, index) => (
                  <div key={index} className="p-4 border dark:border-gray-700 rounded-lg space-y-3">
                    <div className="flex justify-end">
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeItem('education', index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        label="Institution"
                        value={edu.institution}
                        onChange={(e) => updateItem('education', index, 'institution', e.target.value)}
                      />
                      <Input
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                      />
                      <Input
                        label="Field of Study"
                        value={edu.field}
                        onChange={(e) => updateItem('education', index, 'field', e.target.value)}
                      />
                      <Input
                        label="GPA"
                        value={edu.gpa}
                        onChange={(e) => updateItem('education', index, 'gpa', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Experience</h2>
                  <Button size="sm" onClick={() => addItem('experience')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {(resume.experience || []).map((exp, index) => (
                  <div key={index} className="p-4 border dark:border-gray-700 rounded-lg space-y-3">
                    <div className="flex justify-end">
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeItem('experience', index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        label="Company"
                        value={exp.company}
                        onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                      />
                      <Input
                        label="Position"
                        value={exp.position}
                        onChange={(e) => updateItem('experience', index, 'position', e.target.value)}
                      />
                      <Input
                        label="Location"
                        value={exp.location}
                        onChange={(e) => updateItem('experience', index, 'location', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => updateItem('experience', index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Skills</h2>
                  <Button size="sm" onClick={() => addItem('skills')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Category
                  </Button>
                </div>
                {(resume.skills || []).map((skill, index) => (
                  <div key={index} className="p-4 border dark:border-gray-700 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <Input
                        label="Category"
                        placeholder="e.g., Programming Languages"
                        value={skill.category}
                        onChange={(e) => updateItem('skills', index, 'category', e.target.value)}
                        className="flex-1 mr-2"
                      />
                      <Button size="sm" variant="ghost" className="text-red-500 mt-6" onClick={() => removeItem('skills', index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      label="Skills (comma-separated)"
                      placeholder="JavaScript, Python, React"
                      value={(skill.items || []).join(', ')}
                      onChange={(e) => updateItem('skills', index, 'items', e.target.value.split(',').map(s => s.trim()))}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Projects</h2>
                  <Button size="sm" onClick={() => addItem('projects')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {(resume.projects || []).map((project, index) => (
                  <div key={index} className="p-4 border dark:border-gray-700 rounded-lg space-y-3">
                    <div className="flex justify-end">
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeItem('projects', index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        label="Project Name"
                        value={project.name}
                        onChange={(e) => updateItem('projects', index, 'name', e.target.value)}
                      />
                      <Input
                        label="Link"
                        value={project.link}
                        onChange={(e) => updateItem('projects', index, 'link', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={project.description}
                        onChange={(e) => updateItem('projects', index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <Input
                      label="Technologies (comma-separated)"
                      value={(project.technologies || []).join(', ')}
                      onChange={(e) => updateItem('projects', index, 'technologies', e.target.value.split(',').map(s => s.trim()))}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'certifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Certifications</h2>
                  <Button size="sm" onClick={() => addItem('certifications')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {(resume.certifications || []).map((cert, index) => (
                  <div key={index} className="p-4 border dark:border-gray-700 rounded-lg space-y-3">
                    <div className="flex justify-end">
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeItem('certifications', index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        label="Certification Name"
                        value={cert.name}
                        onChange={(e) => updateItem('certifications', index, 'name', e.target.value)}
                      />
                      <Input
                        label="Issuer"
                        value={cert.issuer}
                        onChange={(e) => updateItem('certifications', index, 'issuer', e.target.value)}
                      />
                      <Input
                        label="Link"
                        value={cert.link}
                        onChange={(e) => updateItem('certifications', index, 'link', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ResumeEditor
