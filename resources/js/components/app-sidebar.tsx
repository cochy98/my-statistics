import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Car, BarChart3, Plus, Receipt, TrendingUp } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'I Miei Veicoli',
        href: '/vehicles',
        icon: Car,
    },
    {
        title: 'Nuovo Rifornimento',
        href: '/fuel-logs/create',
        icon: Plus,
    },
    {
        title: 'Statistiche Consumi',
        href: '/fuel-stats',
        icon: BarChart3,
    },
    {
        title: 'Le Mie Spese',
        href: '/expenses',
        icon: Receipt,
    },
    {
        title: 'Nuova Spesa',
        href: '/expenses/create',
        icon: Plus,
    },
    {
        title: 'Statistiche Spese',
        href: '/expense-stats',
        icon: TrendingUp,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Impostazioni',
        href: '/settings/profile',
        icon: BookOpen,
    }
];

export function AppSidebar() {
    return (
        // <Sidebar collapsible="icon" variant="sidebar">
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
