import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Car, Edit, Trash2, Eye, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageMain } from '@/components/page-main';

interface Vehicle {
    id: number;
    model: string;
    plate_number: string;
    fuel_logs_count: number;
    created_at: string;
    updated_at: string;
}

interface VehiclesIndexProps {
    vehicles: Vehicle[];
    flash?: {
        success?: string;
        error?: string;
    };
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
];

export default function VehiclesIndex({ vehicles, flash }: VehiclesIndexProps) {
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.success);
    const [showErrorAlert, setShowErrorAlert] = useState(!!flash?.error);

    // Auto-dismiss degli alert dopo 5 secondi
    useEffect(() => {
        if (flash?.success) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            const timer = setTimeout(() => {
                setShowErrorAlert(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.error]);

    const handleDelete = (id: number) => {
        router.delete(`/vehicles/${id}`, {
            onSuccess: () => {
                // Il messaggio di successo viene gestito dal controller
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="I Miei Veicoli" />
            <PageMain>
                {/* Alert di successo */}
                {showSuccessAlert && flash?.success && (
                    <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Alert di errore */}
                {showErrorAlert && flash?.error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>
                            {flash.error}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">I Miei Veicoli</h1>
                        <p className="text-muted-foreground">Gestisci i tuoi veicoli e i loro consumi</p>
                    </div>
                    <Link href="/vehicles/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Aggiungi Veicolo
                        </Button>
                    </Link>
                </div>

                {vehicles.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Car className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Nessun veicolo registrato</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Inizia aggiungendo il tuo primo veicolo per tracciare i consumi di carburante.
                            </p>
                            <Link href="/vehicles/create">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Aggiungi il Primo Veicolo
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {vehicles.map((vehicle) => (
                            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <Car className="w-5 h-5" />
                                                {vehicle.model}
                                            </CardTitle>
                                            <CardDescription>
                                                Targa: {vehicle.plate_number}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary">
                                            {vehicle.fuel_logs_count} rifornimenti
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <Link href={`/vehicles/${vehicle.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="w-4 h-4 mr-1" />
                                                Visualizza
                                            </Button>
                                        </Link>
                                        <Link href={`/vehicles/${vehicle.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Modifica
                                            </Button>
                                        </Link>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <Trash2 className="w-4 h-4 mr-1" />
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
                                                        onClick={() => handleDelete(vehicle.id)}
                                                    >
                                                        Elimina
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </PageMain>
        </AppLayout>
    );
}
