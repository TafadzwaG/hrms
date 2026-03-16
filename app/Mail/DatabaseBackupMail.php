<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Support\Str;

class DatabaseBackupMail extends Mailable
{
    public function __construct(
        public string $systemName,
        public string $filename,
        public string $storageDisk,
        public string $storagePath,
        public int $size,
        public string $createdAt,
        public bool $includeAttachment = true,
        public ?string $subjectPrefix = null,
        public ?string $message = null,
    ) {
    }

    public function build(): static
    {
        $prefix = trim((string) $this->subjectPrefix);
        $prefix = $prefix !== '' ? $prefix.' ' : '';

        $subject = "{$prefix}{$this->systemName} Database Backup";

        $mail = $this->subject($subject)
            ->view('emails.database-backup')
            ->with([
                'systemName' => $this->systemName,
                'filename' => $this->filename,
                'size' => $this->size,
                'createdAt' => $this->createdAt,
                'messageBody' => $this->message,
                'attached' => $this->includeAttachment,
            ]);

        if ($this->includeAttachment && filled($this->storagePath)) {
            $mime = Str::endsWith($this->filename, '.zip')
                ? 'application/zip'
                : (Str::endsWith($this->filename, '.gz') ? 'application/gzip' : null);

            $mail->attachFromStorageDisk(
                $this->storageDisk,
                $this->storagePath,
                $this->filename,
                $mime ? ['mime' => $mime] : [],
            );
        }

        return $mail;
    }
}

