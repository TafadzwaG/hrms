<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('application_interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_application_id')->constrained('vacancy_applications')->cascadeOnDelete();
            $table->foreignId('company_profile_id')->constrained('company_profiles')->cascadeOnDelete();
            $table->foreignId('candidate_profile_id')->constrained('candidate_profiles')->cascadeOnDelete();
            $table->foreignId('vacancy_id')->constrained('vacancies')->cascadeOnDelete();
            $table->timestamp('scheduled_at');
            $table->timestamp('ends_at')->nullable();
            $table->string('timezone', 64)->default(config('app.timezone', 'UTC'));
            $table->string('meeting_type', 30)->default('video');
            $table->string('location')->nullable();
            $table->text('instructions')->nullable();
            $table->string('status', 30)->default('scheduled');
            $table->timestamp('responded_at')->nullable();
            $table->text('candidate_response_note')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['company_profile_id', 'scheduled_at']);
            $table->index(['candidate_profile_id', 'scheduled_at']);
            $table->index(['vacancy_id', 'scheduled_at']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_interviews');
    }
};
