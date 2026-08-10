import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { ToastProvider } from './AdminToast';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const adminEmail = localStorage.getItem('admin_email') || 'admin@allindiasarkari.com';

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAuth) {
      navigate('/admin/login');
    } else {
      setAuthed(true);
    }
  }, [navigate]);

  if (authed === null) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-xs font-bold text-slate-600 animate-pulse">
          Verifying Admin Access...
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
