"use client";

import { useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";

import {
    LabRequestStatus,
} from "@/shared/graphql/generated/graphql";
import { clientFetch } from "@/lib/clientFetch";

import generatePrintHTML from "./generatePrint";

type Props = {
    labRequestId: string;
    status: LabRequestStatus;
};

export default function PrintLabResultButton({
    labRequestId,
    status,
}: Props) {
    const [loading, setLoading] = useState(false);

    const isDisabled = status !== LabRequestStatus.Completed;

    const handlePrint = async () => {
        let printWindow: Window | null = null;

        try {
            setLoading(true);
            printWindow = window.open("", "_blank");

            if (!printWindow) {
                throw new Error("Unable to open print window");
            }

            const [reqRes, resultRes] = await Promise.all([
                clientFetch(`/api/lab-request/get-by-id?id=${labRequestId}`),
                clientFetch(`/api/lab-result/list?labRequestId=${labRequestId}`),
            ]);

            if (!reqRes.ok) {
                throw new Error("Failed to fetch lab request");
            }

            if (!resultRes.ok) {
                throw new Error("Failed to fetch lab results");
            }

            const reqJson = await reqRes.json();
            const resultJson = await resultRes.json();

            const labRequest = reqJson.labRequest;
            const labResults = resultJson.labResults ?? [];

            if (!labRequest) {
                throw new Error("Lab request not found");
            }

            const html = generatePrintHTML(labRequest, labResults);

            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();

            printWindow.onload = () => {
                printWindow?.focus();
                printWindow?.print();
            };
        } catch (err) {
            console.error("Print failed:", err);

            printWindow?.close();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-end">
            <button
                type="button"
                onClick={handlePrint}
                disabled={isDisabled || loading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold !text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <PrinterOutlined />
                {loading ? "Preparing..." : "Print Lab Result"}
            </button>
        </div>
    );
}