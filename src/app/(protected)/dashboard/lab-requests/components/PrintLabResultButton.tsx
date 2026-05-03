'use client';

import { useState } from 'react';
import { LabRequestStatus } from '@/shared/graphql/generated/graphql';
import { PrinterOutlined } from '@ant-design/icons';
import { clientFetch } from '@/lib/clientFetch';
import generatePrintHTML from './generatePrint';

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
        try {
            setLoading(true);

            const [reqRes, resultRes] = await Promise.all([
                clientFetch(`/api/lab-request/get-by-id?id=${labRequestId}`),
                clientFetch(`/api/lab-result/list?labRequestId=${labRequestId}`),
            ]);

            const reqJson = await reqRes.json();
            const resultJson = await resultRes.json();

            const labRequest = reqJson.labRequest;
            const labResults = resultJson.labResults ?? [];

            const printWindow = window.open('', '_blank');
            if (!printWindow) return;

            const html = generatePrintHTML(labRequest, labResults);

            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            printWindow.location.href = url;

            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();

                URL.revokeObjectURL(url);
            };
        } catch (err) {
            console.error('Print failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-end">
            <button
                onClick={handlePrint}
                disabled={isDisabled || loading}
                className="flex items-center gap-2 bg-blue-600 !text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
                <PrinterOutlined />
                {loading ? 'Preparing...' : 'Print Lab Result'}
            </button>
        </div>
    );
}