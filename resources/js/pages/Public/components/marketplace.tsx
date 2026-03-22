import { Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useRef, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';

export function Reveal({
    children,
    className,
    delay = 0,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function MarketplaceHeader({
    backHref,
    backLabel,
}: {
    backHref: string;
    backLabel: string;
}) {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <ShieldCheck className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-semibold tracking-tight text-foreground">HRX Exchange</span>
                </Link>

                <Button asChild variant="ghost" size="sm">
                    <Link href={backHref}>
                        <ArrowLeft className="h-4 w-4" />
                        {backLabel}
                    </Link>
                </Button>
            </div>
        </header>
    );
}
