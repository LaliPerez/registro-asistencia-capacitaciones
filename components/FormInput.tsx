
import React from 'react';

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({ id, name, label, value, onChange, icon }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <span className="text-slate-400">{icon}</span>
            </div>
        )}
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Ingrese su ${label.toLowerCase()}`}
          className="block w-full py-2 pr-3 border rounded-lg border-slate-300 placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ease-in-out pl-10"
          required
        />
      </div>
    </div>
  );
};
