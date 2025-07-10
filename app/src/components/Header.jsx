import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, register } from "../services/api";
import useAuthStore from "../store/auth";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const logout = useAuthStore((state) => state.logout);
  const authModalVisible = useAuthStore(state => state.authModalVisible);
  const setAuthModal = useAuthStore(state => state.setAuthModal);

  const handleNavigation = () => {
    if (location.pathname === "/") {
      navigate("/saved");
    } else {
      navigate("/");
    }
  };

  const getNavButtonText = () => {
    return location.pathname === "/" ? "Saved" : "Home";
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              KukAI
            </div>
            
            {isLoggedIn ? (
              <button
                onClick={handleNavigation}
                className="px-3 py-1.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-md text-white transition-all duration-200 text-sm"
              >
                {getNavButtonText()}
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={isLoggedIn ? logout : () => setAuthModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-300/20 to-pink-300/20 backdrop-blur-sm border border-purple-200/30 rounded-md text-white transition-all duration-200 text-sm"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
            {user ? <span className="text-sm text-white font-medium">{user.name}</span> : null}
          </div>
        </div>
      </header>

      {authModalVisible ? (
        <AuthModal onClose={() => setAuthModal(false)} />
      ) : null}
    </>
  );
}

function AuthModal({ onClose }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = isRegisterMode 
        ? await register(formData)
        : await login(formData);
      
      setAuth(response.user, response.token);
      onClose();
    } catch (error) {
      console.error('Auth failed:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex items-start justify-end">
      <div className="bg-gray-900/95 backdrop-blur-lg border border-white/25 rounded-lg p-6 w-80">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-white mb-1">
            {isRegisterMode ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-300 text-sm">
            {isRegisterMode ? "Join KukAI today" : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegisterMode && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-purple-400/50 focus:bg-white/20 transition-all duration-200 text-sm"
                required
              />
            </div>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-purple-400/50 focus:bg-white/20 transition-all duration-200 text-sm"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-purple-400/50 focus:bg-white/20 transition-all duration-200 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-1.5 bg-gradient-to-r from-purple-300/20 to-pink-300/20 backdrop-blur-sm border border-purple-200/30 rounded-md text-white transition-all duration-200 text-sm"
          >
            {isRegisterMode ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-purple-300 transition-colors duration-200 text-sm"
          >
            {isRegisterMode
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Header;