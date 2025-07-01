import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import { handleLogin } from "@/services/auth";
import Logo from "../assets/MediTrack_logo_svg.svg";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin(username, password);
      setError("");
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const loginAsGuest = () => {
    localStorage.setItem("access_token", "guest_token");
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="MediTrack Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Sign in to MediTrack
        </h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <div className="mt-1 relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-accent-primary hover:bg-hover-bg text-white font-semibold py-2 px-4 rounded"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={loginAsGuest}
              className="w-full bg-accent-secondary hover:bg-pink-500 text-white font-semibold py-2 px-4 rounded"
            >
              Continue as Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
