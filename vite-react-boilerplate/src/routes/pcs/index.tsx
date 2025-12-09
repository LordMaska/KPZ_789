import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { usePCs, useDeletePC } from '@/features/pcs/api';
import { DataTable, Button, ConfirmDialog, type Column } from '@/components/ui';
import type { PC } from '@/features/pcs/types';

export const Route = createFileRoute('/pcs/')({
  component: PCsListPage,
});

function PCsListPage() {
  const { data: pcs, isLoading, error } = usePCs();
  const deletePC = useDeletePC();
  const [pcToDelete, setPcToDelete] = useState<PC | null>(null);

  const columns: Column<PC>[] = [
    {
      key: 'pc_id',
      header: 'ID',
      className: 'w-20',
    },
    {
      key: 'cpu',
      header: 'CPU',
    },
    {
      key: 'ram',
      header: 'RAM (GB)',
      render: (pc) => `${pc.ram} GB`,
      className: 'w-28',
    },
    {
      key: 'videocard',
      header: 'Відеокарта',
    },
    {
      key: 'os',
      header: 'ОС',
      className: 'w-40',
    },
  ];

  const handleDeleteClick = (pc: PC) => {
    setPcToDelete(pc);
  };

  const handleConfirmDelete = async () => {
    if (pcToDelete) {
      try {
        await deletePC.mutateAsync(String(pcToDelete.pc_id));
        setPcToDelete(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Список ПК</h1>
        </div>
        <Link to="/pcs/new">
          <Button variant="primary">Додати ПК</Button>
        </Link>
      </div>

      <DataTable
        data={pcs}
        columns={columns}
        isLoading={isLoading}
        error={error instanceof Error ? error : undefined}
        emptyMessage="Немає ПК у базі даних. Додайте перший!"
        getRowKey={(pc) => pc.pc_id}
        links={[
          {
            label: 'Переглянути',
            to: '/pcs/$pcId',
            params: (pc) => ({ pcId: String(pc.pc_id) }),
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
        isOpen={!!pcToDelete}
        title="Видалення ПК"
        message={
          pcToDelete
            ? `Ви впевнені, що хочете видалити ПК #${pcToDelete.pc_id} (${pcToDelete.cpu})?`
            : ''
        }
        confirmLabel="Видалити"
        cancelLabel="Скасувати"
        variant="danger"
        isLoading={deletePC.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPcToDelete(null)}
      />
    </div>
  );
}
