import { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { cn, getInitials } from '@/lib/utils';
import type { Space } from '@/types';

export default function SpaceLayout() {
    const { spaceId } = useParams<{ spaceId: string }>();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [space, setSpace] = useState<Space | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (spaceId) {
            loadSpace();
        }
    }, [spaceId]);

    const loadSpace = async () => {
        try {
            // For now we'll get spaces list and find the one we need
            const spaces = await api.spaces.list();
            const currentSpace = spaces.find((s) => s.id === spaceId);
            if (currentSpace) {
                setSpace(currentSpace);
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Failed to load space:', error);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const navItems = [
        {
            to: `/spaces/${spaceId}/chat`,
            icon: 'chat_bubble',
            label: 'Chat',
        },
        {
            to: `/spaces/${spaceId}/documents`,
            icon: 'folder',
            label: 'Knowledge Base',
        },
        {
            to: `/spaces/${spaceId}/settings`,
            icon: 'settings',
            label: 'Settings',
        },
    ];

    return (
        <div className="h-screen flex overflow-hidden bg-white text-slate-900">
            {/* Sidebar */}
            <aside className="w-[260px] h-full flex flex-col bg-sidebar shrink-0 border-r border-slate-800">
                {/* Space Header */}
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">dataset</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-white text-base font-bold leading-tight truncate max-w-[160px]">
                                {space?.name || 'Workspace'}
                            </h1>
                            <p className="text-sidebar-text text-xs font-medium">Workspace</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-2 flex flex-col gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group',
                                    isActive
                                        ? 'bg-sidebar-active text-white shadow-sm'
                                        : 'text-sidebar-text hover:bg-sidebar-active hover:text-white'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={cn(
                                            'material-symbols-outlined',
                                            isActive && 'fill-1'
                                        )}
                                    >
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}

                    {/* Back to Dashboard */}
                    <NavLink
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-sidebar-text hover:bg-sidebar-active hover:text-white transition-colors group mt-auto"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">Back to Spaces</span>
                    </NavLink>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-700">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                            {user?.user_metadata?.full_name
                                ? getInitials(user.user_metadata.full_name)
                                : user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <p className="text-white text-sm font-medium truncate">
                                {user?.user_metadata?.full_name || 'User'}
                            </p>
                            <p className="text-sidebar-text text-xs truncate">
                                {user?.email}
                            </p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="text-sidebar-text hover:text-red-400 transition-colors"
                            title="Sign Out"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                logout
                            </span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-white">
                <Outlet context={{ space, spaceId }} />
            </main>
        </div>
    );
}
