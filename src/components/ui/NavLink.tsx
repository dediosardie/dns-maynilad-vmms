import { AnchorHTMLAttributes, forwardRef, ReactNode } from 'react';

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  icon?: ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ active = false, icon, className = '', children, ...props }, ref) => {
    const baseStyles = 'flex items-center gap-3 px-4 py-2 rounded-md transition';
    
    const stateStyles = active
      ? 'bg-gradient-to-r from-accent to-accent-hover text-black font-medium shadow-lg'
      : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated';
    
    const combinedClassName = `${baseStyles} ${stateStyles} ${className}`.trim();
    
    return (
      <a ref={ref} className={combinedClassName} {...props}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </a>
    );
  }
);

NavLink.displayName = 'NavLink';

export default NavLink;
