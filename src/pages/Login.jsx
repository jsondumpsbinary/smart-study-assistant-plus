import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogIn, Mail } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isValidEmail) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Simplistic auth implementation without password logic
    login(username, normalizedEmail);
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-surface border border-surface-hover rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
            <User className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-br from-text-main to-text-muted bg-clip-text text-transparent">
            Welcome
          </h1>
          <p className="text-text-muted mt-2">Sign in to sync and access your study materials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-main mb-2">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 pl-11 text-text-main focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 bg-blur-sm transition-all"
                placeholder="Enter your username"
              />
              <User className="absolute left-3.5 top-3.5 text-text-muted w-5 h-5" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-main mb-2">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 pl-11 text-text-main focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 bg-blur-sm transition-all"
                placeholder="Enter your email"
              />
              <Mail className="absolute left-3.5 top-3.5 text-text-muted w-5 h-5" />
            </div>
            <p className="text-xs text-text-muted mt-2">
              We&apos;ll use this for study reminder emails.
            </p>
          </div>

          {error && <p className="text-error text-sm -mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-primary/25"
          >
            <LogIn size={20} />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
