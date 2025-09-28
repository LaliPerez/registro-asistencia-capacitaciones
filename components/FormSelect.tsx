
import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  error?: string;
  icon?: React.ReactNode;
}

export const FormSelect: React.FC<FormSelectProps> = ({ id, name, label, value, onChange, options, error, icon }) => {
  const hasError = !!error;

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <span className="text-slate-400 sm:text-sm">{icon}</span>
          </div>
        )}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`
            block w-full py-2 pr-10 border rounded-lg appearance-none
            ${icon ? 'pl-10' : 'pl-3'}
            ${hasError
              ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}
            ${value === '' ? 'text-slate-400' : 'text-slate-900'}
            transition-colors duration-200 ease-in-out
          `}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.value === ''}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};
