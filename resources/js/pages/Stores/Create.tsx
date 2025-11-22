import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Store } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageMain } from '@/components/page-main';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Negozi',
        href: '/stores',
    },
    {
        title: 'Nuovo Negozio',
        href: '/stores/create',
    },
];

export default function StoreCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stores');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuovo Negozio" />

            <PageMain>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/stores">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Torna ai Negozi
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Nuovo Negozio</h1>
                            <p className="text-muted-foreground">
                                Registra un nuovo negozio nel sistema
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Store className="h-5 w-5" />
                                Dettagli Negozio
                            </CardTitle>
                            <CardDescription>
                                Compila i campi per registrare il negozio. Potrai aggiungere le sedi dopo la creazione.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nome */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Es. Esselunga, Farmacia Comunale..."
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Tipo */}
                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo</Label>
                                    <Input
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        placeholder="Es. supermarket, pharmacy, hardware..."
                                        className={errors.type ? 'border-red-500' : ''}
                                    />
                                    {errors.type && (
                                        <p className="text-sm text-red-500">{errors.type}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Esempi: supermarket, pharmacy, hardware, electronics, furniture
                                    </p>
                                </div>

                                {/* Descrizione */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrizione</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Descrizione del negozio (opzionale)"
                                        rows={3}
                                        className={errors.description ? 'border-red-500' : ''}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                </div>

                                {/* Pulsanti */}
                                <div className="flex items-center gap-4 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Salvataggio...' : 'Salva Negozio'}
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/stores">Annulla</Link>
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

