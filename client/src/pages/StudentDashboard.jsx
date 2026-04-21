import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Plus, Clock, CheckCircle, XCircle, FileText, ChevronRight, File } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, type: 'spring' }}
    whileHover={{ y: -8, boxShadow: "0px 20px 40px rgba(0,0,0,0.08)" }}
    className="glass p-6 rounded-[2rem] flex items-center justify-between transition-all cursor-pointer"
  >
    <div>
      <p className="text-slate-500 text-sm font-bold mb-1 uppercase tracking-wider">{title}</p>
      <h3 className="text-4xl font-black">{value}</h3>
    </div>
    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${color} text-white shadow-xl bg-gradient-to-br`}>
      <Icon size={32} />
    </div>
  </motion.div>
);

const StudentDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ Total: 0, Pending: 0, Reviewed: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, statRes] = await Promise.all([
          api.get('/submissions'),
          api.get('/submissions/stats')
        ]);
        setSubmissions(subRes.data);
        
        const counts = { Total: subRes.data.length, Pending: 0, Reviewed: 0 };
        statRes.data.forEach(s => {
          if (s._id === 'Pending') counts.Pending = s.count;
          if (s._id === 'Reviewed') counts.Reviewed = s.count;
        });
        setStats(counts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 relative z-10">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 mb-2">Student Dashboard</h1>
          <p className="text-slate-500 font-medium mb-4">Track and manage your lab manual submissions.</p>
          <a 
            href="/sample-manual.pdf" 
            download="Sample_Lab_Manual.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm border border-slate-200 dark:border-white/10 hover:shadow-md hover:-translate-y-0.5 w-max"
          >
            <File size={16} className="text-primary-500" />
            Download Sample Lab Manual
          </a>
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/upload')}
          className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary-500/30 transition-all border border-white/20"
        >
          <Plus size={20} />
          Submit New Manual
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Submissions" value={stats.Total} icon={FileText} color="from-blue-400 to-blue-600 shadow-blue-500/40" delay={0.1} />
        <StatCard title="Pending Review" value={stats.Pending} icon={Clock} color="from-amber-400 to-amber-600 shadow-amber-500/40" delay={0.2} />
        <StatCard title="Reviewed" value={stats.Reviewed} icon={CheckCircle} color="from-emerald-400 to-emerald-600 shadow-emerald-500/40" delay={0.3} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="glass rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/50 dark:border-slate-700/50"
      >
        <div className="p-8 border-b border-white/20 dark:border-slate-800/50 flex justify-between items-center bg-white/30 dark:bg-slate-900/30">
          <h2 className="text-2xl font-black">Recent Submissions</h2>
          <button className="text-primary-600 font-bold text-sm tracking-widest uppercase hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Subject & Sem</th>
                <th className="px-6 py-4">File Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="text-sm"
            >
              {submissions.map((sub) => (
                <motion.tr 
                  variants={rowVariants}
                  key={sub._id} 
                  className="bg-white/40 dark:bg-slate-800/40 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all rounded-2xl shadow-sm group cursor-pointer"
                  onClick={() => navigate(`/submission/${sub._id}`)}
                >
                  <td className="px-6 py-4 rounded-l-2xl">
                    <p className="font-bold text-base">{sub.subject}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">{sub.semester} • {sub.year} Year</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 max-w-[200px] truncate">{sub.fileName}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {new Date(sub.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors duration-500 shadow-sm ${
                      sub.status === 'Reviewed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 
                      sub.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800' : 
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right rounded-r-2xl">
                    <button 
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all inline-flex items-center justify-center text-slate-400 shadow-sm"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-500 font-medium">
                    No submissions found. Start by uploading your first manual.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
