import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { Upload, File, Check, AlertCircle, PenTool } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const AnimatedPen = () => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center mx-auto mb-8">
      {/* Animated Pen */}
      <motion.div
        animate={{ 
          x: [-20, 20, -10, 15, -20], 
          y: [-10, 5, -5, 10, -10],
          rotateZ: [-15, 10, -5, 15, -15]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-10 text-primary-500 drop-shadow-2xl"
      >
        <PenTool size={64} strokeWidth={1.5} />
      </motion.div>
      
      {/* Simulated text lines appearing */}
      <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center gap-2">
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 60, opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"
        />
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 40, opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.7, ease: 'linear' }}
          className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"
        />
      </div>
    </div>
  );
};

const UploadPage = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    year: user?.year || '',
    semester: user?.semester || '',
    subject: ''
  });
  const [uploading, setUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const getAvailableSemesters = (year) => {
    if (year === '1st') return ['Sem 1', 'Sem 2'];
    if (year === '2nd') return ['Sem 3', 'Sem 4'];
    if (year === '3rd') return ['Sem 5', 'Sem 6'];
    if (year === '4th') return ['Sem 7', 'Sem 8'];
    return [];
  };

  const DEPARTMENT_SUBJECTS = {
    'Computer Science': {
      'Sem 1': ['Engineering Physics', 'Basic Civil Engineering', 'Mathematics-I', 'Graphic Science'],
      'Sem 2': ['Engineering Chemistry', 'Basic Mechanical', 'Mathematics-II', 'Basic Electrical'],
      'Sem 3': ['Data Structures', 'OOPS with C++', 'Digital Electronics', 'Mathematics-III'],
      'Sem 4': ['Operating Systems', 'DBMS', 'Analysis of Algorithms', 'Computer Architecture'],
      'Sem 5': ['Computer Networks', 'Software Engineering', 'Theory of Computation', 'Java Programming'],
      'Sem 6': ['Compiler Design', 'Machine Learning', 'Web Technologies', 'Cloud Computing'],
      'Sem 7': ['Artificial Intelligence', 'Cyber Security', 'Big Data', 'Distributed Systems'],
      'Sem 8': ['Deep Learning', 'Neural Networks', 'Embedded Systems', 'Mobile Computing']
    },
    'Mechanical': {
      'Sem 1': ['Engineering Physics', 'Basic Civil Engineering', 'Mathematics-I', 'Graphic Science'],
      'Sem 2': ['Engineering Chemistry', 'Basic Mechanical', 'Mathematics-II', 'Basic Electrical'],
      'Sem 3': ['Thermodynamics', 'Strength of Materials', 'Material Science', 'Machine Drawing'],
      'Sem 4': ['Fluid Mechanics', 'Kinematics of Machines', 'Manufacturing Process', 'Mathematics-IV'],
      'Sem 5': ['Heat Transfer', 'Machine Design-I', 'Turbo Machinery', 'Industrial Engineering'],
      'Sem 6': ['Dynamics of Machinery', 'Machine Design-II', 'Internal Combustion Engines', 'Mechatronics']
    },
    'Civil': {
      'Sem 1': ['Engineering Physics', 'Basic Civil Engineering', 'Mathematics-I', 'Graphic Science'],
      'Sem 2': ['Engineering Chemistry', 'Basic Mechanical', 'Mathematics-II', 'Basic Electrical'],
      'Sem 3': ['Surveying', 'Mechanics of Solids', 'Building Materials', 'Mathematics-III'],
      'Sem 4': ['Concrete Technology', 'Structural Analysis-I', 'Fluid Mechanics-I', 'Hydraulic Machines'],
      'Sem 5': ['Geotechnical Engineering', 'Structural Analysis-II', 'Environmental Engineering', 'Quantity Surveying']
    },
    'Electrical': {
      'Sem 1': ['Engineering Physics', 'Basic Civil Engineering', 'Mathematics-I', 'Graphic Science'],
      'Sem 2': ['Engineering Chemistry', 'Basic Mechanical', 'Mathematics-II', 'Basic Electrical'],
      'Sem 3': ['Network Analysis', 'Signals & Systems', 'Digital Circuits', 'Electro-Magnetic Fields'],
      'Sem 4': ['Electrical Machines-I', 'Power Systems-I', 'Control Systems', 'Electronic Devices']
    }
  };

  const [tempDept, setTempDept] = useState(user?.department || '');
  
  const availableSems = getAvailableSemesters(formData.year);
  const subjects = (DEPARTMENT_SUBJECTS[tempDept] || {})[formData.semester] || [];

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    if (!formData.subject) return toast.error('Please select a subject');

    const data = new FormData();
    data.append('manual', file);
    data.append('year', formData.year);
    data.append('semester', formData.semester);
    data.append('department', tempDept);
    data.append('subject', formData.subject);

    setUploading(true);
    setProgress(0);
    
    // Simulate progress bar while actual upload happens
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 300);

    try {
      await api.post('/submissions/upload', data);
      clearInterval(interval);
      setProgress(100);
      setUploading(false);
      setIsSuccess(true);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4e7abb', '#a1bbdd', '#ffffff']
      });

      toast.success('Manual submitted successfully!');
      setTimeout(() => {
        navigate('/student');
      }, 3000);
      
    } catch (err) {
      clearInterval(interval);
      setUploading(false);
      toast.error(err.response?.data?.msg || 'Upload failed. Please check your file format.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 relative z-10">
      <motion.div 
        className="mb-10 text-center flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black mb-3 text-slate-800 dark:text-white">Upload Lab Manual</h1>
        <p className="text-slate-500 font-medium mb-5">Submit your work for review and AI feedback.</p>
        
        <a 
          href={`${window.location.origin}/sample-manual.pdf`}
          download="Sample_Lab_Manual.pdf"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm border border-slate-200 dark:border-white/10 hover:shadow-md hover:-translate-y-0.5"
        >
          <File size={16} className="text-primary-500" />
          Download Sample Lab Manual
        </a>
      </motion.div>

      <motion.div 
        className="glass p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/40"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {!uploading && !isSuccess && (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleUpload} 
              className="space-y-6"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3 bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-white/20">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Class Context:</span>
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold shadow-sm">{formData.year || 'N/A'} Year</span>
                  
                  <select
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold shadow-sm border-none outline-none appearance-none cursor-pointer"
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value, subject: ''})}
                  >
                    {availableSems.length > 0 ? (
                      availableSems.map(sem => <option key={sem} value={sem}>{sem}</option>)
                    ) : (
                      <option value="">{formData.semester}</option>
                    )}
                  </select>

                  <select
                    className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold shadow-sm border-none outline-none appearance-none cursor-pointer"
                    value={tempDept}
                    onChange={(e) => {
                      setTempDept(e.target.value);
                      setFormData({...formData, subject: ''});
                    }}
                  >
                    <option value="">Choose Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 ml-1">Select Subject</label>
                  <select 
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-sm font-semibold text-slate-700 dark:text-slate-200"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option value="">Choose your Subject</option>
                    {subjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  {subjects.length === 0 && tempDept && formData.semester && (
                    <p className="text-xs text-rose-500 mt-2 font-bold px-2">No subjects found for {tempDept} in {formData.semester}.</p>
                  )}
                  {!tempDept && (
                     <p className="text-xs text-amber-500 mt-2 font-bold px-2">Please select your department above to see the subject list.</p>
                  )}
                </div>
              </div>

              <motion.div 
                whileHover={{ y: -5, boxShadow: "0px 10px 30px rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.98 }}
                className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all cursor-pointer ${
                  file ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 bg-white/30 dark:bg-slate-800/30'
                }`}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                
                <div className="flex flex-col items-center">
                  {file ? (
                    <>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Check size={32} strokeWidth={3} />
                      </motion.div>
                      <p className="font-black text-lg mb-1 text-slate-800 dark:text-white">{file.name}</p>
                      <p className="text-slate-500 font-medium text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-white dark:bg-slate-800 text-slate-400 rounded-full shadow-md flex items-center justify-center mb-4">
                        <Upload size={32} />
                      </div>
                      <p className="font-black text-lg mb-1 tracking-tight text-slate-800 dark:text-white">Click to upload or drag and drop</p>
                      <p className="text-slate-500 font-medium text-sm">PDF, DOC or DOCX (Max 10MB)</p>
                    </>
                  )}
                </div>
              </motion.div>

              <div className="flex items-start gap-3 bg-white/70 dark:bg-slate-800/70 p-5 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                <AlertCircle className="text-primary-600 shrink-0 mt-0.5" size={20} />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our <strong className="text-primary-600 font-black">AI Assistant</strong> will automatically review your manual for required headings, missing experiments, and overall quality immediately upon submission.
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!file}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-all ${
                  !file 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed hidden' 
                    : 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-xl shadow-primary-500/30'
                }`}
              >
                Upload & Analyze Manual
              </motion.button>
            </motion.form>
          )}

          {uploading && (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <AnimatedPen />

              <h2 className="text-2xl font-black mb-2 text-slate-800 dark:text-white mt-6">Analyzing Document...</h2>
              <p className="text-slate-500 font-medium mb-10 text-center max-w-sm">
                Our AI is currently reviewing your manual structure and content.
              </p>
              
              <div className="w-full max-w-md bg-slate-200 dark:bg-slate-800 rounded-full h-4 mb-3 overflow-hidden shadow-inner p-1">
                <motion.div 
                  className="bg-gradient-to-r from-primary-500 to-purple-500 h-full rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm font-black text-primary-600">{progress}%</p>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-28 h-28 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30 relative">
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Check size={56} strokeWidth={3.5} />
                </motion.div>
                {/* Ping effect around circle */}
                <motion.div 
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-4 border-emerald-400"
                />
              </div>
              <h2 className="text-3xl font-black mb-3 text-slate-800 dark:text-white">Submission Complete!</h2>
              <p className="text-slate-500 font-medium text-center">Your lab manual has been successfully analyzed and uploaded.</p>
              <p className="text-xs font-black tracking-widest uppercase text-primary-500 mt-10 animate-pulse bg-primary-50 px-4 py-2 rounded-xl">Redirecting to dashboard...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UploadPage;
