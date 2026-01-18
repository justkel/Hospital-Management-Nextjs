'use client';

import { useEffect, useMemo, useState } from 'react';
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

type StaffItem = GetAllStaffQuery['staffs']['items'][number];
type StaffsQueryResult = GetAllStaffQuery['staffs'];

export default function StaffManagementClient({
  paginated,
}: {
  paginated: StaffsQueryResult;
}) {
  const [list, setList] = useState<StaffItem[]>(paginated.items);
  const [baseList, setBaseList] = useState<StaffItem[]>(paginated.items);

  const [page, setPage] = useState(paginated.page);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(paginated.total);

  const [openCreate, setOpenCreate] = useState(false);
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
  const [rolesToUpdate, setRolesToUpdate] = useState<StaffRole[]>([]);
  const [updatingRoles, setUpdatingRoles] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<StaffItem | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function fetchPage(nextPage: number, nextLimit = limit) {
    try {
      const res = await clientFetch(
        `/api/staff/staff-list?page=${nextPage}&limit=${nextLimit}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const json = await res.json();

      if (!res.ok) {
        console.error(json.error ?? 'Failed to fetch staff');
        return;
      }

      const data = json.staffs;

      setPage(data.page);
      setTotal(data.total);
      setBaseList(data.items);
      setList(data.items);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const run = async () => {
      if (!search.trim()) {
        setList(baseList);
        return;
      }

      const res = await clientFetch(
        `/api/staff/search?query=${encodeURIComponent(search)}`
      );
      const json = await res.json();
      setList(json.staff ?? []);
    };
    const t = setTimeout(run, 350);
    return () => clearTimeout(t);
  }, [search, baseList]);

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

    setBaseList(prev =>
      prev.map(s => (s.id === json.staff.id ? json.staff : s))
    );
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

    setBaseList(prev => [staff, ...prev]);
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

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Staff Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage and explore staff across your organization
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="px-6 py-2 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium hover:scale-[1.03] transition self-start"
        >
          + Add Staff
        </button>
      </div>

      {successMessage && (
        <div className="fixed top-20 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md animate-fade-in">
          {successMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full md:max-w-sm px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex flex-wrap gap-2">
          {(['ALL', ...Object.values(StaffRole)] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${roleFilter === r
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <div className="col-span-full text-center py-12 text-gray-500">
            {roleFilter === 'ALL'
              ? 'No staff available.'
              : `No staff found with the role "${roleFilter}".`}
          </div>
        )}
      </div>

      <div className="flex justify-center pt-6">
        <Pagination
          current={page}
          pageSize={limit}
          total={total}
          showSizeChanger
          onChange={(p, l) => {
            setLimit(l);
            fetchPage(p, l);
          }}
        />
      </div>

      {selectedId && (
        <DetailsDrawer
          staff={details}
          loading={loadingDetails}
          onClose={closeDetails}
          onStatusUpdated={updatedStaff => {
            setBaseList(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
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
