from abc import ABC, abstractmethod
from functools import lru_cache
import json

import numpy as np
from paddleocr import PaddleOCR


class BaseOcrEngine(ABC):
    @abstractmethod
    def extract(self, image: np.ndarray, language: str, return_boxes: bool) -> dict:
        raise NotImplementedError


@lru_cache(maxsize=8)
def _build_paddle_client(language: str) -> PaddleOCR:
    try:
        return PaddleOCR(
            lang=(language or "en").strip() or "en",
            device="cpu",
            enable_hpi=False,
            enable_mkldnn=False,
            enable_cinn=False,
            cpu_threads=4,
            use_doc_orientation_classify=False,
            use_doc_unwarping=False,
            use_textline_orientation=False,
        )
    except Exception as exception:
        raise RuntimeError(
            f"Failed to initialize PaddleOCR for language '{language or 'en'}': {exception}"
        ) from exception


class PaddleOcrEngine(BaseOcrEngine):
    def extract(self, image: np.ndarray, language: str, return_boxes: bool) -> dict:
        try:
            prediction = _build_paddle_client(language).predict(image)
        except RuntimeError:
            raise
        except Exception as exception:
            raise RuntimeError(f"PaddleOCR inference failed: {exception}") from exception

        payload = self._normalize_prediction_payload(prediction)
        texts = [str(text).strip() for text in (payload.get("rec_texts") or []) if str(text).strip()]
        raw_scores = payload.get("rec_scores") or []
        raw_boxes = payload.get("dt_polys") or payload.get("rec_polys") or []
        lines: list[dict] = []
        confidences: list[float] = []

        for index, line_text in enumerate(texts):
            raw_score = raw_scores[index] if index < len(raw_scores) else None
            line_confidence = float(raw_score) if raw_score is not None else None
            raw_box = raw_boxes[index] if index < len(raw_boxes) else None

            if line_confidence is not None:
                confidences.append(line_confidence)

            line_payload = {
                "text": line_text,
                "confidence": round(line_confidence, 4) if line_confidence is not None else None,
                "bbox": normalize_bbox(raw_box) if return_boxes else [],
            }
            lines.append(line_payload)

        return {
            "text": "\n".join(texts).strip(),
            "confidence": round(sum(confidences) / len(confidences), 4) if confidences else None,
            "lines": lines,
        }

    def _normalize_prediction_payload(self, prediction: object) -> dict:
        if isinstance(prediction, list) and prediction:
            first = prediction[0]
        else:
            first = prediction

        if isinstance(first, dict):
            return first

        json_payload = getattr(first, "json", None)

        if isinstance(json_payload, dict):
            return json_payload

        if isinstance(json_payload, str):
            resolved = json.loads(json_payload)
            if isinstance(resolved, dict):
                return resolved

        if callable(json_payload):
            resolved = json_payload()
            if isinstance(resolved, dict):
                return resolved
            if isinstance(resolved, str):
                parsed = json.loads(resolved)
                if isinstance(parsed, dict):
                    return parsed

        raise RuntimeError(
            f"Unsupported PaddleOCR result payload: {type(first).__name__}"
        )


class OcrEngineRegistry:
    def __init__(self) -> None:
        self._engines = {
            "paddleocr": PaddleOcrEngine(),
        }

    def resolve(self, engine: str) -> BaseOcrEngine:
        key = (engine or "paddleocr").lower()

        if key not in self._engines:
            raise ValueError(f"Unsupported OCR engine: {engine}")

        return self._engines[key]


def normalize_bbox(raw_box: object) -> list[int]:
    if isinstance(raw_box, np.ndarray):
        raw_box = raw_box.tolist()

    if isinstance(raw_box, tuple):
        raw_box = list(raw_box)

    if not isinstance(raw_box, list) or not raw_box:
        return []

    points = [
        point
        for point in raw_box
        if isinstance(point, (list, tuple)) and len(point) >= 2
    ]

    if not points:
        return []

    xs = [float(point[0]) for point in points]
    ys = [float(point[1]) for point in points]

    return [
        int(round(min(xs))),
        int(round(min(ys))),
        int(round(max(xs))),
        int(round(max(ys))),
    ]


engine_registry = OcrEngineRegistry()
