import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useSessions, useDeleteSession } from '@/features/sessions/api';
import { DataTable, Button, ConfirmDialog, type Column } from '@/components/ui';
import type { Session } from '@/features/sessions/types';
import { formatDuration } from '@/utils/duration';
import { formatCurrency } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';

export const Route = createFileRoute('/sessions/')({
  component: SessionsListPage,
});

function SessionsListPage() {
  const { data: sessions, isLoading, error } = useSessions();
  const deleteSession = useDeleteSession();
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

  const columns: Column<Session>[] = [
    {
      key: 'session_id',
      header: 'ID',
      className: 'w-20',
    },
    {
      key: 'pc_id',
      header: 'PC ID',
      className: 'w-24',
    },
    {
      key: 'client_phone',
      header: 'Телефон клієнта',
      className: 'w-40',
    },
    {
      key: 'Time',
      header: 'Час',
      render: (session) => (session.Time ? formatDateTime(session.Time) : 'Н/Д'),
    },
    {
      key: 'Duration',
      header: 'Тривалість',
      render: (session) => formatDuration(session.Duration),
      className: 'w-32',
    },
    {
      key: 'Cost',
      header: 'Вартість',
      render: (session) => formatCurrency(session.Cost),
      className: 'w-28 text-right',
    },
  ];

  const handleDeleteClick = (session: Session) => {
    setSessionToDelete(session);
  };

  const handleConfirmDelete = async () => {
    if (sessionToDelete) {
      try {
        await deleteSession.mutateAsync(String(sessionToDelete.session_id));
        setSessionToDelete(null);
      } catch (err) {
        console.error('Помилка при видаленні:', err);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="secondary">
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Головна
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Список сесій</h1>
        </div>
        <Link to="/sessions/new">
          <Button variant="primary">Додати сесію</Button>
        </Link>
      </div>

      <DataTable
        data={sessions}
        columns={columns}
        isLoading={isLoading}
        error={error instanceof Error ? error : undefined}
        emptyMessage="Немає сесій у базі даних. Додайте першу!"
        getRowKey={(session) => session.session_id}
        links={[
          {
            label: 'Переглянути',
            to: '/sessions/$sessionId',
            params: (session) => ({ sessionId: String(session.session_id) }),
          },
        ]}
        actions={[
          {
            label: 'Видалити',
            variant: 'danger',
            onClick: handleDeleteClick,
          },
        ]}
      />

      <ConfirmDialog
        isOpen={!!sessionToDelete}
        title="Видалення сесії"
        message={
          sessionToDelete
            ? `Ви впевнені, що хочете видалити сесію #${sessionToDelete.session_id}?`
            : ''
        }
        confirmLabel="Видалити"
        cancelLabel="Скасувати"
        variant="danger"
        isLoading={deleteSession.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSessionToDelete(null)}
      />
    </div>
  );
}
