import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import UploadPage from './pages/UploadPage';
import SubmissionDetail from './pages/SubmissionDetail';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BackgroundAnimations from './components/BackgroundAnimations';
import { Toaster } from 'react-hot-toast';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const AppContent = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen relative z-0 overflow-hidden">
      <BackgroundAnimations />
      {user && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full max-w-full">
        {user && <Navbar setIsSidebarOpen={setIsSidebarOpen} />}
        <main className={`p-4 md:p-6 w-full`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/student" element={
              <PrivateRoute role="student"><StudentDashboard /></PrivateRoute>
            } />
            <Route path="/upload" element={
              <PrivateRoute role="student"><UploadPage /></PrivateRoute>
            } />
            
            <Route path="/faculty" element={
              <PrivateRoute role="faculty"><FacultyDashboard /></PrivateRoute>
            } />
            
            <Route path="/submission/:id" element={
              <PrivateRoute><SubmissionDetail /></PrivateRoute>
            } />

            <Route path="/" element={<Navigate to={user ? (user.role === 'faculty' ? '/faculty' : '/student') : '/login'} />} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
