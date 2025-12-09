import { useQueryClient } from '@tanstack/react-query';
import useAppQuery from '@/hooks/useAppQuery';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '@/lib/axios';
import { Client, ClientCreateSchema, ClientUpdateSchema } from '@/features/clients/types';
import useAppMutation from '@/hooks/useAppMutation';
import toast from '@/hooks/toast';

// API-запити з валідацією Zod
const getClients = async (): Promise<Client[]> => {
  const response = await apiClient.get('/clients');
  return response.data.data || response.data;
};

const getClientById = async (id: string): Promise<Client> => {
  const response = await apiClient.get(`/clients/${id}`);
  return response.data.data || response.data;
};

const createClient = async (newClient: unknown): Promise<Client> => {
  // Валідуємо дані перед відправкою
  const validatedData = ClientCreateSchema.parse(newClient);
  const response = await apiClient.post('/clients', validatedData);
  return response.data;
};

const updateClient = async ({ id, data }: { id: string, data: unknown }): Promise<Client> => {
  // Валідуємо дані перед оновленням
  const validatedData = ClientUpdateSchema.parse(data);
  const response = await apiClient.patch(`/clients/${id}`, validatedData);
  return response.data;
};

const deleteClient = async (id: string): Promise<void> => {
  await apiClient.delete(`/clients/${id}`);
};

// Хуки
export const useClients = () => useAppQuery<Client[]>({ queryKey: ['clients'], queryFn: getClients });

export const useClient = (id: string) => useAppQuery<Client>({ queryKey: ['clients', id], queryFn: () => getClientById(id) });
export const useCreateClient = () => {
  const navigate = useNavigate();

  return useAppMutation(createClient, {
    invalidateQueries: [['clients']],
    navigateTo: '/clients',
    successMessage: 'Клієнта створено',
    errorMessage: 'Не вдалося створити клієнта',
  });
};

export const useUpdateClient = () => {
  const navigate = useNavigate();

  return useAppMutation(updateClient, {
    invalidateQueries: [['clients']],
    navigateTo: '/clients',
    successMessage: 'Клієнта оновлено',
    errorMessage: 'Не вдалося оновити клієнта',
  });
};

export const useDeleteClient = () => {
  return useAppMutation(deleteClient, {
    invalidateQueries: [['clients']],
    successMessage: 'Клієнта видалено',
    errorMessage: 'Не вдалося видалити клієнта',
  });
};
