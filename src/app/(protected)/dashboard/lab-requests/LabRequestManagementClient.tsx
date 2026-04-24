'use client';

import { useEffect, useMemo, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import {
  ChargeDomain,
  GetVisitsByPatientUserCodeQuery,
} from '@/shared/graphql/generated/graphql';
import {
  SearchOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useBilling } from '@/hooks/billing/useBilling';
import PatientVisitCard from './components/PatientVisitCard';

type Visit = GetVisitsByPatientUserCodeQuery['visitsByPatientUserCode'][number];

export default function LabRequestManagementClient() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const { catalogs } = useBilling(ChargeDomain.Lab);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);

    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!debouncedSearch) {
      setVisits([]);
      setSearched(false);
      return;
    }

    const run = async () => {
      setLoading(true);
      setSearched(true);

      try {
        const res = await clientFetch(
          `/api/visit/search-by-user-code?userCode=${debouncedSearch}`
        );
        const json = await res.json();
        setVisits(json.visits ?? []);
      } catch (err) {
        console.error(err);
        setVisits([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [debouncedSearch]);

  const patient = useMemo(() => visits[0]?.patient, [visits]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Lab Requests
          </h1>
          <p className="text-gray-500 mt-2">
            Search patient visits by user code.
          </p>
        </div>

        <div className="relative max-w-xl">
          <input
            type="number"
            min={1}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Enter patient user code..."
            className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-12 py-4 text-lg shadow-sm focus:ring-2 focus:ring-green-700 focus:outline-none"
          />

          <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

          {loading && (
            <LoadingOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 text-lg animate-spin" />
          )}
        </div>

        {patient && (
          <PatientVisitCard
            patient={patient}
            visits={visits}
            catalogs={catalogs}
          />
        )}

        {!loading && searched && visits.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-3xl py-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold">No visits found</h3>
            <p className="text-gray-500 mt-1">
              No patient visits matching "{debouncedSearch}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}