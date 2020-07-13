<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'id' => 1,
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'created_at'=> Date('Y-m-d H:m:s'),
        ]);
        $user = User::find(1);
        $user->assignRole('admin');
        DB::table('users')->insert([
            'id' => 2,
            'first_name' => 'Sales',
            'last_name' => 'Example',
            'email' => 'sales@example.com',
            'password' => bcrypt('password'),
            'created_at'=> Date('Y-m-d H:m:s'),
        ]);
        
        $user = User::find(2);
        $user->assignRole('sales');
    }
}
        
