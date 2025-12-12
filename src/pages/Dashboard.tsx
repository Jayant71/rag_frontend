import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime, getInitials } from '@/lib/utils';
import type { Space } from '@/types';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSpaceName, setNewSpaceName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadSpaces();
    }, []);

    const loadSpaces = async () => {
        try {
            const data = await api.spaces.list();
            setSpaces(data);
        } catch (error) {
            console.error('Failed to load spaces:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSpace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSpaceName.trim()) return;

        setCreating(true);
        try {
            const space = await api.spaces.create({ name: newSpaceName.trim() });
            setSpaces([...spaces, space]);
            setNewSpaceName('');
            setShowCreateModal(false);
            navigate(`/spaces/${space.id}`);
        } catch (error) {
            console.error('Failed to create space:', error);
        } finally {
            setCreating(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    // Placeholder images for demo
    const placeholderImages = [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    ];

    return (
        <div className="min-h-screen bg-background-dark text-white font-display flex flex-col overflow-x-hidden transition-colors duration-200">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/90 backdrop-blur-sm px-4 md:px-10 py-3 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-8 text-accent">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48">
                            <g clipPath="url(#clip0)">
                                <path
                                    d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                                    fill="currentColor"
                                />
                            </g>
                        </svg>
                    </div>
                    <h1 className="text-lg font-bold tracking-tight">RAG Engine</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-slate-400 hover:text-accent transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="relative group">
                        <div className="size-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold cursor-pointer border-2 border-border-dark">
                            {user?.user_metadata?.full_name
                                ? getInitials(user.user_metadata.full_name)
                                : user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-surface-dark border border-border-dark rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <div className="p-3 border-b border-border-dark">
                                <p className="text-sm font-medium truncate">
                                    {user?.user_metadata?.full_name || 'User'}
                                </p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                            My Spaces
                        </h2>
                        <p className="text-base font-medium text-slate-400">
                            Manage your knowledge bases and chat contexts.
                        </p>
                    </div>
                    <Button
                        variant="accent"
                        className="rounded-full"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            add_circle
                        </span>
                        <span>Create New Space</span>
                    </Button>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* "New Space" Trigger Card */}
                        <div
                            onClick={() => setShowCreateModal(true)}
                            className="group cursor-pointer flex flex-col items-center justify-center gap-4 min-h-[320px] rounded-xl border-2 border-dashed border-border-dark bg-transparent hover:bg-accent/5 transition-all duration-300"
                        >
                            <div className="size-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-4xl text-accent">
                                    add
                                </span>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold group-hover:text-accent transition-colors">
                                    Add Space
                                </p>
                                <p className="text-sm text-slate-400">
                                    Create a new knowledge base
                                </p>
                            </div>
                        </div>

                        {/* Space Cards */}
                        {spaces.map((space, index) => (
                            <Link
                                key={space.id}
                                to={`/spaces/${space.id}`}
                                className="group flex flex-col rounded-xl bg-surface-dark shadow-lg border border-transparent hover:border-accent/50 transition-all duration-300 overflow-hidden"
                            >
                                <div className="relative h-48 w-full bg-zinc-800 overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                        style={{
                                            backgroundImage: `url(${space.cover_image_url ||
                                                placeholderImages[index % placeholderImages.length]
                                                })`,
                                        }}
                                    />
                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        <span className="text-xs font-bold text-white flex items-center gap-1">
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${space.status === 'active'
                                                        ? 'bg-green-500'
                                                        : space.status === 'processing'
                                                            ? 'bg-yellow-500'
                                                            : 'bg-gray-500'
                                                    }`}
                                            />
                                            {space.status === 'active'
                                                ? 'Active'
                                                : space.status === 'processing'
                                                    ? 'Processing'
                                                    : 'Archived'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 p-5 md:p-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                                            {space.name}
                                        </h3>
                                        <p className="text-slate-400 text-sm line-clamp-2">
                                            {space.description || 'No description'}
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-400">
                                            Updated {formatRelativeTime(space.updated_at)}
                                        </span>
                                        <span className="text-sm font-bold text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Enter Space
                                            <span className="material-symbols-outlined text-[16px]">
                                                arrow_forward
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Space Modal */}
            {showCreateModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setShowCreateModal(false)}
                >
                    <div
                        className="bg-surface-dark border border-border-dark rounded-2xl p-6 w-full max-w-md mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold mb-4">Create New Space</h3>
                        <form onSubmit={handleCreateSpace}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Space Name
                                </label>
                                <input
                                    type="text"
                                    value={newSpaceName}
                                    onChange={(e) => setNewSpaceName(e.target.value)}
                                    placeholder="Enter space name..."
                                    className="w-full h-11 px-4 rounded-lg bg-background-dark border border-border-dark text-white placeholder:text-slate-500 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-slate-300"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="accent"
                                    disabled={creating || !newSpaceName.trim()}
                                >
                                    {creating ? 'Creating...' : 'Create Space'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
