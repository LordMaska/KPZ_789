import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useClients, useDeleteClient } from '@/features/clients/api';
import { DataTable, Button, ConfirmDialog, type Column } from '@/components/ui';
import type { Client } from '@/features/clients/types';
import { formatDate } from '@/utils/date';

export const Route = createFileRoute('/clients/')({
  component: ClientsListPage,
});

function ClientsListPage() {
  const { data: clients, isLoading, error } = useClients();
  const deleteClient = useDeleteClient();
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const columns: Column<Client>[] = [
    {
      key: 'phone',
      header: 'Телефон',
      className: 'w-40',
    },
    {
      key: 'full_name',
      header: "Повне ім'я",
    },
    {
      key: 'birth',
      header: 'Дата народження',
      render: (client) => formatDate(client.birth),
      className: 'w-40',
    },
  ];

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
  };

  const handleConfirmDelete = async () => {
    if (clientToDelete) {
      try {
        await deleteClient.mutateAsync(clientToDelete.phone);
        setClientToDelete(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Список клієнтів</h1>
        </div>
        <Link to="/clients/new">
          <Button variant="primary">Додати клієнта</Button>
        </Link>
      </div>

      <DataTable
        data={clients}
        columns={columns}
        isLoading={isLoading}
        error={error instanceof Error ? error : undefined}
        emptyMessage="Немає клієнтів у базі даних. Додайте першого!"
        getRowKey={(client) => client.phone}
        links={[
          {
            label: 'Переглянути',
            to: '/clients/$clientPhone',
            params: (client) => ({ clientPhone: client.phone }),
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
        isOpen={!!clientToDelete}
        title="Видалення клієнта"
        message={
          clientToDelete
            ? `Ви впевнені, що хочете видалити клієнта ${clientToDelete.full_name} (${clientToDelete.phone})?`
            : ''
        }
        confirmLabel="Видалити"
        cancelLabel="Скасувати"
        variant="danger"
        isLoading={deleteClient.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setClientToDelete(null)}
      />
    </div>
  );
}
