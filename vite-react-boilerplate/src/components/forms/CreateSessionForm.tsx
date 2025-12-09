import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SessionCreateSchema, type SessionCreate } from '@/features/sessions/types';

interface CreateSessionFormProps {
  onSubmit: (data: SessionCreate) => void;
  isLoading?: boolean;
}

export const CreateSessionForm = ({ onSubmit, isLoading = false }: CreateSessionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SessionCreate>({
    resolver: zodResolver(SessionCreateSchema) as any,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="pc_id" className="block text-sm font-medium">
          PC ID
        </label>
        <input
          {...register('pc_id', { valueAsNumber: true })}
          type="number"
          id="pc_id"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter PC ID"
        />
        {errors.pc_id && <span className="text-sm text-red-600">{errors.pc_id.message}</span>}
      </div>

      <div>
        <label htmlFor="client_phone" className="block text-sm font-medium">
          Client Phone
        </label>
        <input
          {...register('client_phone')}
          type="tel"
          id="client_phone"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter client phone"
        />
        {errors.client_phone && <span className="text-sm text-red-600">{errors.client_phone.message}</span>}
      </div>

      <div>
        <label htmlFor="Time" className="block text-sm font-medium">
          Session Time
        </label>
        <input
          {...register('Time')}
          type="datetime-local"
          id="Time"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.Time && <span className="text-sm text-red-600">{errors.Time.message}</span>}
      </div>

      <div>
        <label htmlFor="Duration" className="block text-sm font-medium">
          Duration
        </label>
        <input
          {...register('Duration')}
          type="text"
          id="Duration"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="e.g., 2 hours"
        />
        {errors.Duration && <span className="text-sm text-red-600">{errors.Duration.message}</span>}
      </div>

      <div>
        <label htmlFor="Cost" className="block text-sm font-medium">
          Cost
        </label>
        <input
          {...register('Cost', { valueAsNumber: true })}
          type="number"
          id="Cost"
          step="0.01"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter cost"
        />
        {errors.Cost && <span className="text-sm text-red-600">{errors.Cost.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create Session'}
      </button>
    </form>
  );
};
