import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Button, Card, Spinner, Badge } from '../components/ui';
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  Edit3,
  Sparkles,
  Download,
  Upload,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Code2,
  Palette,
  Briefcase,
} from 'lucide-react';
import { RESUME_TEMPLATES, SAMPLE_RESUMES, THEME_COLORS } from '../constants/resumeTemplates';

const calculateAtsScore = resume => {
  if (!resume) return 0;
  let score = 0;
  // Contact info
  if (resume.personalInfo?.fullName) score += 10;
  if (resume.personalInfo?.email && resume.personalInfo?.phone) score += 10;
  if (resume.personalInfo?.location) score += 5;
  if (resume.personalInfo?.linkedin || resume.personalInfo?.github) score += 5;
  // Summary
  if (resume.personalInfo?.summary && resume.personalInfo.summary.length > 50) score += 15;
  // Experience
  if (resume.experience && resume.experience.length > 0) {
    score += 20;
    if (resume.experience.some(e => e.description && e.description.length > 40)) score += 5;
  }
  // Education
  if (resume.education && resume.education.length > 0) score += 10;
  // Skills
  if (resume.skills && resume.skills.length > 0) {
    score += 15;
    const totalSkills = resume.skills.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
    if (totalSkills >= 6) score += 5;
  }
  return Math.min(100, score);
};

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get('/resumes');
      setResumes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Could not fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const createBlankResume = async (templateId = 'modern') => {
    setCreating(true);
    try {
      const response = await api.post('/resumes', {
        title: `Resume ${resumes.length + 1}`,
        template: templateId,
        themeColor: '#4f46e5',
        fontFamily: 'sans',
      });
      const newResume = response.data.data;
      setResumes([newResume, ...resumes]);
      toast.success('Resume created! Opening editor...');
      navigate(`/resume/${newResume._id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  const createFromPreset = async presetKey => {
    const presetData = SAMPLE_RESUMES[presetKey];
    if (!presetData) return;
    setCreating(true);
    try {
      const response = await api.post('/resumes', {
        ...presetData,
        title: `${presetData.title} (${resumes.length + 1})`,
      });
      const newResume = response.data.data;
      setResumes([newResume, ...resumes]);
      toast.success(`Created from ${presetData.title} template!`);
      navigate(`/resume/${newResume._id}`);
    } catch (error) {
      console.error('Error creating preset resume:', error);
      toast.error('Failed to create template resume');
    } finally {
      setCreating(false);
    }
  };

  const duplicateResume = async id => {
    try {
      const response = await api.post(`/resumes/${id}/duplicate`);
      setResumes([response.data.data, ...resumes]);
      toast.success('Resume duplicated successfully');
    } catch (error) {
      console.error('Error duplicating resume:', error);
      toast.error('Failed to duplicate resume');
    }
  };

  const deleteResume = async id => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
      toast.success('Resume deleted');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  // Import JSON backup
  const handleImportJson = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async evt => {
      try {
        const parsed = JSON.parse(evt.target?.result);
        delete parsed._id;
        delete parsed.user;
        delete parsed.createdAt;
        delete parsed.updatedAt;
        const res = await api.post('/resumes', {
          ...parsed,
          title: `${parsed.title || 'Imported Resume'} (Imported)`,
        });
        setResumes([res.data.data, ...resumes]);
        toast.success('Resume imported successfully!');
        navigate(`/resume/${res.data.data._id}`);
      } catch (err) {
        toast.error('Invalid resume JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Spinner size="lg" />
        <p className="text-sm text-slate-500">Loading your resumes...</p>
      </div>
    );
  }

  const avgScore =
    resumes.length > 0
      ? Math.round(resumes.reduce((acc, r) => acc + calculateAtsScore(r), 0) / resumes.length)
      : 0;

  return (
    <div className="space-y-8 animate-in pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 p-8 md:p-10 text-white shadow-xl shadow-primary-500/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              ATS-Optimized Studio & Live Preview
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Professional Resume Builder
            </h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Craft recruiter-ready, high-converting tech resumes with live A4 preview, ATS
              compatibility score, smart metrics, and one-click PDF export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer">
              <input type="file" accept=".json" className="hidden" onChange={handleImportJson} />
              <span className="inline-flex items-center px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200">
                <Upload className="w-4 h-4 mr-2" />
                Import JSON
              </span>
            </label>

            <Button
              onClick={() => createBlankResume('modern')}
              isLoading={creating}
              className="bg-white text-primary-700 hover:bg-slate-100 shadow-lg font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Blank Resume
            </Button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="relative mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-white/70 font-medium">Saved Resumes</span>
            <p className="text-2xl font-bold">{resumes.length}</p>
          </div>
          <div>
            <span className="text-xs text-white/70 font-medium">Average ATS Readiness</span>
            <p className="text-2xl font-bold flex items-center gap-1.5">
              {avgScore}%
              <TrendingUp className="w-4 h-4 text-emerald-300" />
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs text-white/70 font-medium">Format Standard</span>
            <p className="text-2xl font-bold">100% Recruiter ATS Ready</p>
          </div>
        </div>
      </div>

      {/* Instant Role Presets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-500" />
              One-Click Role Presets
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Start with high-impact, pre-filled software engineering templates and customize
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Full Stack preset */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500/50 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
                  Full Stack / Cloud
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 95% ATS Score
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                Full-Stack Software Engineer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Includes quantified microservice bullets, TypeScript, React 18, Node.js, AWS, and
                system scaling achievements.
              </p>
            </div>
            <button
              onClick={() => createFromPreset('software_engineer')}
              disabled={creating}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-primary-600 hover:text-white text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Frontend preset */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500/50 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/40">
                  Frontend / UI
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 92% ATS Score
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Frontend & UI/UX Engineer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tailored for React, Next.js, design systems, web performance optimization, and
                responsive web apps.
              </p>
            </div>
            <button
              onClick={() => createFromPreset('frontend_developer')}
              disabled={creating}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-600 hover:text-white text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Your Resumes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" />
            Your Resumes ({resumes.length})
          </h2>
        </div>

        {resumes.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/50 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-4 shadow-sm">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No resumes created yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Create your first resume with our live visual studio or start from a pre-filled role
              preset above.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => createBlankResume('modern')} isLoading={creating}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Resume
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map(resume => {
              const score = calculateAtsScore(resume);
              const expCount = resume.experience?.length || 0;
              const skillCount =
                resume.skills?.reduce((a, c) => a + (c.items?.length || 0), 0) || 0;
              const theme = resume.themeColor || '#4f46e5';

              return (
                <div
                  key={resume._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500/50 shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                          {resume.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {resume.personalInfo?.jobTitle || 'Resume Draft'}
                        </p>
                      </div>
                      <div
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: theme }}
                        title="Theme Accent"
                      />
                    </div>

                    {/* Meta badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {resume.template || 'modern'}
                      </span>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          score >= 80
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : score >= 50
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {score}% ATS Score
                      </span>
                    </div>

                    {/* Stats summary */}
                    <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4 border-t border-slate-100 dark:border-slate-800/80">
                      <span>
                        {expCount} Experience{expCount !== 1 ? 's' : ''}
                      </span>
                      <span>•</span>
                      <span>{skillCount} Skills</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <Link to={`/resume/${resume._id}`} className="flex-1">
                      <Button size="sm" variant="primary" fullWidth className="gap-1.5">
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit in Studio
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => duplicateResume(resume._id)}
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteResume(resume._id)}
                      title="Delete"
                      className="text-rose-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ATS Guidelines card */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200/70 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          How to get a 100% ATS-Ready Resume with HireReady:
        </h3>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">1.</span>
            <span>
              Use action verbs (e.g., "Architected", "Engineered", "Optimized") for every bullet.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">2.</span>
            <span>Quantify impact with numbers (e.g., "improved performance by 35%").</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">3.</span>
            <span>
              Include at least 6 core technical skills relevant to your target engineering job.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeBuilder;
