import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { usePC, useUpdatePC, useDeletePC } from '@/features/pcs/api';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PCUpdateSchema, type PCUpdate } from '@/features/pcs/types';
import toast from '@/hooks/toast';
import useConfirm from '@/hooks/useConfirm';

export const Route = createFileRoute('/pcs/$pcId')({
  component: PCDetailPage,
});

function PCDetailPage() {
  const { pcId } = Route.useParams();
  const navigate = useNavigate();
  
  // Отримуємо дані ПК
  const { data: pc, isLoading, error } = usePC(pcId);
  const updatePC = useUpdatePC();
  const deletePC = useDeletePC();

  // Режим редагування
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PCUpdate>({
    resolver: zodResolver(PCUpdateSchema),
    defaultValues: {},
  });

  // Завантажуємо дані в форму при отриманні з API
  useEffect(() => {
    if (pc) {
      reset({
        cpu: pc.cpu,
        ram: pc.ram,
        videocard: pc.videocard,
        hard_disc: pc.hard_disc,
        usb_amout: pc.usb_amout,
        os: pc.os,
        buy_date: pc.buy_date,
      });
    }
  }, [pc, reset]);

  const onSubmit = async (data: PCUpdate) => {
    try {
      await updatePC.mutateAsync({ id: pcId, data });
      setIsEditing(false);
    } catch (err) {
      console.error('Помилка при оновленні:', err);
      toast.error('Помилка при оновленні ПК');
    }
  };

  // Обробка видалення
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { confirm, Confirm } = useConfirm();

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Видалення ПК',
      message: pc ? `Ви впевнені, що хочете видалити ПК #${pc.pc_id}?` : 'Ви впевнені?',
      confirmLabel: 'Видалити',
      cancelLabel: 'Скасувати',
      variant: 'danger',
      isLoading: () => deletePC.isPending,
    });
    if (!ok) return;

    try {
      await deletePC.mutateAsync(pcId);
      navigate({ to: '/pcs' });
    } catch (err) {
      toast.error('Помилка при видаленні');
    }
  };

  if (isLoading) {
    return <div className="p-4">Завантаження...</div>;
  }

  if (error || !pc) {
    return (
      <div className="p-4 text-red-600">
        Помилка: {error instanceof Error ? error.message : 'ПК не знайдено'}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Деталі ПК #{pc.pc_id}</h1>
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
                disabled={deletePC.isPending}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                Видалити
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        // Режим редагування
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Процесор (CPU)</label>
            <input
              {...register('cpu')}
              type="text"
              required
              maxLength={120}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.cpu && <p className="text-sm text-red-600">{(errors.cpu as any)?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Оперативна пам'ять (GB)</label>
            <input
              {...register('ram', { valueAsNumber: true })}
              type="number"
              required
              min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.ram && <p className="text-sm text-red-600">{(errors.ram as any)?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Відеокарта</label>
            <input
              {...register('videocard')}
              type="text"
              required
              maxLength={120}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.videocard && <p className="text-sm text-red-600">{(errors.videocard as any)?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Жорсткий диск</label>
            <input
              {...register('hard_disc')}
              type="text"
              required
              maxLength={30}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.hard_disc && <p className="text-sm text-red-600">{(errors.hard_disc as any)?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Кількість USB портів</label>
            <input
              {...register('usb_amout', { valueAsNumber: true })}
              type="number"
              required
              min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.usb_amout && <p className="text-sm text-red-600">{(errors.usb_amout as any)?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Операційна система</label>
            <input
              {...register('os')}
              type="text"
              required
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.os && <p className="text-sm text-red-600">{(errors.os as any)?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Дата купівлі</label>
            <input
              {...register('buy_date')}
              type="date"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.buy_date && <p className="text-sm text-red-600">{(errors.buy_date as any)?.message}</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updatePC.isPending}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {updatePC.isPending ? 'Збереження...' : 'Зберегти'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                // Повертаємо оригінальні дані
                reset({
                  cpu: pc.cpu,
                  ram: pc.ram,
                  videocard: pc.videocard,
                  hard_disc: pc.hard_disc,
                  usb_amout: pc.usb_amout,
                  os: pc.os,
                  buy_date: pc.buy_date,
                });
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Скасувати
            </button>
          </div>

          {updatePC.isError && (
            <div className="text-red-600">
              Помилка: {updatePC.error instanceof Error ? updatePC.error.message : 'Невідома помилка'}
            </div>
          )}
        </form>
      ) : (
        // Режим перегляду
        <div className="bg-white border border-gray-300 rounded p-4 space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">ID:</span>
            <span>{pc.pc_id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Процесор:</span>
            <span>{pc.cpu}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">RAM:</span>
            <span>{pc.ram} GB</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Відеокарта:</span>
            <span>{pc.videocard}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Жорсткий диск:</span>
            <span>{pc.hard_disc}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">USB порти:</span>
            <span>{pc.usb_amout}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">ОС:</span>
            <span>{pc.os}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Дата купівлі:</span>
            <span>{pc.buy_date}</span>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate({ to: '/pcs' })}
        className="mt-4 text-blue-600 hover:underline"
      >
        ← Повернутися до списку
      </button>

      <Confirm />
    </div>
  );
}
