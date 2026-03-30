<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('documentation index loads for authenticated users', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/documentation')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Documentation/Index')
            ->has('sections.modules')
            ->has('sections.roles')
            ->has('sections.references')
        );
});

test('documentation show page loads a handbook document', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/documentation/modules/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Documentation/Show')
            ->where('document.section', 'modules')
            ->where('document.slug', 'dashboard')
            ->where('document.title', 'Dashboard')
            ->has('document.blocks')
            ->where('document.blocks.1.type', 'flowchart')
        );
});

test('documentation pdf downloads successfully', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/documentation/modules/dashboard/pdf')
        ->assertOk()
        ->assertHeader('content-type', 'application/pdf')
        ->assertDownload('dashboard.pdf');
});
