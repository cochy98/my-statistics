import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type FuelLog = {
    id: number;
    date: string;
    amount: number | null;
    liters: number | null;
    price_per_liter: number | null;
    km_travelled: number | null;
};

type Props = {
    fuelLogs: FuelLog[];
    vehicle: {
        model: string;
        id: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/',
    },
    {
        title: 'Statistica consumi',
        href: '/fuel-stats',
    },
];

export default function FuelStats({ fuelLogs, vehicle }: Props) {
    const data = useMemo(() => {
        return fuelLogs.map((log) => ({
            ...log,
            km_per_liter: log.liters && log.km_travelled ? (log.km_travelled / log.liters).toFixed(2) : null,
            euro_per_km: log.amount && log.km_travelled ? (log.amount / log.km_travelled).toFixed(3) : null,
            date: new Date(log.date).toLocaleDateString(),
        }));
    }, [fuelLogs]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Statistiche Carburante" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-3xl font-bold">Statistiche Veicolo: {vehicle?.model}</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 shadow">
                        <h2 className="mb-2 text-xl font-semibold">KM per Litro</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="km_per_liter" stroke="#10b981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow">
                        <h2 className="mb-2 text-xl font-semibold">€ per KM</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="euro_per_km" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="col-span-full rounded-2xl bg-white p-4 shadow">
                        <h2 className="mb-2 text-xl font-semibold">Importo Totale (€)</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="amount" stroke="#f59e0b" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
