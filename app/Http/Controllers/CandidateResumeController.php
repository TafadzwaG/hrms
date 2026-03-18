<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use App\Models\CandidateResume;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CandidateResumeController extends Controller
{
    public function store(Request $request, CandidateProfile $candidate): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $file = $request->file('file');
        $filePath = $file->store("resumes/{$candidate->id}", 'public');

        $isFirst = $candidate->resumes()->count() === 0;

        $candidate->resumes()->create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'is_primary' => $isFirst,
            'uploaded_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Resume uploaded successfully.');
    }

    public function download(CandidateProfile $candidate, CandidateResume $resume)
    {
        abort_unless((int) $resume->candidate_profile_id === (int) $candidate->id, 404);

        $disk = Storage::disk('public');
        if ($disk->exists($resume->file_path)) {
            return $disk->download($resume->file_path, $resume->file_name);
        }

        return back()->with('error', 'The requested resume file could not be located.');
    }

    public function destroy(CandidateProfile $candidate, CandidateResume $resume): RedirectResponse
    {
        abort_unless((int) $resume->candidate_profile_id === (int) $candidate->id, 404);

        Storage::disk('public')->delete($resume->file_path);
        $resume->delete();

        return back()->with('success', 'Resume deleted successfully.');
    }

    public function setPrimary(CandidateProfile $candidate, CandidateResume $resume): RedirectResponse
    {
        abort_unless((int) $resume->candidate_profile_id === (int) $candidate->id, 404);

        $candidate->resumes()->update(['is_primary' => false]);
        $resume->update(['is_primary' => true]);

        return back()->with('success', 'Primary resume updated successfully.');
    }
}
