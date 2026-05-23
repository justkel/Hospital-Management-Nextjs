'use client';

import { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import {
    GetAllPatientsQuery,
    CreatePatientInput,
    PatientStatus,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import CreatePatientModal from './components/CreatePatientModal';
import PatientCard from './components/PatientCard';
import { Search, UserPlus, Users } from 'lucide-react';

export type PatientListItem =
    GetAllPatientsQuery['patients']['items'][number];

export default function PatientManagementClient({
    paginated,
}: {
    paginated: GetAllPatientsQuery['patients'];
}) {
    const [list, setList] = useState<PatientListItem[]>(paginated.items);
    const [baseList, setBaseList] = useState<PatientListItem[]>(paginated.items);

    const [page, setPage] = useState(paginated.page);
    const [total, setTotal] = useState(paginated.total);
    const [limit, setLimit] = useState(20);

    const [search, setSearch] = useState('');
    const [openCreate, setOpenCreate] = useState(false);

    async function fetchPage(nextPage: number, nextLimit = limit) {
        const res = await clientFetch(
            `/api/patients/list?page=${nextPage}&limit=${nextLimit}`
        );

        const json = await res.json();
        if (!res.ok) return;

        setPage(json.patients.page);
        setTotal(json.patients.total);
        setBaseList(json.patients.items);
        setList(json.patients.items);
    }

    useEffect(() => {
        const run = async () => {
            if (!search.trim()) {
                setList(baseList);
                return;
            }

            const res = await clientFetch(
                `/api/patients/search?query=${encodeURIComponent(search)}`
            );

            const json = await res.json();
            setList(json.patients ?? []);
        };

        const t = setTimeout(run, 350);
        return () => clearTimeout(t);
    }, [search, baseList]);

    async function handleCreate(data: CreatePatientInput) {
        const res = await clientFetch('/api/patients/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error);

        setBaseList(prev => [json.patient, ...prev]);
        setList(prev => [json.patient, ...prev]);
        setTotal(t => t + 1);

        return {
            warning: json.warning as string | undefined,
            matches: json.matches,
        };
    }

    const emergencyCount = list.filter(p => p.emergency).length;
    const activeCount = list.filter(p => p.status === PatientStatus.Active).length;

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-xl bg-[#0c1a12] px-6 py-6 sm:px-8">
                <div className="pointer-events-none absolute inset-0"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#1D9E75]/15 blur-[50px]" />

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#5DCAA5]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
                            Clinical records
                        </div>
                        <h1 className="mb-1 text-[20px] font-medium tracking-[-0.02em] text-white">Patients</h1>
                        <p className="text-[13px] text-[#5a7a6a]">Manage patient records and registrations</p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="hidden gap-2 sm:flex">
                            {[
                                { val: total, label: 'Total' },
                                { val: emergencyCount, label: 'Emergency' },
                                { val: activeCount, label: 'Active' },
                            ].map(s => (
                                <div key={s.label}
                                    className="min-w-[60px] rounded-[10px] border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 text-center"
                                >
                                    <p className="text-[18px] font-medium leading-none text-white">{s.val}</p>
                                    <p className="mt-1 text-[10px] uppercase tracking-[0.07em] text-[#3B6D11]">{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setOpenCreate(true)}
                            className="inline-flex h-[38px] items-center gap-2 rounded-[9px] bg-[#1D9E75] px-5 text-[13px] font-medium text-white transition hover:bg-[#0F6E56]"
                        >
                            <UserPlus size={14} />
                            New patient
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative max-w-[300px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B4B2A9]" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search name or patient number…"
                    className="h-[38px] w-full rounded-[9px] border border-[#E8E6E0] bg-white pl-9 pr-3 text-[13px] text-[#2C2C2A] placeholder-[#B4B2A9] outline-none transition focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10"
                />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {list.length > 0 ? (
                    list.map(p => <PatientCard key={p.id} patient={p} />)
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-16">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-[#E8E6E0] bg-white">
                            <Users size={22} className="text-[#B4B2A9]" />
                        </div>
                        <p className="text-[13px] font-medium text-[#5F5E5A]">No patients found</p>
                        <p className="mt-1 text-[12px] text-[#B4B2A9]">Try a different search or register a new patient</p>
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
                        setLimit(l);
                        fetchPage(p, l);
                    }}
                />
            </div>

            {openCreate && (
                <CreatePatientModal
                    onClose={() => setOpenCreate(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
}
