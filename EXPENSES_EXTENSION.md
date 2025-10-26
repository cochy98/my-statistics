# Estensione App Statistics - Gestione Spese Generali

## Panoramica
L'applicazione è stata estesa per gestire non solo i consumi dei veicoli, ma anche le spese generali di una persona (alimentari, salute, bellezza, svago, ecc.).

## Entità Database

### 1. Stores (Negozi)
- **Tabella**: `stores`
- **Campi**:
  - `id` (PK)
  - `name` (nome univoco del negozio)
  - `type` (tipo: supermarket, specialty_food, pharmacy, household, other)
  - `description` (descrizione opzionale)
  - `timestamps`

### 2. Categories (Categorie)
- **Tabella**: `categories`
- **Campi**:
  - `id` (PK)
  - `name` (nome della categoria)
  - `slug` (slug univoco per URL)
  - `color` (colore hex per UI)
  - `icon` (nome icona per UI)
  - `description` (descrizione opzionale)
  - `timestamps`

**Categorie predefinite**:
- Alimentari (verde)
- Salute (rosso)
- Bellezza (rosa)
- Casa (viola)
- Svago (arancione)
- Trasporti (blu)
- Altro (grigio)

### 3. Expenses (Spese)
- **Tabella**: `expenses`
- **Campi**:
  - `id` (PK)
  - `user_id` (FK a users)
  - `store_id` (FK a stores, nullable)
  - `category_id` (FK a categories, nullable)
  - `date` (data della spesa)
  - `week_identifier` (identificatore settimana formato YYYY-WW)
  - `amount` (importo in euro)
  - `description` (descrizione opzionale)
  - `notes` (note aggiuntive)
  - `timestamps`

## Relazioni

```
User (1) -----> (N) Expense
Store (1) -----> (N) Expense
Category (1) --> (N) Expense
```

## Modelli Eloquent

### Store Model
- Relazione `hasMany` con Expense
- Scope `byType()` per filtrare per tipo

### Category Model
- Relazione `hasMany` con Expense
- Scope `bySlug()` per cercare per slug

### Expense Model
- Relazioni `belongsTo` con User, Store, Category
- Scope per filtrare per settimana, categoria, negozio, periodo
- Metodo statico `generateWeekIdentifier()` per generare identificatori settimana
- Accessor `formatted_amount` per formattare l'importo

### User Model (Aggiornato)
- Aggiunta relazione `hasMany` con Expense

## Seeder e Importazione

### CategorySeeder
Popola le categorie predefinite con colori e icone.

### ExpenseSeeder
Importa i dati dal CSV `storage/app/spese.csv` e:
- Crea automaticamente i negozi
- Categorizza le spese basandosi sul nome del negozio e descrizione
- Genera gli identificatori settimana
- Gestisce le date nel formato italiano (dd/mm/yyyy)

### Comando Artisan
```bash
php artisan expenses:import-csv path/to/file.csv --user-id=1
```

## Mappatura Automatica Categorie

Il sistema mappa automaticamente i negozi alle categorie:

**Alimentari**: Sole 365, MD, Lidl, Iper Superò, Pescheria, Polleria, Frutta, Ortofrutta, Pane, Pasticceria, Casalingo, Dentifricio e caffè

**Casa**: Ammorbidente, Puck, Cose per la casa, Carta igienica, Detergenti

**Salute**: Parigina

**Bellezza**: Rilevata tramite parole chiave nella descrizione (shampoo, bellezza, cosmetici)

## Utilizzo

1. **Eseguire le migrazioni**:
   ```bash
   php artisan migrate
   ```

2. **Popolare le categorie**:
   ```bash
   php artisan db:seed --class=CategorySeeder
   ```

3. **Importare le spese dal CSV**:
   ```bash
   php artisan expenses:import-csv spese.csv --user-id=1
   ```

4. **Oppure eseguire tutti i seeder**:
   ```bash
   php artisan db:seed
   ```

## Note Tecniche

- Le date nel CSV sono nel formato italiano (dd/mm/yyyy)
- Gli importi sono gestiti come decimali con 2 cifre decimali
- Gli identificatori settimana seguono il formato ISO (YYYY-WW)
- I negozi sono creati automaticamente se non esistono
- Le categorie sono assegnate automaticamente basandosi su regole predefinite
