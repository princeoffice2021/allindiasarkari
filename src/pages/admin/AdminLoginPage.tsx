import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { updateSEO } from '../../lib/seo';
import { ShieldCheck, Lock, Mail, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    updateSEO({
      title: 'Admin Login - All India Sarkari',
      description: 'Protected Admin Portal Login for All India Sarkari content managers.',
      noindex: true,
    });

    // Check if already authenticated
    if (localStorage.getItem('admin_authenticated') === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        // Production & Live Supabase Auth Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Dev-only fallback if developers are testing without creating a user in Supabase console
          if (import.meta.env.DEV && email === 'admin@allindiasarkari.com' && password === 'admin123') {
            localStorage.setItem('admin_authenticated', 'true');
            localStorage.setItem('admin_email', email);
            navigate('/admin');
            return;
          }
          setErrorMsg(error.message || 'Authentication failed. Please check your credentials.');
          setLoading(false);
          return;
        }

        if (data.user) {
          localStorage.setItem('admin_authenticated', 'true');
          localStorage.setItem('admin_email', data.user.email || email);
          navigate('/admin');
          return;
        }
      } else {
        if (import.meta.env.DEV) {
          // Development-only fallback when Supabase is not configured
          if (email === 'admin@allindiasarkari.com' && password === 'admin123') {
            localStorage.setItem('admin_authenticated', 'true');
            localStorage.setItem('admin_email', email);
            navigate('/admin');
            return;
          } else {
            setErrorMsg('Development mode: Enter admin@allindiasarkari.com and admin123');
          }
        } else {
          setErrorMsg('Supabase Auth is not configured. Production environment requires valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-900 text-amber-400 shadow-md">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
            Admin Portal Login
          </h1>
          <p className="text-xs text-slate-500">
            All India Sarkari Content Management Portal
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@allindiasarkari.com"
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-800 focus:border-blue-800 focus:outline-hidden"
              />
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-800 focus:border-blue-800 focus:outline-hidden"
              />
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-900 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-blue-950 transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In To Admin Dashboard'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {import.meta.env.DEV && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">Development Demo Notice:</p>
            <p><strong>Email:</strong> admin@allindiasarkari.com</p>
            <p><strong>Password:</strong> admin123</p>
            <p className="text-[10px] text-slate-400 pt-1">
              (For production, create your admin user accounts in Supabase Auth Console)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
