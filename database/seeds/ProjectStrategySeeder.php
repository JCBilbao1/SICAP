<?php

use Illuminate\Database\Seeder;
use App\Models\ProjectStrategy;

class ProjectStrategySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ProjectStrategy::insert([
            [
                'name' => 'Training Programs',
            ],
            [
                'name' => 'Technical Assistance and Advisory Services',
            ],
            [
                'name' => 'Communication/ Information Activities',
            ],
            [
                'name' => 'Community Outreach Activities',
            ],
            [
                'name' => 'Technology Transfer, Utilization and Commercialization',
            ],
        ]);
    }
}
