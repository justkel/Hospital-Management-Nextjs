'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pagination } from 'antd';
import {
  StaffRole,
  GetAllStaffQuery,
  CreateStaffInput,
  UpdateStaffRolesInput,
} from '@/shared/graphql/generated/graphql';
import CreateStaffModal from './CreateStaffModal';
import StaffCard from './components/StaffCard';
import RolesModal from './components/RolesModal';
import DetailsDrawer from './components/DetailsDrawer';
import { clientFetch } from '@/lib/clientFetch';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { CheckCircle, Search, UserPlus, Users } from 'lucide-react';
import { HasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';

type StaffItem = GetAllStaffQuery['staffs']['items'][number];
type StaffsQueryResult = GetAllStaffQuery['staffs'];

export default function StaffManagementClient({
  paginated,
}: {
  paginated: StaffsQueryResult;
}) {
  const { searchParams, update } = useUrlFilters();

  const [list, setList] = useState<StaffItem[]>(paginated.items);

  const [page, setPage] = useState(paginated.page);
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 25);
  const [total, setTotal] = useState(paginated.total);

  const [openCreate, setOpenCreate] = useState(false);
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'ALL'>('ALL');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
  const [rolesToUpdate, setRolesToUpdate] = useState<StaffRole[]>([]);
  const [updatingRoles, setUpdatingRoles] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<StaffItem | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function fetchStaff(
    nextPage: number,
    nextLimit: number,
    nextSearch: string,
  ) {
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(nextLimit),
      });

      if (nextSearch.trim()) {
        params.set('search', nextSearch.trim());
      }

      const res = await clientFetch(`/api/staff/staff-list?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      const json = await res.json();

      if (!res.ok) {
        console.error(json.error ?? 'Failed to fetch staff');
        return;
      }

      const data = json.staffs;

      setPage(data.page);
      setTotal(data.total);
      setList(data.items);
    } catch (err) {
      console.error(err);
    }
  }

  function applyFilters(next: {
    page: number;
    limit: number;
    search: string;
  }) {
    setLimit(next.limit);

    update({
      search: next.search.trim() || undefined,
      page: next.page,
      limit: next.limit,
    });

    fetchStaff(next.page, next.limit, next.search);
  }

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const t = setTimeout(() => {
      applyFilters({ page: 1, limit, search });
    }, 350);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filtered = useMemo(() => {
    return roleFilter === 'ALL'
      ? list
      : list.filter(s => s.roles.includes(roleFilter));
  }, [list, roleFilter]);


  function openRoleModal(staff: StaffItem) {
    setEditingStaff(staff);
    setRolesToUpdate(staff.roles);
    setRoleError(null);
  }


  function toggleRole(role: StaffRole) {
    setRolesToUpdate(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  }

  async function handleUpdateRoles() {
    if (!editingStaff) return;
    setUpdatingRoles(true);
    setRoleError(null);

    const body: UpdateStaffRolesInput = {
      staffId: editingStaff.id,
      roles: rolesToUpdate,
    };

    const res = await clientFetch('/api/staff/update-roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const json = await res.json();

    if (!res.ok) {
      setRoleError(json.error ?? 'Something went wrong');
      setUpdatingRoles(false);
      return;
    }

    setList(prev =>
      prev.map(s => (s.id === json.staff.id ? json.staff : s))
    );

    setEditingStaff(null);
    setUpdatingRoles(false);

    setSuccessMessage('Roles updated successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  }

  async function handleCreate(data: CreateStaffInput) {
    const res = await clientFetch('/api/staff/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || 'Failed to create staff');
    }

    const staff = json.staff;

    setList(prev => [staff, ...prev]);
    setTotal(t => t + 1);
  }

  async function openDetails(id: string) {
    setSelectedId(id);
    setLoadingDetails(true);
    setDetails(null);

    const res = await clientFetch(`/api/staff/get-by-id?id=${id}`);
    const json = await res.json();

    setDetails(json.staff ?? null);
    setLoadingDetails(false);
  }

  function closeDetails() {
    setSelectedId(null);
    setDetails(null);
  }

  const activeCount = list.filter(s => s.status === 'ACTIVE').length;
  const roleCount = new Set(list.flatMap(s => s.roles)).size;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-xl bg-[#0c1a12] px-6 py-6 sm:px-8">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#1D9E75]/15 blur-[50px]" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] !text-[#5DCAA5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
              Organization roster
            </div>
            <h1 className="mb-1 text-[20px] font-medium tracking-[-0.02em] !text-white">
              Staff management
            </h1>
            <p className="text-[13px] !text-[#5a7a6a]">
              Manage and explore staff across your organisation
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="hidden gap-2.5 sm:flex">
              {[
                { val: total, label: 'Total' },
                { val: roleCount, label: 'Roles' },
                { val: activeCount, label: 'Active' },
              ].map(s => (
                <div key={s.label}
                  className="min-w-[60px] rounded-[10px] border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 text-center"
                >
                  <p className="text-[18px] font-medium leading-none !text-white">{s.val}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.07em] !text-[#3B6D11]">{s.label}</p>
                </div>
              ))}
            </div>

            <HasRoles roles={[Roles.ADMIN]}>
              <button
                onClick={() => setOpenCreate(true)}
                className="inline-flex h-[38px] items-center gap-2 rounded-[9px] bg-[#1D9E75] px-5 text-[13px] font-medium !text-white transition hover:bg-[#0F6E56]"
              >
                <UserPlus size={14} />
                Add staff
              </button>
            </HasRoles>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1 sm:max-w-[300px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 !text-[#B4B2A9]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or code…"
            className="h-[38px] w-full rounded-[9px] border border-[#E8E6E0] bg-white pl-9 pr-3 text-[13px] text-[#2C2C2A] placeholder-[#B4B2A9] outline-none transition focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['ALL', ...Object.values(StaffRole)] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`h-8 rounded-full px-3.5 text-[12px] font-medium transition border ${roleFilter === r
                ? 'border-[#0c1a12] bg-[#0c1a12] !text-white'
                : 'border-[#E8E6E0] bg-white text-[#5F5E5A] hover:border-[#D3D1C7] hover:text-[#2C2C2A]'
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map(staff => (
            <StaffCard
              key={staff.id}
              staff={staff}
              onView={openDetails}
              onEdit={openRoleModal}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white border border-[#E8E6E0]">
              <Users size={22} className="text-[#B4B2A9]" />
            </div>
            <p className="text-[13px] font-medium text-[#5F5E5A]">No staff found</p>
            <p className="mt-1 text-[12px] !text-[#B4B2A9]">
              {roleFilter === 'ALL'
                ? 'No staff available yet.'
                : `No staff with the role "${roleFilter}".`}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-2">
        <Pagination
          current={page}
          pageSize={limit}
          total={total}
          showSizeChanger
          onChange={(p, l) => {
            applyFilters({ page: p, limit: l, search });
          }}
        />
      </div>

      {successMessage && (
        <div className="fixed right-5 top-[72px] z-50 flex items-center gap-2 rounded-[10px] border border-[#1D9E75]/30 bg-[#0c1a12] px-4 py-2.5 text-[13px] font-medium !text-[#5DCAA5] shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
          <CheckCircle size={14} />
          {successMessage}
        </div>
      )}

      {selectedId && (
        <DetailsDrawer
          staff={details}
          loading={loadingDetails}
          onClose={closeDetails}
          onStatusUpdated={updatedStaff => {
            setList(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
          }}
        />
      )}

      {editingStaff && (
        <RolesModal
          staff={editingStaff}
          rolesToUpdate={rolesToUpdate}
          onClose={() => setEditingStaff(null)}
          onToggleRole={toggleRole}
          onSave={handleUpdateRoles}
          updating={updatingRoles}
          error={roleError}
        />
      )}

      {openCreate && (
        <CreateStaffModal
          onClose={() => setOpenCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
