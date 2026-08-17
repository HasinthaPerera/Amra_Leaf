import React from 'react';
import { 
  ShieldCheck, AlertTriangle, XCircle, Info, CheckCircle2, 
  Loader2, FolderOpen, RefreshCcw 
} from 'lucide-react';
import Button from './Button';

// Badge
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'slate' | 'blue' | 'emerald' | 'orange' | 'red' | 'purple';
  className?: string;
}

export function Badge({ children, variant = 'slate', className = '' }: BadgeProps) {
  const styles = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    orange: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold border rounded-full ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

// StatusBadge
interface StatusBadgeProps {
  status: 'COMPLIANT' | 'PENDING' | 'INCOMPLETE' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'ACKNOWLEDGED' | 'NOT ACKNOWLEDGED' | 'PASSED' | 'FAILED' | 'active' | 'inactive';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  let variant: 'slate' | 'blue' | 'emerald' | 'orange' | 'red' | 'purple' = 'slate';
  let icon: React.ReactNode = null;
  let text = status;

  switch (normalized) {
    case 'COMPLIANT':
    case 'ACKNOWLEDGED':
    case 'PASSED':
    case 'ACTIVE':
      variant = 'emerald';
      icon = <ShieldCheck className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      break;
    case 'PENDING':
    case 'NOT ACKNOWLEDGED':
      variant = 'orange';
      icon = <AlertTriangle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      break;
    case 'INCOMPLETE':
    case 'FAILED':
    case 'INACTIVE':
      variant = 'red';
      icon = <XCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      break;
    case 'PUBLISHED':
      variant = 'blue';
      icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      break;
    case 'DRAFT':
      variant = 'slate';
      icon = <Info className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      break;
    case 'ARCHIVED':
      variant = 'slate';
      icon = <Info className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold border rounded-lg ${
      variant === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
      variant === 'orange' ? 'bg-amber-50 border-amber-100 text-amber-800' :
      variant === 'red' ? 'bg-red-50 border-red-100 text-red-800' :
      variant === 'blue' ? 'bg-blue-50 border-blue-100 text-blue-800' :
      'bg-slate-50 border-slate-100 text-slate-800'
    } ${className}`}>
      {icon}
      {text}
    </span>
  );
}

// ProgressBar
interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, className = '', showText = false, size = 'sm' }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, value));
  
  let color = 'bg-blue-600';
  if (percentage >= 85) color = 'bg-emerald-600';
  else if (percentage >= 50) color = 'bg-amber-500';
  else if (percentage > 0) color = 'bg-red-500';
  else color = 'bg-slate-200';

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showText && (
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</span>
        )}
        {showText && (
          <span className={`text-xs font-bold ${
            percentage >= 85 ? 'text-emerald-700' :
            percentage >= 50 ? 'text-amber-700' :
            percentage > 0 ? 'text-red-700' :
            'text-slate-500'
          }`}>{percentage}%</span>
        )}
      </div>
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-3'}`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// LoadingSpinner
export function LoadingSpinner({ className = '', label = 'Loading data...' }: { className?: string; label?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
      <p className="text-sm text-slate-400 font-medium">{label}</p>
    </div>
  );
}

// EmptyState
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center text-center p-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 ${className}`}>
      <FolderOpen className="w-10 h-10 text-slate-300 mb-4" />
      <h3 className="text-base font-bold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-5 leading-normal">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// ErrorState
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = 'System Error', 
  description = 'Unable to fetch records. Please try again.', 
  onRetry, 
  className = '' 
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center text-center p-8 border border-red-100 rounded-xl bg-red-50/30 ${className}`}>
      <XCircle className="w-10 h-10 text-red-500 mb-4" />
      <h3 className="text-base font-bold text-red-800 mb-1">{title}</h3>
      <p className="text-sm text-red-600/75 max-w-sm mb-5 leading-normal">{description}</p>
      {onRetry && (
        <Button variant="danger" size="sm" leftIcon={<RefreshCcw className="w-3.5 h-3.5" />} onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
}

// Alert banner
interface AlertProps {
  title?: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Alert({ title, message, type = 'info', className = '' }: AlertProps) {
  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
  };

  return (
    <div className={`flex items-start p-4 border rounded-xl ${styles[type]} ${className}`} role="alert">
      {icons[type]}
      <div className="ml-3">
        {title && <h5 className="text-sm font-bold leading-none mb-1.5">{title}</h5>}
        <p className="text-xs leading-relaxed font-medium">{message}</p>
      </div>
    </div>
  );
}

// Avatar
export function Avatar({ name, size = 'md', className = '' }: { name: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className={`flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200/50 flex-shrink-0 ${sizes[size]} ${className}`}>
      {initials}
    </div>
  );
}
