import React, { forwardRef } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  FolderGit2,
  ExternalLink,
} from 'lucide-react';

const ResumePreview = forwardRef(({ resume, scale = 1 }, ref) => {
  if (!resume) return null;

  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    template = 'modern',
    themeColor = '#4f46e5',
    fontFamily = 'sans',
  } = resume;

  const fontClass =
    fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans';

  // Helper date formatter
  const formatDate = d => {
    if (!d) return '';
    try {
      const date = new Date(d);
      return isNaN(date.getTime())
        ? d
        : date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    } catch {
      return d;
    }
  };

  /* ---------------------------------------------------- */
  /* TEMPLATE 1: MODERN EXECUTIVE                        */
  /* ---------------------------------------------------- */
  const renderModern = () => (
    <div className="p-8 sm:p-10 space-y-6 text-slate-800">
      {/* Header */}
      <div className="border-b-2 pb-5" style={{ borderColor: themeColor }}>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: themeColor }}>
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-base font-semibold text-slate-600 tracking-wide mt-0.5">
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
        </div>

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-3 text-xs text-slate-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" style={{ color: themeColor }} />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" style={{ color: themeColor }} />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" style={{ color: themeColor }} />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5" style={{ color: themeColor }} />
              {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5" style={{ color: themeColor }} />
              {personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" style={{ color: themeColor }} />
              {personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="space-y-1.5">
          <h2
            className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
            style={{ color: themeColor }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-3">
          <h2
            className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
            style={{ color: themeColor }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-start justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{exp.position || 'Role'}</span>
                    <span className="text-slate-600 font-medium">
                      {' '}
                      · {exp.company || 'Company'}
                    </span>
                    {exp.location && <span className="text-slate-400"> ({exp.location})</span>}
                  </div>
                  <span className="text-slate-500 font-medium whitespace-nowrap text-[11px]">
                    {formatDate(exp.startDate)} –{' '}
                    {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs leading-relaxed text-slate-700 pl-3 border-l-2 border-slate-200 whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="space-y-2">
          <h2
            className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
            style={{ color: themeColor }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
            Skills & Competencies
          </h2>
          <div className="space-y-1.5">
            {skills.map((cat, idx) => (
              <div key={idx} className="text-xs flex items-baseline gap-2">
                <span className="font-bold text-slate-800 min-w-[120px] text-[11px]">
                  {cat.category || 'Skills'}:
                </span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {(Array.isArray(cat.items) ? cat.items : []).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="space-y-2.5">
          <h2
            className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
            style={{ color: themeColor }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
            Key Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={idx} className="text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{proj.name}</span>
                  {proj.link && (
                    <span className="text-[11px] font-medium text-slate-500 truncate max-w-[200px]">
                      {proj.link}
                    </span>
                  )}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[11px] font-semibold" style={{ color: themeColor }}>
                    Tech Stack: {(proj.technologies || []).join(' · ')}
                  </p>
                )}
                {proj.description && (
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-2">
          <h2
            className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
            style={{ color: themeColor }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex items-start justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  {edu.field && <span> in {edu.field}</span>}
                  <p className="text-slate-600 font-medium">{edu.institution}</p>
                  {edu.gpa && <p className="text-slate-500 text-[11px]">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-slate-500 whitespace-nowrap text-[11px]">
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="space-y-1.5">
          <h2
            className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
            style={{ color: themeColor }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
            Certifications
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
            {certifications.map((cert, idx) => (
              <div key={idx}>
                <span className="font-semibold text-slate-900">{cert.name}</span>
                {cert.issuer && <span className="text-slate-500"> — {cert.issuer}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /* ---------------------------------------------------- */
  /* TEMPLATE 2: CLASSIC ATS (Single-Column)              */
  /* ---------------------------------------------------- */
  const renderClassic = () => (
    <div className="p-8 sm:p-10 space-y-5 text-slate-900">
      {/* Centered Classic Header */}
      <div className="text-center pb-4 border-b border-slate-300">
        <h1 className="text-2xl font-bold tracking-wide uppercase text-slate-900">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mt-1">
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <span>• {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
          )}
          {personalInfo.github && (
            <span>• {personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-line pt-1">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900">
            Experience
          </h2>
          <div className="space-y-2.5 pt-1">
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold">
                  <span>
                    {exp.position} <span className="font-normal">at {exp.company}</span>
                  </span>
                  <span className="font-normal text-slate-600">
                    {formatDate(exp.startDate)} –{' '}
                    {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900">
            Education
          </h2>
          <div className="space-y-2 pt-1">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <div>
                  <span className="font-bold">{edu.institution}</span>
                  <p className="text-slate-700">
                    {edu.degree} {edu.field ? `in ${edu.field}` : ''}{' '}
                    {edu.gpa ? `(GPA: ${edu.gpa})` : ''}
                  </p>
                </div>
                <span className="text-slate-600">
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900">
            Technical Skills
          </h2>
          <div className="space-y-1 pt-1 text-xs">
            {skills.map((cat, idx) => (
              <div key={idx}>
                <span className="font-bold">{cat.category}: </span>
                <span className="text-slate-700">{(cat.items || []).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900">
            Projects
          </h2>
          <div className="space-y-2 pt-1 text-xs">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold">
                  <span>{proj.name}</span>
                  {proj.link && <span className="font-normal text-slate-500">{proj.link}</span>}
                </div>
                {proj.technologies && (
                  <p className="text-slate-600 font-semibold text-[11px]">
                    Technologies: {proj.technologies.join(', ')}
                  </p>
                )}
                {proj.description && (
                  <p className="text-slate-700 leading-relaxed">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /* ---------------------------------------------------- */
  /* TEMPLATE 3: CREATIVE TWO-COLUMN                      */
  /* ---------------------------------------------------- */
  const renderCreative = () => (
    <div className="grid grid-cols-12 min-h-[900px] text-slate-800">
      {/* Left Sidebar (4 cols) */}
      <div
        className="col-span-4 p-6 sm:p-7 text-white space-y-6"
        style={{ backgroundColor: themeColor }}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-black leading-tight">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-xs font-medium text-white/90 tracking-wide">
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="space-y-2.5 text-xs text-white/90">
          <h3 className="font-bold uppercase tracking-wider text-[11px] text-white/80 border-b border-white/20 pb-1">
            Contact
          </h3>
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2">
              <Github className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{personalInfo.github.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="space-y-2.5 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-white/80 border-b border-white/20 pb-1">
              Skills
            </h3>
            {skills.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="font-bold text-[11px] text-white/95">{cat.category}</p>
                <div className="flex flex-wrap gap-1">
                  {(cat.items || []).map((item, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 text-white font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education in sidebar */}
        {education.length > 0 && (
          <div className="space-y-2 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-white/80 border-b border-white/20 pb-1">
              Education
            </h3>
            {education.map((edu, idx) => (
              <div key={idx} className="space-y-0.5">
                <p className="font-bold text-white leading-tight">{edu.degree}</p>
                <p className="text-white/80 text-[11px]">{edu.institution}</p>
                <p className="text-white/60 text-[10px]">
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column (8 cols) */}
      <div className="col-span-8 p-7 space-y-6">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="space-y-1">
            <h2
              className="text-xs font-bold uppercase tracking-widest border-b pb-1"
              style={{ color: themeColor, borderColor: '#e2e8f0' }}
            >
              About Me
            </h2>
            <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line pt-1">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="space-y-3">
            <h2
              className="text-xs font-bold uppercase tracking-widest border-b pb-1"
              style={{ color: themeColor, borderColor: '#e2e8f0' }}
            >
              Experience
            </h2>
            <div className="space-y-3 pt-1">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">
                      {exp.position}{' '}
                      <span className="font-medium text-slate-600">at {exp.company}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {formatDate(exp.startDate)} –{' '}
                      {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="space-y-3">
            <h2
              className="text-xs font-bold uppercase tracking-widest border-b pb-1"
              style={{ color: themeColor, borderColor: '#e2e8f0' }}
            >
              Projects
            </h2>
            <div className="space-y-2.5 pt-1">
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-0.5 text-xs">
                  <div className="flex justify-between items-baseline font-bold">
                    <span className="text-slate-900">{proj.name}</span>
                    {proj.link && (
                      <span className="font-normal text-slate-500 text-[11px]">{proj.link}</span>
                    )}
                  </div>
                  {proj.technologies && (
                    <p className="text-[11px] font-semibold" style={{ color: themeColor }}>
                      Stack: {proj.technologies.join(', ')}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      id="printable-resume"
      className={`bg-white text-slate-900 shadow-2xl rounded-sm mx-auto overflow-hidden transition-all ${fontClass}`}
      style={{
        width: '100%',
        maxWidth: '820px',
        minHeight: '1060px',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      {template === 'classic'
        ? renderClassic()
        : template === 'creative'
          ? renderCreative()
          : renderModern()}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
