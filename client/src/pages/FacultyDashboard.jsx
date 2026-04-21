import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Clock, Users, BookOpen, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FacultyDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ year: '' });
  const [facultyInfo, setFacultyInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await api.get('/auth/me');
        setFacultyInfo(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContext();
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await api.get('/submissions', { params: filters });
        setSubmissions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">Faculty Dashboard</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg text-xs font-black uppercase tracking-wider">{facultyInfo?.department}</span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg text-xs font-black uppercase tracking-wider">{facultyInfo?.semester}</span>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg text-xs font-black uppercase tracking-wider">{facultyInfo?.subject}</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-6 border border-white/40 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600"><Users size={20} /></div>
              <div className="text-sm">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Submissions</p>
                <p className="font-black text-lg">{submissions.length}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600"><Clock size={20} /></div>
              <div className="text-sm">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Pending Reviews</p>
                <p className="font-black text-lg">{submissions.filter(s => s.status === 'Pending').length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 glass p-4 rounded-3xl border border-white/50 dark:border-slate-800"
      >
        <div className="flex items-center gap-4 px-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Filter By:</span>
          <div className="min-w-[200px]">
            <select 
              className="w-full bg-white/50 dark:bg-slate-800/50 p-3.5 rounded-2xl border-none outline-none text-sm font-semibold shadow-sm focus:ring-2 focus:ring-primary-500 transition-all"
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
            >
              <option value="">All Academic Years</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Grid of Flip Cards instead of Table */}
      {loading ? (
        <div className="flex items-center justify-center p-20 animate-pulse text-slate-400 font-bold">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="flex items-center justify-center p-20 text-slate-500 font-medium">No manual submissions match your filters.</div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          <AnimatePresence>
            {submissions.map((sub, index) => (
              <motion.div
                key={sub._id}
                variants={{
                  hidden: { opacity: 0, rotateY: -90, scale: 0.9 },
                  show: { opacity: 1, rotateY: 0, scale: 1, transition: { type: 'spring', damping: 15 } }
                }}
                whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                className="glass rounded-[2rem] p-6 relative flex flex-col justify-between h-64 cursor-pointer group transition-all duration-300"
                onClick={() => navigate(`/submission/${sub._id}`)}
              >
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    sub.status === 'Reviewed' ? 'bg-emerald-500 text-white' : 
                    sub.status === 'Rejected' ? 'bg-rose-500 text-white' : 
                    'bg-amber-500 text-white'
                  }`}>
                    {sub.status}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-purple-500 text-white flex items-center justify-center font-black text-xl shadow-lg">
                      {sub.student?.name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white leading-tight">{sub.student?.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium truncate max-w-[120px]">{sub.student?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1 mt-6">
                    <p className="font-black text-lg text-slate-800 dark:text-slate-100 leading-tight">{sub.subject}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{sub.semester} • {sub.year} Yr</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-slate-500 group-hover:text-primary-600 transition-colors">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span className="text-xs font-semibold truncate max-w-[100px]">{sub.fileName}</span>
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default FacultyDashboard;
