import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type ConfirmVariant = 'danger' | 'warning' | 'info' | 'default';

type ConfirmOptions = {
  title?: string;
  message?: ReactNode | string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  // can be boolean or function that returns boolean to allow reading mutation state
  isLoading?: boolean | (() => boolean);
};

export const useConfirm = () => {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const resolverRef = useRef<(value: boolean) => void | null>(null);

  const confirm = (opts: ConfirmOptions = {}) =>
    new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setOptions(opts);
      setIsOpen(true);
    });

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current(true);
    resolverRef.current = null;
    setOptions(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current(false);
    resolverRef.current = null;
    setOptions(null);
  };

  const Confirm = () => {
    if (!options) return null;
    const isLoading = typeof options.isLoading === 'function' ? options.isLoading() : !!options.isLoading;

    return (
      <ConfirmDialog
        isOpen={isOpen}
        title={String(options.title ?? '')}
        message={options.message as any}
        confirmLabel={String(options.confirmLabel ?? 'Підтвердити')}
        cancelLabel={String(options.cancelLabel ?? 'Скасувати')}
        variant={String((options.variant as any) ?? 'danger') as any}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  };

  return { confirm, Confirm } as const;
};

export default useConfirm;
