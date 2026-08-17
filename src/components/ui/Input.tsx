import React, { useState } from 'react';
import { Eye, EyeOff, Search } from 'lucide-react';

// Input Props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm text-slate-800 bg-white border rounded-lg transition-colors duration-200 outline-none
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            ${error ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Password Input
export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={show ? 'text' : 'password'}
            className={`
              w-full pl-3 pr-10 py-2 text-sm text-slate-800 bg-white border rounded-lg transition-colors duration-200 outline-none
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              ${error ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'}
              ${className}
            `}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm text-slate-800 bg-white border rounded-lg transition-colors duration-200 outline-none resize-none
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            ${error ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm text-slate-800 bg-white border rounded-lg transition-colors duration-200 outline-none
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            ${error ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// Checkbox
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string | React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-start cursor-pointer select-none">
          <input
            id={id}
            ref={ref}
            type="checkbox"
            className={`
              mt-0.5 w-4.5 h-4.5 text-blue-600 bg-white border-slate-200 rounded focus:ring-blue-500/20 focus:ring-offset-0 transition-colors
              ${className}
            `}
            {...props}
          />
          <span className="ml-2.5 text-sm text-slate-600 font-medium leading-tight">{label}</span>
        </label>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// Radio
interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string | React.ReactNode;
  error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-center cursor-pointer select-none">
          <input
            id={id}
            ref={ref}
            type="radio"
            className={`
              w-4 h-4 text-blue-600 bg-white border-slate-200 focus:ring-blue-500/20 focus:ring-offset-0 transition-colors
              ${className}
            `}
            {...props}
          />
          <span className="ml-2 text-sm text-slate-650 font-medium">{label}</span>
        </label>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Radio.displayName = 'Radio';

// Search Bar
interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
}

export function SearchBar({ onSearch, className = '', placeholder = 'Search...', ...props }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          w-full pl-9 pr-4 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg outline-none transition-colors duration-200
          hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
