'use client';

import { useState } from 'react';
import { Pagination } from 'antd';
import {
    GetAllPatientsQuery,
    CreatePatientInput,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import CreatePatientModal from './CreatePatientModal';
import PatientCard from './components/PatientCard';

export type PatientListItem =
    GetAllPatientsQuery['patients']['items'][number];

export default function PatientManagementClient({
    paginated,
}: {
    paginated: GetAllPatientsQuery['patients'];
}) {
    const [list, setList] = useState<PatientListItem[]>(paginated.items);
    const [page, setPage] = useState(paginated.page);
    const [total, setTotal] = useState(paginated.total);
    const [limit, setLimit] = useState(20);

    const [openCreate, setOpenCreate] = useState(false);

    async function fetchPage(nextPage: number, nextLimit = limit) {
        const res = await clientFetch(
            `/api/patients/list?page=${nextPage}&limit=${nextLimit}`
        );

        const json = await res.json();
        if (!res.ok) return;

        setPage(json.patients.page);
        setTotal(json.patients.total);
        setList(json.patients.items);
    }

    async function handleCreate(data: CreatePatientInput) {
        const res = await clientFetch('/api/patients/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error);

        setList(prev => [json.patient, ...prev]);
        setTotal(t => t + 1);
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold">
                        Patients
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage patient records and registrations
                    </p>
                </div>

                <button
                    onClick={() => setOpenCreate(true)}
                    className="rounded-2xl bg-emerald-600 px-6 py-2 text-white! font-medium hover:bg-emerald-700 hover:scale-[1.03] transition"
                >
                    + New Patient
                </button>
            </div>
            <input
                disabled
                placeholder="Search patient name or number…"
                className="w-full md:max-w-sm rounded-xl border px-4 py-3 bg-gray-100 text-gray-400 cursor-not-allowed"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {list.map(p => (
                    <PatientCard key={p.id} patient={p} />
                ))}
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

            {openCreate && (
                <CreatePatientModal
                    onClose={() => setOpenCreate(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
}
