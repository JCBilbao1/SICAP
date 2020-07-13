<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTablesAddSoftDeletesToTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('distributors', function (Blueprint $table) {
            $table->softDeletes('deleted_at', 0);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->softDeletes('deleted_at', 0);
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::table('distributors', function (Blueprint $table) {
            $table->softDeletes('deleted_at', 0);
        });
        Schema::table('products', function (Blueprint $table) {
            $table->softDeletes('deleted_at', 0);
        });

    }
}
