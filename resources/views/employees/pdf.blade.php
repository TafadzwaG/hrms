@php
    $currentContract = $employee->currentContract;
    $physicalProfile = $employee->physicalProfile;
    $jobProfile = $employee->jobProfile;
    $primaryManager = $employee->manager ? trim($employee->manager->first_name.' '.$employee->manager->surname) : null;
    $initials = collect(preg_split('/\s+/', trim($employee->full_name)) ?: [])
        ->filter()
        ->take(2)
        ->map(fn (string $part) => strtoupper(mb_substr($part, 0, 1)))
        ->implode('');
    $brandName = strtoupper(config('app.name', 'Providence HRMS'));
    $logoLetter = strtoupper(mb_substr($brandName, 0, 1));
    $statusLabel = $employee->status ? str($employee->status)->replace('_', ' ')->headline()->toString() : 'Employee Record';
    $employmentLabel = $currentContract?->contract_type
        ? str($currentContract->contract_type)->replace('_', ' ')->headline()->toString()
        : ($jobProfile?->employment_type ? str($jobProfile->employment_type)->replace('_', ' ')->headline()->toString() : null);
    $recordCode = $employee->staff_number ?: 'EMP-'.$employee->id;
    $heroSubtitleParts = array_filter([
        $currentContract?->job_title ?: $employee->position?->name ?: $employee->occupation,
        $currentContract?->department?->name ?: $employee->orgUnit?->name,
    ]);
    $heroSubtitle = implode(' · ', $heroSubtitleParts);
    $formatDate = fn ($value, string $format = 'd M Y') => $value ? \Carbon\Carbon::parse($value)->format($format) : '—';
    $formatMoney = fn ($amount, ?string $currency = null) => $amount !== null && $amount !== ''
        ? trim(($currency ?: 'USD').' '.number_format((float) $amount, 2))
        : '—';
    $display = fn ($value, string $fallback = '—') => filled($value) ? $value : $fallback;
    $emptyClass = fn ($value) => filled($value) ? '' : ' empty';
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Employee Profile — {{ $employee->full_name }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page { margin: 34px; }

        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 10px;
            color: #1e293b;
            background: #ffffff;
            line-height: 1.5;
            padding: 18px;
        }

        .page-border {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            pointer-events: none;
        }

        .header {
            display: table;
            width: 100%;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 18px;
            margin-bottom: 24px;
        }

        .header-left,
        .header-right {
            display: table-cell;
            vertical-align: top;
        }

        .header-right {
            width: 200px;
            text-align: right;
        }

        .brand-container {
            display: table;
        }

        .logo-box,
        .brand-text {
            display: table-cell;
            vertical-align: middle;
        }

        .logo-box {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: #0f172a;
            color: #ffffff;
            text-align: center;
            font-size: 18px;
            font-weight: 800;
            line-height: 40px;
        }

        .brand-text {
            padding-left: 12px;
        }

        .brand-text h1 {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            letter-spacing: -0.02em;
        }

        .brand-text p {
            font-size: 9px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .doc-info h2 {
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
        }

        .doc-info p {
            font-size: 8px;
            color: #94a3b8;
            font-weight: 600;
            text-transform: uppercase;
        }

        .hero {
            width: 100%;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            background: #f8fafc;
            padding: 24px;
            margin-bottom: 24px;
        }

        .hero-table {
            display: table;
            width: 100%;
        }

        .avatar-cell,
        .hero-details {
            display: table-cell;
            vertical-align: top;
        }

        .avatar-cell {
            width: 76px;
        }

        .avatar-container {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #e2e8f0;
            border: 2px solid #ffffff;
            color: #475569;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            line-height: 56px;
        }

        .hero-details h3 {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
        }

        .hero-sub {
            font-size: 11px;
            color: #64748b;
            margin-top: 2px;
            font-weight: 500;
        }

        .badge-row {
            margin-top: 10px;
        }

        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.02em;
            margin-right: 6px;
        }

        .badge-active { background: #dcfce7; color: #166534; }
        .badge-position { background: #dbeafe; color: #1e40af; }
        .badge-id {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
            font-family: DejaVu Sans Mono, monospace;
        }
        .badge-muted { background: #fef3c7; color: #92400e; }

        .section {
            margin-bottom: 20px;
        }

        .section-header {
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid #f1f5f9;
        }

        .section-header span {
            font-size: 9px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .grid {
            display: table;
            width: 100%;
            table-layout: fixed;
        }

        .grid-column {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            padding-right: 8px;
        }

        .grid-column:last-child {
            padding-right: 0;
            padding-left: 8px;
        }

        .info-item {
            margin-bottom: 10px;
        }

        .info-label {
            font-size: 8px;
            font-weight: 600;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 2px;
        }

        .info-value {
            font-size: 10.5px;
            font-weight: 500;
            color: #1e293b;
        }

        .info-value.empty {
            color: #cbd5e1;
            font-style: italic;
        }

        .info-value.long-text {
            font-weight: 400;
            line-height: 1.6;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
        }

        th {
            text-align: left;
            padding: 8px;
            background: #f8fafc;
            font-size: 8px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border: 1px solid #e2e8f0;
        }

        td {
            padding: 8px;
            font-size: 10px;
            color: #334155;
            border: 1px solid #e2e8f0;
            vertical-align: top;
        }

        tr:nth-child(even) {
            background: #fafafa;
        }

        .progress-container {
            width: 100px;
            height: 4px;
            background: #e2e8f0;
            border-radius: 2px;
            margin-top: 4px;
        }

        .progress-bar {
            height: 100%;
            background: #0f172a;
            border-radius: 2px;
        }

        .subsection-title {
            font-size: 8px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin: 12px 0 6px;
        }

        .empty-state {
            font-size: 10px;
            color: #94a3b8;
            font-style: italic;
            padding: 4px 0;
        }

        .text-mono {
            font-family: DejaVu Sans Mono, monospace;
            font-size: 9px;
        }

        .page-break {
            page-break-before: always;
        }

        .footer {
            margin-top: 40px;
            padding-top: 12px;
            border-top: 1px solid #f1f5f9;
            display: table;
            width: 100%;
            font-size: 8px;
            color: #94a3b8;
            font-weight: 500;
        }

        .footer-left,
        .footer-right {
            display: table-cell;
        }

        .footer-right {
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="page-border"></div>
    <div class="header">
        <div class="header-left">
            <div class="brand-container">
                <div class="logo-box">{{ $logoLetter }}</div>
                <div class="brand-text">
                    <h1>{{ $brandName }}</h1>
                    <p>Enterprise Human Capital Management</p>
                </div>
            </div>
        </div>
        <div class="header-right doc-info">
            <h2>Official Employee Record</h2>
            <p>Generated: {{ now()->format('d M Y · H:i') }} · Confidential</p>
            <p>Prepared by {{ auth()->user()?->name ?? 'System' }}</p>
        </div>
    </div>

    <div class="hero">
        <div class="hero-table">
            <div class="avatar-cell">
                <div class="avatar-container">{{ $initials !== '' ? $initials : 'EM' }}</div>
            </div>
            <div class="hero-details">
                <h3>{{ $employee->full_name }}</h3>
                <p class="hero-sub">{{ $heroSubtitle !== '' ? $heroSubtitle : 'Employee profile record' }}</p>
                <div class="badge-row">
                    <span class="badge badge-active">{{ $statusLabel }}</span>
                    @if($employmentLabel)
                        <span class="badge badge-position">{{ $employmentLabel }}</span>
                    @endif
                    <span class="badge badge-id">{{ $recordCode }}</span>
                    @if($currentContract?->status)
                        <span class="badge badge-muted">{{ str($currentContract->status)->replace('_', ' ')->headline()->toString() }}</span>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-header"><span>01 · Personal Information</span></div>
        <div class="grid">
            <div class="grid-column">
                <div class="info-item">
                    <p class="info-label">Full Name</p>
                    <p class="info-value">{{ $employee->full_name }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Date of Birth</p>
                    <p class="info-value{{ $emptyClass($employee->date_of_birth) }}">
                        @if($employee->date_of_birth)
                            {{ $formatDate($employee->date_of_birth) }} (Age {{ \Carbon\Carbon::parse($employee->date_of_birth)->age }})
                        @else
                            Not provided
                        @endif
                    </p>
                </div>
                <div class="info-item">
                    <p class="info-label">Gender</p>
                    <p class="info-value{{ $emptyClass($employee->gender) }}">{{ $display($employee->gender, 'Not provided') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Marital Status</p>
                    <p class="info-value{{ $emptyClass($employee->marital_status) }}">{{ $display($employee->marital_status, 'Not provided') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Nationality</p>
                    <p class="info-value{{ $emptyClass($employee->nationality) }}">{{ $display($employee->nationality, 'Not provided') }}</p>
                </div>
            </div>
            <div class="grid-column">
                <div class="info-item">
                    <p class="info-label">National ID</p>
                    <p class="info-value{{ $emptyClass($employee->national_id) }} text-mono">{{ $display($employee->national_id, 'Not provided') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Email Address</p>
                    <p class="info-value{{ $emptyClass($employee->email ?: $employee->user?->email) }}">{{ $display($employee->email ?: $employee->user?->email, 'Not provided') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Contact Number</p>
                    <p class="info-value{{ $emptyClass($employee->contact_number) }}">{{ $display($employee->contact_number, 'Not provided') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Alternate Contact</p>
                    <p class="info-value{{ $emptyClass($employee->alt_phone_number) }}">{{ $display($employee->alt_phone_number, 'Not provided') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Educational Level</p>
                    <p class="info-value{{ $emptyClass($employee->educational_level) }}">{{ $display($employee->educational_level, 'Not provided') }}</p>
                </div>
            </div>
        </div>
        <div class="info-item">
            <p class="info-label">Address</p>
            <p class="info-value{{ $emptyClass($employee->address) }}">{{ $display($employee->address, 'Not provided') }}</p>
        </div>
    </div>

    <div class="section">
        <div class="section-header"><span>02 · Employment Details</span></div>
        <div class="grid">
            <div class="grid-column">
                <div class="info-item">
                    <p class="info-label">Primary Designation</p>
                    <p class="info-value">{{ $display($currentContract?->job_title ?: $employee->position?->name ?: $employee->occupation, 'Not specified') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Department / Unit</p>
                    <p class="info-value">{{ $display($currentContract?->department?->name ?: $employee->orgUnit?->name, 'Not assigned') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Hire Date</p>
                    <p class="info-value{{ $emptyClass($employee->hire_date) }}">{{ $employee->hire_date ? $formatDate($employee->hire_date) : 'Not provided' }}</p>
                </div>
            </div>
            <div class="grid-column">
                <div class="info-item">
                    <p class="info-label">Reporting Manager</p>
                    <p class="info-value{{ $emptyClass($primaryManager) }}">{{ $display($primaryManager, 'Not assigned') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Pay Point</p>
                    <p class="info-value{{ $emptyClass($currentContract?->pay_point ?: $employee->pay_point) }}">{{ $display($currentContract?->pay_point ?: $employee->pay_point, 'Not assigned') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Status</p>
                    <p class="info-value">{{ $statusLabel }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-header"><span>03 · Active Contract Terms</span></div>
        @if($currentContract)
            <table>
                <thead>
                    <tr>
                        <th>Contract #</th>
                        <th>Type</th>
                        <th>Salary (Base)</th>
                        <th>Effective Date</th>
                        <th>Expiry Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-mono">{{ $display($currentContract->contract_number, '—') }}</td>
                        <td>{{ $display(str($currentContract->contract_type)->replace('_', ' ')->headline()->toString(), '—') }}</td>
                        <td>{{ $formatMoney($currentContract->basic_salary, $currentContract->currency) }}</td>
                        <td>{{ $formatDate($currentContract->start_date) }}</td>
                        <td>{{ $formatDate($currentContract->end_date) }}</td>
                    </tr>
                </tbody>
            </table>
        @else
            <p class="empty-state">No active contract is recorded.</p>
        @endif
    </div>

    <div class="section">
        <div class="section-header"><span>04 · Next of Kin & Family</span></div>
        @if($employee->nextOfKin->isNotEmpty())
            <table>
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Relationship</th>
                        <th>Contact Info</th>
                        <th>Primary</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($employee->nextOfKin as $kin)
                        <tr>
                            <td>{{ $kin->full_name }}</td>
                            <td>{{ $kin->relationship }}</td>
                            <td>{{ $display($kin->contact_number, 'N/A') }}</td>
                            <td>{{ $kin->is_primary ? 'Yes' : 'No' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="empty-state">No next of kin or dependants recorded.</p>
        @endif
    </div>

    <div class="page-break"></div>

    <div class="section">
        <div class="section-header"><span>05 · Skills & Certifications</span></div>
        @if($employee->skills->isNotEmpty())
            <table>
                <thead>
                    <tr>
                        <th>Competency</th>
                        <th>Proficiency</th>
                        <th>Certification</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($employee->skills as $skill)
                        <tr>
                            <td>{{ $skill->name }}</td>
                            <td>
                                {{ $skill->proficiency_percent !== null ? $skill->proficiency_percent.'%' : $display($skill->proficiency_level, '—') }}
                                @if($skill->proficiency_percent !== null)
                                    <div class="progress-container">
                                        <div class="progress-bar" style="width: {{ min((float) $skill->proficiency_percent, 100) }}%"></div>
                                    </div>
                                @endif
                            </td>
                            <td>{{ $display($skill->certification_name, '—') }}</td>
                            <td>{{ $skill->expires_at ? 'Expires '.$formatDate($skill->expires_at) : 'Verified' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="empty-state">No skills or certifications recorded.</p>
        @endif
    </div>

    <div class="section">
        <div class="section-header"><span>06 · Performance KPI Snapshot</span></div>
        @if($employee->kpis->isNotEmpty())
            <table>
                <thead>
                    <tr>
                        <th>Target Metric</th>
                        <th>Goal</th>
                        <th>Progress</th>
                        <th>Due Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($employee->kpis as $kpi)
                        <tr>
                            <td>{{ $kpi->title }}</td>
                            <td>{{ $display($kpi->target_value, '—') }}</td>
                            <td>
                                {{ $kpi->progress_percent !== null ? $kpi->progress_percent.'%' : '—' }}
                                @if($kpi->progress_percent !== null)
                                    <div class="progress-container">
                                        <div class="progress-bar" style="width: {{ min((float) $kpi->progress_percent, 100) }}%"></div>
                                    </div>
                                @endif
                            </td>
                            <td>{{ $formatDate($kpi->due_date) }}</td>
                            <td>{{ $kpi->status ? str($kpi->status)->replace('_', ' ')->headline()->toString() : '—' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="empty-state">No KPI records available.</p>
        @endif

        @if($employee->scorecards->isNotEmpty())
            <div class="subsection-title">Recent scorecards</div>
            <table>
                <thead>
                    <tr>
                        <th>Cycle</th>
                        <th>Status</th>
                        <th>Overall Score</th>
                        <th>Rating</th>
                        <th>Finalized</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($employee->scorecards->take(5) as $scorecard)
                        <tr>
                            <td>{{ $display($scorecard->cycle?->title, '—') }}</td>
                            <td>{{ $scorecard->status ? str($scorecard->status)->replace('_', ' ')->headline()->toString() : '—' }}</td>
                            <td>{{ $display($scorecard->overall_score, '—') }}</td>
                            <td>{{ $display($scorecard->overall_rating, '—') }}</td>
                            <td>{{ $formatDate($scorecard->finalized_at) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>

    <div class="section">
        <div class="section-header"><span>07 · Benefit Enrollments</span></div>
        @if($employee->benefitEnrollments->isNotEmpty())
            <table>
                <thead>
                    <tr>
                        <th>Benefit</th>
                        <th>Plan</th>
                        <th>Status</th>
                        <th>Effective Date</th>
                        <th>Employee Contribution</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($employee->benefitEnrollments as $enrollment)
                        <tr>
                            <td>{{ $display($enrollment->benefit?->name, '—') }}</td>
                            <td>{{ $display($enrollment->benefitPlan?->name, '—') }}</td>
                            <td>{{ $enrollment->status ? str($enrollment->status)->replace('_', ' ')->headline()->toString() : '—' }}</td>
                            <td>{{ $formatDate($enrollment->effective_date) }}</td>
                            <td>{{ $enrollment->employee_contribution !== null ? number_format((float) $enrollment->employee_contribution, 2) : '—' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="empty-state">No benefit enrollments recorded.</p>
        @endif
    </div>

    <div class="section">
        <div class="section-header"><span>08 · Assigned Assets</span></div>
        @if($employee->assetAssignments->isNotEmpty())
            <table>
                <thead>
                    <tr>
                        <th>Asset Tag</th>
                        <th>Device Name</th>
                        <th>Condition</th>
                        <th>Assigned Date</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($employee->assetAssignments as $assignment)
                        <tr>
                            <td class="text-mono">{{ $display($assignment->asset?->asset_tag, '—') }}</td>
                            <td>{{ $display($assignment->asset?->name, '—') }}</td>
                            <td>{{ $display($assignment->condition_on_assignment ?: $assignment->asset?->status, '—') }}</td>
                            <td>{{ $formatDate($assignment->assigned_at) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="empty-state">No assigned assets recorded.</p>
        @endif
    </div>

    <div class="section">
        <div class="section-header"><span>09 · Physical Profile & System Access</span></div>
        <div class="grid">
            <div class="grid-column">
                <div class="info-item">
                    <p class="info-label">Blood Type</p>
                    <p class="info-value{{ $emptyClass($physicalProfile?->blood_type) }}">{{ $display($physicalProfile?->blood_type, 'Not provided') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Uniform Size</p>
                    <p class="info-value{{ $emptyClass($physicalProfile?->uniform_size) }}">{{ $display($physicalProfile?->uniform_size, 'Not provided') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Shirt / Trouser / Shoe</p>
                    @php
                        $sizes = array_filter([$physicalProfile?->shirt_size, $physicalProfile?->trouser_size, $physicalProfile?->shoe_size]);
                    @endphp
                    <p class="info-value{{ empty($sizes) ? ' empty' : '' }}">{{ ! empty($sizes) ? implode(' / ', $sizes) : 'Not provided' }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Medical Notes</p>
                    <p class="info-value long-text{{ $emptyClass($physicalProfile?->emergency_medical_notes) }}">{{ $display($physicalProfile?->emergency_medical_notes, 'No medical notes recorded') }}</p>
                </div>
            </div>
            <div class="grid-column">
                <div class="info-item">
                    <p class="info-label">System Account</p>
                    <p class="info-value{{ $emptyClass($employee->user?->name) }}">{{ $display($employee->user?->name, 'No linked user account') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Account Email</p>
                    <p class="info-value{{ $emptyClass($employee->user?->email) }}">{{ $display($employee->user?->email, 'Not available') }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">Roles</p>
                    <p class="info-value{{ $employee->user && $employee->user->roles->isNotEmpty() ? '' : ' empty' }}">
                        @if($employee->user && $employee->user->roles->isNotEmpty())
                            {{ $employee->user->roles->pluck('name')->implode(', ') }}
                        @else
                            No roles assigned
                        @endif
                    </p>
                </div>
                <div class="info-item">
                    <p class="info-label">Job Profile Summary</p>
                    <p class="info-value long-text{{ $emptyClass($jobProfile?->summary) }}">{{ $display($jobProfile?->summary, 'No job profile summary recorded') }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-left">{{ $brandName }} · Employee Profile Export · {{ $recordCode }}</div>
        <div class="footer-right">Internal Use Only · Data Privacy Protected</div>
    </div>
</body>
</html>