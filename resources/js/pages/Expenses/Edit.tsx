import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Receipt } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Expense, type Store, type Category, type User } from '@/types';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import { PageMain } from '@/components/page-main';

interface ExpenseEditProps {
    expense: Expense;
    categories: Category[];
    stores: Store[];
    users: User[];
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
        title: 'Modifica Spesa',
        href: '/expenses/edit',
    },
];

export default function ExpenseEdit({ expense, categories, stores, users }: ExpenseEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        store_id: expense.store_id?.toString() || '',
        category_id: expense.category_id?.toString() || '',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
        amount: expense.amount.toString(),
        description: expense.description || '',
        notes: expense.notes || '',
        shared_user_ids: expense.shared_users?.map(u => u.id) || [],
    });

    const userOptions: MultiSelectOption[] = users.map(user => ({
        label: `${user.name} (${user.email})`,
        value: user.id,
    }));

    const handleUsersChange = (selectedIds: (string | number)[]) => {
        setData('shared_user_ids', selectedIds as number[]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/expenses/${expense.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modifica Spesa" />

            <PageMain>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/expenses">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Torna alle Spese
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Modifica Spesa</h1>
                            <p className="text-muted-foreground">
                                Modifica i dettagli della spesa
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" />
                                Dettagli Spesa
                            </CardTitle>
                            <CardDescription>
                                Modifica i campi necessari e salva le modifiche
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Importo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Importo *</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            placeholder="0.00"
                                            className={errors.amount ? 'border-red-500' : ''}
                                        />
                                        {errors.amount && (
                                            <p className="text-sm text-red-500">{errors.amount}</p>
                                        )}
                                    </div>

                                    {/* Data */}
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Data *</Label>
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
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Negozio */}
                                    <div className="space-y-2">
                                        <Label htmlFor="store_id">Negozio</Label>
                                        <Select
                                            value={data.store_id || undefined}
                                            onValueChange={(value) => setData('store_id', value)}
                                        >
                                            <SelectTrigger className={errors.store_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Seleziona un negozio" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {stores.map((store) => (
                                                    <SelectItem key={store.id} value={store.id.toString()}>
                                                        {store.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.store_id && (
                                            <p className="text-sm text-red-500">{errors.store_id}</p>
                                        )}
                                    </div>

                                    {/* Categoria */}
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id">Categoria</Label>
                                        <Select
                                            value={data.category_id || undefined}
                                            onValueChange={(value) => setData('category_id', value)}
                                        >
                                            <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Seleziona una categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            {category.color && (
                                                                <div 
                                                                    className="w-3 h-3 rounded-full" 
                                                                    style={{ backgroundColor: category.color }}
                                                                />
                                                            )}
                                                            {category.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && (
                                            <p className="text-sm text-red-500">{errors.category_id}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Descrizione */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrizione</Label>
                                    <Input
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Breve descrizione della spesa"
                                        className={errors.description ? 'border-red-500' : ''}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                </div>

                                {/* Note */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Note</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Note aggiuntive (opzionale)"
                                        rows={3}
                                        className={errors.notes ? 'border-red-500' : ''}
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-500">{errors.notes}</p>
                                    )}
                                </div>

                                {/* Condivisione */}
                                {users.length > 0 && (
                                    <div className="space-y-2">
                                        <Label htmlFor="shared_users">Condividi con</Label>
                                        <MultiSelect
                                            options={userOptions}
                                            selected={data.shared_user_ids}
                                            onChange={handleUsersChange}
                                            placeholder="Seleziona utenti con cui condividere..."
                                            searchPlaceholder="Cerca utenti..."
                                            error={!!errors.shared_user_ids}
                                        />
                                        {errors.shared_user_ids && (
                                            <p className="text-sm text-red-500">{errors.shared_user_ids}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            Seleziona gli utenti con cui vuoi condividere questa spesa
                                        </p>
                                    </div>
                                )}

                                {/* Pulsanti */}
                                <div className="flex items-center gap-4 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Salvataggio...' : 'Salva Modifiche'}
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/expenses">Annulla</Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </PageMain>
        </AppLayout>
    );
}
