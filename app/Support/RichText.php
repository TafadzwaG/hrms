<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;

class RichText
{
    private const ALLOWED_TAGS = [
        'p',
        'br',
        'ul',
        'ol',
        'li',
        'strong',
        'b',
        'em',
        'i',
        'u',
        'h3',
        'h4',
        'blockquote',
        'a',
    ];

    public static function sanitize(?string $html): string
    {
        $html = trim((string) $html);

        if ($html === '') {
            return '';
        }

        $document = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML(
            '<?xml encoding="utf-8" ?><div>'.$html.'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $root = $document->getElementsByTagName('div')->item(0);

        if (! $root instanceof DOMElement) {
            return '';
        }

        self::sanitizeChildren($root);

        return trim(self::innerHtml($root));
    }

    public static function plainText(?string $html): string
    {
        $html = self::sanitize($html);

        if ($html === '') {
            return '';
        }

        $normalized = preg_replace([
            '/<li[^>]*>/i',
            '/<br\s*\/?>/i',
            '/<\/(p|div|h[1-6]|blockquote|li)>/i',
        ], [
            '• ',
            "\n",
            "\n",
        ], $html);

        return trim(preg_replace('/\n{3,}/', "\n\n", html_entity_decode(strip_tags((string) $normalized), ENT_QUOTES | ENT_HTML5, 'UTF-8')) ?? '');
    }

    public static function bulletList(?string $html, array $fallback = [], int $limit = 5): array
    {
        $segments = collect(preg_split('/(?:\r\n|\r|\n|•|-|\d+\.)+/u', self::plainText($html)) ?: [])
            ->map(fn (string $segment) => trim($segment))
            ->filter();

        return $segments
            ->merge($fallback)
            ->map(fn (string $item) => trim($item))
            ->filter()
            ->unique()
            ->take($limit)
            ->values()
            ->all();
    }

    private static function sanitizeChildren(DOMNode $node): void
    {
        foreach (iterator_to_array($node->childNodes) as $child) {
            if ($child->nodeType === XML_COMMENT_NODE) {
                $node->removeChild($child);
                continue;
            }

            if ($child->nodeType !== XML_ELEMENT_NODE) {
                continue;
            }

            $tag = strtolower($child->nodeName);

            self::sanitizeChildren($child);

            if (! in_array($tag, self::ALLOWED_TAGS, true)) {
                self::unwrapNode($child);
                continue;
            }

            if ($child instanceof DOMElement) {
                self::sanitizeAttributes($child, $tag);
            }
        }
    }

    private static function sanitizeAttributes(DOMElement $element, string $tag): void
    {
        foreach (iterator_to_array($element->attributes) as $attribute) {
            $name = strtolower($attribute->nodeName);

            if ($tag === 'a' && $name === 'href') {
                continue;
            }

            $element->removeAttributeNode($attribute);
        }

        if ($tag !== 'a') {
            return;
        }

        $href = trim((string) $element->getAttribute('href'));

        if ($href === '' || ! preg_match('/^(https?:\/\/|mailto:|tel:|\/|#)/i', $href)) {
            $element->removeAttribute('href');
            return;
        }

        $element->setAttribute('href', $href);
        $element->setAttribute('target', '_blank');
        $element->setAttribute('rel', 'noopener noreferrer');
    }

    private static function unwrapNode(DOMNode $node): void
    {
        $parent = $node->parentNode;

        if (! $parent) {
            return;
        }

        while ($node->firstChild) {
            $parent->insertBefore($node->firstChild, $node);
        }

        $parent->removeChild($node);
    }

    private static function innerHtml(DOMNode $node): string
    {
        $html = '';

        foreach ($node->childNodes as $child) {
            $html .= $node->ownerDocument?->saveHTML($child) ?? '';
        }

        return $html;
    }
}
