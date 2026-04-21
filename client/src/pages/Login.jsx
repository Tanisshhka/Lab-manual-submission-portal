import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Floating elements specific to the landing view
const floatingVariants = {
  animate: { y: [0, -15, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }
};

const AnimatedBook = () => {
  return (
    <motion.div 
      className="relative w-64 h-64 flex items-center justify-center bg-gradient-to-tr from-primary-400 to-purple-600 rounded-[3rem] shadow-2xl border-4 border-white/20 dark:border-white/10"
      initial={{ scale: 0.8, rotateY: 90 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <BookOpen size={100} className="text-white drop-shadow-2xl" strokeWidth={1.5} />
      </motion.div>
      
      {/* Decorative Sparkles */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-8 right-12 text-yellow-300"
      >
        <Sparkles size={24} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -15, 0], opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-12 left-10 text-blue-200"
      >
        <Sparkles size={20} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        className="absolute top-10 left-16 text-purple-200"
      >
        <Sparkles size={16} />
      </motion.div>
    </motion.div>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      navigate(user.role === 'faculty' ? '/faculty' : '/student');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-10 p-4 w-full relative z-10">
      {/* Visual / Landing Side */}
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center text-center p-8 hidden md:flex"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div variants={floatingVariants} animate="animate" className="mb-10">
          <AnimatedBook />
        </motion.div>
        
        <motion.h1 
          className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Lab Manual Submission Portal
        </motion.h1>
        
        <motion.p 
          className="text-xl text-slate-500 font-medium max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Sage University's premier platform for fast, AI-assisted lab manual reviews.
        </motion.p>
      </motion.div>

      {/* Login Form Side */}
      <motion.div 
        className="flex-1 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="glass p-10 rounded-[2.5rem] shadow-2xl border border-white/40 dark:border-slate-700/50 backdrop-blur-xl relative overflow-hidden">
          {/* Decorative glow inside card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="text-center mb-10 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-xl shadow-primary-500/30">S</div>
            <h2 className="text-3xl font-black mb-2 text-slate-800 dark:text-white">Login</h2>
            <p className="text-slate-500 font-medium">Access your Sage University portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-sm font-semibold"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 ml-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-sm font-semibold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-500/30 transition-all flex items-center justify-center gap-2 mt-4 text-sm tracking-wider uppercase"
            >
              <LogIn size={20} />
              Sign In
            </motion.button>
          </form>

          <p className="text-center mt-8 text-slate-500 text-sm font-medium relative z-10">
            Don't have an account? <Link to="/signup" className="text-primary-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
