import numpy as np
from typing import List

def calibrate(raw_probability: float, x_thresholds: List[float], y_thresholds: List[float]) -> float:
    calibrated = np.interp(
        raw_probability,
        x_thresholds,
        y_thresholds
    )
    return float(np.clip(calibrated, 0.0, 1.0))
