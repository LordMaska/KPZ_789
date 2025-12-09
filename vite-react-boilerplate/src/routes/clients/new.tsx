import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCreateClient } from '@/features/clients/api';
import { CreateClientForm } from '@/components/forms/CreateClientForm';
import toast from '@/hooks/toast';

export const Route = createFileRoute('/clients/new')({
  component: NewClientPage,
});

function NewClientPage() {
  const navigate = useNavigate();
  const createClient = useCreateClient();

  const onSubmit = async (data: unknown) => {
    try {
      await createClient.mutateAsync(data as any);
    } catch (err) {
      console.error('Помилка при створенні:', err);
      toast.error('Помилка при створенні клієнта');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Створити нового клієнта</h1>

      <CreateClientForm onSubmit={onSubmit} isLoading={createClient.isPending} />
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => navigate({ to: '/clients' })}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Скасувати
        </button>
      </div>
    </div>
  );
}
