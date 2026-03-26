from collections.abc import Iterator
from io import BytesIO

import fitz
from PIL import Image


def pdf_to_images(payload: bytes) -> Iterator[Image.Image]:
    pdf = fitz.open(stream=payload, filetype="pdf")
    try:
        for page_index in range(pdf.page_count):
            page = pdf.load_page(page_index)
            pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            image = Image.open(BytesIO(pixmap.tobytes("png"))).convert("RGB")
            del pixmap
            yield image
    finally:
        pdf.close()
