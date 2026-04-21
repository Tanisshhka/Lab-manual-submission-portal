import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ setIsSidebarOpen }) => {
  const { user } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [dark]);

  return (
    <header className="h-20 px-4 md:px-6 flex items-center justify-between border-b border-white/30 sticky top-0 z-10 w-full" style={{background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)'}}>
      <div className="flex items-center flex-1 md:max-w-xl gap-2 md:gap-3">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <Menu size={24} />
        </button>
        <div className="relative group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search submissions or students..." 
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 transition-all text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setDark(!dark)}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
