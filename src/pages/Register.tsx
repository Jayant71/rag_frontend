import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Register() {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, fullName);
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-secondary flex flex-col items-center justify-center p-4">
            {/* Registration Card */}
            <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-md p-10 flex flex-col gap-8 transition-colors duration-200">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-2xl font-bold">
                                smart_toy
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-text-main tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-text-muted font-normal">
                            Start building your knowledge base today.
                        </p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="fullname"
                            className="text-sm font-medium text-text-main"
                        >
                            Full Name
                        </label>
                        <Input
                            id="fullname"
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-text-main"
                        >
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-text-main"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="confirm_password"
                            className="text-sm font-medium text-text-main"
                        >
                            Confirm Password
                        </label>
                        <Input
                            id="confirm_password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="mt-3" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>

                {/* Footer */}
                <div className="text-center text-sm text-text-muted">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-primary hover:text-primary-dark font-semibold hover:underline transition-colors"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
