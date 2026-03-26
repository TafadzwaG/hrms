export type PortalType = 'employee' | 'candidate' | 'employer';
export type DashboardRole =
    | 'system_admin'
    | 'hr_admin'
    | 'payroll'
    | 'manager'
    | 'authoriser'
    | 'auditor'
    | 'employee';

export type SidebarShortcut = {
    title: string;
    href: string;
    icon: string;
    badge?: string | null;
};

export type PageRoleScope = {
    mode: 'self' | 'team' | 'approval_queue' | 'tenant' | 'readonly';
    label: string;
    allows_self_toggle?: boolean;
    current_view?: 'team' | 'self' | null;
    requested_view?: 'team' | 'mine' | null;
    self_label?: string;
    team_label?: string;
};

export type AuthRole = {
    id: number;
    code: string;
    name: string;
    description?: string | null;
};

export type TenantOrganization = {
    id: number;
    name: string;
    slug: string;
    code?: string | null;
    status: string;
    timezone?: string | null;
    is_active?: boolean;
    role_codes?: string[];
};

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    is_super_admin?: boolean;
    primary_portal?: PortalType;
    active_portal?: PortalType;
    available_portals?: PortalType[];
    dashboard_role?: DashboardRole;
    pinned_shortcuts?: SidebarShortcut[];
    portal_switch_urls?: Partial<Record<PortalType, string>>;
    is_impersonated?: boolean;
    created_at: string | null;
    updated_at: string | null;
    roles: AuthRole[];
    permissions: string[];
    [key: string]: unknown;
};

export type ImpersonationPayload = {
    active: boolean;
    started_at?: string | null;
    original_portal?: PortalType | null;
    stop_url: string;
    impersonator: {
        id: number;
        name: string;
        email: string;
        initials: string;
        primary_portal?: PortalType;
    };
    impersonated: {
        id: number;
        name: string;
        email: string;
        initials: string;
        primary_portal?: PortalType;
    };
};

export type User = AuthUser;

export type Auth = {
    user: AuthUser | null;
    roles: AuthRole[];
    permissions: string[];
    can: Record<string, boolean>;
    impersonation?: ImpersonationPayload | null;
};

export type TenantContextPayload = {
    active_organization: TenantOrganization | null;
    organizations: TenantOrganization[];
    can_switch: boolean;
    is_super_admin: boolean;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
