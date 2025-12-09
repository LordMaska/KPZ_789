import useAppQuery from '@/hooks/useAppQuery';
import apiClient from '@/lib/axios';
import { PC, PCCreateSchema, PCUpdateSchema } from '@/features/pcs/types';
import useAppMutation from '@/hooks/useAppMutation';

// Функції для API-запитів з валідацією Zod
const getPC = async (): Promise<PC[]> => {
  const response = await apiClient.get('/pcs');
  const data = response.data.data || response.data;
  // Валідуємо отримані дані
  return data;
};

const getPCById = async (id: string): Promise<PC> => {
  const response = await apiClient.get(`/pcs/${id}`);
  return response.data.data || response.data;
};

const createPC = async (newPC: unknown): Promise<PC> => {
  // Валідуємо дані перед відправкою
  const validatedData = PCCreateSchema.parse(newPC);
  const response = await apiClient.post('/pcs', validatedData);
  return response.data;
};

const updatePC = async ({ id, data }: { id: string, data: unknown }): Promise<PC> => {
  // Валідуємо дані перед оновленням
  const validatedData = PCUpdateSchema.parse(data);
  const response = await apiClient.patch(`/pcs/${id}`, validatedData);
  return response.data;
};

const deletePC = async (id: string): Promise<void> => {
  await apiClient.delete(`/pcs/${id}`);
};



// Хуки для використання в компонентах
export const usePCs = () => useAppQuery<PC[]>({ queryKey: ['pcs'], queryFn: getPC });

export const usePC = (id: string) => useAppQuery<PC>({ queryKey: ['pcs', id], queryFn: () => getPCById(id) });
export const useCreatePC = () => {
  return useAppMutation(createPC, {
    invalidateQueries: [['pcs']],
    navigateTo: '/pcs',
    successMessage: 'ПК створено',
    errorMessage: 'Не вдалося створити ПК',
  });
};

export const useUpdatePC = () => {
  return useAppMutation(updatePC, {
    invalidateQueries: [['pcs']],
    navigateTo: '/pcs',
    successMessage: 'ПК оновлено',
    errorMessage: 'Не вдалося оновити ПК',
  });
};

export const useDeletePC = () => {
  return useAppMutation(deletePC, {
    invalidateQueries: [['pcs']],
    successMessage: 'ПК видалено',
    errorMessage: 'Не вдалося видалити ПК',
  });
};
