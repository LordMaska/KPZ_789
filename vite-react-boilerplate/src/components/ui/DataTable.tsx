import { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface DataTableAction<T> {
  label: string;
  onClick: (item: T) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: (item: T) => boolean;
  icon?: ReactNode;
}

export interface DataTableLink<T> {
  label: string;
  to: string;
  params?: (item: T) => Record<string, string>;
  className?: string;
}

interface DataTableProps<T> {
  data?: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  actions?: DataTableAction<T>[];
  links?: DataTableLink<T>[];
  getRowKey: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  error = null,
  emptyMessage = 'Немає даних',
  actions = [],
  links = [],
  getRowKey,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner size="lg" text="Завантаження даних..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Validate data is array
  if (!Array.isArray(data)) {
    return (
      <ErrorMessage
        message={`Помилка: дані не є масивом. Отримано: ${JSON.stringify(data)}`}
      />
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const hasActions = actions.length > 0 || links.length > 0;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full border-collapse bg-white shadow-sm">
        <thead>
          <tr className="border-b border-gray-500 bg-gray-100">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-sm font-semibold text-gray-900 ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
            {hasActions && (
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                Дії
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={getRowKey(item)}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              className={`transition-colors ${
                onRowClick
                  ? 'cursor-pointer hover:bg-gray-50'
                  : 'hover:bg-gray-50/50'
              }`}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-3 text-sm text-gray-700 ${column.className || ''}`}
                >
                  {column.render
                    ? column.render(item)
                    : String((item as Record<string, unknown>)[column.key] ?? '')}
                </td>
              ))}
              {hasActions && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {links.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.to}
                        params={link.params ? link.params(item) : undefined}
                        className={
                          link.className ||
                          'text-sm text-blue-600 hover:text-blue-800 hover:underline'
                        }
                      >
                        {link.label}
                      </Link>
                    ))}
                    {actions.map((action, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant={action.variant || 'ghost'}
                        onClick={() => action.onClick(item)}
                        isLoading={action.isLoading ? action.isLoading(item) : false}
                        leftIcon={action.icon}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
