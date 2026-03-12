<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('owner_employee_id');
            $table->unsignedBigInteger('document_type_id');

            $table->string('title')->nullable();
            $table->string('file_uri');
            $table->date('issue_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->json('metadata_json')->nullable();
            $table->string('access_policy', 32)->default('OWNER_AND_HR');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('owner_employee_id')
                ->references('id')->on('employees')
                ->onDelete('cascade')->onUpdate('cascade');

            $table->foreign('document_type_id')
                ->references('id')->on('document_types')
                ->onDelete('restrict')->onUpdate('cascade');

            $table->index(['owner_employee_id']);
            $table->index(['document_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};