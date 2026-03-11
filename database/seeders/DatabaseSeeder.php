<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Creamos 400 usuarios usando la fábrica que 
        // acabamos de configurar
        
        \App\Models\User::factory(400)->create();

        // Y un admin para nosotros
        \App\Models\User::factory()->create([
            'name' => 'Admin Sistema',
            'email' => 'admin@admin.com',
            'role' => 'ADMIN',
            'age' => null,
            'grade' => null,
        ]);
    }
}
