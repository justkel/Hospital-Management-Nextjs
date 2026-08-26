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
      <div className="rounded-2xl border !border-[#E8E6E0] !bg-white py-16 shadow-sm">
        <Empty
          image={<FileSearch size={40} className="mx-auto !text-[#B4B2A9]" />}
          description={
            <span className="text-sm !text-[#767570]">
              No audit logs match these filters
            </span>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white shadow-sm md:block">
        <div
          className="overflow-x-auto hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b !border-[#E8E6E0] !bg-[#FAFAF8] text-left text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                <th className="w-14 px-4 py-3">S/N</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Date</th>
                <th className="w-16 px-4 py-3 text-center">View</th>
              </tr>
            </thead>
            <tbody className="divide-y !divide-[#F0EFE9]">
              {list.map((a, index) => {
                const style = getActionStyle(a.action);
                return (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className="cursor-pointer transition hover:!bg-[#F7F7F5]"
                  >
                    <td className="px-4 py-3.5 !text-[#B4B2A9]">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${style.bg} ${style.text} ${style.border}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {a.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md !bg-[#F7F7F5] px-2 py-1 font-mono text-[10px] font-semibold !text-[#767570]">
                        {a.entity}
                      </span>
                    </td>
                    <td className="max-w-xs px-4 py-3.5 !text-[#5F5E5A]">
                      <Tooltip title={a.actorType ?? 'N/A'}>
                        <span className="block truncate">{a.actorType ?? 'N/A'}</span>
                      </Tooltip>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 !text-[#767570]">
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
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg !text-[#B4B2A9] transition hover:!bg-[#EFF5FF] hover:!text-[#1D6FE0]"
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
              className="overflow-hidden rounded-xl border !border-[#E8E6E0] !bg-white p-4 text-left transition hover:!border-[#D3D1C7]"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex max-w-[70%] items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${style.bg} ${style.text} ${style.border} shrink-0`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot} shrink-0`} />
                  <span className="truncate">{a.action}</span>
                </span>
                <span className="shrink-0 text-[10px] font-medium !text-[#B4B2A9]">
                  #{(page - 1) * limit + index + 1}
                </span>
              </div>

              <div className="mt-2.5">
                <p className="break-words text-sm !text-[#5F5E5A]">
                  {a.actorType ?? 'N/A'}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                <span className="shrink-0 rounded-md !bg-[#F7F7F5] px-2 py-0.5 font-mono text-[10px] font-semibold !text-[#767570] max-w-[55%] truncate">
                  {a.entity}
                </span>
                <span className="shrink-0 !text-[#B4B2A9]">
                  {formatRelative(a.createdAt)}
                </span>
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