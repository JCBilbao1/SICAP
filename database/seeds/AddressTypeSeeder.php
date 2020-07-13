<?php

use Illuminate\Database\Seeder;

class AddressTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $address_types = array(
            [
                'type' => 'shipping',
                'created_at' => date('Y:m:d H:m:s')
            ],
            [
                'type' => 'billing',
                'created_at' => date('Y:m:d H:m:s')
            ]
            );
        foreach($address_types as $address_type)
        DB::table('address_type')->insert($address_type);
    }
}
