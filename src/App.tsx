import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Home from './pages/Home';
import InjectionSchedule from './pages/InjectionSchedule';
import OralSchedule from './pages/OralSchedule';
import TravelPlans from './pages/TravelPlans';
import Config from './pages/Config';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { UserProvider, useUser } from './context/UserContext';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useUser();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ padding: '2rem', flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/schedule"
                element={(
                  <PrivateRoute>
                    <InjectionSchedule />
                  </PrivateRoute>
                )}
              />
              <Route
                path="/oral"
                element={(
                  <PrivateRoute>
                    <OralSchedule />
                  </PrivateRoute>
                )}
              />
              <Route path="/travel" element={<TravelPlans />} />
              <Route
                path="/config"
                element={(
                  <PrivateRoute>
                    <Config />
                  </PrivateRoute>
                )}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={(
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                )}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
