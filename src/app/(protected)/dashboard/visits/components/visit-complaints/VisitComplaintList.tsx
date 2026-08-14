'use client';

import { clientFetch } from '@/lib/clientFetch';
import { useEffect, useState } from 'react';
import { Input, Button } from 'antd';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { scheduledFetch } from '@/lib/requestScheduler';

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
    return <p className="text-sm text-gray-500">Loading complaints...</p>;
  }

  if (!complaints.length) {
    return (
      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
        No complaints recorded for this visit yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {complaints.map((c) => (
        <div
          key={c.id}
          className="w-full p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col gap-2"
        >
          {editingId === c.id ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Input.TextArea
                value={editingText}
                onChange={(e) => {
                  setEditingText(e.target.value);
                  if (error) setError(null);
                }}
                autoSize
                placeholder="Enter complaint..."
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleSave(c.id)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                {c.complaint}
              </p>
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEditClick(c)}
                className="text-gray-400 hover:text-gray-600"
              />
            </div>
          )}

          <span className="text-xs text-gray-400">
            {new Date(c.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}