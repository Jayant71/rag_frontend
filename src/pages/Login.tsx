import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Login() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-secondary flex flex-col items-center justify-center p-4">
            {/* Login Card */}
            <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-md p-10 flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl font-bold">
                            neurology
                        </span>
                        <h1 className="text-text-main text-2xl font-bold tracking-tight">
                            RAG Engine
                        </h1>
                    </div>
                    <h2 className="text-text-secondary text-xl font-semibold mt-2">
                        Welcome back
                    </h2>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="email"
                            className="text-text-main text-sm font-medium"
                        >
                            Email Address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="password"
                                className="text-text-main text-sm font-medium"
                            >
                                Password
                            </label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="flex justify-end mt-1">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <Button type="submit" className="mt-2" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                {/* Footer */}
                <div className="text-center text-sm text-text-muted">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
