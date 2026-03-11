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
        // Creamos 400 usuarios 
        
        \App\Models\User::factory(400)->create();

        //los profesores
        
        \App\Models\User::factory(20)->create([
            'role' => 'PROFESOR',
            'age' => fake()->numberBetween(25, 60),
            'grade' => null,
        ]);


        // admin 
        \App\Models\User::factory()->create([
            'name' => 'Walter Sistema',
            'email' => 'admin@estudiantes.com',
            'password' => bcrypt('admin123'), 
            'role' => 'ADMIN',
            'age' => null,
            'grade' => null,
        ]);
    }
}
