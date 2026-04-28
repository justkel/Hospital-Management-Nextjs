'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import { LabPriority } from '@/shared/graphql/generated/graphql';
import CatalogDropdown from './CatalogDropdown';
import SelectedCatalogSummary from './SelectedCatalogSummary';
import PrioritySelector from './PrioritySelector';
import { LabRequestSelectorProps } from './types';
import { ChargeCatalogOption } from '@/hooks/billing/useBilling';
import DuplicateConfirmationModal from './DuplicateConfirmationModal';
import RequestFeedback from './RequestFeedback';

export default function LabRequestSelector({
  catalogs,
  visitId,
  onCreated,
}: LabRequestSelectorProps & { onCreated?: () => void }) {
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [priority, setPriority] = useState<LabPriority>(
    LabPriority.Routine
  );

  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const [previousRequests, setPreviousRequests] = useState<any[]>([]);

  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const noCatalogs = !catalogs?.length;

  const selectedCatalogs = useMemo(() => {
    return (
      catalogs?.filter((c: ChargeCatalogOption) =>
        selectedCatalogIds.includes(c.id)
      ) || []
    );
  }, [catalogs, selectedCatalogIds]);

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

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const submitRequest = async (payload?: any) => {
    const res = await clientFetch('/api/lab-request/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitId,
        chargeCatalogIds: selectedCatalogIds,
        priority,
        ...payload,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || 'Failed to create lab request');
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

      setSuccess('Lab request created successfully.');
      setSelectedCatalogIds([]);
      onCreated?.();
      triggerAutoDismiss();
    } catch (err) {
      clearDuplicateState();
      setError(
        err instanceof Error ? err.message : 'Something went wrong'
      );
      triggerAutoDismiss();
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDuplicate = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const json = await submitRequest({
        confirmDuplicate: true,
        duplicateReason: 'Confirmed by clinician',
      });

      clearDuplicateState();

      if (json.previousRequests?.length) {
        setPreviousRequests(json.previousRequests);
      }

      setSuccess('Lab request created successfully.');
      setSelectedCatalogIds([]);
      onCreated?.();
      triggerAutoDismiss();
    } catch (err) {
      clearDuplicateState();
      setError(
        err instanceof Error ? err.message : 'Something went wrong'
      );
      triggerAutoDismiss();
    } finally {
      setLoading(false);
    }
  };

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
        <>
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
        </>
      )}
    </div>
  );
}