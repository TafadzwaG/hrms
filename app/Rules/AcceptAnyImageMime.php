<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class AcceptAnyImageMime implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile) {
            $fail('The :attribute must be a valid uploaded file.');

            return;
        }

        $mimes = array_filter([
            $value->getMimeType(),
            $value->getClientMimeType(),
        ]);

        $isImage = collect($mimes)->contains(
            fn (mixed $mime) => is_string($mime) && Str::startsWith($mime, 'image/')
        );

        if (! $isImage) {
            $fail('The :attribute must be an image.');
        }
    }
}
