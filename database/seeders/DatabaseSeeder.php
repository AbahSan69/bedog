<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Jalankan seeder database untuk membuat akun Admin default.
     */
    public function run(): void
    {
        // Buat atau perbarui akun Super Admin
        User::updateOrCreate(
            ['email' => 'admin@barbershop.com'],
            [
                'name'     => 'Administrator Barbershop',
                'password' => Hash::make('admin123'),
            ]
        );
    }
}