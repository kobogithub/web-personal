import React from 'react';

interface InputProps {
  as?: 'input' | 'textarea';
  type?: string;
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  maxLength: number;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  showCounter?: boolean;
}

export default function Input({
  as = 'input',
  type = 'text',
  id,
  name,
  label,
  value,
  onChange,
  error,
  maxLength,
  placeholder,
  rows,
  required = true,
  showCounter = false,
}: InputProps) {
  const fieldClass = `w-full px-4 py-3 border transition duration-300 focus:outline-none focus:ring-2 focus:ring-magi-accent bg-magi-surface2 text-magi-ink ${
    error ? 'border-magi-danger focus:ring-magi-danger' : 'border-magi-line focus:border-magi-accent'
  } ${as === 'textarea' ? 'resize-vertical' : ''}`;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="block text-xs font-mono uppercase tracking-wider text-magi-muted">
          {label} {required && '*'}
        </label>
        {showCounter && (
          <span className="text-xs text-magi-muted font-mono">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <div className="corner-mark">
        {as === 'textarea' ? (
          <textarea
            id={id}
            name={name}
            rows={rows ?? 6}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            className={fieldClass}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            className={fieldClass}
            placeholder={placeholder}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-magi-danger">{error}</p>}
    </div>
  );
}
