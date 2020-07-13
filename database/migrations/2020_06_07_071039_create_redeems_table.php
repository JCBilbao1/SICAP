<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRedeemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('redeems', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('reward_id')->index();
            $table->foreign('reward_id')->references('id')->on('rewards');
            $table->unsignedBigInteger('point_id')->index();
            $table->foreign('point_id')->references('id')->on('points');
            $table->unsignedBigInteger('distributor_id')->index();
            $table->foreign('distributor_id')->references('id')->on('distributors');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('redeems');
    }
}
