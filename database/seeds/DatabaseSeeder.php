<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();
        $this->call([
            PermissionTableSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            RankTypeSeeder::class,
            AddressTypeSeeder::class,
            OrderStatusSeeder::class,
            CategoriesSeeder::class
        ]);
        Model::reguard();
    }
}
