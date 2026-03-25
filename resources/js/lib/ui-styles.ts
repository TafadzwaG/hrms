/**
 * Unified visual language — shared style constants.
 *
 * These patterns establish a single monochromatic shadcn/ui-aligned design system
 * across the landing page, candidate hub, employer hub, and admin portal.
 * Import from here instead of writing one-off Tailwind strings.
 *
 * Colour palette: black / white / zinc (foreground → zinc-950, muted → zinc-500,
 * subtle → zinc-400, border → zinc-200, surface → zinc-50/white).
 */

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

/** Full-page title (e.g. "Vacancies", "Reports"). One per page. */
export const uiPageTitle = 'text-3xl font-bold tracking-tight text-foreground';

/** Inline page sub-title / description directly under a page title. */
export const uiPageSubtitle = 'text-sm text-muted-foreground';

/** Section heading inside a page (not inside a card). */
export const uiSectionTitle = 'text-xl font-semibold tracking-tight text-foreground';

/** Card / panel heading (CardTitle equivalent for custom cards). */
export const uiCardTitle = 'text-sm font-semibold text-foreground uppercase tracking-widest';

/** Form field label — single consistent size across all forms. */
export const uiFieldLabel = 'block text-xs font-medium text-muted-foreground uppercase tracking-widest';

/** Table column header. */
export const uiTableHead = 'text-xs font-medium text-muted-foreground uppercase tracking-widest';

/** Body text — primary. */
export const uiBodyText = 'text-sm text-foreground';

/** Secondary / supporting body text. */
export const uiMutedText = 'text-sm text-muted-foreground';

/** Helper / caption text below inputs or in footers. */
export const uiHelperText = 'text-xs text-muted-foreground';

/** Stat / KPI value. Large number in a stat card. */
export const uiStatValue = 'text-3xl font-semibold tracking-tight text-foreground';

/** Small label above a stat value. */
export const uiStatLabel = 'text-xs font-medium text-muted-foreground';

/** Sub-line inside a stat card. */
export const uiStatSub = 'text-xs text-muted-foreground';

// ---------------------------------------------------------------------------
// Sidebar navigation
// ---------------------------------------------------------------------------

/** Sidebar section group label (e.g. "Candidate Hub", "Career"). */
export const uiSidebarGroupLabel = 'px-6 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground';

/** Active sidebar link. */
export const uiSidebarLinkActive =
    'flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground bg-zinc-200 border-r-2 border-foreground rounded-none transition-colors duration-150';

/** Inactive sidebar link. */
export const uiSidebarLinkInactive =
    'flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-zinc-200/50 hover:text-foreground rounded-md transition-colors duration-150';

// ---------------------------------------------------------------------------
// Buttons (raw className strings for non-shadcn <button> elements)
// ---------------------------------------------------------------------------

/** Primary action button. */
export const uiPrimaryButton =
    'inline-flex items-center justify-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-zinc-800 active:scale-[0.98] transition-all';

/** Secondary / outline button. */
export const uiSecondaryButton =
    'inline-flex items-center justify-center gap-2 border border-zinc-200 bg-white text-zinc-700 px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-50 active:scale-[0.98] transition-all';

/** Ghost / neutral button. */
export const uiGhostButton =
    'inline-flex items-center justify-center gap-2 text-muted-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-100 hover:text-foreground transition-all';

/** Destructive button. */
export const uiDestructiveButton =
    'inline-flex items-center justify-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-zinc-950 active:scale-[0.98] transition-all';

// ---------------------------------------------------------------------------
// Inputs / Form controls
// ---------------------------------------------------------------------------

/** Standard bordered input / select / textarea. */
export const uiBorderedInput =
    'w-full bg-white border border-zinc-200 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-colors';

/** Underlined (borderless) input — hub forms. */
export const uiUnderlinedInput =
    'w-full bg-transparent border-0 border-b border-zinc-200 focus:border-zinc-900 focus:ring-0 px-0 py-2 text-sm font-medium text-foreground placeholder:text-zinc-300 outline-none appearance-none transition-colors';

/** Textarea (bordered). */
export const uiTextarea =
    'w-full bg-transparent rounded-md border border-zinc-200 p-3 text-sm text-foreground placeholder:text-zinc-300 focus:border-zinc-900 focus:ring-0 transition-colors resize-y';

// ---------------------------------------------------------------------------
// Cards / Surfaces
// ---------------------------------------------------------------------------

/** Standard card shell (custom, not shadcn Card). */
export const uiCard = 'bg-white border border-zinc-200 rounded-md shadow-sm';

/** Section card as used in hub pages. */
export const uiSectionCard = 'bg-zinc-50 border border-zinc-200 rounded-md shadow-sm p-6';

/** Section card header row (title + optional action). */
export const uiSectionCardHeader = 'flex items-center justify-between border-b border-zinc-200 pb-4 mb-6';

// ---------------------------------------------------------------------------
// Tables (raw <table> — not shadcn Table)
// ---------------------------------------------------------------------------

/** <thead> row background. */
export const uiTableHeaderRow = 'bg-zinc-50 border-b border-zinc-200';

/** <th> cell. */
export const uiTableTh = `px-4 py-3 ${uiTableHead}`;

/** <tbody> row hover. */
export const uiTableBodyRow = 'transition-colors hover:bg-zinc-50 border-b border-zinc-100 last:border-0';

/** <td> cell (body). */
export const uiTableTd = 'px-4 py-4 text-sm text-foreground';

/** <td> cell — muted / secondary value. */
export const uiTableTdMuted = 'px-4 py-4 text-sm text-muted-foreground';

// ---------------------------------------------------------------------------
// Badges (raw <span>)
// ---------------------------------------------------------------------------

/** Base badge shell. */
export const uiBadgeBase =
    'inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest';

/** Default / neutral badge. */
export const uiBadgeNeutral = `${uiBadgeBase} badge-tone-neutral`;

/** Primary / active badge. */
export const uiBadgePrimary = `${uiBadgeBase} badge-tone-chart-1`;

/** Subtle / muted badge. */
export const uiBadgeMuted = `${uiBadgeBase} badge-tone-muted`;

/** Semantic badge tones aligned to the chart palette. */
export const uiBadgeInfo = `${uiBadgeBase} badge-tone-info`;
export const uiBadgeSuccess = `${uiBadgeBase} badge-tone-success`;
export const uiBadgeWarning = `${uiBadgeBase} badge-tone-warning`;
export const uiBadgeDanger = `${uiBadgeBase} badge-tone-danger`;
export const uiBadgeAccent = `${uiBadgeBase} badge-tone-accent`;

// ---------------------------------------------------------------------------
// Empty states
// ---------------------------------------------------------------------------

export const uiEmptyState =
    'py-12 text-center border border-dashed border-zinc-200 rounded-md bg-zinc-50/50';

export const uiEmptyStateText = 'text-xs font-medium uppercase tracking-widest text-muted-foreground';

// ---------------------------------------------------------------------------
// Pagination links (raw)
// ---------------------------------------------------------------------------

export const uiPaginationLink =
    'inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium transition-all';

export const uiPaginationLinkActive = `${uiPaginationLink} bg-zinc-900 text-white border-zinc-900`;

export const uiPaginationLinkInactive = `${uiPaginationLink} border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-foreground`;

// ---------------------------------------------------------------------------
// Monochrome status map — replaces coloured status maps across the app.
// Semantic meaning is conveyed through zinc shade intensity only.
// ---------------------------------------------------------------------------

export const uiStatusColors: Record<string, string> = {
    // Live / positive states — dark
    active: `${uiBadgeBase} bg-zinc-900 text-white border-zinc-900`,
    published: `${uiBadgeBase} bg-zinc-900 text-white border-zinc-900`,
    open: `${uiBadgeBase} bg-zinc-900 text-white border-zinc-900`,
    hired: `${uiBadgeBase} bg-zinc-900 text-white border-zinc-900`,
    accepted: `${uiBadgeBase} bg-zinc-900 text-white border-zinc-900`,
    offered: `${uiBadgeBase} bg-zinc-800 text-white border-zinc-800`,
    completed: `${uiBadgeBase} bg-zinc-900 text-white border-zinc-900`,
    interview: `${uiBadgeBase} bg-zinc-800 text-white border-zinc-800`,
    shortlisted: `${uiBadgeBase} bg-zinc-200 text-zinc-900 border-zinc-300`,
    under_review: `${uiBadgeBase} bg-zinc-100 text-zinc-600 border-zinc-200`,
    scheduled: `${uiBadgeBase} bg-zinc-100 text-zinc-600 border-zinc-200`,

    // Neutral / draft states — medium
    draft: `${uiBadgeBase} bg-zinc-100 text-zinc-500 border-zinc-200`,
    pending: `${uiBadgeBase} bg-zinc-100 text-zinc-500 border-zinc-200`,
    pending_payment: `${uiBadgeBase} bg-zinc-200 text-zinc-700 border-zinc-300`,
    submitted: `${uiBadgeBase} bg-zinc-100 text-zinc-600 border-zinc-200`,

    // Inactive / terminal — light/faded
    closed: `${uiBadgeBase} bg-zinc-200 text-zinc-700 border-zinc-300`,
    archived: `${uiBadgeBase} bg-zinc-100 text-zinc-500 border-zinc-200`,
    suspended: `${uiBadgeBase} bg-zinc-200 text-zinc-600 border-zinc-300`,
    expired: `${uiBadgeBase} bg-zinc-100 text-zinc-400 border-zinc-200`,
    cancelled: `${uiBadgeBase} bg-zinc-100 text-zinc-500 border-zinc-200`,
    rejected: `${uiBadgeBase} bg-white text-zinc-400 border-zinc-200`,
    withdrawn: `${uiBadgeBase} bg-white text-zinc-400 border-zinc-200`,
};

/** Resolve a status to its monochrome badge class. Falls back to neutral. */
export function getStatusClass(status: string): string {
    return uiStatusColors[status.toLowerCase()] ?? uiBadgeNeutral;
}

