import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminSidebar } from './AdminSidebar';
import { ToastProvider } from './AdminToast';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>(
    localStorage.getItem('admin_email') || 'admin@allindiasarkari.com'
  );

  useEffect(() => {
    let mounted = true;

    async function verifyAdminSession() {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (mounted) {
            const email = session.user.email || 'admin@allindiasarkari.com';
            setAdminEmail(email);
            localStorage.setItem('admin_authenticated', 'true');
            localStorage.setItem('admin_email', email);
            setAuthed(true);
          }
        } else {
          // Unauthenticated or expired session
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_email');
          if (mounted) {
            setAuthed(false);
            navigate('/admin/login', { replace: true });
          }
        }
      } else {
        // Fallback for local development when Supabase credentials are not yet configured
        const localAuth = localStorage.getItem('admin_authenticated') === 'true';
        if (localAuth) {
          if (mounted) setAuthed(true);
        } else {
          if (mounted) {
            setAuthed(false);
            navigate('/admin/login', { replace: true });
          }
        }
      }
    }

    verifyAdminSession();

    // Subscribe to Supabase auth state change events (e.g. token refresh, logout in another tab, session expiry)
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_email');
          if (mounted) {
            setAuthed(false);
            navigate('/admin/login', { replace: true });
          }
        } else if (session?.user) {
          if (mounted) {
            const email = session.user.email || 'admin@allindiasarkari.com';
            setAdminEmail(email);
            localStorage.setItem('admin_authenticated', 'true');
            localStorage.setItem('admin_email', email);
            setAuthed(true);
          }
        }
      });
      authListener = data;
    }

    return () => {
      mounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  if (authed === null) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-xs font-bold text-slate-600 animate-pulse">
          Verifying Admin Session...
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800 antialiased">
        <AdminSidebar adminEmail={adminEmail} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
};

