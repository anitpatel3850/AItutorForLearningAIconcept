import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  Send, 
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { useAuth } from '../context/GameContext';
import { sound } from '../utils/audio';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    sound.playClick();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSubmitted(true);
      sound.playCorrect();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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

        {/* Card */}
        <Card glow="cyan" className="p-6 sm:p-8 bg-[#0C1024]/90 border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] space-y-6">
          <div className="space-y-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>KEY RECOVERY PROTOCOL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Recover Access Key
            </h1>
            <p className="text-xs text-slate-300">
              Enter your registered terminal email to dispatch a secure access link.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">
                    Terminal Email Address
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

                <Button
                  type="submit"
                  size="lg"
                  glow
                  disabled={isLoading || !email.trim()}
                  className="w-full text-slate-950 font-bold"
                  icon={isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  iconPosition="right"
                >
                  {isLoading ? 'DISPATCHING SIGNAL...' : 'SEND RESET LINK'}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-5 bg-emerald-950/50 border border-emerald-500/40 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold font-display text-white">
                    Signal Dispatched
                  </h4>
                  <p className="text-xs text-emerald-200 font-sans">
                    Password reset instructions have been sent.
                  </p>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                  Please verify your inbox at <strong className="text-cyan-300">{email}</strong> to reconfigure your neural credentials.
                </p>

                <div className="pt-2">
                  <Link to="/login">
                    <Button variant="secondary" size="sm" className="w-full text-xs font-mono">
                      RETURN TO LOGIN
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Login link */}
          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
