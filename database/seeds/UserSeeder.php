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
            'first_name' => 'CDO',
            'last_name' => 'Coordination',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role_id' => 1,
        ]);
    }
}
        
