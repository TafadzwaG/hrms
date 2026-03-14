<?php

namespace App\Http\Controllers;

use App\Models\LearningCourse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LearningCourseController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = (string) $request->input('status', 'all');

        $courses = LearningCourse::query()
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $builder) use ($search) {
                    $builder
                        ->where('course_code', 'like', "%{$search}%")
                        ->orWhere('title', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%");
                });
            })
            ->when($status !== 'all', fn (Builder $query) => $query->where('status', $status))
            ->orderBy('title')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('LearningCourses/Index', [
            'courses' => $courses,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('LearningCourses/Create', [
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        $validated['compliance_required'] = $request->boolean('compliance_required');

        $course = LearningCourse::create($validated);

        return redirect()
            ->route('learning-courses.show', $course)
            ->with('success', 'Learning course created successfully.');
    }

    public function show(LearningCourse $learningCourse): Response
    {
        return Inertia::render('LearningCourses/Show', [
            'course' => $learningCourse,
        ]);
    }

    public function edit(LearningCourse $learningCourse): Response
    {
        return Inertia::render('LearningCourses/Edit', [
            'course' => $learningCourse,
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function update(Request $request, LearningCourse $learningCourse): RedirectResponse
    {
        $validated = $request->validate($this->rules($learningCourse));
        $validated['compliance_required'] = $request->boolean('compliance_required');

        $learningCourse->update($validated);

        return redirect()
            ->route('learning-courses.show', $learningCourse)
            ->with('success', 'Learning course updated successfully.');
    }

    public function destroy(LearningCourse $learningCourse): RedirectResponse
    {
        $learningCourse->delete();

        return redirect()
            ->route('learning-courses.index')
            ->with('success', 'Learning course deleted successfully.');
    }

    private function statusOptions(): array
    {
        return ['active', 'inactive', 'archived'];
    }

    private function rules(?LearningCourse $learningCourse = null): array
    {
        return [
            'course_code' => ['required', 'string', 'max:100', 'unique:learning_courses,course_code,'.($learningCourse?->id ?? 'NULL').',id'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'duration_hours' => ['required', 'numeric', 'min:0'],
            'compliance_required' => ['nullable', 'boolean'],
            'expires_after_days' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', 'in:active,inactive,archived'],
        ];
    }
}
