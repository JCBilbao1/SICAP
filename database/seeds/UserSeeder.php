<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'id' => 1,
            'first_name' => 'Administrator',
            'last_name' => '',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role_id' => 1,
        ]);
    }
}
        
