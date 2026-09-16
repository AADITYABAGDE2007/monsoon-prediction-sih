import os
import json
import xgboost as xgb
import pandas as pd
from ..config import settings

FEATURES = [
    "rainfall_mm", "rain_3d", "rain_5d", "rain_7d", "rain_15d", "rain_30d",
    "rain_days_7d", "dry_days_7d", "rain_days_15d", "dry_days_15d", "consecutive_dry_days",
    "u925", "v925", "speed925", "u850", "v850", "speed850", "wind_shear",
    "rh925", "rh850", "dmi", "RMM1", "RMM2", "phase", "amplitude", "oni",
    "day_of_year", "month", "monsoon_day", "olr", "olr_3d_mean", "olr_5d_mean",
    "olr_climatology", "olr_anomaly"
]

class ModelService:
    def __init__(self):
        self.models = {}
        self.calibrators = {}
        self.thresholds = {
            "onset_7d": 0.21,
            "onset_14d": 0.25,
            "break_7d": 0.05,
            "break_14d": 0.12
        }
        self.models_loaded = False
        self.base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))

    def load_artifacts(self):
        model_files = {
            "onset_7d": "xgboost_onset_7d_baseline.json",
            "onset_14d": "xgboost_onset_14d_baseline.json",
            "break_7d": "xgboost_break_7d_baseline.json",
            "break_14d": "xgboost_break_14d_baseline.json"
        }
        
        calibrator_files = {
            "onset_7d": "onset_7d_isotonic.json",
            "onset_14d": "onset_14d_isotonic.json",
            "break_7d": "break_7d_isotonic.json",
            "break_14d": "break_14d_isotonic.json"
        }

        try:
            for key, filename in model_files.items():
                filepath = os.path.join(self.base_dir, settings.MODELS_DIR, filename)
                if not os.path.exists(filepath):
                    print(f"Warning: Model file not found at {filepath}")
                    return False
                
                model = xgb.Booster()
                model.load_model(filepath)
                
                if model.feature_names != FEATURES:
                    raise ValueError(f"Feature name mismatch in {filename}. Expected exactly {FEATURES}.")
                    
                self.models[key] = model

            for key, filename in calibrator_files.items():
                filepath = os.path.join(self.base_dir, settings.CALIBRATORS_DIR, filename)
                if not os.path.exists(filepath):
                    print(f"Warning: Calibrator file not found at {filepath}")
                    return False
                    
                with open(filepath, "r") as f:
                    self.calibrators[key] = json.load(f)
                    
            self.models_loaded = True
            return True
            
        except Exception as e:
            print(f"Error loading artifacts: {str(e)}")
            self.models_loaded = False
            return False

    def predict_all(self, feature_values: dict):
        # We can just reuse predict_batch
        return self.predict_batch([feature_values])[0]

    def predict_batch(self, features_list: list):
        if not self.models_loaded:
            raise RuntimeError("Models are not loaded.")
            
        import numpy as np
        
        # Ensure correct order for all rows
        ordered_values = [[row[f] for f in FEATURES] for row in features_list]
        
        # Create DMatrix for the entire batch
        dmatrix = xgb.DMatrix(ordered_values, feature_names=FEATURES)
        
        results = [{} for _ in range(len(features_list))]
        from ..calibration import calibrate
        from ..risk import categorize_risk

        for key in ["onset_7d", "onset_14d", "break_7d", "break_14d"]:
            raw_preds = self.models[key].predict(dmatrix)
            calibrator = self.calibrators[key]
            
            x_thresh = calibrator["x_thresholds"]
            y_thresh = calibrator["y_thresholds"]
            
            # Vectorized calibration
            calibrated_preds = np.interp(raw_preds, x_thresh, y_thresh)
            calibrated_preds = np.clip(calibrated_preds, 0.0, 1.0)
            
            threshold = self.thresholds[key]
            
            # Populate results
            for i in range(len(features_list)):
                raw = float(raw_preds[i])
                calib = float(calibrated_preds[i])
                alert = calib >= threshold
                risk = categorize_risk(calib)
                
                results[i][key] = {
                    "raw_score": raw,
                    "calibrated_score": calib,
                    "threshold": threshold,
                    "alert": alert,
                    "risk_category": risk
                }
                
        return results

model_service = ModelService()
