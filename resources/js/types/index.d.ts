import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Store {
    id: number;
    name: string;
    type: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    color: string | null;
    icon: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface Expense {
    id: number;
    user_id: number;
    store_id: number | null;
    category_id: number | null;
    date: string;
    week_identifier: string;
    amount: number;
    description: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    store?: Store;
    category?: Category;
    user?: User;
    shared_users?: User[];
    formatted_amount?: string;
}
