<?php

namespace App\Http\Controllers\Employer;

use App\Http\Requests\Employer\ChangeSubscriptionRequest;
use App\Http\Requests\Employer\UpdateBillingProfileRequest;
use App\Models\CompanySubscription;
use App\Models\SubscriptionPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends BaseEmployerHubController
{
    public function edit(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $company->load([
            'billingProfile',
            'activeSubscription.plan',
            'subscriptions.plan',
            'invoices' => fn ($query) => $query->latest('issued_at'),
        ]);

        return Inertia::render('Employer/Billing', [
            'company' => $this->presenter->company($company),
            'billingProfile' => $this->presenter->billingProfile($company->billingProfile),
            'subscription' => $this->presenter->subscription($company->activeSubscription),
            'plans' => SubscriptionPlan::query()
                ->where('is_active', true)
                ->orderBy('price')
                ->get()
                ->map(fn ($plan) => $this->presenter->subscriptionPlan($plan))
                ->all(),
            'invoices' => $company->invoices->map(fn ($invoice) => $this->presenter->invoice($invoice))->all(),
        ]);
    }

    public function updateProfile(UpdateBillingProfileRequest $request): RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $company->billingProfile()->updateOrCreate(
            ['company_profile_id' => $company->id],
            $request->validated(),
        );

        return back()->with('success', 'Billing profile updated.');
    }

    public function changeSubscription(ChangeSubscriptionRequest $request): RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $plan = SubscriptionPlan::query()->findOrFail($request->integer('subscription_plan_id'));
        $activeSubscription = $company->activeSubscription;

        DB::transaction(function () use ($activeSubscription, $company, $plan, $request) {
            if ($activeSubscription) {
                $activeSubscription->update([
                    'status' => 'inactive',
                    'cancelled_at' => now(),
                ]);
            }

            CompanySubscription::query()->create([
                'company_profile_id' => $company->id,
                'subscription_plan_id' => $plan->id,
                'status' => 'active',
                'seats' => $request->integer('seats') ?: ($activeSubscription?->seats ?? 1),
                'amount' => $plan->price,
                'currency' => $plan->currency,
                'started_at' => now(),
                'renews_at' => now()->addMonth(),
                'metadata' => [
                    'source' => 'employer_hub',
                ],
            ]);
        });

        return back()->with('success', 'Subscription updated.');
    }
}
