<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeScorecard;
use App\Models\EmployeeScorecardItem;
use App\Models\KpiLibrary;
use App\Models\PerformanceComment;
use App\Models\PerformanceCycle;
use App\Models\PerformanceEvidence;
use App\Models\ScorecardTemplate;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeScorecardController extends Controller
{
    // ── CRUD ─────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $cycleId = $request->input('cycle_id');
        $status = (string) $request->input('status', 'all');

        $scorecards = EmployeeScorecard::query()
            ->with([
                'employee:id,first_name,middle_name,surname,staff_number',
                'cycle:id,title',
            ])
            ->when($search !== '', function (Builder $q) use ($search) {
                $q->whereHas('employee', function (Builder $builder) use ($search) {
                    $builder
                        ->where('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('surname', 'like', "%{$search}%")
                        ->orWhere('staff_number', 'like', "%{$search}%");
                });
            })
            ->when($cycleId, fn (Builder $q) => $q->where('performance_cycle_id', $cycleId))
            ->when($status !== 'all', fn (Builder $q) => $q->where('status', $status))
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->paginate(15)
            ->through(fn (EmployeeScorecard $sc) => $this->mapScorecard($sc))
            ->withQueryString();

        $cycles = PerformanceCycle::query()
            ->select('id', 'title')
            ->orderByDesc('start_date')
            ->get();

        return Inertia::render('Performance/Scorecards/Index', [
            'scorecards' => $scorecards,
            'filters' => [
                'search' => $search,
                'cycle_id' => $cycleId,
                'status' => $status,
            ],
            'cycles' => $cycles,
            'statuses' => EmployeeScorecard::STATUSES,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Performance/Scorecards/Create', [
            'options' => $this->scorecardFormOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        $itemsData = $request->validate($this->itemRules());

        $scorecard = DB::transaction(function () use ($validated, $itemsData, $request) {
            $validated['created_by'] = $request->user()?->id;
            $validated['status'] = $validated['status'] ?? 'draft';

            $scorecard = EmployeeScorecard::create($validated);

            // If a template is provided and no items submitted, copy template items
            if (! empty($validated['scorecard_template_id']) && empty($itemsData['items'])) {
                $template = ScorecardTemplate::with('items')->find($validated['scorecard_template_id']);

                if ($template) {
                    foreach ($template->items as $templateItem) {
                        $scorecard->items()->create([
                            'kpi_library_id' => $templateItem->kpi_library_id,
                            'perspective' => $templateItem->perspective,
                            'objective' => $templateItem->objective,
                            'kpi_name' => $templateItem->kpi_name,
                            'target_type' => $templateItem->target_type,
                            'target_value' => $templateItem->target_value,
                            'weight' => $templateItem->weight,
                            'sort_order' => $templateItem->sort_order,
                        ]);
                    }
                }
            } elseif (! empty($itemsData['items'])) {
                foreach ($itemsData['items'] as $item) {
                    $scorecard->items()->create($item);
                }
            }

            return $scorecard;
        });

        return redirect()
            ->route('employee-scorecards.show', $scorecard)
            ->with('success', 'Employee scorecard created successfully.');
    }

    public function show(EmployeeScorecard $employeeScorecard): Response
    {
        $employeeScorecard->load([
            'items.kpi',
            'comments.user:id,name',
            'evidence',
            'improvementPlan',
            'employee:id,first_name,middle_name,surname,staff_number',
            'cycle:id,title,start_date,end_date,status',
        ]);

        // Calculate perspective breakdowns
        $perspectiveBreakdown = [];
        foreach (KpiLibrary::PERSPECTIVES as $perspective) {
            $items = $employeeScorecard->items->where('perspective', $perspective);
            $perspectiveBreakdown[$perspective] = [
                'items_count' => $items->count(),
                'total_weight' => $items->sum('weight'),
                'average_score' => $items->count() > 0 ? round((float) $items->avg('score'), 2) : 0,
            ];
        }

        return Inertia::render('Performance/Scorecards/Show', [
            'scorecard' => $employeeScorecard,
            'perspectiveBreakdown' => $perspectiveBreakdown,
            'ratingBands' => EmployeeScorecard::RATING_BANDS,
            'statuses' => EmployeeScorecard::STATUSES,
            'perspectives' => KpiLibrary::PERSPECTIVES,
            'targetTypes' => KpiLibrary::TARGET_TYPES,
            'commentTypes' => PerformanceComment::TYPES,
        ]);
    }

    public function edit(EmployeeScorecard $employeeScorecard): Response
    {
        $employeeScorecard->load(['items.kpi']);

        return Inertia::render('Performance/Scorecards/Edit', [
            'scorecard' => $employeeScorecard,
            'options' => $this->scorecardFormOptions(),
        ]);
    }

    public function update(Request $request, EmployeeScorecard $employeeScorecard): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        $itemsData = $request->validate($this->itemRules());

        DB::transaction(function () use ($employeeScorecard, $validated, $itemsData) {
            $employeeScorecard->update($validated);

            if (isset($itemsData['items'])) {
                $employeeScorecard->items()->delete();

                foreach ($itemsData['items'] as $item) {
                    $employeeScorecard->items()->create($item);
                }
            }
        });

        return redirect()
            ->route('employee-scorecards.show', $employeeScorecard)
            ->with('success', 'Employee scorecard updated successfully.');
    }

    public function destroy(EmployeeScorecard $employeeScorecard): RedirectResponse
    {
        if ($employeeScorecard->status !== 'draft') {
            return back()->with('error', 'Only draft scorecards can be deleted.');
        }

        DB::transaction(function () use ($employeeScorecard) {
            $employeeScorecard->items()->delete();
            $employeeScorecard->comments()->delete();

            // Delete evidence files
            foreach ($employeeScorecard->evidence as $evidence) {
                Storage::disk('public')->delete($evidence->file_path);
            }
            $employeeScorecard->evidence()->delete();

            $employeeScorecard->delete();
        });

        return redirect()
            ->route('employee-scorecards.index')
            ->with('success', 'Employee scorecard deleted successfully.');
    }

    // ── Workflow Actions ─────────────────────────────────────

    public function submitSelfAssessment(Request $request, EmployeeScorecard $employeeScorecard): RedirectResponse
    {
        $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:employee_scorecard_items,id'],
            'items.*.self_assessment_score' => ['required', 'numeric', 'min:0', 'max:100'],
            'items.*.self_assessment_comment' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($request, $employeeScorecard) {
            foreach ($request->input('items') as $itemData) {
                EmployeeScorecardItem::where('id', $itemData['id'])
                    ->where('employee_scorecard_id', $employeeScorecard->id)
                    ->update([
                        'self_assessment_score' => $itemData['self_assessment_score'],
                        'self_assessment_comment' => $itemData['self_assessment_comment'] ?? null,
                    ]);
            }

            $employeeScorecard->update([
                'status' => 'self_assessment_submitted',
                'self_assessment_completed_at' => now(),
            ]);
        });

        return back()->with('success', 'Self-assessment submitted successfully.');
    }

    public function submitManagerReview(Request $request, EmployeeScorecard $employeeScorecard): RedirectResponse
    {
        $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:employee_scorecard_items,id'],
            'items.*.manager_score' => ['required', 'numeric', 'min:0', 'max:100'],
            'items.*.manager_comment' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($request, $employeeScorecard) {
            foreach ($request->input('items') as $itemData) {
                $item = EmployeeScorecardItem::where('id', $itemData['id'])
                    ->where('employee_scorecard_id', $employeeScorecard->id)
                    ->first();

                if ($item) {
                    $item->update([
                        'manager_score' => $itemData['manager_score'],
                        'manager_comment' => $itemData['manager_comment'] ?? null,
                        'score' => $itemData['manager_score'],
                    ]);
                }
            }

            $employeeScorecard->load('items');
            $employeeScorecard->calculateOverallScore();

            $employeeScorecard->update([
                'status' => 'manager_reviewed',
                'manager_review_completed_at' => now(),
            ]);
        });

        return back()->with('success', 'Manager review submitted successfully.');
    }

    public function finalize(Request $request, EmployeeScorecard $employeeScorecard): RedirectResponse
    {
        $employeeScorecard->update([
            'status' => 'finalized',
            'finalized_at' => now(),
            'finalized_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Scorecard finalized successfully.');
    }

    // ── Evidence / Documents ─────────────────────────────────

    public function storeEvidence(Request $request, EmployeeScorecard $employeeScorecard): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:pdf,doc,docx,xls,xlsx,csv,jpg,jpeg,png,gif,txt'],
            'description' => ['nullable', 'string', 'max:500'],
            'employee_scorecard_item_id' => ['nullable', 'integer', 'exists:employee_scorecard_items,id'],
        ]);

        $file = $request->file('file');
        $filePath = $file->store("performance-evidence/{$employeeScorecard->id}", 'public');

        PerformanceEvidence::create([
            'employee_scorecard_id' => $employeeScorecard->id,
            'employee_scorecard_item_id' => $request->input('employee_scorecard_item_id'),
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'description' => $request->input('description'),
            'uploaded_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Evidence uploaded successfully.');
    }

    public function downloadEvidence(EmployeeScorecard $employeeScorecard, PerformanceEvidence $performanceEvidence)
    {
        abort_unless((int) $performanceEvidence->employee_scorecard_id === (int) $employeeScorecard->id, 404);

        $disk = Storage::disk('public');

        if ($disk->exists($performanceEvidence->file_path)) {
            return $disk->download($performanceEvidence->file_path, $performanceEvidence->file_name);
        }

        return back()->with('error', 'The requested evidence file could not be located.');
    }

    public function destroyEvidence(EmployeeScorecard $employeeScorecard, PerformanceEvidence $performanceEvidence): RedirectResponse
    {
        abort_unless((int) $performanceEvidence->employee_scorecard_id === (int) $employeeScorecard->id, 404);

        Storage::disk('public')->delete($performanceEvidence->file_path);
        $performanceEvidence->delete();

        return back()->with('success', 'Evidence deleted successfully.');
    }

    // ── Comments ─────────────────────────────────────────────

    public function storeComment(Request $request, EmployeeScorecard $employeeScorecard): RedirectResponse
    {
        $request->validate([
            'comment' => ['required', 'string'],
            'type' => ['required', 'in:' . implode(',', PerformanceComment::TYPES)],
        ]);

        PerformanceComment::create([
            'employee_scorecard_id' => $employeeScorecard->id,
            'user_id' => $request->user()?->id,
            'comment' => $request->input('comment'),
            'type' => $request->input('type'),
        ]);

        return back()->with('success', 'Comment added successfully.');
    }

    // ── Private Helpers ──────────────────────────────────────

    private function mapScorecard(EmployeeScorecard $scorecard): array
    {
        return [
            'id' => $scorecard->id,
            'status' => $scorecard->status,
            'overall_score' => $scorecard->overall_score,
            'overall_rating' => $scorecard->overall_rating,
            'employee' => $scorecard->employee ? [
                'id' => $scorecard->employee->id,
                'full_name' => $scorecard->employee->full_name,
                'staff_number' => $scorecard->employee->staff_number,
            ] : null,
            'cycle' => $scorecard->cycle ? [
                'id' => $scorecard->cycle->id,
                'title' => $scorecard->cycle->title,
            ] : null,
            'finalized_at' => $scorecard->finalized_at?->toDateTimeString(),
            'updated_at' => $scorecard->updated_at?->toDateTimeString(),
            'links' => [
                'show' => route('employee-scorecards.show', $scorecard, false),
                'edit' => route('employee-scorecards.edit', $scorecard, false),
            ],
        ];
    }

    private function scorecardFormOptions(): array
    {
        $employees = Employee::query()
            ->select('id', 'first_name', 'middle_name', 'surname', 'staff_number')
            ->orderBy('first_name')
            ->orderBy('surname')
            ->get();

        $cycles = PerformanceCycle::query()
            ->select('id', 'title', 'status')
            ->whereIn('status', ['active', 'review_in_progress'])
            ->orderByDesc('start_date')
            ->get();

        $templates = ScorecardTemplate::query()
            ->with('items')
            ->where('is_active', true)
            ->select('id', 'name', 'is_active')
            ->orderBy('name')
            ->get();

        return [
            'employees' => $employees,
            'cycles' => $cycles,
            'templates' => $templates,
            'perspectives' => KpiLibrary::PERSPECTIVES,
            'statuses' => EmployeeScorecard::STATUSES,
            'ratingBands' => EmployeeScorecard::RATING_BANDS,
            'targetTypes' => KpiLibrary::TARGET_TYPES,
        ];
    }

    private function rules(): array
    {
        return [
            'employee_id' => ['required', 'exists:employees,id'],
            'performance_cycle_id' => ['required', 'exists:performance_cycles,id'],
            'scorecard_template_id' => ['nullable', 'exists:scorecard_templates,id'],
            'status' => ['nullable', 'in:' . implode(',', EmployeeScorecard::STATUSES)],
            'notes' => ['nullable', 'string'],
        ];
    }

    private function itemRules(): array
    {
        return [
            'items' => ['nullable', 'array'],
            'items.*.perspective' => ['required', 'in:' . implode(',', KpiLibrary::PERSPECTIVES)],
            'items.*.objective' => ['required', 'string', 'max:500'],
            'items.*.kpi_name' => ['required', 'string', 'max:255'],
            'items.*.kpi_library_id' => ['nullable', 'exists:kpi_library,id'],
            'items.*.target_type' => ['required', 'in:' . implode(',', KpiLibrary::TARGET_TYPES)],
            'items.*.target_value' => ['nullable', 'numeric', 'min:0'],
            'items.*.weight' => ['required', 'numeric', 'min:0', 'max:100'],
            'items.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
