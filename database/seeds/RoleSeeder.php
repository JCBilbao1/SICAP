<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

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
        $role = Role::create(['name' => 'admin']);
        $permissions = Permission::all();
        foreach($permissions as $permission){
            $permission->assignRole($role);
        }
        $role = Role::create(['name' => 'distributor']);
        foreach($permissions as $permission){
            //distributor
            if($permission->name == 'user-edit'){
                $permission->assignRole($role);
            }
            if($permission->name == 'distributor-edit'){
                $permission->assignRole($role);
            }
            //product
            if($permission->name == 'product-list'){
                $permission->assignRole($role);
            }
            //orders
            if($permission->name == 'order-list'){
                $permission->assignRole($role);
            }
            if($permission->name == 'order-create'){
                $permission->assignRole($role);
            }
            if($permission->name == 'order-edit'){
                $permission->assignRole($role);
            }
            if($permission->name == 'order-delete'){
                $permission->assignRole($role);
            }
            //rewards
            if($permission->name == 'reward-list'){
                $permission->assignRole($role);
            }
            //point
            if($permission->name == 'point-create'){
                $permission->assignRole($role);
            }
            if($permission->name == 'point-edit'){
                $permission->assignRole($role);
            }
            //categories
            if($permission->name == 'categories-list'){
                $permission->assignRole($role);
            }
            //ranks
            if($permission->name == 'rank-list'){
                $permission->assignRole($role);
            }
            //redeems
            if($permission->name == 'redeem-list'){
                $permission->assignRole($role);
            }
            if($permission->name == 'redeem-create'){
                $permission->assignRole($role);
            }
        }
        $role = Role::create(['name' => 'sales']);
        foreach($permissions as $permission){
            if($permission->name == 'user-edit'){
                $permission->assignRole($role);
            }
            //product
            if($permission->name == 'product-list'){
                $permission->assignRole($role);
            }
            if($permission->name == 'product-create'){
                $permission->assignRole($role);
            }
            if($permission->name == 'product-edit'){
                $permission->assignRole($role);
            }
            if($permission->name == 'product-delete'){
                $permission->assignRole($role);
            }
            //orders
            if($permission->name == 'order-list'){
                $permission->assignRole($role);
            }
            if($permission->name == 'order-create'){
                $permission->assignRole($role);
            }
            if($permission->name == 'order-edit'){
                $permission->assignRole($role);
            }
            if($permission->name == 'order-delete'){
                $permission->assignRole($role);
            }
            //categories
            if($permission->name == 'categories-list'){
                $permission->assignRole($role);
            }
            if($permission->name == 'categories-create'){
                $permission->assignRole($role);
            }
            if($permission->name == 'categories-edit'){
                $permission->assignRole($role);
            }
            if($permission->name == 'categories-delete'){
                $permission->assignRole($role);
            }
            //point
            if($permission->name == 'point-list'){
                $permission->assignRole($role);
            }
            if($permission->name == 'point-create'){
                $permission->assignRole($role);
            }
            if($permission->name == 'point-edit'){
                $permission->assignRole($role);
            }
            if($permission->name == 'point-delete'){
                $permission->assignRole($role);
            }
            //sales
            if($permission->name == 'sales-list'){
                $permission->assignRole($role);
            }
            if($permission->name == 'sales-create'){
                $permission->assignRole($role);
            }
            if($permission->name == 'sales-edit'){
                $permission->assignRole($role);
            }
            if($permission->name == 'sales-delete'){
                $permission->assignRole($role);
            }
        }
        
    }
}
