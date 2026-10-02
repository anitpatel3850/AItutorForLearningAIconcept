import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Zap
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { useAuth } from '../context/GameContext';
import { sound } from '../utils/audio';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('explorer@aiquest.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Where to redirect after login (default /dashboard)
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  // If already authenticated, redirect to destination
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(fromLocation, { replace: true });
    }
  }, [isAuthenticated, navigate, fromLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await login({ email, password, rememberMe });
      if (result.success) {
        navigate(fromLocation, { replace: true });
      } else {
        setErrorMessage(result.error || 'Failed to authenticate neural link.');
        sound.playWrong();
      }
    } catch (err) {
      setErrorMessage('An unexpected connection error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    sound.playClick();
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        navigate(fromLocation, { replace: true });
      }
    } catch (err) {
      setErrorMessage('Google authentication service unavailable.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleQuickDemo = () => {
    sound.playClick();
    setEmail('explorer@aiquest.io');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      <ParticleBackground />

      <div className="w-full max-w-md relative z-10 my-auto">
        {/* Brand Emblem */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-[1.5px] shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow">
              <div className="w-full h-full bg-[#070913] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <span className="font-display font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
              AI QUEST
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <Card glow="cyan" className="p-6 sm:p-8 bg-[#0C1024]/90 border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] space-y-6">
          <div className="space-y-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>TERMINAL ACCESS // GATEWAY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Welcome Back, AI Explorer
            </h1>
            <p className="text-xs text-slate-300">
              Log into your neural terminal and resume your AI Quest.
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@aiquest.io"
                  className="w-full bg-slate-950/80 border border-white/15 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-white/15 focus:border-cyan-400 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0 focus:ring-1"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              glow
              disabled={isLoading}
              className="w-full text-slate-950 font-bold"
              icon={isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              {isLoading ? 'ESTABLISHING LINK...' : 'LOGIN'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0C1024] px-3 text-[11px] font-mono text-slate-400 uppercase">
              Or Connect With
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>

          {/* Google Login Button */}
          <Button
            variant="secondary"
            size="md"
            disabled={isGoogleLoading}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] border-white/15"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.98 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="text-xs font-mono font-bold tracking-wide">
              {isGoogleLoading ? 'CONNECTING GOOGLE...' : 'CONTINUE WITH GOOGLE'}
            </span>
          </Button>

          {/* Quick Demo Pre-fill helper */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Demo Account Ready:</span>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              <span>Fill Explorer Credentials</span>
            </button>
          </div>

          {/* Create Account Link */}
          <div className="text-center pt-2 text-xs font-mono text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors"
            >
              Create Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
