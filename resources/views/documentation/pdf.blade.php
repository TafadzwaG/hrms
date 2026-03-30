<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ $document['title'] }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #0f172a; font-size: 12px; line-height: 1.55; margin: 28px; }
        h1 { font-size: 24px; margin: 0 0 8px; }
        h2 { font-size: 18px; margin: 24px 0 10px; }
        h3 { font-size: 14px; margin: 18px 0 8px; }
        p { margin: 0 0 10px; color: #334155; }
        ul, ol { margin: 8px 0 12px 20px; color: #334155; }
        li { margin: 0 0 6px; }
        code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 11px; }
        pre { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        th, td { border-bottom: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
        th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #475569; }
        .meta { margin-bottom: 18px; padding: 12px 14px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; }
        .diagram { margin: 14px 0 20px; padding: 14px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff; }
        .diagram svg { width: 100%; height: auto; }
    </style>
</head>
<body>
    <div class="meta">
        <h1>{{ $document['title'] }}</h1>
        <p>{{ $document['summary'] }}</p>
        <p><strong>Source:</strong> {{ $document['path'] }}</p>
    </div>

    @foreach ($blocks as $block)
        @if ($block['type'] === 'markdown')
            {!! $block['html'] !!}
        @elseif ($block['type'] === 'flowchart')
            <div class="diagram">
                {!! $block['svg'] !!}
            </div>
        @endif
    @endforeach
</body>
</html>
