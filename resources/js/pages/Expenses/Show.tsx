import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Receipt, Edit, Calendar, Store, Tag, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Expense } from '@/types';
import { PageMain } from '@/components/page-main';

interface ExpenseShowProps {
    expense: Expense;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Le Mie Spese',
        href: '/expenses',
    },
    {
        title: 'Dettagli Spesa',
        href: '/expenses/show',
    },
];

export default function ExpenseShow({ expense }: ExpenseShowProps) {
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('it-IT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getCategoryColor = (category: any) => {
        if (!category?.color) return 'bg-gray-100 text-gray-800';
        
        const colorMap: { [key: string]: string } = {
            '#4CAF50': 'bg-green-100 text-green-800',
            '#F44336': 'bg-red-100 text-red-800',
            '#E91E63': 'bg-pink-100 text-pink-800',
            '#9C27B0': 'bg-purple-100 text-purple-800',
            '#FF9800': 'bg-orange-100 text-orange-800',
            '#2196F3': 'bg-blue-100 text-blue-800',
            '#607D8B': 'bg-gray-100 text-gray-800',
        };
        
        return colorMap[category.color] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dettagli Spesa" />

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
                                <h1 className="text-3xl font-bold tracking-tight">Dettagli Spesa</h1>
                                <p className="text-muted-foreground">
                                    Visualizza tutti i dettagli della spesa
                                </p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href={`/expenses/${expense.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifica
                            </Link>
                        </Button>
                    </div>

                    {/* Dettagli Principali */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" />
                                Informazioni Spesa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Importo */}
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">
                                    {formatAmount(expense.amount)}
                                </div>
                                {expense.description && (
                                    <p className="text-lg text-muted-foreground">
                                        {expense.description}
                                    </p>
                                )}
                            </div>

                            {/* Informazioni Principali */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Data */}
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Data</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(expense.date)}
                                        </p>
                                        <Badge variant="outline" className="mt-1">
                                            {expense.week_identifier}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Negozio */}
                                {expense.store && (
                                    <div className="flex items-center gap-3">
                                        <Store className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Negozio</p>
                                            <p className="text-sm text-muted-foreground">
                                                {expense.store.name}
                                            </p>
                                            {expense.store.type && (
                                                <Badge variant="secondary" className="mt-1">
                                                    {expense.store.type}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Categoria */}
                                {expense.category && (
                                    <div className="flex items-center gap-3">
                                        <Tag className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Categoria</p>
                                            <Badge className={getCategoryColor(expense.category)}>
                                                {expense.category.name}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Note */}
                            {expense.notes && (
                                <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                                    <div>
                                        <p className="font-medium">Note</p>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {expense.notes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Informazioni Sistema */}
                            <div className="pt-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div>
                                        <p className="font-medium">Creata il:</p>
                                        <p>{new Date(expense.created_at).toLocaleString('it-IT')}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Ultima modifica:</p>
                                        <p>{new Date(expense.updated_at).toLocaleString('it-IT')}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PageMain>
        </AppLayout>
    );
}
