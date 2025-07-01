import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Home from './pages/Home';
import InjectionSchedule from './pages/InjectionSchedule';
import OralSchedule from './pages/OralSchedule';
import TravelPlans from './pages/TravelPlans';
import Config from './pages/Config';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';

function App() {
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
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
