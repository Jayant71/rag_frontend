import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-white shadow hover:bg-primary-dark focus-visible:ring-primary',
                destructive:
                    'bg-danger text-white shadow-sm hover:bg-red-600 focus-visible:ring-danger',
                outline:
                    'border border-border bg-white shadow-sm hover:bg-gray-50 focus-visible:ring-primary',
                secondary:
                    'bg-gray-100 text-text-main shadow-sm hover:bg-gray-200 focus-visible:ring-gray-500',
                ghost:
                    'hover:bg-gray-100 focus-visible:ring-gray-500',
                link:
                    'text-primary underline-offset-4 hover:underline focus-visible:ring-primary',
                accent:
                    'bg-accent text-black shadow hover:bg-green-400 glow-accent focus-visible:ring-accent',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-8 px-3 text-xs',
                lg: 'h-12 px-6 text-base',
                xl: 'h-14 px-8 text-lg',
                icon: 'h-10 w-10',
                'icon-sm': 'h-8 w-8',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
