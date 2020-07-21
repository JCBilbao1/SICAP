<?php

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //this will create all roles
        Role::create(['slug' => 'admin', 'name' => 'Administrator']);
    }
}
