import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
            {helperText && <span className="text-xs text-text-muted ml-2">{helperText}</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-bg-elevated border ${
            error ? 'border-accent' : 'border-border-muted'
          } rounded-md px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors ${className}`.trim()}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-accent">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
