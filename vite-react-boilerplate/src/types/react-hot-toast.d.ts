declare module 'react-hot-toast' {
  import type { ComponentType } from 'react';

  export const Toaster: ComponentType<Record<string, unknown>>;
  export const toast: {
    success: (msg: string, opts?: Record<string, unknown>) => void;
    error: (msg: string, opts?: Record<string, unknown>) => void;
    // allow default import as function
  };

  export default toast;
}
