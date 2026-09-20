'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, FileText, GraduationCap, 
  HelpCircle, ShieldCheck, BarChart2, LogOut, X, ShieldAlert 
} from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Avatar } from '@/components/ui/Feedback';

interface SidebarProps {
  role: 'admin' | 'employee';
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser, logout } = useSimulation();

  const adminLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Employees', href: '/admin/employees', icon: Users },
    { label: 'Policies', href: '/admin/policies', icon: FileText },
    { label: 'Training Modules', href: '/admin/training', icon: GraduationCap },
    { label: 'Quizzes', href: '/admin/quizzes', icon: HelpCircle },
    { label: 'Compliance Tracking', href: '/admin/compliance', icon: ShieldCheck },
    { label: 'Activity Log', href: '/admin/activity', icon: BarChart2 },
  ];

  const employeeLinks = [
    { label: 'My Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'Policies', href: '/employee/policies', icon: FileText },
    { label: 'Security Training', href: '/employee/training', icon: GraduationCap },
    { label: 'Take Quiz', href: '/employee/quiz', icon: HelpCircle },
    { label: 'My Progress', href: '/employee/progress', icon: BarChart2 },
  ];

  const links = role === 'admin' ? adminLinks : employeeLinks;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-blue-500" />
              <span className="text-base font-extrabold text-white tracking-tight uppercase">
                AMRA <span className="text-blue-500">LEAF</span>
              </span>
            </Link>
            <button 
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-white focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              // Check if path is active (exact match or parent directory for detailed views)
              const isActive = pathname === link.href || (link.href !== `/${role}/dashboard` && pathname.startsWith(link.href));
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => onClose()}
                  className={`
                    flex items-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}
                  `}
                >
                  <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar name={currentUser?.name || 'User'} size="sm" className="bg-blue-900 text-blue-200" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate leading-none mb-1">
                  {currentUser?.name || 'Loading Name...'}
                </p>
                <p className="text-xxs font-semibold text-slate-500 uppercase tracking-wider truncate">
                  {role === 'admin' ? 'System Admin' : currentUser?.department || 'Employee'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/50 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            SECURE LOGOUT
          </button>
        </div>
      </aside>
    </>
  );
}
export default Sidebar;
