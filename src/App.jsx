import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Flashcards from './pages/Flashcards';
import History from './pages/History';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/flashcards" element={<Flashcards />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/history" element={<History />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
