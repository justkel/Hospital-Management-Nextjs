'use client';

import { useEffect, useMemo, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import { GetVisitsByPatientUserCodeQuery } from '@/shared/graphql/generated/graphql';
import {
  SearchOutlined,
  LoadingOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

type Visit = GetVisitsByPatientUserCodeQuery['visitsByPatientUserCode'][number];

export default function LabRequestClient() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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
          <p className="text-gray-500 mt-2 text-base">
            Search patient visits by user code to create or manage lab requests.
          </p>
        </div>

        <div className="relative max-w-xl">
          <input
            type="number"
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
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <UserOutlined className="text-2xl text-green-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {patient.fullName}
                  </h2>
                  <p className="text-gray-500">
                    User Code: {patient.userCode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <p><span className="font-medium">Gender:</span> {patient.gender}</p>
                <p><span className="font-medium">Patient No:</span> {patient.patientNumber}</p>
                <p><span className="font-medium">Phone:</span> {patient.phoneNumber || '—'}</p>
                <p><span className="font-medium">Email:</span> {patient.email || '—'}</p>
              </div>
            </div>

            {/* Visits */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Visits
              </h3>

              <div className="grid gap-4">
                {visits.map(v => (
                  <button
                    key={v.id}
                    className="w-full text-left border border-gray-200 hover:border-green-700 hover:shadow-md transition rounded-2xl p-5 bg-gray-50 hover:bg-white"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="font-semibold text-lg text-gray-900">
                          {v.visitType}
                        </p>
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                            v.status === 'OPEN'
                              ? 'bg-green-100 text-green-700'
                              : v.status === 'CLOSED'
                              ? 'bg-gray-200 text-gray-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {v.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <CalendarOutlined />
                        {new Date(v.visitDateTime).toLocaleString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && searched && visits.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-3xl py-16 text-center animate-fade-in">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800">
              No visits found
            </h3>
            <p className="text-gray-500 mt-1">
              No patient visits matching "{debouncedSearch}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}