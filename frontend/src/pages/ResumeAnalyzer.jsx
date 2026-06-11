import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  BarChart2, 
  Layout, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  X
} from 'lucide-react';
import ResumeHistory from '../components/ResumeAnalyzer';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const fileInputRef = useRef(null);

  // Loading animation step messages
  const steps = [
    "Reading PDF document structure...",
    "Extracting textual content and metadata...",
    "Analyzing formatting alignment and section hierarchy...",
    "Auditing verb strength and action-oriented impact...",
    "Measuring keyword density and skills relevancy...",
    "Synthesizing recommendations and scoring...",
    "Finalizing report and archiving dashboard snapshots..."
  ];

  // Increment loading step message periodically
  const startLoadingStepper = () => {
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 2500);
    return interval;
  };

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF documents are supported for resume auditing.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Resume file size must be under 5MB.');
      return;
    }
    setFile(selectedFile);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const clearFile = () => {
    setFile(null);
    setError('');
  };

  // Submit file for analysis
  const analyzeResume = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    const stepperInterval = startLoadingStepper();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/resume/analyze', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        let errMsg = 'Failed to analyze the resume.';
        try {
          const errData = await response.json();
          if (errData && errData.detail) {
            errMsg = errData.detail;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      setResult(data);
      // Increment refreshTrigger to automatically reload the History component below!
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to analyze the resume. Please ensure the backend is running and try again.');
    } finally {
      clearInterval(stepperInterval);
      setLoading(false);
    }
  };


  // Circle SVG calculations
  const radius = 52;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const getScoreOffset = (score) => circumference - (score / 100) * circumference;

  return (
    <div className="space-y-12 relative pb-20">
      {/* Ambient background glows */}
      <div className="ambient-glow -top-20 -left-20 animate-pulse-slow"></div>
      <div className="ambient-glow top-60 -right-20 bg-purple-600/10 animate-pulse-slow font-[style:animation-delay:2s]"></div>

      {/* Hero Header */}
      <section className="space-y-4 pt-8 relative z-10">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-400/20">
          Resume AI Auditor
        </span>
        <h1 className="text-5xl font-black tracking-tight text-white mt-4">
          Audit your resume. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 text-glow">Secure the interview.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl font-light leading-relaxed">
          Upload your resume in PDF format to receive instant structural analysis, keywords density score, and high-impact improvement recommendations.
        </p>
      </section>

      {/* Main Analysis Workflow Section */}
      <section className="relative z-10">
        {loading ? (
          /* Premium Loading Stepper State */
          <div className="glass-card rounded-3xl p-16 text-center border border-white/5 flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto text-blue-400 animate-pulse" size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Analyzing Resume...</h3>
            
            {/* Stepper Message Display */}
            <div className="max-w-md bg-slate-950/60 border border-white/5 px-6 py-4 rounded-2xl mt-4 min-h-[60px] flex items-center justify-center">
              <p className="text-sm text-blue-400 font-medium animate-pulse text-center">
                {steps[loadingStep]}
              </p>
            </div>
            
            {/* Stepper Progress Bar */}
            <div className="w-64 bg-slate-800 h-1.5 rounded-full mt-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        ) : result ? (
          /* Results Dashboard View */
          <div className="space-y-6">
            
            {/* Success Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/40 border border-white/5 backdrop-blur-md px-6 py-4 rounded-2xl gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Evaluation Generated Successfully</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Filename: {file ? file.name : "Resume.pdf"}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  clearFile();
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs font-bold transition-all border border-slate-700 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} />
                Audit New Resume
              </button>
            </div>

            {/* Comprehensive Detail View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Overall Score Circle Widget */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none -z-10" />
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Overall ATS Relevancy</h3>
                
                {/* SVG Progress Ring */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      className="text-slate-800/60"
                      strokeWidth={stroke}
                      stroke="currentColor"
                      fill="transparent"
                      r={radius}
                      cx="80"
                      cy="80"
                    />
                    <circle
                      className="text-blue-500 transition-all duration-1000 ease-out"
                      strokeWidth={stroke}
                      strokeDasharray={circumference}
                      strokeDashoffset={getScoreOffset(result.overall_score)}
                      strokeLinecap="round"
                      stroke="url(#scoreRingGradient)"
                      fill="transparent"
                      r={radius}
                      cx="80"
                      cy="80"
                      style={{ filter: "drop-shadow(0px 0px 8px rgba(59, 130, 246, 0.3))" }}
                    />
                    <defs>
                      <linearGradient id="scoreRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Score Text in Center */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white">{result.overall_score}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Relevance</span>
                  </div>
                </div>

                <div className="mt-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                    result.overall_score >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    result.overall_score >= 60 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {result.overall_score >= 80 ? 'Industry Standard Ready' :
                     result.overall_score >= 60 ? 'Needs Refinements' : 'Needs Significant Revision'}
                  </span>
                </div>
              </div>

              {/* Metric Breakdown Progress Panels */}
              <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-white/5 space-y-6">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest pb-3 border-b border-white/5 flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-400" />
                  Category Score Breakdown
                </h3>
                
                <div className="space-y-6">
                  {/* Impact Metrics */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-200 flex items-center gap-2">
                        <BarChart2 size={16} className="text-violet-400" />
                        Impact Metrics
                      </span>
                      <span className="font-bold text-violet-400">{result.impact_metrics.score}/100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full" 
                        style={{ width: `${result.impact_metrics.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 font-light mt-1 pl-6 leading-relaxed">
                      {result.impact_metrics.feedback}
                    </p>
                  </div>

                  {/* Format and Structure */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-200 flex items-center gap-2">
                        <Layout size={16} className="text-blue-400" />
                        Format & Structure
                      </span>
                      <span className="font-bold text-blue-400">{result.formatting_structure.score}/100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full" 
                        style={{ width: `${result.formatting_structure.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 font-light mt-1 pl-6 leading-relaxed">
                      {result.formatting_structure.feedback}
                    </p>
                  </div>

                  {/* Skills Density */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-200 flex items-center gap-2">
                        <Sparkles size={16} className="text-cyan-400" />
                        Skills Density
                      </span>
                      <span className="font-bold text-cyan-400">{result.skills_density.score}/100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-cyan-600 to-emerald-500 h-full rounded-full" 
                        style={{ width: `${result.skills_density.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 font-light mt-1 pl-6 leading-relaxed">
                      {result.skills_density.feedback}
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Strengths & Improvements Double Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Strengths Column */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 bg-slate-900/20">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Key Strengths
                </h3>
                <ul className="space-y-3">
                  {result.strengths.map((str, index) => (
                    <li key={index} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements Column */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 bg-slate-900/20">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-400" />
                  Areas of Improvement
                </h3>
                <ul className="space-y-3">
                  {result.improvements.map((imp, index) => (
                    <li key={index} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        ) : (
          /* Drag & Drop Upload Zone View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Upload Zone Left */}
            <div className="lg:col-span-2">
              <div
                className={`glass-card rounded-3xl p-12 border-2 border-dashed text-center flex flex-col items-center justify-center min-h-[350px] transition-all relative overflow-hidden group ${
                  dragActive 
                    ? "border-blue-500 bg-blue-500/5 shadow-2xl shadow-blue-500/10 scale-[1.01]" 
                    : "border-white/10 bg-slate-900/30 hover:border-white/20 hover:bg-slate-900/40"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleChange}
                />

                {file ? (
                  /* File Selected Display */
                  <div className="space-y-6 animate-message-in">
                    <div className="relative">
                      <div className="h-16 w-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/30 mx-auto text-blue-400">
                        <FileText size={32} />
                      </div>
                      <button 
                        onClick={clearFile}
                        className="absolute -top-1.5 right-[calc(50%-44px)] h-6 w-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">{file.name}</h4>
                      <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>

                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        onClick={clearFile}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full text-xs font-semibold transition-all border border-white/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={analyzeResume}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 cursor-pointer"
                      >
                        Start Analysis
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty State Upload Handler */
                  <div className="space-y-6">
                    <div className="h-16 w-16 bg-slate-900/60 rounded-2xl flex items-center justify-center border border-white/5 mx-auto text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/30 group-hover:scale-110 transition-all duration-300">
                      <UploadCloud size={32} className="transition-transform group-hover:-translate-y-1 duration-300" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white">Drag & drop your resume</h3>
                      <p className="text-slate-400 text-xs max-w-sm mx-auto font-light leading-relaxed">
                        Support for standard resume formats. Make sure your resume is in **PDF format** (Max size 5MB).
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={triggerFileSelect}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs font-bold transition-all border border-slate-700 active:scale-95 cursor-pointer shadow-inner"
                      >
                        Browse Files
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audit guidelines / Info panel Right */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest pb-3 border-b border-white/5 flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-400" />
                Resume Audit Checklist
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">1</div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light mt-0.5">
                    <strong className="text-slate-300 block font-semibold mb-0.5">Quantifiable Accomplishments</strong>
                    Use numeric metrics where possible (e.g. "Increased engagement by 35%").
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">2</div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light mt-0.5">
                    <strong className="text-slate-300 block font-semibold mb-0.5">ATS-Friendly Structure</strong>
                    Avoid multi-column tables or complex graphics that confuse parsers.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">3</div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light mt-0.5">
                    <strong className="text-slate-300 block font-semibold mb-0.5">Relevant Keyword Density</strong>
                    Match your skills list closely to your target job definitions.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-4 rounded-2xl mt-6 text-xs leading-relaxed flex items-center gap-3 animate-message-in">
            <AlertCircle size={18} className="shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
      </section>

      {/* Score Progression Timeline Section */}
      <ResumeHistory refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default ResumeAnalyzer;