import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCreatePC } from '@/features/pcs/api';
import { CreatePCForm } from '@/components/forms/CreatePCForm';
import toast from '@/hooks/toast';

export const Route = createFileRoute('/pcs/new')({
  component: NewPCPage,
});

function NewPCPage() {
  const navigate = useNavigate();
  const createPC = useCreatePC();

  const onSubmit = async (data: unknown) => {
    try {
      await createPC.mutateAsync(data as any);
    } catch (err) {
      console.error('Помилка при створенні:', err);
      toast.error('Помилка при створенні ПК');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Створити новий ПК</h1>

      <CreatePCForm onSubmit={onSubmit} isLoading={createPC.isPending} />
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => navigate({ to: '/pcs' })}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Скасувати
        </button>
      </div>
    </div>
  );
}
