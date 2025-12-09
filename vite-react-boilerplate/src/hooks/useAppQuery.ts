import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import toast from './toast';

/**
 * useAppQuery — обгортка над useQuery для уніфікованої обробки помилок
 */
export const useAppQuery = <TData = unknown, TError = unknown, TQueryKey extends readonly unknown[] = readonly unknown[]>(
  options: UseQueryOptions<TData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> => {
  // treat options as any to avoid mismatches between different react-query overload typings
  const raw = options as any;
  const wrappedOptions = {
    ...raw,
    onError: (err: unknown) => {
      const msg = (err as any)?.message || 'Сталася помилка при завантаженні даних';
      toast.error(String(msg));
      if (raw && raw.onError) {
        raw.onError(err);
      }
    },
  } as UseQueryOptions<TData, TError, TData, TQueryKey>;

  return useQuery<TData, TError, TData, TQueryKey>(wrappedOptions as any);
};

export default useAppQuery;
