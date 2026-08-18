'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';

export default function FormField({
  label,
  error,
  id,
  type = 'text',
  register = () => ({}),
  className,
  wrapperClassName,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn('flex flex-col gap-1 w-full', wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-slate-700 tracking-wide">
          {label}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={id}
          className={cn(
            'w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-150 min-h-[5rem]',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...register(id)}
          {...props}
        />
      ) : isPassword ? (
        <div className="relative">
          <input
            id={id}
            type={resolvedType}
            className={cn(
              'w-full px-3 py-2 pr-10 text-sm bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-150',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...register(id)}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-teal-600 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <i className="fa-solid fa-eye-slash text-[14px]"></i>
            ) : (
              <i className="fa-solid fa-eye text-[14px]"></i>
            )}
          </button>
        </div>
      ) : (
        <input
          id={id}
          type={type}
          className={cn(
            'w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-150',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...register(id)}
          {...props}
        />
      )}
      {error && <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>}
    </div>
  );
}
