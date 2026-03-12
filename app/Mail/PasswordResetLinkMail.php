<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetLinkMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public User $user;
    public string $resetUrl;

    public function __construct(User $user, string $resetUrl)
    {
        $this->user = $user;
        $this->resetUrl = $resetUrl;
    }

    public function build()
    {
        $appName = config('app.name', 'HRMS');

        return $this->subject("{$appName} - Reset your password")
            ->view('emails.password-reset-link')
            ->with([
                'user' => $this->user,
                'resetUrl' => $this->resetUrl,
                'appName' => $appName,
            ]);
    }
}