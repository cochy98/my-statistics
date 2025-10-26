import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Fuel, BarChart3, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div> */}
                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">I Miei Veicoli</CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Gestisci</div>
                            <p className="text-xs text-muted-foreground">
                                Visualizza e gestisci i tuoi veicoli
                            </p>
                            <Link href="/vehicles">
                                <Button className="w-full mt-2" size="sm">
                                    <Car className="w-4 h-4 mr-2" />
                                    Veicoli
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rifornimenti</CardTitle>
                            <Fuel className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Traccia</div>
                            <p className="text-xs text-muted-foreground">
                                Registra nuovi rifornimenti
                            </p>
                            <Link href="/fuel-logs/create">
                                <Button className="w-full mt-2" size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuovo Rifornimento
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Statistiche</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Analizza</div>
                            <p className="text-xs text-muted-foreground">
                                Visualizza grafici e statistiche
                            </p>
                            <Link href="/fuel-stats">
                                <Button className="w-full mt-2" size="sm">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Statistiche
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aggiungi Veicolo</CardTitle>
                            <Plus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Registra</div>
                            <p className="text-xs text-muted-foreground">
                                Aggiungi un nuovo veicolo
                            </p>
                            <Link href="/vehicles/create">
                                <Button className="w-full mt-2" size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuovo Veicolo
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Grafici e Statistiche</h3>
                            <p className="text-muted-foreground mb-4">
                                Visualizza i tuoi consumi di carburante in modo dettagliato
                            </p>
                            <Link href="/fuel-stats">
                                <Button>
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Visualizza Statistiche
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
