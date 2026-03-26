import logging
from time import perf_counter

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.core.security import verify_service_token
from app.schemas.ocr import OcrResponse, OcrPage
from app.services.file_loader import image_from_bytes, load_upload_bytes
from app.services.image_preprocessor import preprocess_image
from app.services.ocr_engine import engine_registry
from app.services.pdf_converter import pdf_to_images
from app.services.result_formatter import build_ocr_response

router = APIRouter(dependencies=[Depends(verify_service_token)])
logger = logging.getLogger(__name__)


@router.post("/extract", response_model=OcrResponse)
async def extract(
    file: UploadFile = File(...),
    language: str = Form("en"),
    engine: str = Form("paddleocr"),
    return_boxes: bool = Form(False),
) -> OcrResponse:
    started = perf_counter()

    try:
        filename, file_bytes = await load_upload_bytes(file)
        file_name_lower = filename.lower()

        if file_name_lower.endswith(".pdf"):
            page_images = pdf_to_images(file_bytes)
        elif file_name_lower.endswith((".png", ".jpg", ".jpeg", ".webp")):
            page_images = [image_from_bytes(file_bytes)]
        else:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Unsupported file type. Upload PDF, PNG, JPG, JPEG, or WEBP.",
            )

        ocr_engine = engine_registry.resolve(engine)
        pages: list[OcrPage] = []

        for page_number, page_image in enumerate(page_images, start=1):
            processed_image = preprocess_image(page_image)
            page_result = ocr_engine.extract(
                image=processed_image,
                language=language,
                return_boxes=return_boxes,
            )
            pages.append(
                OcrPage(
                    page=page_number,
                    text=page_result["text"],
                    confidence=page_result["confidence"],
                    lines=page_result["lines"],
                )
            )

        processing_ms = int((perf_counter() - started) * 1000)

        return build_ocr_response(
            pages=pages,
            engine=engine,
            language=language,
            processing_ms=processing_ms,
        )
    except HTTPException:
        raise
    except ValueError as exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exception),
        ) from exception
    except Exception as exception:
        logger.exception("OCR extraction failed for %s", file.filename or "upload")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OCR extraction failed: {exception}",
        ) from exception
