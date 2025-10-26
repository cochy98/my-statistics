import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Fuel } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageMain } from '@/components/page-main';

interface Vehicle {
    id: number;
    model: string;
    plate_number: string;
}

interface FuelLog {
    id: number;
    vehicle_id: number;
    date: string;
    amount: number;
    liters: number;
    price_per_liter: number | null;
    km_travelled: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

interface FuelLogEditProps {
    fuelLog: FuelLog;
    vehicles: Vehicle[];
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
        title: 'Modifica Rifornimento',
        href: '/fuel-logs/edit',
    },
];

export default function FuelLogEdit({ fuelLog, vehicles }: FuelLogEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        vehicle_id: fuelLog.vehicle_id.toString(),
        date: fuelLog.date,
        amount: fuelLog.amount.toString(),
        liters: fuelLog.liters.toString(),
        price_per_liter: fuelLog.price_per_liter?.toString() || '',
        km_travelled: fuelLog.km_travelled?.toString() || '',
        notes: fuelLog.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/fuel-logs/${fuelLog.id}`);
    };

    const calculatePricePerLiter = () => {
        if (data.amount && data.liters) {
            const price = parseFloat(data.amount) / parseFloat(data.liters);
            setData('price_per_liter', price.toFixed(3));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modifica Rifornimento" />
            <PageMain>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Modifica Rifornimento</h1>
                        <p className="text-muted-foreground">Aggiorna i dettagli del rifornimento</p>
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
                            <Fuel className="w-5 h-5" />
                            Dettagli Rifornimento
                        </CardTitle>
                        <CardDescription>
                            Modifica i campi che desideri aggiornare
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="vehicle_id">Veicolo</Label>
                                <Select value={data.vehicle_id} onValueChange={(value) => setData('vehicle_id', value)}>
                                    <SelectTrigger className={errors.vehicle_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Seleziona un veicolo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehicles.map((vehicle) => (
                                            <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                                {vehicle.model} - {vehicle.plate_number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.vehicle_id && (
                                    <p className="text-sm text-red-500">{errors.vehicle_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Data Rifornimento</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className={errors.date ? 'border-red-500' : ''}
                                />
                                {errors.date && (
                                    <p className="text-sm text-red-500">{errors.date}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Importo (€)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.amount}
                                        onChange={(e) => {
                                            setData('amount', e.target.value);
                                            calculatePricePerLiter();
                                        }}
                                        placeholder="0.00"
                                        className={errors.amount ? 'border-red-500' : ''}
                                    />
                                    {errors.amount && (
                                        <p className="text-sm text-red-500">{errors.amount}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="liters">Litri</Label>
                                    <Input
                                        id="liters"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.liters}
                                        onChange={(e) => {
                                            setData('liters', e.target.value);
                                            calculatePricePerLiter();
                                        }}
                                        placeholder="0.00"
                                        className={errors.liters ? 'border-red-500' : ''}
                                    />
                                    {errors.liters && (
                                        <p className="text-sm text-red-500">{errors.liters}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price_per_liter">Prezzo al Litro (€)</Label>
                                    <Input
                                        id="price_per_liter"
                                        type="number"
                                        step="0.001"
                                        min="0.001"
                                        value={data.price_per_liter}
                                        onChange={(e) => setData('price_per_liter', e.target.value)}
                                        placeholder="0.000"
                                        className={errors.price_per_liter ? 'border-red-500' : ''}
                                    />
                                    {errors.price_per_liter && (
                                        <p className="text-sm text-red-500">{errors.price_per_liter}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="km_travelled">KM Percorsi (opzionale)</Label>
                                    <Input
                                        id="km_travelled"
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        value={data.km_travelled}
                                        onChange={(e) => setData('km_travelled', e.target.value)}
                                        placeholder="0.0"
                                        className={errors.km_travelled ? 'border-red-500' : ''}
                                    />
                                    {errors.km_travelled && (
                                        <p className="text-sm text-red-500">{errors.km_travelled}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Note (opzionale)</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('notes', e.target.value)}
                                    placeholder="Aggiungi note sul rifornimento..."
                                    className={errors.notes ? 'border-red-500' : ''}
                                    rows={3}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-red-500">{errors.notes}</p>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvataggio...' : 'Salva Modifiche'}
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
