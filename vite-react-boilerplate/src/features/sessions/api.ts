import { useQueryClient } from '@tanstack/react-query';
import useAppQuery from '@/hooks/useAppQuery';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '@/lib/axios';
import { Session, SessionCreateSchema, SessionUpdateSchema } from '@/features/sessions/types';
import useAppMutation from '@/hooks/useAppMutation';


// API-запити з валідацією Zod
const getSessions = async (): Promise<Session[]> => {
  const response = await apiClient.get('/sessions');
  return response.data.data || response.data;
};

const getSessionById = async (id: string): Promise<Session> => {
  const response = await apiClient.get(`/sessions/${id}`);
  return response.data.data || response.data;
};

const createSession = async (newSession: unknown): Promise<Session> => {
  // Валідуємо дані перед відправкою
  const validatedData = SessionCreateSchema.parse(newSession);
  const response = await apiClient.post('/sessions', validatedData);
  return response.data;
};

const updateSession = async ({ id, data }: { id: string, data: unknown }): Promise<Session> => {
  // Валідуємо дані перед оновленням
  const validatedData = SessionUpdateSchema.parse(data);
  const response = await apiClient.patch(`/sessions/${id}`, validatedData);
  return response.data;
};

const deleteSession = async (id: string): Promise<void> => {
  await apiClient.delete(`/sessions/${id}`);
};

// Хуки
export const useSessions = () => useAppQuery<Session[]>({ queryKey: ['sessions'], queryFn: getSessions });

export const useSession = (id: string) => useAppQuery<Session>({ queryKey: ['sessions', id], queryFn: () => getSessionById(id) });
export const useCreateSession = () => {
  const navigate = useNavigate();

  return useAppMutation(createSession, {
    invalidateQueries: [['sessions']],
    navigateTo: '/sessions',
    successMessage: 'Сесію створено',
    errorMessage: 'Не вдалося створити сесію',
  });
};

export const useUpdateSession = () => {
  const navigate = useNavigate();

  return useAppMutation(updateSession, {
    invalidateQueries: [['sessions']],
    navigateTo: '/sessions',
    successMessage: 'Сесію оновлено',
    errorMessage: 'Не вдалося оновити сесію',
  });
};

export const useDeleteSession = () => {
  return useAppMutation(deleteSession, {
    invalidateQueries: [['sessions']],
    successMessage: 'Сесію видалено',
    errorMessage: 'Не вдалося видалити сесію',
  });
};
