import cv2
import numpy as np
from PIL import Image


def preprocess_image(image: Image.Image) -> np.ndarray:
    rgb = np.array(image.convert("RGB"))
    return cv2.GaussianBlur(rgb, (3, 3), 0)
