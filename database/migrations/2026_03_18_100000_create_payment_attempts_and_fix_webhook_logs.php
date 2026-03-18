<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments')->cascadeOnDelete();
            $table->string('provider', 50);
            $table->json('request_payload')->nullable();
            $table->json('response_payload')->nullable();
            $table->string('status', 50)->default('initiated');
            $table->timestamp('attempted_at')->nullable();
            $table->timestamps();

            $table->index('payment_id');
            $table->index('status');
        });

        Schema::table('payment_webhook_logs', function (Blueprint $table) {
            $table->string('event')->nullable()->after('provider_reference');
            $table->string('ip_address')->nullable()->after('event');
            $table->timestamp('received_at')->nullable()->after('processed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_attempts');

        Schema::table('payment_webhook_logs', function (Blueprint $table) {
            $table->dropColumn(['event', 'ip_address', 'received_at']);
        });
    }
};
