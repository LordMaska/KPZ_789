import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Session } from '@/features/sessions/types';
import type { PC } from '@/features/pcs/schema';
import type { Client } from '@/features/clients/schema';
import { useSession, useUpdateSession, useDeleteSession } from '@/features/sessions/api';
import { usePCs } from '@/features/pcs/api';
import { useClients } from '@/features/clients/api';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SessionUpdateSchema, type SessionUpdate } from '@/features/sessions/types';
import toast from '@/hooks/toast';
import useConfirm from '@/hooks/useConfirm';
import type { Duration } from '@/utils/duration';

const formatDuration = (duration: Duration): string => {
  if (typeof duration === 'string') return duration;
  if (typeof duration === 'object' && duration !== null) {
    const parts: string[] = [];
    if (duration.hours) parts.push(`${duration.hours}г`);
    if (duration.minutes) parts.push(`${duration.minutes}хв`);
    if (duration.seconds) parts.push(`${duration.seconds}с`);
    return parts.length > 0 ? parts.join(' ') : '0с';
  }
  return String(duration);
};

const durationToTimeString = (duration: Duration): string => {
  if (typeof duration === 'string') return duration;
  if (typeof duration === 'object' && duration !== null) {
    const hours = String(duration.hours || 0).padStart(2, '0');
    const minutes = String(duration.minutes || 0).padStart(2, '0');
    const seconds = String(duration.seconds || 0).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  return '';
};

export const Route = createFileRoute('/sessions/$sessionId')({
  component: SessionDetailPage,
});

function SessionDetailPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  
  const sessionQuery = useSession(sessionId) as UseQueryResult<Session, unknown>;
  const { data: session, isLoading, error } = sessionQuery;
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();
  const pcsQuery = usePCs() as UseQueryResult<PC[] | undefined, unknown>;
  const { data: pcs, isLoading: pcsLoading } = pcsQuery;
  const clientsQuery = useClients() as UseQueryResult<Client[] | undefined, unknown>;
  const { data: clients, isLoading: clientsLoading } = clientsQuery;

  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit: rhfHandleSubmit, reset, formState: { errors } } = useForm<Partial<SessionUpdate>>({
    resolver: zodResolver(SessionUpdateSchema as any),
  } as any);

  useEffect(() => {
    if (session) {
      const timeValue = session.Time ? new Date(session.Time).toISOString().slice(0, 16) : '';
      let costValue = 0;
      if (typeof session.Cost === 'number') {
        costValue = session.Cost;
      } else if (typeof session.Cost === 'string') {
    // Видаляємо все, крім цифр, крапки і мінуса
      const cleaned = String(session.Cost).replace(new RegExp('[^\\d.-]', 'g'), '');
    costValue = Number(cleaned);
      } else if (typeof session.Cost === 'object' && session.Cost !== null) {
        const costObj = session.Cost as { amount?: number; value?: number };
        if (typeof costObj.amount === 'number') costValue = costObj.amount;
        else if (typeof costObj.value === 'number') costValue = costObj.value;
      }
      reset({
        pc_id: session.pc_id,
        client_phone: session.client_phone,
        Time: timeValue,
        Duration: durationToTimeString(session.Duration) as any,
        Cost: costValue as any,
      });
    }
  }, [session]);

  const onSubmit = async (data: any) => {
    try {
      await updateSession.mutateAsync({ id: sessionId, data });
      setIsEditing(false);
    } catch (err) {
      console.error('Помилка при оновленні:', err);
      toast.error('Помилка при оновленні сесії');
    }
  };

  const { confirm, Confirm } = useConfirm();

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Видалення сесії',
      message: session ? `Ви впевнені, що хочете видалити сесію #${session.session_id}?` : 'Ви впевнені?',
      confirmLabel: 'Видалити',
      cancelLabel: 'Скасувати',
      variant: 'danger',
      isLoading: () => deleteSession.isPending,
    });
    if (!ok) return;

    try {
      await deleteSession.mutateAsync(sessionId);
      navigate({ to: '/sessions' });
    } catch (err) {
      toast.error('Помилка при видаленні');
    }
  };

  if (isLoading || pcsLoading || clientsLoading) {
    return <div className="p-4">Завантаження...</div>;
  }

  if (error || !session) {
    return (
      <div className="p-4 text-red-600">
        Помилка: {error instanceof Error ? error.message : 'Сесію не знайдено'}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Деталі сесії #{session.session_id}</h1>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Редагувати
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteSession.isPending}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                Видалити
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={rhfHandleSubmit(onSubmit)} className="space-y-4">
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
            {errors.client_phone && <p className="text-sm text-red-600">{(errors.client_phone as any)?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Час</label>
            <input
              {...register('Time')}
              type="datetime-local"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.Time && <p className="text-sm text-red-600">{(errors.Time as any)?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Тривалість</label>
            <input
              {...register('Duration')}
              type="text"
              required
              placeholder="HH:mm:ss"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.Duration && <p className="text-sm text-red-600">{(errors.Duration as any)?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Вартість</label>
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
              disabled={updateSession.isPending}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {updateSession.isPending ? 'Збереження...' : 'Зберегти'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                let costValue = 0;
                if (typeof session.Cost === 'number') {
                  costValue = session.Cost;
                } else if (typeof session.Cost === 'string') {
                  const cleaned = String(session.Cost).replace(new RegExp('[^\\d.-]', 'g'), '');
                  costValue = Number(cleaned);
                } else if (typeof session.Cost === 'object' && session.Cost !== null) {
                  const costObj = session.Cost as { amount?: number; value?: number };
                  if (typeof costObj.amount === 'number') costValue = costObj.amount;
                  else if (typeof costObj.value === 'number') costValue = costObj.value;
                }
                reset({
                  pc_id: session.pc_id,
                  client_phone: session.client_phone,
                  Time: session.Time ? new Date(session.Time).toISOString().slice(0, 16) : '',
                  Duration: durationToTimeString(session.Duration) as any,
                  Cost: costValue as any,
                });
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Скасувати
            </button>
          </div>

          {updateSession.isError && (
            <div className="text-red-600">
              Помилка: {updateSession.error instanceof Error ? updateSession.error.message : 'Невідома помилка'}
            </div>
          )}
        </form>
      ) : (
        <div className="bg-white border border-gray-300 rounded p-4 space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">ID сесії:</span>
            <span>{session.session_id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">ID ПК:</span>
            <span>{session.pc_id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Телефон клієнта:</span>
            <span>{session.client_phone}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Час:</span>
            <span>{session.Time ? new Date(session.Time).toLocaleString() : 'Н/Д'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Тривалість:</span>
            <span>{formatDuration(session.Duration)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Вартість:</span>
            <span>{String(session.Cost)}</span>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate({ to: '/sessions' })}
        className="mt-4 text-blue-600 hover:underline"
      >
        ← Повернутися до списку
      </button>

      <Confirm />
    </div>
  );
}
