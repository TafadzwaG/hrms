<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\OffboardingTask;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OffboardingTaskController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = (string) $request->input('status', 'all');

        $tasks = OffboardingTask::query()
            ->with(['employee:id,first_name,middle_name,surname,staff_number'])
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
                        });
                });
            })
            ->when($status !== 'all', fn (Builder $query) => $query->where('status', $status))
            ->orderBy('due_date')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('OffboardingTasks/Index', [
            'tasks' => $tasks,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('OffboardingTasks/Create', [
            'employees' => $this->employees(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $task = OffboardingTask::create($validated);

        return redirect()
            ->route('offboarding-tasks.show', $task)
            ->with('success', 'Offboarding task created successfully.');
    }

    public function show(OffboardingTask $offboardingTask): Response
    {
        $offboardingTask->load(['employee:id,first_name,middle_name,surname,staff_number,email']);

        return Inertia::render('OffboardingTasks/Show', [
            'task' => $offboardingTask,
        ]);
    }

    public function edit(OffboardingTask $offboardingTask): Response
    {
        $offboardingTask->load(['employee:id,first_name,middle_name,surname,staff_number']);

        return Inertia::render('OffboardingTasks/Edit', [
            'task' => $offboardingTask,
            'employees' => $this->employees(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function update(Request $request, OffboardingTask $offboardingTask): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $offboardingTask->update($validated);

        return redirect()
            ->route('offboarding-tasks.show', $offboardingTask)
            ->with('success', 'Offboarding task updated successfully.');
    }

    public function destroy(OffboardingTask $offboardingTask): RedirectResponse
    {
        $offboardingTask->delete();

        return redirect()
            ->route('offboarding-tasks.index')
            ->with('success', 'Offboarding task deleted successfully.');
    }

    private function employees()
    {
        return Employee::query()
            ->select('id', 'first_name', 'middle_name', 'surname', 'staff_number')
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
