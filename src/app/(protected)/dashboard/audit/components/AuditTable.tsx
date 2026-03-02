'use client';

import { AuditItem } from '../AuditManagementClient';

export default function AuditTable({
  list,
}: {
  list: AuditItem[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="p-4 text-left">Action</th>
            <th className="p-4 text-left">Entity</th>
            <th className="p-4 text-left">Actor</th>
            <th className="p-4 text-left">App</th>
            <th className="p-4 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map(a => (
              <tr
                key={a.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-medium">{a.action}</td>
                <td className="p-4">{a.entity}</td>
                <td className="p-4">{a.actorType ?? '—'}</td>
                <td className="p-4">{a.appName}</td>
                <td className="p-4">
                  {new Date(a.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center p-8 text-gray-500"
              >
                No audit logs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}