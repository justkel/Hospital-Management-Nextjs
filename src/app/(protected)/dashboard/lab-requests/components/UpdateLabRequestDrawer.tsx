'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Drawer, Grid } from 'antd';
import { clientFetch } from '@/lib/clientFetch';
import { FindAllLabRequestsQuery, LabPriority } from '@/shared/graphql/generated/graphql';
import CatalogDropdown from './CatalogDropdown';
import SelectedCatalogSummary from './SelectedCatalogSummary';
import PrioritySelector from './PrioritySelector';
import DuplicateConfirmationModal from './DuplicateConfirmationModal';
import { ChargeCatalogOption } from '@/hooks/billing/useBilling';
import RequestFeedback from './RequestFeedback';

const { useBreakpoint } = Grid;

type LabRequestListItem =
    FindAllLabRequestsQuery['labRequests']['items'][number];

export default function UpdateLabRequestDrawer({
    open,
    onClose,
    request,
    catalogs,
    onUpdated,
}: {
    open: boolean;
    onClose: () => void;
    request: LabRequestListItem | null;
    catalogs: ChargeCatalogOption[];
    onUpdated?: () => void;
}) {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>([]);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const [priority, setPriority] = useState<LabPriority>(
        LabPriority.Routine
    );

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [duplicates, setDuplicates] = useState<any[]>([]);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [previousRequests, setPreviousRequests] = useState<any[]>([]);

    const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (request) {
            const matchedIds =
                catalogs
                    ?.filter(c =>
                        request.tests?.some(t => t.chargeCatalogId === c.id)
                    )
                    .map(c => c.id) || [];

            setSelectedCatalogIds(matchedIds);
            setPriority(request.priority || LabPriority.Routine);
        }
    }, [request, catalogs]);

    const selectedCatalogs = useMemo(() => {
        return catalogs?.filter(c => selectedCatalogIds.includes(c.id)) || [];
    }, [catalogs, selectedCatalogIds]);

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

    const clearDuplicateState = () => {
        setDuplicates([]);
        setShowDuplicateModal(false);
    };

    const triggerAutoDismiss = () => {
        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
        }

        feedbackTimeoutRef.current = setTimeout(() => {
            setError(null);
            setSuccess(null);
            setPreviousRequests([]);
        }, 5000);
    };

    const submitRequest = async (payload?: any) => {
        const res = await clientFetch('/api/lab-request/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                labRequestId: request?.id,
                chargeCatalogIds: selectedCatalogIds,
                priority,
                ...payload,
            }),
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.error || 'Failed to update lab request');
        }

        return json;
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            setPreviousRequests([]);
            clearDuplicateState();

            const json = await submitRequest();

            if (!json.success && json.requiresConfirmation) {
                setDuplicates(json.duplicates || []);
                setShowDuplicateModal(true);
                return;
            }

            if (json.previousRequests?.length) {
                setPreviousRequests(json.previousRequests);
            }

            setSuccess('Lab request updated successfully.');
            triggerAutoDismiss();

            setTimeout(() => {
                onUpdated?.();
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            triggerAutoDismiss();
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDuplicate = async () => {
        try {
            setLoading(true);

            const json = await submitRequest({
                confirmDuplicate: true,
                duplicateReason: 'Confirmed by clinician',
            });

            clearDuplicateState();

            if (json.previousRequests?.length) {
                setPreviousRequests(json.previousRequests);
            }

            setSuccess('Lab request updated successfully.');
            triggerAutoDismiss();

            setTimeout(() => {
                onUpdated?.();
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            triggerAutoDismiss();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title="Update Lab Request"
            placement={isMobile ? 'bottom' : 'right'}
            onClose={onClose}
            open={open}
            size={isMobile ? 'large' : 'default'}
            styles={{
                body: {
                    padding: isMobile ? 16 : 24,
                },
            }}
            rootClassName={
                isMobile
                    ? '[&_.ant-drawer-content]:h-[92vh] [&_.ant-drawer-content]:rounded-t-3xl'
                    : '[&_.ant-drawer-content]:w-[650px]'
            }
            className="md:[&_.ant-drawer-content]:rounded-none"
        >
            <div className="space-y-5 sm:space-y-6 pb-6">
                <CatalogDropdown
                    catalogs={catalogs}
                    selectedCatalogIds={selectedCatalogIds}
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    toggleCatalog={toggleCatalog}
                    formatPrice={formatPrice}
                />

                <SelectedCatalogSummary
                    selectedCatalogs={selectedCatalogs}
                    selectedCatalogIds={selectedCatalogIds}
                    removeCatalog={removeCatalog}
                    formatPrice={formatPrice}
                />

                <PrioritySelector
                    priority={priority}
                    setPriority={setPriority}
                />

                {showDuplicateModal && (
                    <DuplicateConfirmationModal
                        duplicates={duplicates}
                        onCancel={clearDuplicateState}
                        onConfirm={handleConfirmDuplicate}
                    />
                )}

                <RequestFeedback
                    previousRequests={previousRequests}
                    error={error}
                    success={success}
                />

                <div className="sticky bottom-0 bg-white pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selectedCatalogIds.length}
                        className="
              w-full px-6 sm:px-8 py-4 rounded-2xl
              bg-blue-600 !text-white font-semibold
              hover:bg-blue-700 disabled:bg-gray-300
              shadow-md transition
            "
                    >
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </Drawer>
    );
}