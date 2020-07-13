<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $order_statuses = array(
            [
                'slug' => 'created',
                'name' => 'ORDER CREATED',
                'description' => 'Order has been created.',
            ],
            [
                'slug' => 'confirmed',
                'name' => 'ORDER CONFIRMED',
                'description' => 'We have confirmed your order and will process it soon.',
            ],
            [
                'slug' => 'on-process',
                'name' => 'ORDER ON PROCESS',
                'description' => 'We are now processing your order.',
            ],
            [
                'slug' => 'delivered',
                'name' => 'ORDER DELIVERED',
                'description' => 'Order has been delivered. Thanks for your order.',
            ],
            [
                'slug' => 'cancelled',
                'name' => 'ORDER CANCELLED',
                'description' => 'Order has been cancelled.',
            ],
            [
                'slug' => 'reserved',
                'name' => 'ORDER RESERVED',
                'description' => 'Order has been placed as reserved.',
            ]
        );

        foreach($order_statuses as $order_status){
            DB::table('order_status')->insert($order_status);
        }
    }
}
