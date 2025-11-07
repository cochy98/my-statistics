<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ResetUserPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:reset-password {--email=} {--password=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Resetta la password di un utente dato l\'indirizzo email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->option('email');
        $password = $this->option('password');

        // Validazione dei parametri
        if (empty($email)) {
            $this->error('Errore: Il parametro --email è obbligatorio.');
            return 1;
        }

        if (empty($password)) {
            $this->error('Errore: Il parametro --password è obbligatorio.');
            return 1;
        }

        // Validazione formato email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error("Errore: L'email '{$email}' non è valida.");
            return 1;
        }

        // Validazione lunghezza password
        if (strlen($password) < 6) {
            $this->error('Errore: La password deve essere di almeno 6 caratteri.');
            return 1;
        }

        // Cerca l'utente per email
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("Errore: Nessun utente trovato con l'email '{$email}'.");
            return 1;
        }

        // Verifica se l'utente è stato eliminato (soft delete)
        /* if ($user->trashed()) {
            $this->error("Errore: L'utente con email '{$email}' è stato eliminato.");
            return 1;
        } */

        try {
            // Aggiorna la password
            $user->password = Hash::make($password);
            $user->save();

            $this->info("Password resettata con successo per l'utente:");
            $this->line("Email: {$email}");
            $this->line("Username: {$user->name}");
            $this->line("Password aggiornata: {$password}");

            return 0;

        } catch (\Exception $e) {
            $this->error("Errore durante l'aggiornamento della password: " . $e->getMessage());
            return 1;
        }
    }
}
