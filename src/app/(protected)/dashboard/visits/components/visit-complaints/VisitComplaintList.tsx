'use client';

import { clientFetch } from '@/lib/clientFetch';
import { useEffect, useState } from 'react';
import { Input, Button } from 'antd';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { scheduledFetch } from '@/lib/requestScheduler';
import { Clock3, MessageSquareText } from 'lucide-react';

interface Complaint {
  id: string;
  complaint: string;
  createdAt: string;
}

interface Props {
  visitId: string;
  refreshKey: number;
}

export default function VisitComplaintList({ visitId, refreshKey }: Props) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const FETCH_PRIORITY = 2;

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await scheduledFetch(
          () => clientFetch(
            `/api/visit-complaints/by-visit/${visitId}`,
            {},
            { skipRateLimitRetry: true }
          ),
          FETCH_PRIORITY
        );
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || 'Failed to fetch complaints');
        }

        setComplaints(json.complaints ?? []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    if (visitId) {
      fetchComplaints();
    }
  }, [visitId, refreshKey]);

  const handleEditClick = (complaint: Complaint) => {
    setEditingId(complaint.id);
    setEditingText(complaint.complaint);
    setError(null);
  };

  const handleSave = async (id: string) => {
    if (!editingText.trim()) {
      setError('Complaint cannot be empty');
      return;
    }

    try {
      setError(null);
      const res = await clientFetch('/api/visit-complaints/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaintId: id, complaint: editingText }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to update complaint');
      }

      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, complaint: editingText } : c))
      );

      setEditingId(null);
      setEditingText('');
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to update complaint');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
    setError(null);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-[#EEF0EC] bg-white p-4">
        <div className="flex animate-pulse items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#F0FAF5]" />
          <div className="space-y-2">
            <div className="h-3 w-32 rounded bg-[#EEF0EC]" />
            <div className="h-2.5 w-48 rounded bg-[#F3F4F1]" />
          </div>
        </div>
        <p className="sr-only">Loading complaints...</p>
      </div>
    );
  }

  if (!complaints.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#DDE5DE] bg-[#FAFCFA] px-5 py-7 text-center">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0FAF5] text-[#1D9E75]">
          <MessageSquareText size={16} />
        </div>
        <p className="mt-3 text-[12px] font-semibold text-[#353B34]">
          No complaints recorded yet
        </p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-[#8D9289]">
          Patient concerns added to this visit will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {complaints.map((c) => (
        <div
          key={c.id}
          className="overflow-hidden rounded-xl border border-[#E5EAE5] bg-white shadow-[0_4px_18px_rgba(20,35,26,0.035)]"
        >
          {editingId === c.id ? (
            <div className="space-y-3 p-4 sm:p-5">
              <Input.TextArea
                value={editingText}
                onChange={(e) => {
                  setEditingText(e.target.value);
                  if (error) setError(null);
                }}
                autoSize
                placeholder="Enter complaint..."
                className="!rounded-lg !border-[#E5EAE5] !bg-[#FCFDFC] !text-[13px] focus:!border-[#1D9E75]"
              />
              <div className="flex justify-end gap-2">
                <Button onClick={handleCancelEdit} className="!rounded-lg">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleSave(c.id)}
                  className="!rounded-lg !bg-[#1D9E75] hover:!bg-[#178664]"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF0EC] px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0FAF5] text-[#1D9E75]">
                    <MessageSquareText size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-[#14231A]">Patient complaint</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-[#8D9289]">
                      <Clock3 size={10} />
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => handleEditClick(c)}
                  aria-label="Edit complaint"
                  className="!inline-flex !h-8 !items-center !gap-1 !rounded-lg !border !border-[#E8E6E0] !px-2.5 !text-[10px] !font-semibold !text-[#5F5E5A] transition hover:!border-[#1D9E75]/30 hover:!bg-[#F0FAF5] hover:!text-[#1D9E75]"
                >
                  Edit
                </Button>
              </div>
              <div className="px-4 py-4 sm:px-5">
                <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#353B34] sm:text-[13px]">
                  {c.complaint}
                </p>
              </div>
            </>
          )}
        </div>
      ))}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}