'use client';

import { Printer } from 'lucide-react';
import { VisitPrescription } from '@/shared/graphql/generated/graphql';
import { generatePrescriptionPrintHTML } from './generatePrescriptionPrintHTML';

interface Props {
  prescriptions: VisitPrescription[];
}

export default function PrescriptionPrint({ prescriptions }: Props) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = generatePrescriptionPrintHTML(prescriptions);

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    printWindow.location.href = url;

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      URL.revokeObjectURL(url);
    };
  };

  return (
    <div className="mt-2">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 bg-gray-900 !text-white px-5 py-2.5 rounded-xl hover:bg-black transition cursor-pointer"
      >
        <Printer size={16} />
        Print Prescription
      </button>
    </div>
  );
}