<?php

use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = array(
            [
                'slug' => 'uncategorized',
                'name' => 'Uncategorized',
                'description' => 'Product is uncategorized.',
                'created_at' => date('Y:m:d H:m:s'),
            ],
        );

        foreach($categories as $category){
            DB::table('categories')->insert($category);
        }
    }
}
