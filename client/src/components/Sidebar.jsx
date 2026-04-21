import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, Users, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const links = user.role === 'student' ? [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Upload Manual', path: '/upload', icon: Upload },
  ] : [
    { name: 'Dashboard', path: '/faculty', icon: LayoutDashboard },
    { name: 'All Students', path: '/faculty/students', icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`w-64 min-h-screen p-4 flex flex-col fixed md:relative z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      style={{
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.35)',
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-10 px-2 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-800 dark:text-white">Sage Portal</h1>
            <p className="text-xs text-slate-500">University Bhopal</p>
          </div>
        </div>
        <button 
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                isActive 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-300/50' 
                  : 'hover:bg-white/40 text-slate-700'
              }`
            }
          >
            <link.icon size={20} />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-100/60 text-rose-600 transition-all mt-auto font-semibold text-sm"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
    </>
  );
};

export default Sidebar;
