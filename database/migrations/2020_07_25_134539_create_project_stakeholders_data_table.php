<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectStakeholdersDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_stakeholders_data', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_stakeholder_id');
            $table->foreign('project_stakeholder_id')->references('id')->on('project_stakeholders')->onDelete('cascade');
            $table->text('stakeholder_field');
            $table->text('stakeholder_field_value');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('project_stakeholders_data');
    }
}
