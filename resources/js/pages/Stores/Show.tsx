import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Store, MapPin, Edit } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Store as StoreType } from '@/types';
import { PageMain } from '@/components/page-main';

interface StoreShowProps {
    store: StoreType;
}

const breadcrumbs = (storeName: string): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Negozi',
        href: '/stores',
    },
    {
        title: storeName,
        href: `/stores/${storeName}`,
    },
];

export default function StoreShow({ store }: StoreShowProps) {
    const getTypeBadgeColor = (type: string | null) => {
        if (!type) return 'bg-gray-100 text-gray-800';
        
        const colorMap: { [key: string]: string } = {
            'supermarket': 'bg-green-100 text-green-800',
            'pharmacy': 'bg-red-100 text-red-800',
            'hardware': 'bg-blue-100 text-blue-800',
            'electronics': 'bg-purple-100 text-purple-800',
            'furniture': 'bg-orange-100 text-orange-800',
        };
        
        return colorMap[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(store.name)}>
            <Head title={store.name} />

            <PageMain>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/stores">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Torna ai Negozi
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
                                <p className="text-muted-foreground">
                                    Dettagli del negozio
                                </p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href={`/stores/${store.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifica
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informazioni Generali */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Store className="h-5 w-5" />
                                    Informazioni Generali
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                                    <p className="text-lg font-semibold">{store.name}</p>
                                </div>

                                {store.type && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                                        <div className="mt-1">
                                            <Badge className={getTypeBadgeColor(store.type)}>
                                                {store.type}
                                            </Badge>
                                        </div>
                                    </div>
                                )}

                                {store.description && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Descrizione</Label>
                                        <p className="text-sm">{store.description}</p>
                                    </div>
                                )}

                                {store.locations && store.locations.length > 0 && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Numero Sedi</Label>
                                        <p className="text-lg font-semibold">{store.locations.length}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Sedi */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Sedi ({store.locations?.length || 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {store.locations && store.locations.length > 0 ? (
                                    <div className="space-y-4">
                                        {store.locations.map((location) => (
                                            <div key={location.id} className="border rounded-lg p-4 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold">
                                                            {location.name || `Sede #${location.id}`}
                                                        </h4>
                                                        {location.is_default && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Principale
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {location.full_address && (
                                                    <div className="text-sm text-muted-foreground">
                                                        <MapPin className="h-3 w-3 inline mr-1" />
                                                        {location.full_address}
                                                    </div>
                                                )}

                                                {location.phone && (
                                                    <div className="text-sm text-muted-foreground">
                                                        Tel: {location.phone}
                                                    </div>
                                                )}

                                                {location.notes && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {location.notes}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Nessuna sede registrata</p>
                                        <p className="text-sm mt-2">Aggiungi una sede dalla pagina di modifica</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PageMain>
        </AppLayout>
    );
}

