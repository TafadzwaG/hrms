<?php

namespace App\Http\Controllers;

use App\Support\Dashboard\RoleDashboardBuilder;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly RoleDashboardBuilder $builder,
    ) {
    }

    public function __invoke(): Response
    {
        $user = request()->user();
        $dashboard = $this->builder->build($user);

        return Inertia::render('Dashboard', [
            'dashboard' => $dashboard,
        ]);
    }
}
