<?php

use Illuminate\Database\Seeder;
use App\Models\ProjectArea;

class ProjectAreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ProjectArea::insert([
            [
                'name' => 'Kaalaman',
            ],
            [
                'name' => 'Kabuhayan',
            ],
            [
                'name' => 'Kalusugan',
            ],
            [
                'name' => 'Kalikasan',
            ],
            [
                'name' => 'Kahusayan sa Pamamahala',
            ],
        ]);
    }
}
