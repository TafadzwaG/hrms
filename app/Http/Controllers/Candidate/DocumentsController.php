<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Requests\Candidate\StoreCandidateDocumentRequest;
use App\Models\CandidateResume;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DocumentsController extends BaseCandidateHubController
{
    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        return Inertia::render('Candidate/Documents', [
            'candidate' => $this->presenter->profile($candidate),
            'documents' => $candidate->resumes()
                ->latest('uploaded_at')
                ->latest()
                ->get()
                ->map(fn ($document) => $this->presenter->document($document))
                ->all(),
            'documentTypes' => CandidateResume::DOCUMENT_TYPES,
        ]);
    }

    public function store(StoreCandidateDocumentRequest $request): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $file = $request->file('document');
        $storedName = Str::uuid()->toString().'_'.$file->getClientOriginalName();
        $path = $file->storeAs('candidate-documents/'.$candidate->id, $storedName, 'public');

        DB::transaction(function () use ($candidate, $file, $path, $request) {
            if ($request->boolean('is_primary') || ! $candidate->resumes()->exists()) {
                $candidate->resumes()->update(['is_primary' => false]);
            }

            $candidate->resumes()->create([
                'file_name' => $file->getClientOriginalName(),
                'document_type' => $request->validated('document_type'),
                'file_path' => $path,
                'description' => $request->validated('description'),
                'mime_type' => $file->getClientMimeType() ?? $file->getMimeType() ?? 'application/octet-stream',
                'size' => $file->getSize(),
                'is_primary' => $request->boolean('is_primary') || ! $candidate->resumes()->exists(),
                'uploaded_by' => $request->user()?->id,
                'uploaded_at' => now(),
            ]);
        });

        return back()->with('success', 'Document uploaded successfully.');
    }

    public function download(Request $request, int $document)
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $resume = $candidate->resumes()->findOrFail($document);

        if (Storage::disk('public')->exists($resume->file_path)) {
            return Storage::disk('public')->download($resume->file_path, $resume->file_name);
        }

        return response()->streamDownload(function () use ($resume) {
            echo 'Seeded document placeholder for '.$resume->file_name;
        }, $resume->file_name, [
            'Content-Type' => $resume->mime_type ?: 'text/plain',
        ]);
    }

    public function makePrimary(Request $request, int $document): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $resume = $candidate->resumes()->findOrFail($document);

        DB::transaction(function () use ($candidate, $resume) {
            $candidate->resumes()->update(['is_primary' => false]);
            $resume->update(['is_primary' => true]);
        });

        return back()->with('success', 'Primary document updated.');
    }

    public function destroy(Request $request, int $document): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $resume = $candidate->resumes()->findOrFail($document);
        $wasPrimary = (bool) $resume->is_primary;

        if ($resume->file_path && Storage::disk('public')->exists($resume->file_path)) {
            Storage::disk('public')->delete($resume->file_path);
        }

        $resume->delete();

        if ($wasPrimary) {
            $candidate->resumes()->latest('uploaded_at')->latest()->first()?->update(['is_primary' => true]);
        }

        return back()->with('success', 'Document deleted.');
    }
}
