import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ elevated = false, className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-xl border border-border-muted p-6';
    const backgroundStyles = elevated ? 'bg-bg-elevated' : 'bg-bg-secondary';
    const shadowStyles = elevated ? 'shadow-xl' : 'shadow-lg';
    
    const combinedClassName = `${baseStyles} ${backgroundStyles} ${shadowStyles} ${className}`.trim();
    
    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-6 border-b border-border-muted ${className}`.trim()} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-6 ${className}`.trim()} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-6 border-t border-border-muted ${className}`.trim()} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export default Card;
