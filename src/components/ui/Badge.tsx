import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium';
    
    const variantStyles = {
      default: 'bg-bg-elevated text-text-primary border border-border-muted',
      accent: 'bg-accent-soft text-accent',
      success: 'bg-green-900/20 text-green-400 border border-green-900/30',
      warning: 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/30',
      danger: 'bg-accent-soft text-accent',
    };
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();
    
    return (
      <span ref={ref} className={combinedClassName} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
