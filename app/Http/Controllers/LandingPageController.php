<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use App\Services\Marketplace\ExchangeEngine;
use App\Support\Marketplace\PublicJobPresenter;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function __construct(
        private readonly ExchangeEngine $exchange,
        private readonly PublicJobPresenter $presenter,
    ) {
    }

    public function __invoke()
    {
        $featuredVacancies = $this->exchange->featuredVacancies()
            ->map(fn (Vacancy $vacancy) => $this->presenter->featured($vacancy))
            ->all();

        return Inertia::render('Landing', [
            'stats' => $this->exchange->publicStats(),
            'featuredVacancies' => $featuredVacancies,
        ]);
    }
}
