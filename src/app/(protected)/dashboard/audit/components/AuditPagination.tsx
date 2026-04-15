'use client';

import { Pagination } from 'antd';

type Props = {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number, limit: number) => void;
};

export default function AuditPagination({
  page,
  total,
  limit,
  onChange,
}: Props) {
  return (
    <div className="flex justify-center pt-6">
      <Pagination
        current={page}
        pageSize={limit}
        total={total}
        showSizeChanger
        onChange={onChange}
      />
    </div>
  );
}