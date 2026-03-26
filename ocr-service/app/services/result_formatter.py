from app.schemas.ocr import OcrPage, OcrResponse


def build_ocr_response(
    *,
    pages: list[OcrPage],
    engine: str,
    language: str,
    processing_ms: int,
) -> OcrResponse:
    full_text = "\n\n".join(page.text for page in pages if page.text).strip()

    return OcrResponse(
        success=True,
        engine=engine,
        language=language,
        pages=pages,
        full_text=full_text,
        processing_ms=processing_ms,
    )
