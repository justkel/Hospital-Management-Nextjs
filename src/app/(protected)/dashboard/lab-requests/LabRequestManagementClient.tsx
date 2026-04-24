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
  UserOutlined,
  CalendarOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { useBilling } from '@/hooks/billing/useBilling';

type Visit = GetVisitsByPatientUserCodeQuery['visitsByPatientUserCode'][number];

export default function LabRequestClient() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [showSelector, setShowSelector] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState('');
  const [selectedCatalogId, setSelectedCatalogId] = useState('');
  const [error, setError] = useState<string | null>(null);

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
      setShowSelector(false);
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
        setShowSelector(false);
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

  const openVisits = useMemo(
    () => visits.filter(v => v.status === 'OPEN'),
    [visits]
  );

  const canSelectLabRequest = openVisits.length > 0;

  const handleProceed = () => {
    if (!selectedVisitId) {
      setError('Please select a visit.');
      return;
    }

    if (!selectedCatalogId) {
      setError('Please select a lab request.');
      return;
    }

    setError(null);

    console.log({
      selectedVisitId,
      selectedCatalogId,
    });
  };

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
            onChange={e => {
              setSearch(e.target.value);
              setError(null);
            }}
            placeholder="Enter patient user code..."
            className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-12 py-4 text-lg shadow-sm focus:ring-2 focus:ring-green-700 focus:outline-none"
          />

          <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

          {loading && (
            <LoadingOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 text-lg animate-spin" />
          )}
        </div>

        {patient && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <UserOutlined className="text-2xl text-green-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{patient.fullName}</h2>
                  <p className="text-gray-500">User Code: {patient.userCode}</p>
                </div>
              </div>

              <button
                disabled={!canSelectLabRequest}
                onClick={() => setShowSelector(prev => !prev)}
                className="px-6 py-3 rounded-xl bg-green-700 text-white! font-medium hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ExperimentOutlined className="mr-2" />
                Select Lab Request
              </button>
            </div>

            {!canSelectLabRequest && (
              <p className="text-sm text-red-500 mt-3">
                No OPEN visit available for lab requests.
              </p>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Available Visits</h3>

              <div className="grid gap-4">
                {visits.map(v => (
                  <div
                    key={v.id}
                    className="border border-gray-200 rounded-2xl p-5 bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{v.visitType}</p>
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                            v.status === 'OPEN'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700'
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
                  </div>
                ))}
              </div>
            </div>

            {showSelector && (
              <div className="mt-8 border-t pt-6 space-y-4 animate-fade-in">
                <select
                  value={selectedVisitId}
                  onChange={e => setSelectedVisitId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                >
                  <option value="">Select Visit</option>
                  {openVisits.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.visitType} — {new Date(v.visitDateTime).toLocaleString()}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCatalogId}
                  onChange={e => setSelectedCatalogId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                >
                  <option value="">Select Lab Request Type</option>
                  {catalogs?.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  onClick={handleProceed}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white! hover:bg-indigo-700"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
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