import { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { cn, formatFileSize, formatRelativeTime, getFileIcon, getFileIconColor } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { Space, Document } from '@/types';

interface OutletContext {
    space: Space | null;
    spaceId: string;
}

export default function Documents() {
    const { space, spaceId } = useOutletContext<OutletContext>();
    const navigate = useNavigate();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, [spaceId]);

    const loadDocuments = async () => {
        try {
            const docs = await api.documents.list(spaceId);
            setDocuments(docs);
        } catch (error) {
            console.error('Failed to load documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (files: FileList) => {
        if (files.length === 0) return;

        setUploading(true);
        try {
            await api.documents.upload(spaceId, files);
            // Reload documents
            await loadDocuments();
        } catch (error) {
            console.error('Failed to upload documents:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (documentId: string, filename: string) => {
        if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) {
            return;
        }

        try {
            await api.documents.delete(spaceId, documentId);
            setDocuments(documents.filter((d) => d.id !== documentId));
        } catch (error) {
            console.error('Failed to delete document:', error);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    }, [spaceId]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'indexed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                        <span className="size-1.5 rounded-full bg-green-600" />
                        Indexed
                    </span>
                );
            case 'processing':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                        <span className="material-symbols-outlined text-[14px] animate-spin">
                            progress_activity
                        </span>
                        Processing
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        Failed
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto p-8 flex flex-col gap-6">
            {/* Header */}
            <header className="flex flex-col gap-4">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-text-muted hover:text-text-main font-medium transition-colors"
                    >
                        Spaces
                    </button>
                    <span className="text-text-muted font-medium">/</span>
                    <span className="text-text-main font-semibold">{space?.name}</span>
                    <span className="text-text-muted font-medium">/</span>
                    <span className="text-text-main font-semibold">Knowledge Base</span>
                </nav>

                {/* Page Title */}
                <div className="flex justify-between items-end">
                    <h2 className="text-[#0F172A] text-[28px] font-bold leading-tight">
                        Documents
                    </h2>
                    <span className="text-text-muted text-sm font-medium mb-1">
                        {documents.length} Files Indexed
                    </span>
                </div>
            </header>

            {/* Upload Zone */}
            <section className="w-full">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        'flex flex-col items-center gap-4 rounded-xl border-2 border-dashed px-8 py-10 transition-colors cursor-pointer',
                        isDragging
                            ? 'border-primary bg-blue-50'
                            : 'border-slate-300 bg-background-secondary hover:border-blue-400 group'
                    )}
                >
                    <div
                        className={cn(
                            'size-12 rounded-full flex items-center justify-center mb-2 transition-transform',
                            isDragging
                                ? 'bg-primary text-white scale-110'
                                : 'bg-blue-50 text-primary group-hover:scale-110'
                        )}
                    >
                        <span className="material-symbols-outlined text-3xl">
                            cloud_upload
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[#0F172A] text-lg font-bold leading-tight">
                            {uploading
                                ? 'Uploading...'
                                : 'Drag files here or click to browse'}
                        </p>
                        <p className="text-text-muted text-sm font-normal">
                            Support for PDF, DOCX, MD, TXT
                        </p>
                    </div>
                    <label>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.docx,.doc,.md,.txt,.csv"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploading}
                        />
                        <Button
                            type="button"
                            className="mt-4"
                            disabled={uploading}
                            onClick={() =>
                                document.querySelector<HTMLInputElement>('input[type="file"]')?.click()
                            }
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>{uploading ? 'Ingesting...' : 'Ingest Files'}</span>
                        </Button>
                    </label>
                </div>
            </section>

            {/* File List Table */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center py-16 text-text-muted">
                    <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">
                        folder_open
                    </span>
                    <p className="text-lg font-medium">No documents yet</p>
                    <p className="text-sm">Upload files to start building your knowledge base</p>
                </div>
            ) : (
                <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-left text-text-muted text-xs font-bold uppercase tracking-wider w-[40%]">
                                        Filename
                                    </th>
                                    <th className="px-6 py-4 text-left text-text-muted text-xs font-bold uppercase tracking-wider w-[25%]">
                                        Uploaded At
                                    </th>
                                    <th className="px-6 py-4 text-left text-text-muted text-xs font-bold uppercase tracking-wider w-[20%]">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-text-muted text-xs font-bold uppercase tracking-wider w-[15%]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {documents.map((doc) => (
                                    <tr
                                        key={doc.id}
                                        className="group hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        'size-10 rounded-lg flex items-center justify-center shrink-0',
                                                        getFileIconColor(doc.filename)
                                                    )}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        {getFileIcon(doc.filename, doc.mime_type || undefined)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-[#0F172A] text-sm font-semibold">
                                                        {doc.filename}
                                                    </p>
                                                    <p className="text-text-muted text-xs">
                                                        {formatFileSize(doc.file_size)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-text-muted text-sm font-medium">
                                                {formatRelativeTime(doc.uploaded_at)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(doc.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(doc.id, doc.filename)}
                                                className="p-2 rounded-lg text-danger hover:bg-red-50 transition-colors"
                                                title="Delete File"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    delete
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
                        <span className="text-sm text-text-muted font-medium">
                            Showing {documents.length} of {documents.length} files
                        </span>
                    </div>
                </section>
            )}
        </div>
    );
}
