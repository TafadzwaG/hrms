<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table): void {
            $table->string('ocr_status', 32)->nullable()->after('access_policy');
            $table->string('ocr_engine', 64)->nullable()->after('ocr_status');
            $table->string('ocr_language', 16)->nullable()->after('ocr_engine');
            $table->unsignedInteger('ocr_page_count')->nullable()->after('ocr_language');
            $table->decimal('ocr_avg_confidence', 5, 4)->nullable()->after('ocr_page_count');
            $table->text('ocr_error_message')->nullable()->after('ocr_avg_confidence');
            $table->timestamp('ocr_processed_at')->nullable()->after('ocr_error_message');
            $table->longText('ocr_full_text')->nullable()->after('ocr_processed_at');
            $table->json('ocr_raw_json')->nullable()->after('ocr_full_text');
            $table->json('ocr_metadata_json')->nullable()->after('ocr_raw_json');
            $table->index('ocr_status');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table): void {
            $table->dropIndex(['ocr_status']);
            $table->dropColumn([
                'ocr_status',
                'ocr_engine',
                'ocr_language',
                'ocr_page_count',
                'ocr_avg_confidence',
                'ocr_error_message',
                'ocr_processed_at',
                'ocr_full_text',
                'ocr_raw_json',
                'ocr_metadata_json',
            ]);
        });
    }
};
