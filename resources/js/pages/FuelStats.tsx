import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowLeft, Car, Fuel, CheckCircle, TrendingUp, DollarSign, Gauge, Star } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageMain } from '@/components/page-main';

type FuelLog = {
    id: number;
    date: string;
    amount: number | null;
    liters: number | null;
    price_per_liter: number | null;
    km_travelled: number | null;
    notes: string | null;
};

type Vehicle = {
    id: number;
    model: string;
    plate_number: string;
    is_preferred: boolean;
};

type Props = {
    vehicle: Vehicle | null;
    vehicles: Vehicle[];
    fuelLogs: FuelLog[];
    isPreferredVehicle: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Statistiche Consumi',
        href: '/fuel-stats',
    },
];

export default function FuelStats({ vehicle, vehicles, fuelLogs, isPreferredVehicle, flash }: Props) {
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

    const data = useMemo(() => {
        return fuelLogs.map((log) => ({
            ...log,
            km_per_liter: log.liters && log.km_travelled ? (log.km_travelled / log.liters).toFixed(2) : null,
            euro_per_km: log.amount && log.km_travelled ? (log.amount / log.km_travelled).toFixed(3) : null,
            date: new Date(log.date).toLocaleDateString('it-IT'),
        }));
    }, [fuelLogs]);

    const handleVehicleChange = (vehicleId: string) => {
        window.location.href = `/fuel-stats?vehicle_id=${vehicleId}`;
    };

    const setAsPreferred = () => {
        if (vehicle) {
            router.post(`/vehicles/${vehicle.id}/set-preferred`, {}, {
                onSuccess: () => {
                    // Il messaggio di successo viene gestito dal controller
                }
            });
        }
    };

    const removeFromPreferred = () => {
        router.post('/remove-preferred-vehicle', {}, {
            onSuccess: () => {
                // Il messaggio di successo viene gestito dal controller
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const formatNumber = (value: number, decimals: number = 1) => {
        const num = typeof value === 'number' ? value : (parseFloat(value) || 0);
        return num.toFixed(decimals);
    };

    const calculateStats = () => {
        if (fuelLogs.length === 0) return null;

        const totalAmount = fuelLogs.reduce((sum, log) => {
            const amount = typeof log.amount === 'number' ? log.amount : (parseFloat(log.amount || '0') || 0);
            return sum + amount;
        }, 0);
        
        const totalLiters = fuelLogs.reduce((sum, log) => {
            const liters = typeof log.liters === 'number' ? log.liters : (parseFloat(log.liters || '0') || 0);
            return sum + liters;
        }, 0);
        
        const totalKm = fuelLogs.reduce((sum, log) => {
            const km = typeof log.km_travelled === 'number' ? log.km_travelled : (parseFloat(log.km_travelled || '0') || 0);
            return sum + km;
        }, 0);
        
        const avgKmPerLiter = totalKm && totalLiters ? (totalKm / totalLiters).toFixed(2) : null;
        const avgEuroPerKm = totalAmount && totalKm ? (totalAmount / totalKm).toFixed(3) : null;

        return {
            totalAmount: totalAmount || 0,
            totalLiters: totalLiters || 0,
            totalKm: totalKm || 0,
            avgKmPerLiter,
            avgEuroPerKm,
            totalRefills: fuelLogs.length
        };
    };

    const stats = calculateStats();

    // Se non c'è un veicolo selezionato, mostra errore
    if (!vehicle) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Statistiche Consumi - Errore" />
                <PageMain>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <TrendingUp className="w-8 h-8" />
                                Statistiche Consumi
                            </h1>
                            <p className="text-muted-foreground">Seleziona un veicolo per visualizzare le statistiche</p>
                        </div>
                        <Link href="/vehicles">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Torna ai Veicoli
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardContent className="text-center py-12">
                            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Nessun veicolo selezionato</h3>
                            <p className="text-muted-foreground mb-4">
                                Seleziona un veicolo dalla lista sottostante per visualizzare le sue statistiche di consumo.
                            </p>
                            
                            {vehicles.length > 0 ? (
                                <div className="max-w-md mx-auto">
                                    <Select onValueChange={handleVehicleChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleziona un veicolo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicles.map((v) => (
                                                <SelectItem key={v.id} value={v.id.toString()}>
                                                    {v.model} - {v.plate_number}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : (
                                <Link href="/vehicles/create">
                                    <Button>
                                        <Car className="w-4 h-4 mr-2" />
                                        Aggiungi Primo Veicolo
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                </PageMain>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Statistiche ${vehicle.model}`} />
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

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <TrendingUp className="w-8 h-8" />
                            Statistiche Consumi
                        </h1>
                        <p className="text-muted-foreground">
                            Analisi consumi per {vehicle.model} (targa: {vehicle.plate_number})
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isPreferredVehicle ? (
                            <Button variant="outline" onClick={removeFromPreferred}>
                                <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-600" />
                                Rimuovi dai Preferiti
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={setAsPreferred}>
                                <Star className="w-4 h-4 mr-2" />
                                Imposta come Preferito
                            </Button>
                        )}
                        <Link href="/vehicles">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Torna ai Veicoli
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Selettore Veicolo */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Car className="w-5 h-5" />
                            Cambia Veicolo
                        </CardTitle>
                        <CardDescription>
                            Scegli un altro veicolo per visualizzare le sue statistiche
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select 
                            value={vehicle.id.toString()} 
                            onValueChange={handleVehicleChange}
                        >
                            <SelectTrigger className="w-full max-w-md">
                                <SelectValue placeholder="Seleziona un veicolo" />
                            </SelectTrigger>
                            <SelectContent>
                                {vehicles.map((v) => (
                                    <SelectItem key={v.id} value={v.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            {v.model} - {v.plate_number}
                                            {v.is_preferred && (
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-600" />
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Statistiche Riepilogative */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Spesa Totale</p>
                                        <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Fuel className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Litri Totali</p>
                                        <p className="text-2xl font-bold">{formatNumber(stats.totalLiters)} L</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Gauge className="w-5 h-5 text-purple-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">KM/Litro Medio</p>
                                        <p className="text-2xl font-bold">{stats.avgKmPerLiter || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-orange-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Rifornimenti</p>
                                        <p className="text-2xl font-bold">{stats.totalRefills}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Grafici */}
                {data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Gauge className="w-5 h-5" />
                                    Efficienza (KM/Litro)
                                </CardTitle>
                                <CardDescription>
                                    Andamento dell'efficienza del carburante nel tempo
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={data}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip 
                                            formatter={(value: any) => [`${value} km/L`, 'Efficienza']}
                                            labelFormatter={(label) => `Data: ${label}`}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Line 
                                            type="monotone" 
                                            dataKey="km_per_liter" 
                                            stroke="#10b981" 
                                            strokeWidth={2}
                                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Costo per KM
                                </CardTitle>
                                <CardDescription>
                                    Andamento del costo per chilometro percorso
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip 
                                            formatter={(value: any) => [`€${value}`, 'Costo/KM']}
                                            labelFormatter={(label) => `Data: ${label}`}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Bar dataKey="euro_per_km" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Fuel className="w-5 h-5" />
                                    Importo Rifornimenti
                                </CardTitle>
                                <CardDescription>
                                    Andamento degli importi spesi per rifornimento
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={data}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip 
                                            formatter={(value: any) => [formatCurrency(value), 'Importo']}
                                            labelFormatter={(label) => `Data: ${label}`}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Line 
                                            type="monotone" 
                                            dataKey="amount" 
                                            stroke="#f59e0b" 
                                            strokeWidth={2}
                                            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Fuel className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Nessun dato disponibile</h3>
                            <p className="text-muted-foreground mb-4">
                                Non ci sono rifornimenti registrati per {vehicle.model}
                            </p>
                            <Link href={`/fuel-logs/create?vehicle_id=${vehicle.id}`}>
                                <Button>
                                    <Fuel className="w-4 h-4 mr-2" />
                                    Aggiungi Primo Rifornimento
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </PageMain>
        </AppLayout>
    );
}
