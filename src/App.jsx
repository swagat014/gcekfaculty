import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FacultyDirectory from './pages/FacultyDirectory';
import Feedback from './pages/Feedback';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FacultyDirectory />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default App;

