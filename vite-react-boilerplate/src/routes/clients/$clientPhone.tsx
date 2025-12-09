import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useClient, useUpdateClient, useDeleteClient } from '@/features/clients/api';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientUpdateSchema, type ClientUpdate } from '@/features/clients/types';
import toast from '@/hooks/toast';
import useConfirm from '@/hooks/useConfirm';

export const Route = createFileRoute('/clients/$clientPhone')({
  component: ClientDetailPage,
});

function ClientDetailPage() {
  const { clientPhone } = Route.useParams();
  const navigate = useNavigate();
  
  const { data: client, isLoading, error } = useClient(clientPhone);
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientUpdate>({
    resolver: zodResolver(ClientUpdateSchema as any),
  } as any);

  useEffect(() => {
    if (client) {
      reset({
        full_name: client.full_name,
        birth: client.birth,
      });
    }
  }, [client, reset]);

  const onSubmit = async (data: ClientUpdate) => {
    try {
      await updateClient.mutateAsync({ id: clientPhone, data });
      setIsEditing(false);
    } catch (err) {
      console.error('Помилка при оновленні:', err);
      toast.error('Помилка при оновленні клієнта');
    }
  };

  const { confirm, Confirm } = useConfirm();

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Видалення клієнта',
      message: client ? `Ви впевнені, що хочете видалити клієнта ${client.full_name} (${client.phone})?` : 'Ви впевнені?',
      confirmLabel: 'Видалити',
      cancelLabel: 'Скасувати',
      variant: 'danger',
      isLoading: () => deleteClient.isPending,
    });
    if (!ok) return;

    try {
      await deleteClient.mutateAsync(clientPhone);
      navigate({ to: '/clients' });
    } catch (err) {
      toast.error('Помилка при видаленні');
    }
  };

  if (isLoading) {
    return <div className="p-4">Завантаження...</div>;
  }

  if (error || !client) {
    return (
      <div className="p-4 text-red-600">
        Помилка: {error instanceof Error ? error.message : 'Клієнта не знайдено'}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Деталі клієнта: {client.phone}</h1>
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
                disabled={deleteClient.isPending}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                Видалити
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Повне ім'я</label>
            <input
              {...register('full_name')}
              type="text"
              required
              maxLength={155}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.full_name && <p className="text-sm text-red-600">{(errors.full_name as any)?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Дата народження</label>
            <input
              {...register('birth')}
              type="date"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.birth && <p className="text-sm text-red-600">{(errors.birth as any)?.message}</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updateClient.isPending}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {updateClient.isPending ? 'Збереження...' : 'Зберегти'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                reset({ full_name: client.full_name, birth: client.birth });
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Скасувати
            </button>
          </div>

          {updateClient.isError && (
            <div className="text-red-600">
              Помилка: {updateClient.error instanceof Error ? updateClient.error.message : 'Невідома помилка'}
            </div>
          )}
        </form>
      ) : (
        <div className="bg-white border border-gray-300 rounded p-4 space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Телефон:</span>
            <span>{client.phone}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Повне ім'я:</span>
            <span>{client.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Дата народження:</span>
            <span>{client.birth}</span>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate({ to: '/clients' })}
        className="mt-4 text-blue-600 hover:underline"
      >
        ← Повернутися до списку
      </button>

      <Confirm />
    </div>
  );
}
