'use client';

import { useEffect } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div role="dialog" aria-modal className="relative w-full max-w-4xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
