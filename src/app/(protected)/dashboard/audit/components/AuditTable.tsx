'use client';

import { useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { AuditItem } from '../AuditManagementClient';
import AuditViewModal from './AuditViewModal';

type Props = {
  list: AuditItem[];
  page: number;
  limit: number;
};

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function AuditTable({ list, page, limit }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">S/N</th>
              <th className="p-4 text-left">Action</th>
              <th className="p-4 text-left">Entity</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-center">View</th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0 ? (
              list.map((a, index) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="p-4 font-medium">{a.action}</td>
                  <td className="p-4">{a.entity}</td>
                  <td className="p-4">
                    {a.actorType ?? 'N/A'}
                  </td>
                  <td className="p-4">
                    {formatDate(a.createdAt)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedId(a.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EyeOutlined />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedId && (
        <AuditViewModal
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}