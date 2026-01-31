import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-bg-elevated border ${
            error ? 'border-accent' : 'border-border-muted'
          } rounded-md px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors resize-vertical ${className}`.trim()}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-accent">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
