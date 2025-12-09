import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PCCreateSchema, type PCCreate } from '@/features/pcs/types';

interface CreatePCFormProps {
  onSubmit: (data: PCCreate) => void;
  isLoading?: boolean;
}

export const CreatePCForm = ({ onSubmit, isLoading = false }: CreatePCFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PCCreate>({
    resolver: zodResolver(PCCreateSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="cpu" className="block text-sm font-medium">
          CPU
        </label>
        <input
          {...register('cpu')}
          type="text"
          id="cpu"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter CPU model"
        />
        {errors.cpu && <span className="text-sm text-red-600">{errors.cpu.message}</span>}
      </div>

      <div>
        <label htmlFor="ram" className="block text-sm font-medium">
          RAM (GB)
        </label>
        <input
          {...register('ram', { valueAsNumber: true })}
          type="number"
          id="ram"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter RAM amount"
        />
        {errors.ram && <span className="text-sm text-red-600">{errors.ram.message}</span>}
      </div>

      <div>
        <label htmlFor="videocard" className="block text-sm font-medium">
          Videocard
        </label>
        <input
          {...register('videocard')}
          type="text"
          id="videocard"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter videocard model"
        />
        {errors.videocard && <span className="text-sm text-red-600">{errors.videocard.message}</span>}
      </div>

      <div>
        <label htmlFor="hard_disc" className="block text-sm font-medium">
          Hard Disc
        </label>
        <input
          {...register('hard_disc')}
          type="text"
          id="hard_disc"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter hard disc capacity"
        />
        {errors.hard_disc && <span className="text-sm text-red-600">{errors.hard_disc.message}</span>}
      </div>

      <div>
        <label htmlFor="usb_amout" className="block text-sm font-medium">
          USB Ports
        </label>
        <input
          {...register('usb_amout', { valueAsNumber: true })}
          type="number"
          id="usb_amout"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter number of USB ports"
        />
        {errors.usb_amout && <span className="text-sm text-red-600">{errors.usb_amout.message}</span>}
      </div>

      <div>
        <label htmlFor="os" className="block text-sm font-medium">
          Operating System
        </label>
        <input
          {...register('os')}
          type="text"
          id="os"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter operating system"
        />
        {errors.os && <span className="text-sm text-red-600">{errors.os.message}</span>}
      </div>

      <div>
        <label htmlFor="buy_date" className="block text-sm font-medium">
          Purchase Date
        </label>
        <input
          {...register('buy_date')}
          type="date"
          id="buy_date"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.buy_date && <span className="text-sm text-red-600">{errors.buy_date.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create PC'}
      </button>
    </form>
  );
};
