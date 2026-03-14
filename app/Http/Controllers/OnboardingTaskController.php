<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\OnboardingTask;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingTaskController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = (string) $request->input('status', 'all');

        $tasks = OnboardingTask::query()
            ->with([
                'employee:id,first_name,middle_name,surname,staff_number,user_id',
                'employee.user:id,email',
            ])
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $builder) use ($search) {
                    $builder
                        ->where('task_name', 'like', "%{$search}%")
                        ->orWhere('owner_team', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%")
                        ->orWhereHas('employee', function (Builder $employeeQuery) use ($search) {
                            $employeeQuery
                                ->where('first_name', 'like', "%{$search}%")
                                ->orWhere('middle_name', 'like', "%{$search}%")
                                ->orWhere('surname', 'like', "%{$search}%")
                                ->orWhere('staff_number', 'like', "%{$search}%");
                        })
                        ->orWhereHas('employee.user', function (Builder $userQuery) use ($search) {
                            $userQuery->where('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status !== 'all', fn (Builder $query) => $query->where('status', $status))
            ->orderBy('due_date')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('OnboardingTasks/Index', [
            'tasks' => $tasks,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('OnboardingTasks/Create', [
            'employees' => $this->employees(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $task = OnboardingTask::create($validated);

        return redirect()
            ->route('onboarding-tasks.show', $task)
            ->with('success', 'Onboarding task created successfully.');
    }

    public function show(OnboardingTask $onboardingTask): Response
    {
        $onboardingTask->load([
            'employee:id,first_name,middle_name,surname,staff_number,user_id',
            'employee.user:id,email',
        ]);

        return Inertia::render('OnboardingTasks/Show', [
            'task' => $onboardingTask,
        ]);
    }

    public function edit(OnboardingTask $onboardingTask): Response
    {
        $onboardingTask->load([
            'employee:id,first_name,middle_name,surname,staff_number,user_id',
            'employee.user:id,email',
        ]);

        return Inertia::render('OnboardingTasks/Edit', [
            'task' => $onboardingTask,
            'employees' => $this->employees(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function update(Request $request, OnboardingTask $onboardingTask): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $onboardingTask->update($validated);

        return redirect()
            ->route('onboarding-tasks.show', $onboardingTask)
            ->with('success', 'Onboarding task updated successfully.');
    }

    public function destroy(OnboardingTask $onboardingTask): RedirectResponse
    {
        $onboardingTask->delete();

        return redirect()
            ->route('onboarding-tasks.index')
            ->with('success', 'Onboarding task deleted successfully.');
    }

    private function employees()
    {
        return Employee::query()
            ->select('id', 'user_id', 'first_name', 'middle_name', 'surname', 'staff_number')
            ->with('user:id,email')
            ->orderBy('first_name')
            ->orderBy('surname')
            ->get();
    }

    private function statusOptions(): array
    {
        return ['pending', 'in_progress', 'completed', 'cancelled'];
    }

    private function rules(): array
    {
        return [
            'employee_id' => ['required', 'exists:employees,id'],
            'task_name' => ['required', 'string', 'max:255'],
            'owner_team' => ['required', 'string', 'max:255'],
            'due_date' => ['nullable', 'date'],
            'status' => ['required', 'in:pending,in_progress,completed,cancelled'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
