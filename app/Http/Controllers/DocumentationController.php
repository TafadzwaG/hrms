<?php

namespace App\Http\Controllers;

use App\Support\Documentation\DocumentationRenderer;
use App\Support\Documentation\DocumentationCatalog;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class DocumentationController extends Controller
{
    public function index(DocumentationCatalog $catalog): Response
    {
        return Inertia::render('Documentation/Index', [
            'sections' => $catalog->sections(),
        ]);
    }

    public function show(string $section, string $slug, DocumentationCatalog $catalog, DocumentationRenderer $renderer): Response
    {
        $document = $catalog->find($section, $slug);

        abort_if(! $document, 404);

        $document['blocks'] = $renderer->renderBlocks($document['markdown']);

        return Inertia::render('Documentation/Show', [
            'document' => $document,
            'sections' => $catalog->sections(),
        ]);
    }

    public function download(string $section, string $slug, DocumentationCatalog $catalog, DocumentationRenderer $renderer): SymfonyResponse
    {
        $document = $catalog->find($section, $slug);

        abort_if(! $document, 404);

        $blocks = $renderer->renderBlocks($document['markdown']);

        $pdf = Pdf::loadView('documentation.pdf', [
            'document' => $document,
            'blocks' => $blocks,
        ])->setPaper('a4');

        return $pdf->download(str($document['slug'])->replace('-', '_')->append('.pdf')->toString());
    }
}
