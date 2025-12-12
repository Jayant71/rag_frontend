import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Space, UserConfig } from '@/types';

interface OutletContext {
    space: Space | null;
    spaceId: string;
}

export default function Settings() {
    const { space, spaceId } = useOutletContext<OutletContext>();
    const navigate = useNavigate();
    const [config, setConfig] = useState<Partial<UserConfig>>({
        openai_api_key: '',
        llama_cloud_api_key: '',
        cohere_api_key: '',
        qdrant_url: '',
        qdrant_api_key: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showKeys, setShowKeys] = useState({
        openai: false,
        llama: false,
        cohere: false,
    });

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const data = await api.userConfig.get();
            if (data) {
                setConfig({
                    openai_api_key: data.openai_api_key || '',
                    llama_cloud_api_key: data.llama_cloud_api_key || '',
                    cohere_api_key: data.cohere_api_key || '',
                    qdrant_url: data.qdrant_url || '',
                    qdrant_api_key: data.qdrant_api_key || '',
                });
            }
        } catch (error) {
            console.error('Failed to load config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.userConfig.upsert(config);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteWorkspace = async () => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${space?.name}"? This action cannot be undone and will delete all documents and chat history.`
            )
        ) {
            return;
        }

        const confirmText = window.prompt(
            `Type "${space?.name}" to confirm deletion:`
        );
        if (confirmText !== space?.name) {
            alert('Deletion cancelled - name did not match');
            return;
        }

        setDeleting(true);
        try {
            await api.spaces.delete(spaceId);
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to delete workspace:', error);
            alert('Failed to delete workspace');
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-[880px] px-10 py-10">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-[#0F172A] text-[30px] font-bold leading-tight mb-2">
                    Settings
                </h1>
                <p className="text-text-muted text-base font-normal">
                    Configure your API keys and infrastructure to use the RAG engine.
                </p>
            </header>

            {/* Infrastructure Section */}
            <section className="mb-8 border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[#0F172A]">Infrastructure</h2>
                    <span className="material-symbols-outlined text-slate-400">dns</span>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Qdrant URL */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="qdrant-url"
                            className="text-text-secondary text-sm font-medium"
                        >
                            Qdrant URL <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="qdrant-url"
                            type="url"
                            placeholder="https://your-qdrant-instance.cloud.qdrant.io:6333"
                            value={config.qdrant_url || ''}
                            onChange={(e) =>
                                setConfig({ ...config, qdrant_url: e.target.value })
                            }
                        />
                        <p className="text-xs text-slate-500">
                            Your Qdrant vector database URL. Get a free instance at{' '}
                            <a
                                href="https://cloud.qdrant.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                cloud.qdrant.io
                            </a>
                        </p>
                    </div>

                    {/* Qdrant API Key */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="qdrant-key"
                            className="text-text-secondary text-sm font-medium"
                        >
                            Qdrant API Key <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="qdrant-key"
                            type="password"
                            placeholder="your-qdrant-api-key"
                            value={config.qdrant_api_key || ''}
                            onChange={(e) =>
                                setConfig({ ...config, qdrant_api_key: e.target.value })
                            }
                        />
                        <p className="text-xs text-slate-500">
                            API key for Qdrant Cloud authentication. Find it in your Qdrant Cloud dashboard.
                        </p>
                    </div>
                </div>
            </section>

            {/* API Keys Section */}
            <section className="mb-8 border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[#0F172A]">API Keys</h2>
                    <span className="material-symbols-outlined text-slate-400">key</span>
                </div>

                <form className="flex flex-col gap-6">
                    {/* OpenAI Key */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="openai-key"
                            className="text-text-secondary text-sm font-medium"
                        >
                            OpenAI API Key <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                id="openai-key"
                                type={showKeys.openai ? 'text' : 'password'}
                                placeholder="sk-..."
                                value={config.openai_api_key || ''}
                                onChange={(e) =>
                                    setConfig({ ...config, openai_api_key: e.target.value })
                                }
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowKeys({ ...showKeys, openai: !showKeys.openai })
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {showKeys.openai ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500">
                            Used for generation and embeddings.{' '}
                            <a
                                href="https://platform.openai.com/api-keys"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Get your key
                            </a>
                        </p>
                    </div>

                    {/* LlamaCloud Key */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="llama-key"
                            className="text-text-secondary text-sm font-medium"
                        >
                            LlamaCloud API Key <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                id="llama-key"
                                type={showKeys.llama ? 'text' : 'password'}
                                placeholder="llx-..."
                                value={config.llama_cloud_api_key || ''}
                                onChange={(e) =>
                                    setConfig({ ...config, llama_cloud_api_key: e.target.value })
                                }
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowKeys({ ...showKeys, llama: !showKeys.llama })
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {showKeys.llama ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500">
                            Required for document parsing.{' '}
                            <a
                                href="https://cloud.llamaindex.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Get your key
                            </a>
                        </p>
                    </div>

                    {/* Cohere Key */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <label
                                htmlFor="cohere-key"
                                className="text-text-secondary text-sm font-medium"
                            >
                                Cohere API Key
                            </label>
                            <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded">
                                Optional
                            </span>
                        </div>
                        <div className="relative">
                            <Input
                                id="cohere-key"
                                type={showKeys.cohere ? 'text' : 'password'}
                                placeholder="..."
                                value={config.cohere_api_key || ''}
                                onChange={(e) =>
                                    setConfig({ ...config, cohere_api_key: e.target.value })
                                }
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowKeys({ ...showKeys, cohere: !showKeys.cohere })
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {showKeys.cohere ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500">
                            Used for reranking search results.
                        </p>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                save
                            </span>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </section>

            {/* Danger Zone */}
            <section className="mt-8 border border-red-200 bg-red-50 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold text-red-800">Delete Workspace</h3>
                        <p className="text-sm text-red-700/80 max-w-md">
                            Permanently remove this workspace and all ingested documents. This
                            action cannot be undone.
                        </p>
                    </div>
                    <div>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteWorkspace}
                            disabled={deleting}
                            className="whitespace-nowrap"
                        >
                            {deleting ? 'Deleting...' : 'Delete Workspace'}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
