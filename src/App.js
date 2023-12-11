import React from 'react';
import Signup from './components/login/Signup';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/login/Dashboard';
import Login from './components/login/Login';
import PrivateRoute from './components/login/PrivateRoute';
import ForgotPassword from './components/login/ForgotPassword';
import UpdateProfile from './components/login/UpdateProfile';
import Subjects from './pages/Subjects';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import RecommendedCourses from './pages/RecommendedCourses';
import MechanicalEngineering from './pages/MechanicalEngineering'; // インポート
import Results from './pages/Results';
import VocabularyGraph from './pages/ConnectedWords/VocabularyGraph';

function App() {
  return (
    <Router>
      <div className="main-content"> {/* メインコンテンツのためのクラス */}
            <AuthProvider>
              <Routes>
                <Route exact path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/subjects" element={<PrivateRoute><Subjects /></PrivateRoute>} />
                <Route path="/subjects/mechanical-engineering" element={<MechanicalEngineering />} /> {/* ルーティング設定 */}
                <Route path="/subjects/mechanical-engineering/results" element={<Results />} />
                <Route path="/subjects/mechanical-engineering/results/recommended-courses" element={<RecommendedCourses />} />
                <Route path="/dictionary" element={<VocabularyGraph />} /> {/* New route for Dictionary page */}
              </Routes>
            </AuthProvider>
      </div>
    </Router>
  );
}



export default App;