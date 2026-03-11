<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $age = fake()->numberBetween(12, 18);

        $gradeMapping = [
            12 => '1 ESO',
            13 => '2 ESO',
            14 => '3 ESO',
            15 => '4 ESO',
            16 => '1 BACH',
            17 => '2 BACH',
            18 => '2 BACH',
        ];

        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'), 
            'role' => 'ALUMNO',
            'age' => $age,
            'grade' => $gradeMapping[$age],
            'remember_token' => \Illuminate\Support\Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
