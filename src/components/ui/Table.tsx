import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, forwardRef } from 'react';

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto max-h-[600px]">
        <table
          ref={ref}
          className={`w-full text-sm ${className}`.trim()}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={`border-b border-border-muted bg-bg-elevated sticky top-0 z-10 ${className}`.trim()}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <tbody ref={ref} className={className} {...props}>
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={`border-b border-border-muted hover:bg-bg-elevated transition-colors ${className}`.trim()}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={`px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider ${className}`.trim()}
        {...props}
      >
        {children}
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={`px-4 py-3 text-text-secondary ${className}`.trim()}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

export default Table;
