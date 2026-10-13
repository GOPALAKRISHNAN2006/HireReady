import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Button, Card, Input, Spinner, Badge } from '../components/ui';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Download,
  Eye,
  FileText,
  Sparkles,
  Copy,
  Printer,
  Palette,
  Check,
  ChevronDown,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldCheck,
  Wand2,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  User,
  Sliders,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import ResumePreview from '../components/resume/ResumePreview';
import { downloadResumeAsPdf, printResumeDocument } from '../utils/pdfExport';
import {
  THEME_COLORS,
  FONT_OPTIONS,
  RESUME_TEMPLATES,
  ACTION_VERBS,
  SAMPLE_RESUMES,
} from '../constants/resumeTemplates';

const calculateAtsScore = resume => {
  if (!resume) return 0;
  let score = 0;
  if (resume.personalInfo?.fullName) score += 10;
  if (resume.personalInfo?.email && resume.personalInfo?.phone) score += 10;
  if (resume.personalInfo?.location) score += 5;
  if (resume.personalInfo?.linkedin || resume.personalInfo?.github) score += 5;
  if (resume.personalInfo?.summary && resume.personalInfo.summary.length > 50) score += 15;
  if (resume.experience && resume.experience.length > 0) {
    score += 20;
    if (resume.experience.some(e => e.description && e.description.length > 40)) score += 5;
  }
  if (resume.education && resume.education.length > 0) score += 10;
  if (resume.skills && resume.skills.length > 0) {
    score += 15;
    const totalSkills = resume.skills.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
    if (totalSkills >= 6) score += 5;
  }
  return Math.min(100, score);
};

const SUGGESTED_SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'JavaScript (ES6+)',
  'Python',
  'Next.js',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Docker',
  'AWS',
  'Tailwind CSS',
  'GraphQL',
  'Git / GitHub CI',
  'Jest / Unit Testing',
  'REST APIs',
];

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'edit' | 'preview'
  const [previewZoom, setPreviewZoom] = useState(0.85);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await api.get(`/resumes/${id}`);
      const data = response.data.data;
      if (!data.themeColor) data.themeColor = '#4f46e5';
      if (!data.fontFamily) data.fontFamily = 'sans';
      if (!data.template) data.template = 'modern';
      setResume(data);
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to load resume');
      navigate('/resume');
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async (showToast = true) => {
    setSaving(true);
    try {
      await api.put(`/resumes/${id}`, resume);
      if (showToast) toast.success('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error(error.response?.data?.message || 'Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section, field, value) => {
    setResume(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const addItem = section => {
    const newItem =
      section === 'education'
        ? {
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            current: false,
            gpa: '',
          }
        : section === 'experience'
          ? {
              company: '',
              position: '',
              location: '',
              startDate: '',
              endDate: '',
              current: false,
              description: '',
              achievements: [],
            }
          : section === 'projects'
            ? { name: '', description: '', technologies: [], link: '' }
            : section === 'skills'
              ? { category: 'Core Skills', items: [] }
              : { name: '', issuer: '', date: '', link: '' };

    setResume(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
  };

  const removeItem = (section, index) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const updateItem = (section, index, field, value) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const insertActionVerb = (verb, section, index) => {
    if (section === 'experience') {
      const current = resume.experience?.[index]?.description || '';
      const addition = current ? `${current}\n• ${verb} ` : `• ${verb} `;
      updateItem('experience', index, 'description', addition);
    }
  };

  const addSuggestedSkill = skillName => {
    setResume(prev => {
      const currentSkills = [...(prev.skills || [])];
      if (currentSkills.length === 0) {
        currentSkills.push({ category: 'Technical Skills', items: [skillName] });
      } else {
        const first = { ...currentSkills[0] };
        if (!first.items) first.items = [];
        if (!first.items.includes(skillName)) {
          first.items = [...first.items, skillName];
          currentSkills[0] = first;
        }
      }
      return { ...prev, skills: currentSkills };
    });
    toast.success(`Added ${skillName} to skills!`);
  };

  const loadSampleData = () => {
    if (
      window.confirm(
        'Load sample Software Engineer data? This will overwrite existing draft fields.'
      )
    ) {
      const sample = SAMPLE_RESUMES.software_engineer;
      setResume(prev => ({
        ...prev,
        personalInfo: sample.personalInfo,
        experience: sample.experience,
        education: sample.education,
        skills: sample.skills,
        projects: sample.projects,
        certifications: sample.certifications,
      }));
      toast.success('Sample data loaded!');
    }
  };

  const exportAsJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${resume.title || 'resume'}.json`);
    dlAnchor.click();
    toast.success('Exported JSON backup!');
  };

  const copyPlainText = () => {
    const lines = [];
    if (resume.personalInfo?.fullName) lines.push(resume.personalInfo.fullName.toUpperCase());
    if (resume.personalInfo?.jobTitle) lines.push(resume.personalInfo.jobTitle);
    const contact = [
      resume.personalInfo?.email,
      resume.personalInfo?.phone,
      resume.personalInfo?.location,
      resume.personalInfo?.linkedin,
      resume.personalInfo?.github,
    ]
      .filter(Boolean)
      .join(' | ');
    if (contact) lines.push(contact);

    if (resume.personalInfo?.summary) {
      lines.push('\nPROFESSIONAL SUMMARY\n' + resume.personalInfo.summary);
    }

    if (resume.experience?.length) {
      lines.push('\nWORK EXPERIENCE');
      resume.experience.forEach(e => {
        lines.push(
          `${e.position} at ${e.company} (${e.startDate || ''} - ${e.current ? 'Present' : e.endDate || ''})`
        );
        if (e.description) lines.push(e.description);
      });
    }

    if (resume.skills?.length) {
      lines.push('\nTECHNICAL SKILLS');
      resume.skills.forEach(s => {
        lines.push(`${s.category}: ${(s.items || []).join(', ')}`);
      });
    }

    if (resume.projects?.length) {
      lines.push('\nKEY PROJECTS');
      resume.projects.forEach(p => {
        lines.push(`${p.name} - ${(p.technologies || []).join(', ')}`);
        if (p.description) lines.push(p.description);
      });
    }

    if (resume.education?.length) {
      lines.push('\nEDUCATION');
      resume.education.forEach(ed => {
        lines.push(`${ed.degree} in ${ed.field || ''} - ${ed.institution}`);
      });
    }

    navigator.clipboard.writeText(lines.join('\n'));
    toast.success('Resume copied to clipboard for ATS application forms!');
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) {
      toast.error('Resume preview is not ready yet');
      return;
    }
    setExportingPdf(true);
    try {
      const filename = `${resume.personalInfo?.fullName || resume.title || 'Resume'}_Resume`;
      await downloadResumeAsPdf(printRef.current, filename);
    } catch (err) {
      console.error('Download PDF error:', err);
    } finally {
      setExportingPdf(false);
    }
  };

  const handlePrint = () => {
    printResumeDocument();
  };

  const handleAiReview = async () => {
    setAnalyzingAi(true);
    setAiModalOpen(true);
    try {
      // Save current state first so server evaluates latest edits
      await api.put(`/resumes/${id}`, resume);
      const res = await api.post(`/resumes/${id}/analyze`, {
        targetRole: resume.personalInfo?.jobTitle || 'Software Engineer',
      });
      if (res.data?.data) {
        setAiFeedback(res.data.data);
        toast.success('AI Resume Analysis complete!');
      }
    } catch (err) {
      console.error('AI Review error:', err);
      toast.error('AI analysis encountered an error. Please try again.');
    } finally {
      setAnalyzingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Spinner size="lg" />
        <p className="text-sm text-slate-500">Opening Resume Studio...</p>
      </div>
    );
  }

  if (!resume) return null;

  const atsScore = calculateAtsScore(resume);

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    {
      id: 'experience',
      label: 'Work Experience',
      icon: Briefcase,
      count: resume.experience?.length || 0,
    },
    {
      id: 'education',
      label: 'Education',
      icon: GraduationCap,
      count: resume.education?.length || 0,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Code2,
      count: resume.skills?.reduce((a, c) => a + (c.items?.length || 0), 0) || 0,
    },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: resume.projects?.length || 0 },
    {
      id: 'certifications',
      label: 'Certifications',
      icon: Award,
      count: resume.certifications?.length || 0,
    },
    { id: 'design', label: 'Template & Design', icon: Palette },
  ];

  return (
    <div className="space-y-6 animate-in pb-12">
      {/* High-Precision Printable Style Sheet injection */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 8mm;
          }
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          #resume-preview-panel,
          #resume-preview-panel * {
            display: block !important;
            visibility: visible !important;
          }
          #printable-resume,
          #printable-resume * {
            visibility: visible !important;
          }
          #printable-resume {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
            background: #ffffff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Studio Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/resume')}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Resumes
          </Button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={resume.title || ''}
              onChange={e => setResume({ ...resume, title: e.target.value })}
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-primary-500 outline-none px-1 py-0.5 rounded transition-all"
              placeholder="Resume Name"
            />
          </div>

          <span
            className={`hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
              atsScore >= 80
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {atsScore}% ATS Ready
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle (mobile / small screen) */}
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium xl:hidden">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'edit'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500'
              }`}
            >
              Preview
            </button>
          </div>

          {/* AI Review */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleAiReview}
            isLoading={analyzingAi}
            title="Get AI critique, missing keywords, and suggestions"
            className="text-xs gap-1.5 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">AI Review</span>
          </Button>

          {/* Copy Plain Text */}
          <Button
            size="sm"
            variant="outline"
            onClick={copyPlainText}
            title="Copy plain text for ATS application forms"
            className="text-xs gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Copy Text</span>
          </Button>

          {/* Print / System PDF */}
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            title="Open browser print dialog or Save to PDF"
            className="text-xs gap-1 text-slate-700 dark:text-slate-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </Button>

          {/* Direct Download PDF Button */}
          <Button
            size="sm"
            variant="primary"
            onClick={handleDownloadPdf}
            isLoading={exportingPdf}
            title="Directly download high-resolution A4 PDF"
            className="text-xs gap-1.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-primary-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </Button>

          {/* Save Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => saveResume(true)}
            isLoading={saving}
            className="text-xs gap-1"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </Button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT PANE: Editor Controls (xl:col-span-6)               */}
        {/* ======================================================== */}
        <div
          className={`space-y-5 ${
            viewMode === 'preview' ? 'hidden xl:block xl:col-span-6' : 'xl:col-span-6'
          }`}
        >
          {/* Section Navigation Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
            {sections.map(sec => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.label}</span>
                  {sec.count !== undefined && sec.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {sec.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section Editor Card */}
          <Card className="p-6">
            {/* 1. PERSONAL INFO */}
            {activeSection === 'personal' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Personal & Contact Information
                    </h2>
                    <p className="text-xs text-slate-400">
                      Your header info appears right at the top of the resume
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={loadSampleData}
                    className="text-xs text-primary-600"
                  >
                    <Wand2 className="w-3.5 h-3.5 mr-1" />
                    Load Sample
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Alex Rivera"
                    value={resume.personalInfo?.fullName || ''}
                    onChange={e => updateField('personalInfo', 'fullName', e.target.value)}
                  />
                  <Input
                    label="Job Title / Headline"
                    placeholder="e.g. Senior Full Stack Software Engineer"
                    value={resume.personalInfo?.jobTitle || ''}
                    onChange={e => updateField('personalInfo', 'jobTitle', e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="alex.dev@gmail.com"
                    value={resume.personalInfo?.email || ''}
                    onChange={e => updateField('personalInfo', 'email', e.target.value)}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+1 (555) 019-2834"
                    value={resume.personalInfo?.phone || ''}
                    onChange={e => updateField('personalInfo', 'phone', e.target.value)}
                  />
                  <Input
                    label="Location (City, State / Remote)"
                    placeholder="San Francisco, CA"
                    value={resume.personalInfo?.location || ''}
                    onChange={e => updateField('personalInfo', 'location', e.target.value)}
                  />
                  <Input
                    label="LinkedIn Profile URL"
                    placeholder="linkedin.com/in/username"
                    value={resume.personalInfo?.linkedin || ''}
                    onChange={e => updateField('personalInfo', 'linkedin', e.target.value)}
                  />
                  <Input
                    label="GitHub Profile URL"
                    placeholder="github.com/username"
                    value={resume.personalInfo?.github || ''}
                    onChange={e => updateField('personalInfo', 'github', e.target.value)}
                  />
                  <Input
                    label="Portfolio / Website URL"
                    placeholder="alexrivera.dev"
                    value={resume.personalInfo?.portfolio || ''}
                    onChange={e => updateField('personalInfo', 'portfolio', e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Professional Summary
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {resume.personalInfo?.summary?.length || 0} characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={resume.personalInfo?.summary || ''}
                    onChange={e => updateField('personalInfo', 'summary', e.target.value)}
                    placeholder="High-impact 2-4 sentences highlighting your years of experience, core technical specialties, and top achievements..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* 2. WORK EXPERIENCE */}
            {activeSection === 'experience' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Work Experience ({resume.experience?.length || 0})
                    </h2>
                    <p className="text-xs text-slate-400">
                      Highlight achievements with action verbs and quantifiable metrics
                    </p>
                  </div>
                  <Button size="sm" onClick={() => addItem('experience')} className="text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Position
                  </Button>
                </div>

                {(resume.experience || []).map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Role #{idx + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('experience', idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 h-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input
                        label="Job Title / Position"
                        placeholder="e.g. Senior Software Engineer"
                        value={exp.position || ''}
                        onChange={e => updateItem('experience', idx, 'position', e.target.value)}
                      />
                      <Input
                        label="Company / Organization"
                        placeholder="e.g. Stripe, Google, StartUp Inc."
                        value={exp.company || ''}
                        onChange={e => updateItem('experience', idx, 'company', e.target.value)}
                      />
                      <Input
                        label="Location"
                        placeholder="e.g. San Francisco, CA / Remote"
                        value={exp.location || ''}
                        onChange={e => updateItem('experience', idx, 'location', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Start Date
                          </label>
                          <input
                            type="month"
                            value={exp.startDate ? String(exp.startDate).slice(0, 7) : ''}
                            onChange={e =>
                              updateItem('experience', idx, 'startDate', e.target.value)
                            }
                            className="w-full px-2.5 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            End Date
                          </label>
                          <input
                            type="month"
                            disabled={exp.current}
                            value={exp.endDate ? String(exp.endDate).slice(0, 7) : ''}
                            onChange={e => updateItem('experience', idx, 'endDate', e.target.value)}
                            className="w-full px-2.5 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-white disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={Boolean(exp.current)}
                        onChange={e => updateItem('experience', idx, 'current', e.target.checked)}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span>I currently work here</span>
                    </label>

                    {/* Bullet Points with Action Verb Helpers */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Bullet Points & Achievements
                        </label>
                      </div>

                      {/* Quick Action Verbs Chips */}
                      <div className="flex flex-wrap items-center gap-1 py-1">
                        <span className="text-[10px] font-bold text-slate-400 mr-1">
                          Insert Verb:
                        </span>
                        {[
                          'Architected',
                          'Spearheaded',
                          'Optimized',
                          'Scaled',
                          'Automated',
                          'Engineered',
                        ].map(v => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => insertActionVerb(v, 'experience', idx)}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 hover:bg-primary-100 transition-colors"
                          >
                            + {v}
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={4}
                        value={exp.description || ''}
                        onChange={e => updateItem('experience', idx, 'description', e.target.value)}
                        placeholder="• Spearheaded development of XYZ feature using React and Node.js, increasing engagement by 25%&#10;• Reduced server latency by 40% by implementing Redis caching"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. SKILLS */}
            {activeSection === 'skills' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Technical Skills
                    </h2>
                    <p className="text-xs text-slate-400">
                      Organize your competencies by category (e.g. Languages, Frameworks, Cloud)
                    </p>
                  </div>
                  <Button size="sm" onClick={() => addItem('skills')} className="text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Category
                  </Button>
                </div>

                {/* Quick Add Suggested Skills */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Quick-Add In-Demand Tech Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_SKILLS.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSuggestedSkill(skill)}
                        className="px-2 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 text-slate-700 dark:text-slate-300 hover:text-primary-600 transition-all"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {(resume.skills || []).map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Input
                        label="Skill Category Name"
                        placeholder="e.g. Languages, Frameworks, Cloud & DevOps"
                        value={cat.category || ''}
                        onChange={e => updateItem('skills', idx, 'category', e.target.value)}
                        className="flex-1 mr-3"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('skills', idx)}
                        className="text-rose-500 hover:text-rose-700 mt-5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <Input
                      label="Skills (comma-separated)"
                      placeholder="React, TypeScript, Next.js, Node.js"
                      value={(cat.items || []).join(', ')}
                      onChange={e =>
                        updateItem(
                          'skills',
                          idx,
                          'items',
                          e.target.value
                            .split(',')
                            .map(s => s.trim())
                            .filter(Boolean)
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 4. PROJECTS */}
            {activeSection === 'projects' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Key Technical Projects ({resume.projects?.length || 0})
                    </h2>
                    <p className="text-xs text-slate-400">
                      Showcase apps with tech stack and live demo or GitHub links
                    </p>
                  </div>
                  <Button size="sm" onClick={() => addItem('projects')} className="text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Project
                  </Button>
                </div>

                {(resume.projects || []).map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Project #{idx + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('projects', idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 h-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input
                        label="Project Title"
                        placeholder="e.g. TaskStream - Realtime Kanban"
                        value={proj.name || ''}
                        onChange={e => updateItem('projects', idx, 'name', e.target.value)}
                      />
                      <Input
                        label="Live Demo / Repository URL"
                        placeholder="https://github.com/username/project"
                        value={proj.link || ''}
                        onChange={e => updateItem('projects', idx, 'link', e.target.value)}
                      />
                    </div>

                    <Input
                      label="Technologies Used (comma-separated)"
                      placeholder="React, Socket.IO, Redis, Docker, Tailwind"
                      value={(proj.technologies || []).join(', ')}
                      onChange={e =>
                        updateItem(
                          'projects',
                          idx,
                          'technologies',
                          e.target.value
                            .split(',')
                            .map(t => t.trim())
                            .filter(Boolean)
                        )
                      }
                    />

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Description & Highlights
                      </label>
                      <textarea
                        rows={2}
                        value={proj.description || ''}
                        onChange={e => updateItem('projects', idx, 'description', e.target.value)}
                        placeholder="Brief summary of the architecture, key technical challenge solved, and measurable impact..."
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. EDUCATION */}
            {activeSection === 'education' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Education & Degrees ({resume.education?.length || 0})
                    </h2>
                    <p className="text-xs text-slate-400">
                      Universities, degrees, GPA, and graduation dates
                    </p>
                  </div>
                  <Button size="sm" onClick={() => addItem('education')} className="text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Degree
                  </Button>
                </div>

                {(resume.education || []).map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Education #{idx + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('education', idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 h-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input
                        label="University / Institution"
                        placeholder="e.g. University of California, Berkeley"
                        value={edu.institution || ''}
                        onChange={e => updateItem('education', idx, 'institution', e.target.value)}
                      />
                      <Input
                        label="Degree"
                        placeholder="e.g. Bachelor of Science"
                        value={edu.degree || ''}
                        onChange={e => updateItem('education', idx, 'degree', e.target.value)}
                      />
                      <Input
                        label="Major / Field of Study"
                        placeholder="e.g. Computer Science"
                        value={edu.field || ''}
                        onChange={e => updateItem('education', idx, 'field', e.target.value)}
                      />
                      <Input
                        label="GPA (optional)"
                        placeholder="e.g. 3.85 / 4.0"
                        value={edu.gpa || ''}
                        onChange={e => updateItem('education', idx, 'gpa', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. CERTIFICATIONS */}
            {activeSection === 'certifications' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Certifications & Licenses ({resume.certifications?.length || 0})
                    </h2>
                    <p className="text-xs text-slate-400">
                      AWS, Google Cloud, Meta certifications or credentials
                    </p>
                  </div>
                  <Button size="sm" onClick={() => addItem('certifications')} className="text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Certificate
                  </Button>
                </div>

                {(resume.certifications || []).map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Certification #{idx + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('certifications', idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 h-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input
                        label="Certificate Name"
                        placeholder="e.g. AWS Certified Solutions Architect"
                        value={cert.name || ''}
                        onChange={e => updateItem('certifications', idx, 'name', e.target.value)}
                      />
                      <Input
                        label="Issuing Organization"
                        placeholder="e.g. Amazon Web Services"
                        value={cert.issuer || ''}
                        onChange={e => updateItem('certifications', idx, 'issuer', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. TEMPLATE & DESIGN */}
            {activeSection === 'design' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Template & Visual Customization
                  </h2>
                  <p className="text-xs text-slate-400">
                    Switch layout templates, accent colors, and typography in real-time
                  </p>
                </div>

                {/* Templates Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select Layout Template:
                  </label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {RESUME_TEMPLATES.map(tpl => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setResume({ ...resume, template: tpl.id })}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          resume.template === tpl.id
                            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/40 shadow-sm ring-2 ring-primary-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {tpl.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-semibold">
                            {tpl.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                          {tpl.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Accent Color:
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {THEME_COLORS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setResume({ ...resume, themeColor: c.hex })}
                        title={c.name}
                        className={`w-8 h-8 rounded-full transition-transform flex items-center justify-center ${
                          resume.themeColor === c.hex
                            ? 'scale-110 ring-2 ring-offset-2 ring-slate-400'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {resume.themeColor === c.hex && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Family Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Font Family:
                  </label>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {FONT_OPTIONS.map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setResume({ ...resume, fontFamily: f.id })}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                          resume.fontFamily === f.id
                            ? 'border-primary-500 bg-primary-50/50 text-primary-700 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export & Portability Options */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Export & Share Options
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleDownloadPdf}
                      isLoading={exportingPdf}
                      className="text-xs gap-1.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 text-white font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download A4 PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePrint}
                      className="text-xs gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print / System PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyPlainText}
                      className="text-xs gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Plain Text
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={exportAsJson}
                      className="text-xs gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download JSON
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANE: Live A4 Document Preview (xl:col-span-6)     */}
        {/* ======================================================== */}
        <div
          id="resume-preview-panel"
          className={`space-y-3 ${
            viewMode === 'edit' ? 'hidden xl:block xl:col-span-6' : 'xl:col-span-6'
          }`}
        >
          {/* Zoom & View Controls */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-primary-500" />
              Live Interactive A4 Sheet
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewZoom(z => Math.max(0.6, z - 0.1))}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono min-w-[40px] text-center">
                {Math.round(previewZoom * 100)}%
              </span>
              <button
                onClick={() => setPreviewZoom(z => Math.min(1.2, z + 0.1))}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewZoom(0.85)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
                title="Reset zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Container */}
          <div className="overflow-x-auto p-4 sm:p-6 bg-slate-200/70 dark:bg-slate-950/70 rounded-2xl border border-slate-300/60 dark:border-slate-800 flex justify-center shadow-inner min-h-[700px]">
            <div style={{ transform: `scale(${previewZoom})`, transformOrigin: 'top center' }}>
              <ResumePreview ref={printRef} resume={resume} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Resume Review Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    AI Resume Critique & Analysis
                  </h3>
                  <p className="text-xs text-slate-500">
                    Target Role:{' '}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {resume.personalInfo?.jobTitle || 'Software Engineer'}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {analyzingAi ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <Spinner size="lg" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Analyzing skills, action verbs, and ATS keywords...
                </p>
                <p className="text-xs text-slate-400">
                  Scanning your resume against industry recruiter rubrics
                </p>
              </div>
            ) : aiFeedback ? (
              <div className="space-y-5">
                {/* Score Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Overall Readiness Score
                    </span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                      {aiFeedback.overall_readiness || atsScore}%
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      (aiFeedback.overall_readiness || atsScore) >= 75
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {(aiFeedback.overall_readiness || atsScore) >= 75
                      ? 'Strong Candidate'
                      : 'Needs Polish'}
                  </span>
                </div>

                {/* Detected Skills */}
                {aiFeedback.skills && aiFeedback.skills.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Detected Core Competencies ({aiFeedback.skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {aiFeedback.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {aiFeedback.strengths && aiFeedback.strengths.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Key Strengths
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {aiFeedback.strengths.map((st, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Gaps & Improvements */}
                {aiFeedback.gaps && aiFeedback.gaps.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      Recommended Improvements & Gaps
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {aiFeedback.gaps.map((gp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{gp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Topics */}
                {aiFeedback.recommended_topics && aiFeedback.recommended_topics.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                      Target Interview Topics To Practice
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {aiFeedback.recommended_topics.map((tp, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40"
                        >
                          {tp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={() => setAiModalOpen(false)}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownloadPdf}
                    isLoading={exportingPdf}
                    className="gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Ready PDF
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;
