'use client';

import { useState } from 'react';
import { Tooltip, Empty } from 'antd';
import { Eye, FileSearch } from 'lucide-react';

import { AuditItem } from '../AuditManagementClient';
import AuditViewModal from './AuditViewModal';
import { formatAbsolute, formatRelative, getActionStyle } from './auditVisuals';

type Props = {
  list: AuditItem[];
  page: number;
  limit: number;
};

export default function AuditTable({ list, page, limit }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white py-16 shadow-sm">
        <Empty
          image={<FileSearch size={40} className="mx-auto text-gray-300" />}
          description={
            <span className="text-sm text-gray-500">
              No audit logs match these filters
            </span>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                <th className="w-14 px-4 py-3.5">S/N</th>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5">Entity</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="w-16 px-4 py-3.5 text-center">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {list.map((a, index) => {
                const style = getActionStyle(a.action);
                return (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3.5 text-gray-400">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {a.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-600">
                        {a.entity}
                      </span>
                    </td>
                    <td className="max-w-xs px-4 py-3.5 text-gray-600">
                      <Tooltip title={a.actorType ?? 'N/A'}>
                        <span className="block truncate">{a.actorType ?? 'N/A'}</span>
                      </Tooltip>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-gray-500">
                      <Tooltip title={formatAbsolute(a.createdAt)}>
                        <span>{formatRelative(a.createdAt)}</span>
                      </Tooltip>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedId(a.id);
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {list.map((a, index) => {
          const style = getActionStyle(a.action);
          return (
            <button
              key={a.id}
              onClick={() => setSelectedId(a.id)}
              className="rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  {a.action}
                </span>
                <span className="text-[11px] text-gray-400">
                  #{(page - 1) * limit + index + 1}
                </span>
              </div>

              <p className="mt-2.5 truncate text-sm text-gray-600">
                {a.actorType ?? 'N/A'}
              </p>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-gray-600">
                  {a.entity}
                </span>
                <span>{formatRelative(a.createdAt)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedId && (
        <AuditViewModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
}