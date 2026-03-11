<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    
    public function run(): void {
        $asignaturas = ['Matemáticas', 'Lengua', 'Física', 'Historia', 'Inglés', 'Programación', 'Filosofía'];
        foreach ($asignaturas as $nombre) {
            \App\Models\Subject::create(['name' => $nombre]);
        }
    }
}
