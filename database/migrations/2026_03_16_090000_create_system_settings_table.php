<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->bigIncrements('id');

            // NOTE: `0` is used as the "global/system" scope so we can enforce uniqueness
            // across system settings on both MySQL and SQLite (tests).
            $table->unsignedBigInteger('organization_id')->default(0);

            $table->string('group', 64);
            $table->string('key', 128);
            $table->json('value')->nullable();
            $table->string('type', 32)->nullable();
            $table->boolean('is_public')->default(false);

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamps();

            $table->unique(['organization_id', 'group', 'key'], 'sysset_org_group_key_uq');
            $table->index(['organization_id', 'group'], 'sysset_org_group_idx');
            $table->index(['group', 'key'], 'sysset_group_key_idx');
            $table->index(['is_public'], 'sysset_public_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};

