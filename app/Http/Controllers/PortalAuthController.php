<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\User;
use App\Support\Auth\PortalAccessResolver;
use App\Support\Auth\PortalRegistrationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class PortalAuthController extends Controller
{
    public function __construct(
        private readonly PortalAccessResolver $resolver,
        private readonly PortalRegistrationService $registration,
    ) {
    }

    public function showLogin(Request $request): Response|RedirectResponse
    {
        if ($request->user()) {
            $this->resolver->ensureDerivedPortalAccesses($request->user());
            return redirect($this->resolver->defaultPortalRedirectPath($request->user()));
        }

        return Inertia::render('auth/login', [
            'status' => $request->session()->get('status'),
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'defaultPortal' => $this->resolver->normalizePortal($request->query('portal')),
        ]);
    }

    public function showRegister(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $availablePortals = $this->availablePortalsForRegistration($user);

        if ($user && $availablePortals === []) {
            return redirect($this->resolver->defaultPortalRedirectPath($user))
                ->with('success', 'All portal profiles are already configured for this account.');
        }

        $requestedPortal = $this->resolver->normalizePortal($request->query('portal'));
        $defaultPortal = $requestedPortal && in_array($requestedPortal, $availablePortals, true)
            ? $requestedPortal
            : (count($availablePortals) === 1 ? $availablePortals[0] : null);

        return Inertia::render('auth/register', [
            'availablePortals' => $availablePortals,
            'defaultPortal' => $defaultPortal,
            'setupMode' => (bool) $user,
            'initialValues' => $user ? [
                'name' => $user->name,
                'email' => $user->email,
            ] : null,
        ]);
    }

    public function register(Request $request): RedirectResponse
    {
        $user = $request->user();
        $availablePortals = $this->availablePortalsForRegistration($user);
        $portal = $this->resolver->normalizePortal($request->route('portal') ?? $request->input('portal'))
            ?? PortalAccessResolver::PORTAL_EMPLOYEE;

        if (! $portal || ! in_array($portal, $availablePortals, true)) {
            throw ValidationException::withMessages([
                'portal' => 'Select a valid portal for this account.',
            ]);
        }

        $payload = $this->validateRegistration($request, $availablePortals, (bool) $user);
        $payload['portal'] = $portal;

        if ($user) {
            $this->registration->addPortal($user, $payload);
            $request->session()->put('active_portal', $portal);

            return redirect($this->resolver->dashboardPathForPortal($portal))
                ->with('success', 'Portal access added successfully.');
        }

        $registeredUser = $this->registration->registerGuest($payload);
        Auth::login($registeredUser);
        $request->session()->regenerate();
        $request->session()->put('active_portal', $portal);

        $message = match ($portal) {
            PortalAccessResolver::PORTAL_CANDIDATE => 'Welcome. Your candidate profile has been created.',
            PortalAccessResolver::PORTAL_EMPLOYER => 'Welcome. Your company profile has been created.',
            default => 'Welcome. Your employee portal has been created.',
        };

        return redirect($this->resolver->dashboardPathForPortal($portal))
            ->with('success', $message);
    }

    public function switchPortal(Request $request, string $portal): RedirectResponse
    {
        $user = $request->user();
        $normalizedPortal = $this->resolver->normalizePortal($portal);

        if (! $user || ! $normalizedPortal || ! $this->resolver->hasPortalAccess($user, $normalizedPortal)) {
            abort(403);
        }

        $request->session()->put('active_portal', $normalizedPortal);

        return redirect($this->resolver->dashboardPathForPortal($normalizedPortal));
    }

    private function validateRegistration(Request $request, array $availablePortals, bool $setupMode): array
    {
        $normalizedPortal = $this->resolver->normalizePortal($request->route('portal') ?? $request->input('portal'))
            ?? PortalAccessResolver::PORTAL_EMPLOYEE;

        $rules = [
            'portal' => ['nullable', 'string', Rule::in($availablePortals)],
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                $setupMode
                    ? Rule::unique('users', 'email')->ignore($request->user()?->id)
                    : Rule::unique('users', 'email'),
            ],
        ];

        if (! $setupMode) {
            $rules['password'] = ['required', 'string', 'confirmed', Password::defaults()];
        }

        if ($normalizedPortal === PortalAccessResolver::PORTAL_CANDIDATE) {
            $rules = [
                ...$rules,
                'headline' => ['nullable', 'string', 'max:255'],
                'phone' => ['nullable', 'string', 'max:50'],
                'location' => ['nullable', 'string', 'max:255'],
                'years_experience' => ['nullable', 'integer', 'min:0', 'max:50'],
                'highest_education' => ['nullable', 'string', Rule::in(CandidateProfile::EDUCATION_LEVELS)],
                'cv' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            ];
        }

        if ($normalizedPortal === PortalAccessResolver::PORTAL_EMPLOYER) {
            $rules = [
                ...$rules,
                'company_name' => ['required', 'string', 'max:255'],
                'industry' => ['required', 'string', Rule::in(CompanyProfile::INDUSTRIES)],
                'registration_number' => ['nullable', 'string', 'max:100'],
                'company_email' => ['nullable', 'string', 'email', 'max:255'],
                'company_phone' => ['nullable', 'string', 'max:50'],
                'website' => ['nullable', 'string', 'url:http,https', 'max:500'],
            ];
        }

        return $request->validate($rules);
    }

    private function availablePortalsForRegistration(?User $user): array
    {
        if (! $user) {
            return PortalAccessResolver::PORTALS;
        }

        $this->resolver->ensureDerivedPortalAccesses($user);

        $existing = $this->resolver->availablePortals($user)->all();

        return array_values(array_diff(PortalAccessResolver::PORTALS, $existing));
    }
}
