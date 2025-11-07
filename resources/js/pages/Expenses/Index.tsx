import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, Plus, Search, Filter, Edit, Trash2, Eye, X, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Expense, type Store, type Category } from '@/types';
import { PageMain } from '@/components/page-main';

interface ExpensesIndexProps {
    expenses: {
        data: Expense[];
        links: any[];
        meta: any;
    };
    categories: Category[];
    stores: Store[];
    weeks: string[];
    filters: {
        category_id?: string;
        store_id?: string;
        date_from?: string;
        date_to?: string;
        week?: string;
        sort_by?: string;
        sort_order?: string;
    };
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
];

export default function ExpensesIndex({ expenses, categories, stores, weeks, filters }: ExpensesIndexProps) {
    const { auth } = usePage<{ auth: { user: { id: number } } }>().props;
    const [showFilters, setShowFilters] = useState(false);
    const [deleteExpenseId, setDeleteExpenseId] = useState<number | null>(null);

    const applyFilters = (newFilters: any) => {
        router.get('/expenses', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        router.get('/expenses', {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (expenseId: number) => {
        router.delete(`/expenses/${expenseId}`, {
            onSuccess: () => {
                setDeleteExpenseId(null);
            },
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

    const getCategoryColor = (category: Category | null) => {
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
            <Head title="Le Mie Spese" />

            <PageMain>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Le Mie Spese</h1>
                            <p className="text-muted-foreground">
                                Gestisci e monitora tutte le tue spese
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
                                <Link href="/expenses/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nuova Spesa
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
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <div>
                                        <Label htmlFor="category">Categoria</Label>
                                        <Select
                                            value={filters.category_id || undefined}
                                            onValueChange={(value) =>
                                                applyFilters({ ...filters, category_id: value || undefined })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tutte le categorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="store">Negozio</Label>
                                        <Select
                                            value={filters.store_id || undefined}
                                            onValueChange={(value) =>
                                                applyFilters({ ...filters, store_id: value || undefined })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tutti i negozi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {stores.map((store) => (
                                                    <SelectItem key={store.id} value={store.id.toString()}>
                                                        {store.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="week">Settimana</Label>
                                        <Select
                                            value={filters.week || undefined}
                                            onValueChange={(value) =>
                                                applyFilters({ ...filters, week: value || undefined })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tutte le settimane" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {weeks.map((week) => (
                                                    <SelectItem key={week} value={week}>
                                                        {week}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="date_from">Data da</Label>
                                        <Input
                                            id="date_from"
                                            type="date"
                                            value={filters.date_from || ''}
                                            onChange={(e) =>
                                                applyFilters({ ...filters, date_from: e.target.value || undefined })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="date_to">Data a</Label>
                                        <Input
                                            id="date_to"
                                            type="date"
                                            value={filters.date_to || ''}
                                            onChange={(e) =>
                                                applyFilters({ ...filters, date_to: e.target.value || undefined })
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Lista Spese */}
                    <div className="space-y-4">
                        {expenses.data.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Nessuna spesa trovata</h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        Non hai ancora registrato nessuna spesa o i filtri non hanno prodotto risultati.
                                    </p>
                                    <Button asChild>
                                        <Link href="/expenses/create">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Aggiungi Prima Spesa
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            expenses.data.map((expense) => (
                                <Card key={expense.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-lg">
                                                        {formatAmount(expense.amount)}
                                                    </h3>
                                                    {expense.category && (
                                                        <Badge className={getCategoryColor(expense.category)}>
                                                            {expense.category.name}
                                                        </Badge>
                                                    )}
                                                    {expense.user_id !== auth.user.id && (
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            Condivisa
                                                        </Badge>
                                                    )}
                                                    {expense.shared_users && expense.shared_users.length > 0 && expense.user_id === auth.user.id && (
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            Condivisa ({expense.shared_users.length})
                                                        </Badge>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Data:</span>
                                                        <span>{formatDate(expense.date)}</span>
                                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                            {expense.week_identifier}
                                                        </span>
                                                    </div>
                                                    
                                                    {expense.store && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">Negozio:</span>
                                                            <span>{expense.store.name}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {expense.description && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">Descrizione:</span>
                                                            <span>{expense.description}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/expenses/${expense.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/expenses/${expense.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setDeleteExpenseId(expense.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Conferma Eliminazione</DialogTitle>
                                                            <DialogDescription>
                                                                Sei sicuro di voler eliminare questa spesa? 
                                                                Questa azione non può essere annullata.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => setDeleteExpenseId(null)}
                                                            >
                                                                Annulla
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleDelete(expense.id)}
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
                    {expenses.data.length > 0 && expenses.links && (
                        <div className="flex justify-center">
                            <nav className="flex items-center gap-2">
                                {expenses.links.map((link: any, index: number) => (
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
