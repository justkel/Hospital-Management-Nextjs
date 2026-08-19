"use client";

import { Printer } from "lucide-react";
import { VisitPrescription } from "@/shared/graphql/generated/graphql";
import { generatePrescriptionPrintHTML } from "./generatePrescriptionPrintHTML";

interface Props {
  prescriptions: VisitPrescription[];
}

export default function PrescriptionPrint({ prescriptions }: Props) {
  if (prescriptions.length === 0) {
    return null;
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    const html = generatePrescriptionPrintHTML(prescriptions);

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 !text-white transition hover:bg-black"
    >
      <Printer size={16} />
      Print Prescription
    </button>
  );
}