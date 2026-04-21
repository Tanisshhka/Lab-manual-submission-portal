import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FileText, Download, CheckCircle, XCircle, AlertTriangle, MessageSquare, ArrowLeft, Bot, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper component for typing effect
const TypingEffect = ({ text, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const safeText = String(text || '');
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + safeText.charAt(index));
      index++;
      if (index === safeText.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

const SubmissionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const [aiReviewStarted, setAiReviewStarted] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [approvedTicked, setApprovedTicked] = useState(false);
  const [rejectShake, setRejectShake] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get('/submissions');
        const item = res.data.find(s => s._id === id);
        setSubmission(item);
        setComments(item?.facultyComments || '');
        setStatus(item?.status || '');
      } catch (err) {
        toast.error('Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await api.patch(`/submissions/${id}`, { status, facultyComments: comments });
      setSubmission(res.data);
      toast.success('Submission updated successfully');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === 'Reviewed') {
      setApprovedTicked(true);
      setTimeout(() => setApprovedTicked(false), 1500);
    } else if (newStatus === 'Rejected') {
      setRejectShake(true);
      setTimeout(() => setRejectShake(false), 500);
    }
  };

  const startAiReview = async () => {
    setAiReviewStarted(true);
    setAiTyping(true);
    
    // If no report exists, trigger re-analysis
    if (!hasStructuredReport) {
      try {
        const res = await api.post(`/submissions/${id}/reanalyze`);
        setSubmission(res.data);
        toast.success('AI Analysis completed!');
      } catch (err) {
        console.error('AI Analysis failed:', err);
        toast.error('AI Analysis failed to start');
      }
    } else {
      // If report exists, just show it with a tiny delay for effect
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setAiTyping(false);
  };

  if (loading) return <div className="h-96 flex items-center justify-center animate-pulse text-slate-500">Loading detailed report...</div>;
  if (!submission) return <div className="p-10 text-center text-slate-500">Submission not found</div>;

  // Safely parse aiReport — could be JSON string, plain object, or plain message string
  let aiReport = null;
  const rawReport = submission.aiReport;
  if (rawReport) {
    if (typeof rawReport === 'object') {
      aiReport = rawReport;
    } else if (typeof rawReport === 'string') {
      try {
        const parsed = JSON.parse(rawReport);
        if (parsed && typeof parsed === 'object') aiReport = parsed;
      } catch {
        aiReport = null;
      }
    }
  }
  // Detect stale error reports and treat them as missing so re-analysis is triggered
  const isErrorReport = aiReport && (
    (aiReport.summary && /error|failed|unavailable/i.test(aiReport.summary)) ||
    (aiReport.suggestions && aiReport.suggestions.some(s => /failed|error|unavailable/i.test(s)))
  );
  const hasStructuredReport = aiReport && aiReport.summary && !isErrorReport;

  return (
    <div className="max-w-6xl mx-auto pb-20 relative z-10">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 transition-colors font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* File Info Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-[2.5rem] flex items-center justify-between border border-white/40 shadow-xl">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-purple-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary-500/30">
                <FileText size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-black mb-1 text-slate-800">{submission.subject}</h1>
                <p className="text-slate-500 font-bold">{submission.fileName}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[10px] bg-white/50 border border-slate-200 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-slate-600">{submission.semester}</span>
                  <span className="text-[10px] bg-white/50 border border-slate-200 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-slate-600">{submission.year} Year</span>
                </div>
              </div>
            </div>
            <motion.a 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={submission.fileUrl} 
              target="_blank" 
              rel="noreferrer"
              className="bg-slate-800 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-2xl shadow-slate-900/20"
            >
              <Download size={18} /> Download
            </motion.a>
          </motion.div>

          {/* AI Analysis Section */}
          <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden border border-white/40 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <Bot size={28} />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-800">AI Assistant Review</h2>
              </div>

              {!aiReviewStarted && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startAiReview}
                  className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary-500/30 text-sm"
                >
                  <Bot size={18} /> Review with AI
                </motion.button>
              )}
            </div>

            <AnimatePresence>
              {aiReviewStarted && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6"
                >
                  {aiTyping ? (
                    <div className="flex items-center gap-3 text-primary-600 font-bold p-10 justify-center">
                      <div className="flex gap-2">
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-3 h-3 bg-primary-500 rounded-full" />
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: 0.2, duration: 0.6 }} className="w-3 h-3 bg-primary-500 rounded-full" />
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: 0.4, duration: 0.6 }} className="w-3 h-3 bg-primary-500 rounded-full" />
                      </div>
                      <span className="ml-2">Analyzing document...</span>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      {!hasStructuredReport ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                            <Bot size={32} className="text-primary-500" />
                          </div>
                          <div>
                            <p className="font-black text-lg text-slate-700 mb-1">Ready for AI Review</p>
                            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                              Click the button above to generate a fresh AI-powered analysis of this document.
                            </p>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startAiReview}
                            className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary-500/30 text-sm mt-2"
                          >
                            <Bot size={18} /> Analyze Now
                          </motion.button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div className="bg-primary-50/60 p-6 rounded-3xl border border-primary-100/50">
                            <p className="font-bold text-primary-800 mb-2">Executive Summary</p>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              <TypingEffect text={aiReport.summary || ''} speed={10} />
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h3 className="font-bold flex items-center gap-2 text-rose-600 px-1">
                                <XCircle size={18} /> Missing Headings
                              </h3>
                              <div className="space-y-2">
                                {(aiReport.missingHeadings || []).length > 0 ? (aiReport.missingHeadings || []).map((h, i) => (
                                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (i * 0.1) }} key={i} className="bg-rose-50 py-3 px-4 rounded-xl text-sm text-rose-700 font-bold border border-rose-100 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-rose-400 rounded-full flex-shrink-0"></div>
                                    <TypingEffect text={h} speed={20} />
                                  </motion.div>
                                )) : <p className="text-slate-400 text-sm px-1 italic">All key headings present.</p>}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-bold flex items-center gap-2 text-amber-600 px-1">
                                <AlertTriangle size={18} /> Grammar &amp; Errors
                              </h3>
                              <div className="space-y-2">
                                {(aiReport.grammarIssues || []).length > 0 ? (aiReport.grammarIssues || []).map((h, i) => (
                                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + (i * 0.1) }} key={i} className="bg-amber-50 py-3 px-4 rounded-xl text-sm text-amber-700 font-bold border border-amber-100 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"></div>
                                    <TypingEffect text={h} speed={20} />
                                  </motion.div>
                                )) : <p className="text-slate-400 text-sm px-1 italic">No significant grammar issues.</p>}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-bold flex items-center gap-2 text-primary-600 px-1">
                              <CheckCircle size={18} /> Improvement Suggestions
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                              {(aiReport.suggestions || []).map((s, i) => (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 + (i * 0.2) }} key={i} className="bg-white/60 p-5 rounded-2xl text-sm text-slate-700 shadow-sm flex items-start gap-4 border border-white/50">
                                  <span className="text-primary-500 font-black text-xl leading-none">0{i+1}</span>
                                  <span className="font-medium"><TypingEffect text={s} speed={15} /></span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Faculty Review */}
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass p-8 rounded-[2.5rem] shadow-2xl border border-white/40 sticky top-28">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-xl"><MessageSquare size={20} /></div> Faculty Review
            </h2>
            
            {user.role === 'faculty' ? (
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Manual Status</label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusChange('Reviewed')}
                      className={`relative overflow-hidden py-4 rounded-2xl font-black text-xs transition-all border-2 flex items-center justify-center gap-2 ${
                        status === 'Reviewed' ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/30' : 'bg-white/50 border-white text-slate-500'
                      }`}
                    >
                      {approvedTicked && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 bg-emerald-400 flex items-center justify-center z-10">
                          <Check size={28} className="text-white" strokeWidth={4} />
                        </motion.div>
                      )}
                      APPROVE
                    </motion.button>

                    <motion.button 
                      animate={rejectShake ? { x: [-10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusChange('Rejected')}
                      className={`py-4 rounded-2xl font-black text-xs transition-all border-2 ${
                        status === 'Rejected' ? 'bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-500/30' : 'bg-white/50 border-white text-slate-500'
                      }`}
                    >
                      REJECT
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Feedback / Comments</label>
                  <textarea 
                    rows="6"
                    className="w-full bg-white/50 rounded-2xl p-5 border-2 border-transparent focus:border-primary-500 outline-none text-sm transition-all shadow-inner resize-none font-medium text-slate-700"
                    placeholder="Provide specific feedback, missing details, or corrections to the student..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdate}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-500/30 transition-all text-sm uppercase tracking-wider"
                >
                  Save Evaluation
                </motion.button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/40 p-6 rounded-3xl border border-white/40">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-4">Official Status</p>
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs shadow-sm ${
                    submission.status === 'Reviewed' ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 
                    submission.status === 'Rejected' ? 'bg-rose-500 text-white shadow-rose-500/30' : 
                    'bg-amber-500 text-white shadow-amber-500/30'
                  }`}>
                    {submission.status === 'Reviewed' ? <CheckCircle size={16} /> : submission.status === 'Rejected' ? <XCircle size={16} /> : <Clock size={16} />}
                    {submission.status.toUpperCase()}
                  </div>
                </div>

                <div className="bg-white/40 p-6 rounded-3xl min-h-[150px] border border-white/40">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-4">Faculty Feedback</p>
                  {submission.facultyComments ? (
                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic border-l-4 border-primary-500 pl-4 py-1">"{submission.facultyComments}"</p>
                  ) : (
                    <p className="text-slate-400 text-xs italic font-semibold">Review pending. Please check back later.</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;
