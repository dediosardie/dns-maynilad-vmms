import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  error?: string;
  options?: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full bg-bg-elevated border ${
            error ? 'border-accent' : 'border-border-muted'
          } rounded-md px-3 py-2 text-text-primary focus:outline-none focus:border-accent transition-colors ${className}`.trim()}
          {...props}
        >
          {options ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
        {error && (
          <p className="mt-1 text-sm text-accent">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
