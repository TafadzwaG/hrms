from io import BytesIO

from fastapi import HTTPException, UploadFile, status
from PIL import Image


async def load_upload_bytes(file: UploadFile) -> tuple[str, bytes]:
    payload = await file.read()

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Uploaded file is empty.",
        )

    filename = file.filename or "document"

    return filename, payload


def image_from_bytes(payload: bytes) -> Image.Image:
    return Image.open(BytesIO(payload)).convert("RGB")
