<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\PerformanceReview;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = (string) $request->input('status', 'all');

        $reviews = PerformanceReview::query()
            ->with(['employee:id,first_name,middle_name,surname,staff_number'])
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $builder) use ($search) {
                    $builder
                        ->where('cycle_name', 'like', "%{$search}%")
                        ->orWhere('reviewer_name', 'like', "%{$search}%")
                        ->orWhere('rating', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhere('comments', 'like', "%{$search}%")
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
            ->orderByDesc('review_date')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('PerformanceReviews/Index', [
            'reviews' => $reviews,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('PerformanceReviews/Create', [
            'employees' => $this->employees(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $review = PerformanceReview::create($validated);

        return redirect()
            ->route('performance-reviews.show', $review)
            ->with('success', 'Performance review created successfully.');
    }

    public function show(PerformanceReview $performanceReview): Response
    {
        $performanceReview->load(['employee:id,first_name,middle_name,surname,staff_number']);

        return Inertia::render('PerformanceReviews/Show', [
            'review' => $performanceReview,
        ]);
    }

    public function edit(PerformanceReview $performanceReview): Response
    {
        $performanceReview->load(['employee:id,first_name,middle_name,surname,staff_number']);

        return Inertia::render('PerformanceReviews/Edit', [
            'review' => $performanceReview,
            'employees' => $this->employees(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function update(Request $request, PerformanceReview $performanceReview): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $performanceReview->update($validated);

        return redirect()
            ->route('performance-reviews.show', $performanceReview)
            ->with('success', 'Performance review updated successfully.');
    }

    public function destroy(PerformanceReview $performanceReview): RedirectResponse
    {
        $performanceReview->delete();

        return redirect()
            ->route('performance-reviews.index')
            ->with('success', 'Performance review deleted successfully.');
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
            'cycle_name' => ['required', 'string', 'max:255'],
            'reviewer_name' => ['required', 'string', 'max:255'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'status' => ['required', 'in:pending,in_progress,completed,cancelled'],
            'review_date' => ['nullable', 'date'],
            'comments' => ['nullable', 'string'],
        ];
    }
}
