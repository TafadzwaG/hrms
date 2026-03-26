<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ocr_results', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('page_number');
            $table->longText('text')->nullable();
            $table->decimal('confidence', 5, 4)->nullable();
            $table->json('raw_json')->nullable();
            $table->timestamps();

            $table->unique(['document_id', 'page_number']);
            $table->index(['organization_id', 'document_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ocr_results');
    }
};
