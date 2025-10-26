import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Car } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageMain } from '@/components/page-main';

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
        title: 'Aggiungi Veicolo',
        href: '/vehicles/create',
    },
];

export default function VehicleCreate() {
    const { data, setData, post, processing, errors } = useForm({
        model: '',
        plate_number: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vehicles');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Aggiungi Veicolo" />
            <PageMain>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Aggiungi Nuovo Veicolo</h1>
                        <p className="text-muted-foreground">Inserisci i dettagli del tuo veicolo</p>
                    </div>
                    <Link href="/vehicles">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Torna ai Veicoli
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Car className="w-5 h-5" />
                            Informazioni Veicolo
                        </CardTitle>
                        <CardDescription>
                            Compila tutti i campi per registrare il tuo veicolo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="model">Modello del Veicolo</Label>
                                <Input
                                    id="model"
                                    type="text"
                                    value={data.model}
                                    onChange={(e) => setData('model', e.target.value)}
                                    placeholder="es. Fiat Panda, BMW X3, Toyota Corolla..."
                                    className={errors.model ? 'border-red-500' : ''}
                                />
                                {errors.model && (
                                    <p className="text-sm text-red-500">{errors.model}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="plate_number">Numero di Targa</Label>
                                <Input
                                    id="plate_number"
                                    type="text"
                                    value={data.plate_number}
                                    onChange={(e) => setData('plate_number', e.target.value.toUpperCase())}
                                    placeholder="es. AB123CD"
                                    className={errors.plate_number ? 'border-red-500' : ''}
                                />
                                {errors.plate_number && (
                                    <p className="text-sm text-red-500">{errors.plate_number}</p>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvataggio...' : 'Salva Veicolo'}
                                </Button>
                                <Link href="/vehicles">
                                    <Button type="button" variant="outline">
                                        Annulla
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </PageMain>
        </AppLayout>
    );
}
