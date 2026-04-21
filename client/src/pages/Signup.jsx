import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

const DEPARTMENTS = ['Computer Science', 'Mechanical', 'Civil', 'Electrical'];

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    role: 'student', 
    year: '', 
    semester: '',
    department: '',
    subject: ''
  });
  const { signup } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signup(formData);
      toast.success('Account created successfully!');
      navigate(user.role === 'faculty' ? '/faculty' : '/student');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass p-8 rounded-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-slate-500">Join the Sage University Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              type="text" required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input 
              type="email" required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select 
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value, year: '', semester: '', subject: ''})}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div className={formData.role === 'faculty' ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select 
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>

          {formData.role === 'student' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value, semester: ''})}
                >
                  <option value="">Select Year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Semester</label>
                <select 
                  required
                  disabled={!formData.year}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                >
                  <option value="">Select Sem</option>
                  {getAvailableSemesters(formData.year).map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Assign Semester</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value, subject: ''})}
                >
                  <option value="">Select Sem</option>
                  {Array.from({length: 8}, (_, i) => (
                    <option key={i+1} value={`Sem ${i+1}`}>Sem {i+1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign Subject</label>
                <select 
                  required
                  disabled={!formData.semester || !formData.department}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <option value="">Select Subject</option>
                  {formData.department && formData.semester && 
                    (DEPARTMENT_SUBJECTS[formData.department]?.[formData.semester] || []).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))
                  }
                </select>
              </div>
            </>
          )}

          <div className="md:col-span-2 mt-4">
            <button 
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Create Account
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-slate-500 text-sm">
          Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

