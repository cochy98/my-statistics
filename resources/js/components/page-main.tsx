import React from 'react';
import { cn } from '@/lib/utils';

interface PageMainProps {
    children: React.ReactNode;
    className?: string;
}

export function PageMain({ children, className }: PageMainProps) {
    return (
        <div className={cn(
            "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4",
            className
        )}>
            {children}
        </div>
    );
}
