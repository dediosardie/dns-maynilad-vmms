import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'default' | 'large' | 'full';
}

export default function Modal({ isOpen, onClose, title, children, size = 'default' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    default: 'max-w-3xl',
    large: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className={`relative bg-bg-secondary rounded-xl shadow-soft border border-border-muted w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-muted">
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
