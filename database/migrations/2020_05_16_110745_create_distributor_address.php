<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDistributorAddress extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('distributor_address', function (Blueprint $table) {
            $table->bigIncrements('id');   
            $table->unsignedBigInteger('distributor_id');
            $table->unsignedBigInteger('address_id');
            $table->foreign('distributor_id')->references('id')->on('distributors');
            $table->foreign('address_id')->references('id')->on('address');

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
        Schema::dropIfExists('distributor_address');
    }
}
