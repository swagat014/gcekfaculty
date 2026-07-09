import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FacultyDirectory from './pages/FacultyDirectory';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FacultyDirectory />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

