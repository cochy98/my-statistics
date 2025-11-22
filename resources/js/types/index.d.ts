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

export interface StoreLocation {
    id: number;
    store_id: number;
    name: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    postal_code: string | null;
    phone: string | null;
    latitude: number | null;
    longitude: number | null;
    notes: string | null;
    is_default: boolean;
    created_at: string;
    updated_at: string;
    full_address?: string;
}

export interface Store {
    id: number;
    name: string;
    type: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
    locations?: StoreLocation[];
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
    store_location_id: number | null;
    category_id: number | null;
    date: string;
    week_identifier: string;
    amount: number;
    description: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    store?: Store;
    store_location?: StoreLocation;
    category?: Category;
    user?: User;
    shared_users?: User[];
    formatted_amount?: string;
}
