'use client';

import { MessageSquareText, ReceiptText } from 'lucide-react';
import { useState } from 'react';
import VisitComplaintBilling from './VisitComplaintBilling';
import VisitComplaintCreate from './VisitComplaintCreate';
import VisitComplaintList from './VisitComplaintList';

interface Props {
  visitId: string;
}

export default function VisitComplaintsSection({ visitId }: Props) {
  const [chargeEnabled, setChargeEnabled] = useState(false);
  const [chargeCatalogId, setChargeCatalogId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshComplaints = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FAF5] text-[#1D9E75]">
          <MessageSquareText size={18} />
        </div>
        <div>
          <h2 className="text-[15px] font-extrabold tracking-[-0.02em] text-[#14231A]">
            Visit complaints
          </h2>
          <p className="mt-0.5 text-[11px] font-medium text-[#8D9289]">
            Capture and review concerns raised during this visit
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E5EAE5] bg-white shadow-[0_8px_28px_rgba(20,35,26,0.045)]">
        <div className="flex items-center gap-2.5 border-b border-[#EEF0EC] px-4 py-3.5 sm:px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0FAF5] text-[#1D9E75]">
            <ReceiptText size={15} />
          </div>
          <div>
            <h3 className="text-[12px] font-extrabold text-[#14231A]">
              Consultation billing
            </h3>
            <p className="mt-0.5 text-[10px] font-medium text-[#8D9289]">
              Optional charge associated with this visit
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-5">
        <VisitComplaintBilling
          visitId={visitId}
          chargeEnabled={chargeEnabled}
          chargeCatalogId={chargeCatalogId}
          setChargeEnabled={setChargeEnabled}
          setChargeCatalogId={setChargeCatalogId}
        />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E5EAE5] bg-white shadow-[0_8px_28px_rgba(20,35,26,0.045)]">
        <VisitComplaintCreate
          visitId={visitId}
          onCreated={refreshComplaints}
        />

        <div className="border-t border-[#EEF0EC] p-4 sm:p-5">
        <VisitComplaintList
          visitId={visitId}
          refreshKey={refreshKey}
        />
        </div>
      </div>
    </section>
  );
}