<?php

namespace App\Http\Controllers\Reports;

use App\Models\WorkflowDefinition;
use Illuminate\Http\Request;

class WorkflowDefinitionReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, WorkflowDefinition::class, 'workflow-definition-register', [
            'id', 'name', 'module', 'version', 'status', 'owner_id', 'created_at', 'updated_at',
        ]);
    }

    public function byModule(Request $request)
    {
        return $this->downloadGroupedCountReport($request, WorkflowDefinition::class, 'module', 'workflow-by-module');
    }

    public function byStatus(Request $request)
    {
        return $this->downloadGroupedCountReport($request, WorkflowDefinition::class, 'status', 'workflow-by-status');
    }

    public function byVersion(Request $request)
    {
        return $this->downloadGroupedCountReport($request, WorkflowDefinition::class, 'version', 'workflow-by-version');
    }

    public function byOwner(Request $request)
    {
        return $this->downloadGroupedCountReport($request, WorkflowDefinition::class, 'owner_id', 'workflow-by-owner');
    }

    public function updatedTrend(Request $request)
    {
        return $this->downloadDateTrendReport($request, WorkflowDefinition::class, 'updated_at', 'workflow-update-trend');
    }
}
