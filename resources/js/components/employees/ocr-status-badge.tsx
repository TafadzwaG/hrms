import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type OcrStatus = 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed' | null | undefined;

const toneMap: Record<Exclude<OcrStatus, null | undefined>, string> = {
    uploaded: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-200',
    queued: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200',
    processing: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200',
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-200',
    failed: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200',
};

const labelMap: Record<Exclude<OcrStatus, null | undefined>, string> = {
    uploaded: 'Uploaded',
    queued: 'Queued',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
};

const spinningStatuses: OcrStatus[] = ['queued', 'processing'];

export function OcrStatusBadge({
    status,
    className,
}: {
    status: OcrStatus;
    className?: string;
}) {
    if (!status) {
        return (
            <Badge
                variant="secondary"
                className={cn(
                    'border border-border/60 bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-none',
                    className,
                )}
            >
                Not Requested
            </Badge>
        );
    }

    const isSpinning = spinningStatuses.includes(status);

    return (
        <Badge
            variant="outline"
            className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] shadow-none',
                toneMap[status],
                className,
            )}
        >
            {isSpinning && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
            {labelMap[status]}
        </Badge>
    );
}
