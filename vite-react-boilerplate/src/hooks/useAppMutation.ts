import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import toast from './toast';

type InvalidateKey = string | readonly (string | number)[];

type AppMutationOptions<TData, TVariables, TError> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationFn'
> & {
  invalidateQueries?: InvalidateKey[];
  navigateTo?: string | ((data: TData | undefined) => string | undefined);
  successMessage?: string;
  errorMessage?: string;
};

/**
 * useAppMutation — обгортка над useMutation
 * Підтримує: invalidateQueries, navigateTo, successMessage, errorMessage
 * Використовувати для уніфікації поведінки мутацій по проєкту.
 */
export const useAppMutation = <TData = unknown, TError = unknown, TVariables = void>(
  mutationFn: (vars: TVariables) => Promise<TData>,
  options: AppMutationOptions<TData, TVariables, TError> = {}
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { invalidateQueries, navigateTo, successMessage, errorMessage, onSuccess, onError, ...rest } = options as any;

  // react-query v5 uses a single options object with `mutationFn` property.
  const mutationOptions: any = {
    mutationFn: mutationFn as any,
    ...rest,
    onSuccess: async (data: TData, variables: TVariables, context: unknown) => {
      try {
        if (invalidateQueries && invalidateQueries.length > 0) {
          for (const key of invalidateQueries) {
            // v5 API: invalidateQueries accepts an object with queryKey
            // @ts-ignore
            await queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
          }
        }

        if (successMessage) {
          toast.success(successMessage);
        }

        if (navigateTo) {
          const destination = typeof navigateTo === 'function' ? navigateTo(data) : navigateTo;
          if (destination) navigate({ to: destination });
        }

        if (onSuccess) await (onSuccess as any)(data, variables, context);
      } catch (err) {
        // swallow here; onError will handle
        // eslint-disable-next-line no-console
        console.error('useAppMutation onSuccess handler error', err);
      }
    },
    onError: (err: unknown, variables: TVariables, context: unknown) => {
      if (errorMessage) {
        // try to show provided message
        toast.error(errorMessage);
      } else {
        // generic message
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const msg = (err as any)?.message || 'Сталася помилка';
        toast.error(String(msg));
      }

      if (onError) {
        (onError as any)(err, variables, context);
      }
    },
  };

  return useMutation<TData, TError, TVariables>(mutationOptions as any);
};

export default useAppMutation;
