import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  MapPin,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface AdminSidebarProps {
  adminEmail?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  adminEmail = 'admin@allindiasarkari.com',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Supabase signout:', e);
    } finally {
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_email');
      navigate('/admin/login');
    }
  };


  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Posts', path: '/admin/posts', icon: FileText },
    { label: 'Add New Post', path: '/admin/posts/new', icon: PlusCircle },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'States & UTs', path: '/admin/states', icon: MapPin },
    { label: 'Media Gallery', path: '/admin/media', icon: ImageIcon },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between bg-slate-900 text-white p-4 w-64 shadow-xl border-r border-slate-800">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-amber-400 font-black shadow-inner">
            AIS
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-amber-400" /> Admin Portal
            </h2>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
              {adminEmail}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-800 text-amber-300 shadow-sm font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="space-y-2 border-t border-slate-800 pt-4">
        <Link
          to="/"
          target="_blank"
          className="flex w-full items-center justify-between rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-400" /> View Live Site
          </span>
          <span className="text-[10px] text-slate-500 font-mono">🔗</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl bg-red-950/60 border border-red-900/80 px-3.5 py-2 text-xs font-bold text-red-200 hover:bg-red-900 transition-colors"
        >
          <LogOut className="h-4 w-4 text-red-400" />
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar toggle */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white p-3.5 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-amber-400 font-black text-xs">
            AIS
          </div>
          <span className="text-xs font-black uppercase tracking-wide text-white">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:text-white"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/80 backdrop-blur-xs">
          <div className="relative z-10 h-full w-64">
            <SidebarContent />
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
};
