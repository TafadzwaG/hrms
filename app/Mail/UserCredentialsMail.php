<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $plainPassword;
    public string $context; // 'created' | 'reset'

    public function __construct(User $user, string $plainPassword, string $context = 'created')
    {
        $this->user = $user;
        $this->plainPassword = $plainPassword;
        $this->context = $context;
    }

    public function build()
    {
        $appName = config('app.name', 'HRMS');
        $subject = $this->context === 'reset'
            ? "{$appName} - Your password has been updated"
            : "{$appName} - Your account has been created";

        return $this->subject($subject)
            ->view('emails.user-credentials')
            ->with([
                'user' => $this->user,
                'plainPassword' => $this->plainPassword,
                'context' => $this->context,
                'appName' => $appName,
                'loginUrl' => rtrim(config('app.url'), '/') . '/login',
            ]);
    }
}