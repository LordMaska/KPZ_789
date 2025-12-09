import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCreateSession } from '@/features/sessions/api';
import { usePCs } from '@/features/pcs/api';
import { useClients } from '@/features/clients/api';
import toast from '@/hooks/toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SessionCreateSchema, type SessionCreate } from '@/features/sessions/types';

export const Route = createFileRoute('/sessions/new')({
  component: NewSessionPage,
});

function NewSessionPage() {
  const navigate = useNavigate();
  const createSession = useCreateSession();
  const { data: pcs, isLoading: pcsLoading } = usePCs();
  const { data: clients, isLoading: clientsLoading } = useClients();

  const { register, handleSubmit, formState: { errors } } = useForm<SessionCreate>({
    resolver: zodResolver(SessionCreateSchema) as any,
  });

  const onSubmit = async (data: SessionCreate) => {
    try {
      await createSession.mutateAsync(data as unknown as any);
    } catch (err) {
      console.error('Помилка при створенні:', err);
      toast.error('Помилка при створенні сесії');
    }
  };

  if (pcsLoading || clientsLoading) {
    return <div className="p-4">Завантаження...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Створити нову сесію</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">PC</label>
          <select
            {...register('pc_id', { valueAsNumber: true })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Оберіть PC</option>
            {pcs?.map((pc) => (
              <option key={pc.pc_id} value={pc.pc_id}>
                ID: {pc.pc_id} - {pc.cpu}, {pc.ram}GB RAM, {pc.os}
              </option>
            ))}
          </select>
          {errors.pc_id && <p className="text-sm text-red-600">{(errors.pc_id as any)?.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Клієнт</label>
          <select
            {...register('client_phone')}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Оберіть клієнта</option>
            {clients?.map((client) => (
              <option key={client.phone} value={client.phone}>
                {client.full_name} ({client.phone})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Час (datetime)</label>
          <input
            {...register('Time')}
            type="datetime-local"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.Time && <p className="text-sm text-red-600">{(errors.Time as any)?.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Тривалість (наприклад: 02:30:00)
          </label>
          <input
            {...register('Duration')}
            type="text"
            required
            placeholder="02:30:00"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.Duration && <p className="text-sm text-red-600">{(errors.Duration as any)?.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Вартість
          </label>
          <input
            {...register('Cost', { valueAsNumber: true })}
            type="number"
            required
            min={0}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.Cost && <p className="text-sm text-red-600">{(errors.Cost as any)?.message}</p>}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={createSession.isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {createSession.isPending ? 'Створення...' : 'Створити'}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: '/sessions' })}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Скасувати
          </button>
        </div>

        {createSession.isError && (
          <div className="text-red-600">
            Помилка: {createSession.error instanceof Error ? createSession.error.message : 'Невідома помилка'}
          </div>
        )}
      </form>
    </div>
  );
}
