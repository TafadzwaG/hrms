export type AuthRole = {
    id: number;
    code: string;
    name: string;
    description?: string | null;
};

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string | null;
    updated_at: string | null;
    roles: AuthRole[];
    permissions: string[];
    [key: string]: unknown;
};

export type User = AuthUser;

export type Auth = {
    user: AuthUser | null;
    roles: AuthRole[];
    permissions: string[];
    can: Record<string, boolean>;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
