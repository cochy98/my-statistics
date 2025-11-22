import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Store, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Store as StoreType, type StoreLocation } from '@/types';
import { PageMain } from '@/components/page-main';

interface StoreEditProps {
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
        title: 'Modifica Negozio',
        href: `/stores/${storeName}/edit`,
    },
];

export default function StoreEdit({ store }: StoreEditProps) {
    const [editingLocation, setEditingLocation] = useState<StoreLocation | null>(null);
    const [showLocationForm, setShowLocationForm] = useState(false);
    const [deleteLocationId, setDeleteLocationId] = useState<number | null>(null);

    const { data, setData, put, processing, errors } = useForm({
        name: store.name,
        type: store.type || '',
        description: store.description || '',
    });

    const locationForm = useForm({
        name: '',
        address: '',
        city: '',
        province: '',
        postal_code: '',
        phone: '',
        latitude: '',
        longitude: '',
        notes: '',
        is_default: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/stores/${store.id}`);
    };

    const handleLocationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingLocation
            ? `/stores/${store.id}/locations/${editingLocation.id}`
            : `/stores/${store.id}/locations`;
        
        const method = editingLocation ? 'put' : 'post';
        
        router[method](url, locationForm.data, {
            onSuccess: () => {
                setShowLocationForm(false);
                setEditingLocation(null);
                locationForm.reset();
            },
        });
    };

    const handleEditLocation = (location: StoreLocation) => {
        setEditingLocation(location);
        locationForm.setData({
            name: location.name || '',
            address: location.address || '',
            city: location.city || '',
            province: location.province || '',
            postal_code: location.postal_code || '',
            phone: location.phone || '',
            latitude: location.latitude?.toString() || '',
            longitude: location.longitude?.toString() || '',
            notes: location.notes || '',
            is_default: location.is_default,
        });
        setShowLocationForm(true);
    };

    const handleDeleteLocation = (locationId: number) => {
        router.delete(`/stores/${store.id}/locations/${locationId}`, {
            onSuccess: () => {
                setDeleteLocationId(null);
            },
        });
    };

    const openNewLocationForm = () => {
        setEditingLocation(null);
        locationForm.reset();
        locationForm.setData({ is_default: (store.locations?.length || 0) === 0 });
        setShowLocationForm(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(store.name)}>
            <Head title={`Modifica ${store.name}`} />

            <PageMain>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/stores">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Torna ai Negozi
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Modifica Negozio</h1>
                            <p className="text-muted-foreground">
                                Modifica i dettagli del negozio e gestisci le sedi
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Form Modifica Negozio */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Store className="h-5 w-5" />
                                    Dettagli Negozio
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Nome */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Tipo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tipo</Label>
                                        <Input
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            placeholder="Es. supermarket, pharmacy..."
                                            className={errors.type ? 'border-red-500' : ''}
                                        />
                                        {errors.type && (
                                            <p className="text-sm text-red-500">{errors.type}</p>
                                        )}
                                    </div>

                                    {/* Descrizione */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descrizione</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={3}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description}</p>
                                        )}
                                    </div>

                                    {/* Pulsanti */}
                                    <div className="flex items-center gap-4 pt-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Salvataggio...' : 'Salva Modifiche'}
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <Link href="/stores">Annulla</Link>
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Gestione Sedi */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Sedi ({store.locations?.length || 0})
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={openNewLocationForm}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Aggiungi Sede
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {store.locations && store.locations.length > 0 ? (
                                    <div className="space-y-3">
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
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditLocation(location)}
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setDeleteLocationId(location.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                {location.address && (
                                                    <div className="text-sm text-muted-foreground">
                                                        <MapPin className="h-3 w-3 inline mr-1" />
                                                        {location.address}
                                                        {location.postal_code && `, ${location.postal_code}`}
                                                        {location.city && ` ${location.city}`}
                                                        {location.province && ` (${location.province})`}
                                                    </div>
                                                )}

                                                {location.phone && (
                                                    <div className="text-sm text-muted-foreground">
                                                        Tel: {location.phone}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Nessuna sede registrata</p>
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                            onClick={openNewLocationForm}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Aggiungi Prima Sede
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Dialog Form Sede */}
                    {showLocationForm && (
                        <Dialog open={showLocationForm} onOpenChange={setShowLocationForm}>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingLocation ? 'Modifica Sede' : 'Nuova Sede'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Compila i campi per {editingLocation ? 'modificare' : 'aggiungere'} la sede
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleLocationSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="location_name">Nome Sede</Label>
                                            <Input
                                                id="location_name"
                                                value={locationForm.data.name}
                                                onChange={(e) => locationForm.setData('name', e.target.value)}
                                                placeholder="Es. Centro, Periferia Nord..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location_city">Città</Label>
                                            <Input
                                                id="location_city"
                                                value={locationForm.data.city}
                                                onChange={(e) => locationForm.setData('city', e.target.value)}
                                                placeholder="Milano"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="location_address">Indirizzo</Label>
                                            <Input
                                                id="location_address"
                                                value={locationForm.data.address}
                                                onChange={(e) => locationForm.setData('address', e.target.value)}
                                                placeholder="Via Roma, 15"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location_province">Provincia</Label>
                                            <Input
                                                id="location_province"
                                                value={locationForm.data.province}
                                                onChange={(e) => locationForm.setData('province', e.target.value.toUpperCase())}
                                                placeholder="MI"
                                                maxLength={2}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location_postal_code">CAP</Label>
                                            <Input
                                                id="location_postal_code"
                                                value={locationForm.data.postal_code}
                                                onChange={(e) => locationForm.setData('postal_code', e.target.value)}
                                                placeholder="20121"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location_phone">Telefono</Label>
                                            <Input
                                                id="location_phone"
                                                value={locationForm.data.phone}
                                                onChange={(e) => locationForm.setData('phone', e.target.value)}
                                                placeholder="02 1234567"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location_latitude">Latitudine</Label>
                                            <Input
                                                id="location_latitude"
                                                type="number"
                                                step="any"
                                                value={locationForm.data.latitude}
                                                onChange={(e) => locationForm.setData('latitude', e.target.value)}
                                                placeholder="45.4642"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location_longitude">Longitudine</Label>
                                            <Input
                                                id="location_longitude"
                                                type="number"
                                                step="any"
                                                value={locationForm.data.longitude}
                                                onChange={(e) => locationForm.setData('longitude', e.target.value)}
                                                placeholder="9.1900"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="location_notes">Note</Label>
                                            <Textarea
                                                id="location_notes"
                                                value={locationForm.data.notes}
                                                onChange={(e) => locationForm.setData('notes', e.target.value)}
                                                rows={2}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2 md:col-span-2">
                                            <Checkbox
                                                id="location_is_default"
                                                checked={locationForm.data.is_default}
                                                onCheckedChange={(checked) =>
                                                    locationForm.setData('is_default', checked === true)
                                                }
                                            />
                                            <Label
                                                htmlFor="location_is_default"
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                Sede principale
                                            </Label>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setShowLocationForm(false);
                                                setEditingLocation(null);
                                                locationForm.reset();
                                            }}
                                        >
                                            Annulla
                                        </Button>
                                        <Button type="submit" disabled={locationForm.processing}>
                                            {locationForm.processing ? 'Salvataggio...' : editingLocation ? 'Salva Modifiche' : 'Aggiungi Sede'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}

                    {/* Dialog Conferma Eliminazione Sede */}
                    <Dialog open={deleteLocationId !== null} onOpenChange={(open) => !open && setDeleteLocationId(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Conferma Eliminazione</DialogTitle>
                                <DialogDescription>
                                    Sei sicuro di voler eliminare questa sede? 
                                    Questa azione non può essere annullata.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteLocationId(null)}
                                >
                                    Annulla
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => deleteLocationId && handleDeleteLocation(deleteLocationId)}
                                >
                                    Elimina
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </PageMain>
        </AppLayout>
    );
}

