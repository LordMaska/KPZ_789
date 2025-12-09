import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientCreateSchema, type ClientCreate } from '@/features/clients/types';

interface CreateClientFormProps {
  onSubmit: (data: ClientCreate) => void;
  isLoading?: boolean;
}

export const CreateClientForm = ({ onSubmit, isLoading = false }: CreateClientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientCreate>({
    resolver: zodResolver(ClientCreateSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone
        </label>
        <input
          {...register('phone')}
          type="tel"
          id="phone"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter phone number"
        />
        {errors.phone && <span className="text-sm text-red-600">{errors.phone.message}</span>}
      </div>

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium">
          Full Name
        </label>
        <input
          {...register('full_name')}
          type="text"
          id="full_name"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter full name"
        />
        {errors.full_name && <span className="text-sm text-red-600">{errors.full_name.message}</span>}
      </div>

      <div>
        <label htmlFor="birth" className="block text-sm font-medium">
          Date of Birth
        </label>
        <input
          {...register('birth')}
          type="date"
          id="birth"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.birth && <span className="text-sm text-red-600">{errors.birth.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create Client'}
      </button>
    </form>
  );
};
