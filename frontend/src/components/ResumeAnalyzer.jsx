import React, { useState, useEffect } from 'react';
import { Calendar, Award, AlertTriangle, CheckCircle2, FileText, Sparkles, Layout, BarChart2, ShieldAlert } from 'lucide-react';

const ResumeHistory = ({ refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('http://localhost:8000/api/resume/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      
      const data = await response.json();
      setHistory(data);
      // Automatically highlight the latest report if history exists
      if (data.length > 0) {
        setSelectedReport(data[0]);
      } else {
        setSelectedReport(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load resume progression history.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-sm">Loading your history portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center text-rose-400 border border-rose-500/20 max-w-2xl mx-auto my-6">
        <ShieldAlert className="mx-auto mb-3 text-rose-500" size={36} />
        <p className="font-semibold">{error}</p>
        <button 
          onClick={fetchHistory}
          className="mt-4 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs font-semibold transition-colors border border-slate-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="text-blue-400" size={24} />
            Resume Score Progression
          </h2>
          <p className="text-sm text-slate-400 mt-1">Track how your formatting and impact scores improve over time.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center p-12 bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-3xl text-slate-500 flex flex-col items-center justify-center">
          <FileText className="text-slate-600 mb-3" size={40} />
          <p className="max-w-md text-sm">No past resume evaluations found. Upload your first resume above to generate automated progression analytics!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Historical Timeline Snapshots Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-slate-300 px-1">Past Uploads</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {history.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                    selectedReport?.id === report.id
                      ? 'border-blue-500/30 bg-blue-500/5 shadow-lg shadow-blue-500/5'
                      : 'border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-white/10'
                  }`}
                >
                  {/* Selected Indicator Bar */}
                  {selectedReport?.id === report.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r-full" />
                  )}

                  <div className="flex justify-between items-center pl-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium tracking-wide">
                        <Calendar size={12} className="text-slate-500" />
                        <span>{report.date}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-200 mt-1 group-hover:text-white transition-colors">
                        Score Snapshot
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-black ${
                        report.overall_score >= 80 ? 'text-emerald-400 text-glow' :
                        report.overall_score >= 60 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {report.overall_score}
                      </span>
                      <span className="text-xs text-slate-500">/100</span>
                    </div>
                  </div>
                  
                  {/* Compact Progress Mini-Bar Indicator */}
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-3 overflow-hidden ml-2">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        report.overall_score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                        report.overall_score >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                        'bg-gradient-to-r from-rose-500 to-red-400'
                      }`} 
                      style={{ width: `${report.overall_score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Comprehensive Detail Interactive Pane */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="glass-card rounded-3xl p-6 shadow-2xl border border-white/5 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none -z-10" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-400/20">
                      Detailed Audit Report
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">Analysis Results</h3>
                    <p className="text-xs text-slate-400">Evaluated on {selectedReport.date}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 bg-slate-950/60 px-6 py-3 rounded-2xl border border-white/5 text-center flex flex-col justify-center min-w-[120px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overall Score</span>
                    <span className={`text-4xl font-black mt-1 ${
                      selectedReport.overall_score >= 80 ? 'text-emerald-400 text-glow' :
                      selectedReport.overall_score >= 60 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {selectedReport.overall_score}<span className="text-lg font-medium text-slate-500">/100</span>
                    </span>
                  </div>
                </div>

                {/* Core Metric Triple Grid Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Impact Metrics Card */}
                  <div className="p-4 border border-white/5 rounded-2xl bg-slate-950/40 hover:border-white/10 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <BarChart2 size={13} className="text-violet-400" />
                          Impact Metrics
                        </span>
                        <span className={`text-sm font-black ${
                          selectedReport.impact_metrics.score >= 80 ? 'text-emerald-400' :
                          selectedReport.impact_metrics.score >= 60 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {selectedReport.impact_metrics.score}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-violet-500 to-fuchsia-400 h-full rounded-full" 
                          style={{ width: `${selectedReport.impact_metrics.score}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed font-light">
                      {selectedReport.impact_metrics.feedback}
                    </p>
                  </div>

                  {/* Structure & Format Card */}
                  <div className="p-4 border border-white/5 rounded-2xl bg-slate-950/40 hover:border-white/10 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Layout size={13} className="text-blue-400" />
                          Format & Style
                        </span>
                        <span className={`text-sm font-black ${
                          selectedReport.formatting_structure.score >= 80 ? 'text-emerald-400' :
                          selectedReport.formatting_structure.score >= 60 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {selectedReport.formatting_structure.score}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" 
                          style={{ width: `${selectedReport.formatting_structure.score}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed font-light">
                      {selectedReport.formatting_structure.feedback}
                    </p>
                  </div>

                  {/* Skills Density Card */}
                  <div className="p-4 border border-white/5 rounded-2xl bg-slate-950/40 hover:border-white/10 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles size={13} className="text-cyan-400" />
                          Skills Density
                        </span>
                        <span className={`text-sm font-black ${
                          selectedReport.skills_density.score >= 80 ? 'text-emerald-400' :
                          selectedReport.skills_density.score >= 60 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {selectedReport.skills_density.score}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full" 
                          style={{ width: `${selectedReport.skills_density.score}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed font-light">
                      {selectedReport.skills_density.feedback}
                    </p>
                  </div>

                </div>

                {/* Bullets Breakdown View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Strengths Card */}
                  <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10">
                    <h4 className="font-bold text-xs text-emerald-400 mb-3.5 uppercase tracking-widest flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      Audited Strengths
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedReport.strengths.map((str, i) => (
                        <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Changes Card */}
                  <div className="bg-amber-500/5 p-5 rounded-2xl border border-amber-500/10">
                    <h4 className="font-bold text-xs text-amber-400 mb-3.5 uppercase tracking-widest flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-400" />
                      Recommended Actions
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedReport.improvements.map((imp, i) => (
                        <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-3xl p-12 text-slate-500">
                Select an evaluation date from the left pane to view specific metrics.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default ResumeHistory;