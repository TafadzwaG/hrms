from pydantic import BaseModel, Field


class OcrLine(BaseModel):
    text: str = ""
    confidence: float | None = None
    bbox: list[int] = Field(default_factory=list)


class OcrPage(BaseModel):
    page: int
    text: str = ""
    confidence: float | None = None
    lines: list[OcrLine] = Field(default_factory=list)


class OcrResponse(BaseModel):
    success: bool = True
    engine: str
    language: str
    pages: list[OcrPage] = Field(default_factory=list)
    full_text: str = ""
    processing_ms: int
