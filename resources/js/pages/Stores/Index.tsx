import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, Plus, Search, Filter, Edit, Trash2, Eye, X, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Store as StoreType } from '@/types';
import { PageMain } from '@/components/page-main';

interface StoresIndexProps {
    stores: {
        data: StoreType[];
        links: any[];
        meta: any;
    };
    types: string[];
    filters: {
        type?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Negozi',
        href: '/stores',
    },
];

export default function StoresIndex({ stores, types, filters }: StoresIndexProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [deleteStoreId, setDeleteStoreId] = useState<number | null>(null);

    const applyFilters = (newFilters: any) => {
        router.get('/stores', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        router.get('/stores', {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (storeId: number) => {
        router.delete(`/stores/${storeId}`, {
            onSuccess: () => {
                setDeleteStoreId(null);
            },
        });
    };

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Negozi" />

            <PageMain>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Negozi</h1>
                            <p className="text-muted-foreground">
                                Gestisci i negozi e le loro sedi
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filtri
                            </Button>
                            <Button asChild>
                                <Link href="/stores/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nuovo Negozio
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Filtri */}
                    {showFilters && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Filtri</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={resetFilters}
                                        className="gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Reset Filtri
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="search">Cerca</Label>
                                        <Input
                                            id="search"
                                            placeholder="Cerca per nome..."
                                            value={filters.search || ''}
                                            onChange={(e) =>
                                                applyFilters({ ...filters, search: e.target.value || undefined })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="type">Tipo</Label>
                                        <Select
                                            value={filters.type || undefined}
                                            onValueChange={(value) =>
                                                applyFilters({ ...filters, type: value || undefined })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tutti i tipi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {types.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Lista Negozi */}
                    <div className="space-y-4">
                        {stores.data.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Store className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Nessun negozio trovato</h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        Non ci sono negozi registrati o i filtri non hanno prodotto risultati.
                                    </p>
                                    <Button asChild>
                                        <Link href="/stores/create">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Aggiungi Primo Negozio
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            stores.data.map((store) => (
                                <Card key={store.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-lg">{store.name}</h3>
                                                    {store.type && (
                                                        <Badge className={getTypeBadgeColor(store.type)}>
                                                            {store.type}
                                                        </Badge>
                                                    )}
                                                    {store.locations && store.locations.length > 0 && (
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {store.locations.length} {store.locations.length === 1 ? 'sede' : 'sedi'}
                                                        </Badge>
                                                    )}
                                                </div>
                                                
                                                {store.description && (
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        {store.description}
                                                    </p>
                                                )}

                                                {store.locations && store.locations.length > 0 && (
                                                    <div className="space-y-1 text-sm text-muted-foreground">
                                                        {store.locations.slice(0, 3).map((location) => (
                                                            <div key={location.id} className="flex items-center gap-2">
                                                                <MapPin className="h-3 w-3" />
                                                                <span>
                                                                    {location.name || location.city || 'Sede'} - {location.city} {location.province && `(${location.province})`}
                                                                </span>
                                                                {location.is_default && (
                                                                    <Badge variant="outline" className="text-xs">Principale</Badge>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {store.locations.length > 3 && (
                                                            <p className="text-xs text-muted-foreground">
                                                                +{store.locations.length - 3} altre sedi
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/stores/${store.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/stores/${store.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setDeleteStoreId(store.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Conferma Eliminazione</DialogTitle>
                                                            <DialogDescription>
                                                                Sei sicuro di voler eliminare questo negozio? 
                                                                Questa azione eliminerà anche tutte le sedi associate.
                                                                Questa azione non può essere annullata.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => setDeleteStoreId(null)}
                                                            >
                                                                Annulla
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleDelete(store.id)}
                                                            >
                                                                Elimina
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Paginazione */}
                    {stores.data.length > 0 && stores.links && (
                        <div className="flex justify-center">
                            <nav className="flex items-center gap-2">
                                {stores.links.map((link: any, index: number) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </PageMain>
        </AppLayout>
    );
}

