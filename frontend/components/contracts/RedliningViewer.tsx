'use client';

import { useState, useEffect } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { Button, Card, Tag, Tooltip, Space, message, Modal } from 'antd';
import { CheckOutlined, CloseOutlined, FilePdfOutlined } from '@ant-design/icons';

interface Change {
  id: string;
  changeType: string;
  originalText: string;
  proposedText: string;
  status: 'pending' | 'accepted' | 'rejected';
  startPosition: number;
  endPosition: number;
}

interface RedliningViewerProps {
  sessionId: string;
  baseText: string;
  proposedText: string;
  contractId: string;
  onComplete: () => void;
}

export default function RedliningViewer({
  sessionId,
  baseText,
  proposedText,
  contractId,
  onComplete,
}: RedliningViewerProps) {
  const [changes, setChanges] = useState<Change[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentHover, setCurrentHover] = useState<string | null>(null);

  useEffect(() => {
    fetchChanges();
  }, [sessionId]);

  const fetchChanges = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redlining/session/${sessionId}/changes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setChanges(data);
  };

  const handleAccept = async (changeId: string) => {
    const token = localStorage.getItem('accessToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redlining/change/${changeId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    message.success('Perubahan diterima');
    fetchChanges();
  };

  const handleReject = async (changeId: string) => {
    const token = localStorage.getItem('accessToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redlining/change/${changeId}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    message.success('Perubahan ditolak');
    fetchChanges();
  };

  const finalizeSession = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redlining/session/${sessionId}/finalize`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Dokumen final berhasil dibuat!');
      onComplete();
    } catch (error) {
      message.error('Gagal membuat dokumen final');
    } finally {
      setLoading(false);
    }
  };

  const pendingChanges = changes.filter((c) => c.status === 'pending').length;
  const acceptedChanges = changes.filter((c) => c.status === 'accepted').length;
  const rejectedChanges = changes.filter((c) => c.status === 'rejected').length;

  return (
    <Card
      title={
        <Space>
          <FilePdfOutlined />
          <span>Redlining Session - Review Perubahan</span>
          <Tag color="gold">{pendingChanges} Tertunda</Tag>
          <Tag color="green">{acceptedChanges} Diterima</Tag>
          <Tag color="red">{rejectedChanges} Ditolak</Tag>
        </Space>
      }
      extra={
        <Button
          type="primary"
          onClick={finalizeSession}
          loading={loading}
          disabled={pendingChanges > 0}
        >
          Apply Perubahan yang Diterima
        </Button>
      }
    >
      <ReactDiffViewer
        oldValue={baseText}
        newValue={proposedText}
        splitView={true}
        compareMethod={DiffMethod.WORDS}
        leftTitle="Dokumen Asli"
        rightTitle="Dokumen Revisi"
        showDiffOnly={false}
        renderContent={(content: string) => (
          <div className="relative">
            <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
          </div>
        )}
      />

      {changes.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-3">Daftar Perubahan:</h4>
          <div className="space-y-2">
            {changes.map((change) => (
              <div
                key={change.id}
                className={`p-3 rounded-lg flex justify-between items-center ${
                  change.status === 'accepted'
                    ? 'bg-green-50'
                    : change.status === 'rejected'
                    ? 'bg-red-50'
                    : 'bg-yellow-50'
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">Asli:</span>{' '}
                    <span className="line-through text-red-600">{change.originalText || '(kosong)'}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Baru:</span>{' '}
                    <span className="text-green-600">{change.proposedText || '(kosong)'}</span>
                  </p>
                </div>
                {change.status === 'pending' && (
                  <Space>
                    <Tooltip title="Terima">
                      <Button
                        size="small"
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => handleAccept(change.id)}
                      />
                    </Tooltip>
                    <Tooltip title="Tolak">
                      <Button
                        size="small"
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => handleReject(change.id)}
                      />
                    </Tooltip>
                  </Space>
                )}
                {change.status === 'accepted' && <Tag color="green">Diterima</Tag>}
                {change.status === 'rejected' && <Tag color="red">Ditolak</Tag>}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}