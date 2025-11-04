import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Calendar, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Expense } from '@/types';
import { PageMain } from '@/components/page-main';

interface ExpenseStatsProps {
    expenses: Expense[];
    categoryStats: Array<{
        name: string;
        total: number;
        count: number;
        average: number;
    }>;
    storeStats: Array<{
        name: string;
        total: number;
        count: number;
        average: number;
    }>;
    weeklyStats: Array<{
        week: string;
        total: number;
        count: number;
    }>;
    totalAmount: number;
    totalCount: number;
    averageAmount: number;
    period: {
        from: string;
        to: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Statistiche Spese',
        href: '/expense-stats',
    },
];

const COLORS = ['#4CAF50', '#F44336', '#E91E63', '#9C27B0', '#FF9800', '#2196F3', '#607D8B'];

export default function ExpenseStats({ 
    expenses, 
    categoryStats, 
    storeStats, 
    weeklyStats, 
    totalAmount, 
    totalCount, 
    averageAmount,
    period 
}: ExpenseStatsProps) {
    const [dateFrom, setDateFrom] = useState(period.from);
    const [dateTo, setDateTo] = useState(period.to);

    const applyDateFilter = () => {
        router.get('/expense-stats', {
            from: dateFrom,
            to: dateTo,
        });
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('it-IT');
    };

    // Prepara i dati per i grafici
    const categoryChartData = categoryStats.map((stat, index) => ({
        name: stat.name,
        value: stat.total,
        count: stat.count,
        average: stat.average,
        color: COLORS[index % COLORS.length],
    }));

    const weeklyChartData = weeklyStats.map(stat => ({
        week: stat.week,
        total: stat.total,
        count: stat.count,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Statistiche Spese" />

            <PageMain>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/expenses">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Torna alle Spese
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Statistiche Spese</h1>
                                <p className="text-muted-foreground">
                                    Analizza le tue spese e i tuoi consumi
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filtri Periodo */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Filtri Periodo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date_from">Da</Label>
                                    <Input
                                        id="date_from"
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_to">A</Label>
                                    <Input
                                        id="date_to"
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                    />
                                </div>
                                <div className="pt-6">
                                    <Button onClick={applyDateFilter}>
                                        Applica Filtri
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistiche Generali */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Totale Speso</p>
                                        <p className="text-2xl font-bold">{formatAmount(totalAmount)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Numero Spese</p>
                                        <p className="text-2xl font-bold">{totalCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Spesa Media</p>
                                        <p className="text-2xl font-bold">{formatAmount(averageAmount)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Grafici */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Spese per Categoria */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="h-5 w-5" />
                                    Spese per Categoria
                                </CardTitle>
                                <CardDescription>
                                    Distribuzione delle spese per categoria
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={categoryChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {categoryChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => formatAmount(Number(value))} />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Spese Settimanali */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Spese Settimanali
                                </CardTitle>
                                <CardDescription>
                                    Andamento delle spese per settimana
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={weeklyChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="week" 
                                                tick={{ fontSize: 12 }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={60}
                                            />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={(value) => formatAmount(Number(value))} />
                                            <Bar dataKey="total" fill="#4CAF50" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabelle Dettagliate */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Categorie */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Categorie</CardTitle>
                                <CardDescription>
                                    Le categorie con le spese più elevate
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {categoryStats.slice(0, 5).map((stat, index) => (
                                        <div key={stat.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline">{index + 1}</Badge>
                                                <div>
                                                    <p className="font-medium">{stat.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {stat.count} spese
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{formatAmount(stat.total)}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Media: {formatAmount(stat.average)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Negozi */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Negozi</CardTitle>
                                <CardDescription>
                                    I negozi dove spendi di più
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {storeStats.slice(0, 5).map((stat, index) => (
                                        <div key={stat.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline">{index + 1}</Badge>
                                                <div>
                                                    <p className="font-medium">{stat.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {stat.count} acquisti
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{formatAmount(stat.total)}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Media: {formatAmount(stat.average)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PageMain>
        </AppLayout>
    );
}
