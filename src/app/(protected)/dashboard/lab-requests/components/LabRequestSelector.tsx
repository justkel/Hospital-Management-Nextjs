'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import {
    DownOutlined,
    CheckOutlined,
    CloseOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { clientFetch } from '@/lib/clientFetch';
import { LabPriority } from '@/shared/graphql/generated/graphql';

export default function LabRequestSelector({
    catalogs,
    visitId,
}: any) {
    const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>([]);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [priority, setPriority] = useState<LabPriority>(
        LabPriority.Routine
    );

    const noCatalogs = !catalogs || catalogs.length === 0;

    const selectedCatalogs = useMemo(
        () =>
            catalogs?.filter((c: any) =>
                selectedCatalogIds.includes(c.id)
            ) || [],
        [catalogs, selectedCatalogIds]
    );

    const filteredCatalogs = useMemo(() => {
        return catalogs?.filter((cat: any) =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [catalogs, searchTerm]);

    const canProceed = selectedCatalogIds.length > 0 && !noCatalogs;

    const formatPrice = (amount: number, currency?: string) => {
        if (currency === 'NGN') return `₦${amount.toLocaleString()}`;
        if (!currency) return amount.toLocaleString();
        return `${currency} ${amount.toLocaleString()}`;
    };

    const toggleCatalog = (id: string) => {
        setSelectedCatalogIds(prev =>
            prev.includes(id)
                ? prev.filter(c => c !== id)
                : [...prev, id]
        );
    };

    const removeCatalog = (id: string) => {
        setSelectedCatalogIds(prev => prev.filter(c => c !== id));
    };

    const totalPrice = useMemo(() => {
        return selectedCatalogs.reduce(
            (sum: number, cat: any) => sum + Number(cat.unitPrice || 0),
            0
        );
    }, [selectedCatalogs]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const res = await clientFetch('/api/lab-request/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitId,
                    chargeCatalogIds: selectedCatalogIds,
                    priority
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Failed to create lab request');
            }

            setSuccess('Lab request created successfully.');
            setSelectedCatalogIds([]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpenDropdown(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="mt-8 border-t border-gray-100 pt-8 space-y-6 font-[Montserrat] animate-fade-in">
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Charges shown here come from billing catalogs mapped to the{' '}
                <span className="font-semibold text-gray-700">Lab</span> domain.
                If no options appear, an administrator may need to configure or map
                lab-related catalogs in billing settings.
            </p>

            {noCatalogs && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 text-sm">
                    No lab charge catalogs are currently available. Please contact
                    an administrator to configure billing catalogs for Lab requests.
                </div>
            )}

            {!noCatalogs && (
                <div className="space-y-5">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setOpenDropdown(prev => !prev)}
                            className="
                w-full px-5 py-4 rounded-2xl border border-gray-200
                bg-white shadow-sm flex items-center justify-between
                hover:border-green-500 focus:ring-2 focus:ring-green-600
                transition cursor-pointer
              "
                        >
                            <span className="text-sm text-gray-700">
                                {selectedCatalogIds.length > 0
                                    ? `${selectedCatalogIds.length} lab request(s) selected`
                                    : 'Select Lab Request Type(s)'}
                            </span>

                            <DownOutlined
                                className={`text-gray-400 transition-transform ${openDropdown ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {openDropdown && (
                            <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-3 border-b border-gray-100 relative">
                                    <SearchOutlined className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search lab request..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="
                      w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                      focus:ring-2 focus:ring-green-500 outline-none text-sm
                    "
                                    />
                                </div>

                                <div className="max-h-72 overflow-y-auto">
                                    {filteredCatalogs?.length > 0 ? (
                                        filteredCatalogs.map((cat: any) => {
                                            const selected = selectedCatalogIds.includes(cat.id);

                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => toggleCatalog(cat.id)}
                                                    className="
                            w-full px-4 py-4 text-left flex items-center justify-between
                            hover:bg-green-50 transition border-b last:border-b-0 border-gray-100
                          "
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">
                                                            {cat.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatPrice(cat.unitPrice, cat.currency)}
                                                        </p>
                                                    </div>

                                                    {selected && (
                                                        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                                                            <CheckOutlined className="text-white text-xs" />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="py-10 text-center text-sm text-gray-400">
                                            No matching lab request found.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {selectedCatalogs.length > 0 && (
                        <>
                            <div className="flex flex-wrap gap-3">
                                {selectedCatalogs.map((cat: any) => (
                                    <div
                                        key={cat.id}
                                        className="
            flex items-center gap-2 px-4 py-2 rounded-full
            bg-green-50 border border-green-200
            max-w-full
          "
                                    >
                                        <span className="text-sm text-green-800 font-medium truncate">
                                            {cat.name}
                                        </span>

                                        <span className="text-xs text-green-700 whitespace-nowrap">
                                            ({formatPrice(cat.unitPrice, cat.currency)})
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => removeCatalog(cat.id)}
                                            className="text-green-700 hover:text-red-500 transition shrink-0"
                                        >
                                            <CloseOutlined className="text-xs" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div
                                className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-3 rounded-2xl border border-green-100
        bg-gradient-to-r from-green-50 to-white
        px-5 py-4
      "
                            >
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        Total Charges
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold text-green-700">
                                        {formatPrice(totalPrice, selectedCatalogs[0]?.currency)}
                                    </p>
                                </div>

                                <div className="text-sm text-gray-500">
                                    {selectedCatalogIds.length} item
                                    {selectedCatalogIds.length > 1 ? 's' : ''} selected
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800">
                                Request Priority
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                                Choose how quickly this lab request should be attended to.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {Object.values(LabPriority).map(level => {
                                const active = priority === level;

                                const styles = {
                                    ROUTINE: active
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 bg-white hover:border-blue-300',
                                    URGENT: active
                                        ? 'border-amber-500 bg-amber-50 shadow-md'
                                        : 'border-gray-200 bg-white hover:border-amber-300',
                                    STAT: active
                                        ? 'border-red-500 bg-red-50 shadow-md'
                                        : 'border-gray-200 bg-white hover:border-red-300',
                                };

                                const badgeStyles = {
                                    ROUTINE: active
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-500',
                                    URGENT: active
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-gray-100 text-gray-500',
                                    STAT: active
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-500',
                                };

                                const descriptions = {
                                    ROUTINE: 'Normal processing',
                                    URGENT: 'Attend quickly',
                                    STAT: 'Immediate action',
                                };

                                return (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setPriority(level)}
                                        className={`
            w-full rounded-2xl border p-4 text-left transition-all duration-200
            ${styles[level as keyof typeof styles]}
          `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                                {level}
                                            </span>

                                            <span
                                                className={`
                text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full
                ${badgeStyles[level as keyof typeof badgeStyles]}
              `}
                                            >
                                                {active ? 'Selected' : 'Choose'}
                                            </span>
                                        </div>

                                        <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                            {descriptions[level as keyof typeof descriptions]}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!canProceed || loading}
                        className="
    w-full sm:w-auto px-8 py-4 rounded-2xl bg-green-600
    text-white! font-semibold hover:bg-green-700
    disabled:bg-gray-300 disabled:cursor-not-allowed
    shadow-md transition
  "
                    >
                        {loading ? 'Creating...' : 'Continue'}
                    </button>
                </div>
            )}
        </div>
    );
}