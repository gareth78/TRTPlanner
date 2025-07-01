import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Home from './pages/Home';
import InjectionSchedule from './pages/InjectionSchedule';
import OralSchedule from './pages/OralSchedule';
import TravelPlans from './pages/TravelPlans';
import Config from './pages/Config';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './pages/SignupPage';
import { useUser } from './UserContext';

function App() {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ padding: '2rem', flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<InjectionSchedule />} />
            <Route path="/oral" element={<OralSchedule />} />
            <Route path="/travel" element={<TravelPlans />} />
            <Route path="/config" element={<Config />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
