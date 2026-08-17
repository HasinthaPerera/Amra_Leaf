import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable = false }: CardProps) {
  const isClickable = !!onClick;
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-slate-100 rounded-xl p-5 shadow-sm shadow-slate-100/40 transition-all duration-200
        ${hoverable || isClickable ? 'hover:shadow-md hover:border-slate-200/60 cursor-pointer hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  variant?: 'blue' | 'emerald' | 'amber' | 'red' | 'indigo' | 'purple';
  className?: string;
}

export function StatCard({ title, value, description, icon, variant = 'blue', className = '' }: StatCardProps) {
  const colorMap = {
    blue: {
      border: 'border-l-4 border-l-blue-600',
      bgIcon: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    emerald: {
      border: 'border-l-4 border-l-emerald-600',
      bgIcon: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    amber: {
      border: 'border-l-4 border-l-amber-500',
      bgIcon: 'bg-amber-50 text-amber-600 border border-amber-100',
    },
    red: {
      border: 'border-l-4 border-l-red-600',
      bgIcon: 'bg-red-50 text-red-600 border border-red-100',
    },
    indigo: {
      border: 'border-l-4 border-l-indigo-600',
      bgIcon: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    },
    purple: {
      border: 'border-l-4 border-l-purple-600',
      bgIcon: 'bg-purple-50 text-purple-600 border border-purple-100',
    }
  };

  return (
    <Card className={`flex items-start justify-between ${colorMap[variant].border} ${className}`}>
      <div className="flex-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-none mb-2">{value}</h3>
        {description && (
          <p className="text-xs font-medium text-slate-500 line-clamp-1">{description}</p>
        )}
      </div>
      {icon && (
        <div className={`p-2 rounded-lg flex items-center justify-center ml-4 ${colorMap[variant].bgIcon}`}>
          {icon}
        </div>
      )}
    </Card>
  );
}
export default Card;
