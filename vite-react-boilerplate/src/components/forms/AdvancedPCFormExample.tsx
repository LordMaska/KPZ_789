import { useState } from 'react';
import { validateData, formatValidationErrors } from '@/utils/validation';
import { PCCreateSchema, type PCCreate } from '@/features/pcs/types';
import { useCreatePC } from '@/features/pcs/api';

interface PCFormState {
  values: Partial<PCCreate>;
  errors: Record<string, string[]>;
}

/**
 * Example component demonstrating advanced Zod validation usage
 * with validation utilities
 */
export function AdvancedPCFormExample() {
  const { mutate: createPC, isPending } = useCreatePC();
  const [formState, setFormState] = useState<PCFormState>({
    values: {},
    errors: {},
  });

  const handleInputChange = (field: keyof PCCreate, value: unknown) => {
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all form data
    const result = validateData(PCCreateSchema, formState.values);

    if (!result.success) {
      // Update form state with validation errors
      setFormState(prev => ({
        ...prev,
        errors: result.errors,
      }));

      // Optionally show formatted errors
      console.error(formatValidationErrors(result.errors));
      return;
    }

    // Data is valid and properly typed
    try {
      createPC(result.data);
      // Reset form on success
      setFormState({ values: {}, errors: {} });
    } catch (error) {
      console.error('Failed to create PC:', error);
    }
  };

  const getFieldError = (field: keyof PCCreate): string | undefined => {
    return formState.errors[field]?.[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-lg font-bold">Create PC</h2>

      {/* CPU Field */}
      <div>
        <label htmlFor="cpu" className="block text-sm font-medium">
          CPU <span className="text-red-500">*</span>
        </label>
        <input
          id="cpu"
          type="text"
          value={formState.values.cpu || ''}
          onChange={e => handleInputChange('cpu', e.target.value)}
          className={`mt-1 w-full rounded-md border px-3 py-2 ${
            getFieldError('cpu') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Intel i7"
        />
        {getFieldError('cpu') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('cpu')}</p>
        )}
      </div>

      {/* RAM Field */}
      <div>
        <label htmlFor="ram" className="block text-sm font-medium">
          RAM (GB) <span className="text-red-500">*</span>
        </label>
        <input
          id="ram"
          type="number"
          value={formState.values.ram || ''}
          onChange={e => handleInputChange('ram', e.target.valueAsNumber)}
          className={`mt-1 w-full rounded-md border px-3 py-2 ${
            getFieldError('ram') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., 16"
        />
        {getFieldError('ram') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('ram')}</p>
        )}
      </div>

      {/* Videocard Field */}
      <div>
        <label htmlFor="videocard" className="block text-sm font-medium">
          Videocard <span className="text-red-500">*</span>
        </label>
        <input
          id="videocard"
          type="text"
          value={formState.values.videocard || ''}
          onChange={e => handleInputChange('videocard', e.target.value)}
          className={`mt-1 w-full rounded-md border px-3 py-2 ${
            getFieldError('videocard') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., NVIDIA RTX 4060"
        />
        {getFieldError('videocard') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('videocard')}</p>
        )}
      </div>

      {/* Hard Disc Field */}
      <div>
        <label htmlFor="hard_disc" className="block text-sm font-medium">
          Hard Disc <span className="text-red-500">*</span>
        </label>
        <input
          id="hard_disc"
          type="text"
          value={formState.values.hard_disc || ''}
          onChange={e => handleInputChange('hard_disc', e.target.value)}
          className={`mt-1 w-full rounded-md border px-3 py-2 ${
            getFieldError('hard_disc') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., 512GB SSD"
        />
        {getFieldError('hard_disc') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('hard_disc')}</p>
        )}
      </div>

      {/* USB Amount Field */}
      <div>
        <label htmlFor="usb_amout" className="block text-sm font-medium">
          USB Ports <span className="text-red-500">*</span>
        </label>
        <input
          id="usb_amout"
          type="number"
          value={formState.values.usb_amout || ''}
          onChange={e => handleInputChange('usb_amout', e.target.valueAsNumber)}
          className={`mt-1 w-full rounded-md border px-3 py-2 ${
            getFieldError('usb_amout') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., 4"
        />
        {getFieldError('usb_amout') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('usb_amout')}</p>
        )}
      </div>

      {/* OS Field */}
      <div>
        <label htmlFor="os" className="block text-sm font-medium">
          Operating System <span className="text-red-500">*</span>
        </label>
        <input
          id="os"
          type="text"
          value={formState.values.os || ''}
          onChange={e => handleInputChange('os', e.target.value)}
          className={`mt-1 w-full rounded-md border px-3 py-2 ${
            getFieldError('os') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Windows 11"
        />
        {getFieldError('os') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('os')}</p>
        )}
      </div>

      {/* Buy Date Field */}
      <div>
        <label htmlFor="buy_date" className="block text-sm font-medium">
          Purchase Date <span className="text-red-500">*</span>
        </label>
        <input
          id="buy_date"
          type="date"
          value={formState.values.buy_date || ''}
          onChange={e => handleInputChange('buy_date', e.target.value)}
          className={`mt-1 w-full rounded-md border px-3 py-2 ${
            getFieldError('buy_date') ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {getFieldError('buy_date') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('buy_date')}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Creating...' : 'Create PC'}
      </button>
    </form>
  );
}
