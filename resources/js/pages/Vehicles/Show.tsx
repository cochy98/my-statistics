import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Car, Edit, Trash2, Plus, Fuel } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageMain } from '@/components/page-main';

interface FuelLog {
    id: number;
    date: string;
    amount: number;
    liters: number;
    price_per_liter: number | null;
    km_travelled: number | null;
    km_per_liter: number | null;
    euro_per_km: number | null;
    created_at: string;
    updated_at: string;
}

interface Vehicle {
    id: number;
    model: string;
    plate_number: string;
    fuel_logs: FuelLog[];
    created_at: string;
    updated_at: string;
}

interface VehicleShowProps {
    vehicle: Vehicle;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'I Miei Veicoli',
        href: '/vehicles',
    },
    {
        title: 'Dettagli Veicolo',
        href: '/vehicles/show',
    },
];

export default function VehicleShow({ vehicle }: VehicleShowProps) {
    // Debug: controlla i dati ricevuti
    console.log('Vehicle data received:', vehicle);
    console.log('Fuel logs:', vehicle.fuel_logs);

    const handleDelete = () => {
        router.delete(`/vehicles/${vehicle.id}`, {
            onSuccess: () => {
                // Il messaggio di successo viene gestito dal controller
            }
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('it-IT');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    // Funzioni helper per calcoli sicuri
    const calculateTotalLiters = () => {
        try {
            const total = vehicle.fuel_logs?.reduce((sum, log) => {
                const liters = typeof log.liters === 'number' ? log.liters : (parseFloat(log.liters) || 0);
                return sum + liters;
            }, 0) || 0;
            return total.toFixed(1);
        } catch (error) {
            console.error('Error calculating total liters:', error);
            return '0.0';
        }
    };

    const calculateTotalAmount = () => {
        try {
            const total = vehicle.fuel_logs?.reduce((sum, log) => {
                const amount = typeof log.amount === 'number' ? log.amount : (parseFloat(log.amount) || 0);
                return sum + amount;
            }, 0) || 0;
            return formatCurrency(total);
        } catch (error) {
            console.error('Error calculating total amount:', error);
            return formatCurrency(0);
        }
    };

    const calculateTotalKm = () => {
        try {
            const total = vehicle.fuel_logs?.reduce((sum, log) => {
                const km = typeof log.km_travelled === 'number' ? log.km_travelled : (log.km_travelled ? parseFloat(log.km_travelled) || 0 : 0);
                return sum + km;
            }, 0) || 0;
            return total.toFixed(0);
        } catch (error) {
            console.error('Error calculating total km:', error);
            return '0';
        }
    };

    const formatFuelLogLiters = (liters: any) => {
        return (typeof liters === 'number' ? liters : (parseFloat(liters) || 0)).toFixed(1);
    };

    const formatFuelLogAmount = (amount: any) => {
        return formatCurrency(typeof amount === 'number' ? amount : (parseFloat(amount) || 0));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${vehicle.model} - Dettagli`} />
            <PageMain>
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/vehicles">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Torna ai Veicoli
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Car className="w-8 h-8" />
                            {vehicle.model}
                        </h1>
                        <p className="text-muted-foreground">Targa: {vehicle.plate_number}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/vehicles/${vehicle.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Modifica
                            </Button>
                        </Link>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Elimina
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Conferma eliminazione</DialogTitle>
                                    <DialogDescription>
                                        Sei sicuro di voler eliminare il veicolo "{vehicle.model}" 
                                        (targa: {vehicle.plate_number})? Questa azione eliminerà 
                                        anche tutti i rifornimenti associati e non può essere annullata.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline">Annulla</Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                    >
                                        Elimina
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Statistiche */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistiche</CardTitle>
                                <CardDescription>Riepilogo dei consumi</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Rifornimenti totali:</span>
                                    <Badge variant="secondary">{vehicle.fuel_logs?.length || 0}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span>Litri totali:</span>
                                    <Badge variant="secondary">
                                        {calculateTotalLiters()} L
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span>Spesa totale:</span>
                                    <Badge variant="secondary">
                                        {calculateTotalAmount()}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span>KM totali:</span>
                                    <Badge variant="secondary">
                                        {calculateTotalKm()} km
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Lista rifornimenti */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Rifornimenti</CardTitle>
                                        <CardDescription>Cronologia dei rifornimenti</CardDescription>
                                    </div>
                                    <Link href="/fuel-logs/create">
                                        <Button size="sm">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Aggiungi Rifornimento
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {!vehicle.fuel_logs || vehicle.fuel_logs.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Fuel className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Nessun rifornimento registrato</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Inizia tracciando i tuoi primi rifornimenti per questo veicolo.
                                        </p>
                                        <Link href="/fuel-logs/create">
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Aggiungi Primo Rifornimento
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {vehicle.fuel_logs?.map((log) => (
                                            <div key={log.id} className="flex justify-between items-center p-4 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <p className="font-semibold">{formatDate(log.date)}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {formatFuelLogLiters(log.liters)}L - {formatFuelLogAmount(log.amount)}
                                                            </p>
                                                        </div>
                                                        {log.km_travelled && (
                                                            <div className="text-sm">
                                                                <p className="font-medium">{log.km_travelled} km</p>
                                                                {log.km_per_liter && (
                                                                    <p className="text-muted-foreground">
                                                                        {log.km_per_liter} km/L
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link href={`/fuel-logs/${log.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
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
