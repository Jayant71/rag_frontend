import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        return (
            <div className="relative">
                <input
                    type={type}
                    className={cn(
                        'flex h-[42px] w-full rounded-lg border bg-white px-4 py-2 text-sm text-text-main placeholder:text-text-muted shadow-sm transition-all',
                        'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error
                            ? 'border-danger focus:border-danger focus:ring-danger'
                            : 'border-border',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-danger">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
