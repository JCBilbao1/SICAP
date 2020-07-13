<?php

use Illuminate\Database\Seeder;

class RankTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $ranks = array([
            'id'=> 1,
            'title' => 'Regional Distributors',
            'slug' => 'regional',
            'description' => '3 months consectutive 5,000 orders',
            'active' => true,
            'created_at'=> Date('Y-m-d H:m:s'),
        ],
        [
            'id'=> 2,
            'title' => 'City Distributors',
            'slug' => 'city',
            'description' => '3 months consectutive 1,000 orders',
            'active' => true,
            'created_at'=> Date('Y-m-d H:m:s'),
        ],
        [
            'id'=> 3,
            'title' => 'Provincial Distributors',
            'slug' => 'provincial',
            'description' => '',
            'active' => true,
            'created_at'=> Date('Y-m-d H:m:s'),
        ],
        [
            'id'=> 4,
            'title' => 'Resellers',
            'slug' => 'resellers',
            'description' => '',
            'active' => true,
            'created_at'=> Date('Y-m-d H:m:s'),
        ]);
        foreach($ranks as $rank){
            DB::table('ranks')->insert($rank);
        }
    }
}
