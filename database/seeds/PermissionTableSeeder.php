<?php

use Illuminate\Database\Seeder;

use Spatie\Permission\Models\Permission;

class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            //user
            'user-list',
            'user-create',
            'user-edit',
            'user-delete',
            //role
            'role-list',
            'role-create',
            'role-edit',
            'role-delete',
            //distributors,
            'distributor-list',
            'distributor-create',
            'distributor-edit',
            'distributor-delete',
            //product
            'product-list',
            'product-create',
            'product-edit',
            'product-delete', 
            //order
            'order-list',
            'order-create',
            'order-edit',
            'order-delete',
            //reward
            'reward-list',
            'reward-create',
            'reward-edit',
            'reward-delete',
            //point
            'point-list',
            'point-create',
            'point-edit',
            'point-delete',
            //categories
            'categories-list',
            'categories-create',
            'categories-edit',
            'categories-delete',
            //ranks
            'rank-list',
            'rank-create',
            'rank-edit',
            'rank-delete',
            //sales
            'sales-list',
            'sales-create',
            'sales-edit',
            'sales-delete',
            //redeems
            'redeem-list',
            'redeem-create',
            'redeem-edit',
            'redeem-delete',
            //inventory
            'inventory-list',
            'inventory-create',
            'inventory-edit',
            'inventory-delete',
        ];
        foreach($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
    }
}
