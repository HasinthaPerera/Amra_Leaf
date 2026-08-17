'use client';

import React from 'react';
import { Menu, Bell, Database, ShieldAlert, BadgeInfo } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Avatar } from '@/components/ui/Feedback';

interface NavbarProps {
  role: 'admin' | 'employee';
  onMenuToggle: () => void;
  title?: string;
}

export function Navbar({ role, onMenuToggle, title }: NavbarProps) {
  const { currentUser } = useSimulation();

  return (
    <header className="bg-white border-b border-slate-200/80 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title */}
        {title && (
          <h1 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Simulator mode banner */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xxs font-bold uppercase tracking-wider">
          <Database className="w-3.5 h-3.5" />
          Simulation Mode
        </div>

        {/* Notification Icon */}
        <button className="relative p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors focus:outline-none">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Info Capsule */}
        <div className="flex items-center gap-2">
          <Avatar name={currentUser?.name || 'User'} size="sm" className="w-8 h-8 text-xs bg-slate-100 text-slate-700" />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-none mb-0.5">
              {currentUser?.name || 'User'}
            </p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {role === 'admin' ? 'Administrator' : currentUser?.department || 'Employee'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
