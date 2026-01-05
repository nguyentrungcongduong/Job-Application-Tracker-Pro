import React, { useState } from 'react';
import { useAuthStore } from '../../store';
import { Sparkles, Mail, Lock, User, ArrowRight, Github, Linkedin, Chrome } from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const { login, register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
        setRegSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="auth-card animate-fade-in glass">
        <div className="auth-header">
          <div className="logo">
            <div className="logo-icon">
              <Sparkles size={32} />
            </div>
            <div className="logo-text">
              <h1 className="gradient-text">JobTracker</h1>
              <span className="logo-subtitle">Pro</span>
            </div>
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Join the Elite'}</h2>
          <p>{isLogin ? 'Login to track your career journey' : 'Start tracking your dream job applications'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {regSuccess ? (
            <div className="registration-success animate-fade-in text-center p-6 bg-primary-900/10 rounded-xl border border-primary-500/20">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-500 rounded-full text-white shadow-glow">
                  <Mail size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Check your email!</h3>
              <p className="text-secondary mb-4">
                We've sent a verification link to <strong>{email}</strong>. 
                Please verify your account to continue.
              </p>
              <button 
                type="button" 
                className="btn btn-secondary w-full"
                onClick={() => {
                  setRegSuccess(false);
                  setIsLogin(true);
                }}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={18} />
                    <input
                      id="name"
                      type="text"
                      className="input"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    id="email"
                    type="email"
                    className="input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="password"
                    type="password"
                    className="input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn btn-primary w-full auth-submit" disabled={loading}>
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </>
          )}
        </form>

        <div className="auth-separator">
          <span>Or continue with</span>
        </div>

        <div className="social-auth">
          <button className="btn btn-secondary social-btn" title="Google (Future)">
            <Chrome size={20} />
          </button>
          <button className="btn btn-secondary social-btn" title="LinkedIn (Future)">
            <Linkedin size={20} />
          </button>
          <button className="btn btn-secondary social-btn" title="GitHub (Future)">
            <Github size={20} />
          </button>
        </div>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button className="auth-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
