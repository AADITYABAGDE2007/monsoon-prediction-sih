# SIH26086 — Hyperlocal Monsoon Onset & Break Prediction System

## Scientific Forecast Report

**Forecast date:** 2025-09-30  
**Forecast coverage:** 2025-06-01 to 2025-09-30  
**Spatial unit:** Block  
**Forecast blocks:** 7,081  
**Forecast rows:** 863,882

---

## 1. System Overview

The production forecast pipeline converts the validated inference matrix
into block-level probabilistic onset and break forecasts.

The production sequence is:

1. Feature-contract validation
2. Frozen XGBoost inference
3. Raw model score generation
4. Frozen calibration
5. Calibration-domain monitoring
6. Production status assignment
7. Risk / alert decision layer
8. Block-level forecast product

The model and calibration artifacts are frozen for this forecast run.

---

## 2. Forecast Horizons

The system produces four forecast signals:

- Monsoon onset within 7 days
- Monsoon onset within 14 days
- Monsoon break within 7 days
- Monsoon break within 14 days

The reported probabilities are the calibrated outputs of the frozen
production calibration artifacts.

---

## 3. Latest Forecast Statistics

| Model | Minimum | Maximum | Mean | Median |
|---|---:|---:|---:|---:|
| onset_7d | 0.00% | 0.00% | 0.00% | 0.00% |
| onset_14d | 0.00% | 0.00% | 0.00% | 0.00% |
| break_7d | 0.00% | 0.00% | 0.00% | 0.00% |
| break_14d | 0.00% | 0.00% | 0.00% | 0.00% |

---

## 4. Calibration Status

Calibration status is reported explicitly for operational transparency.

The system does **not** alter, rescale, or artificially increase
probabilities when calibration warnings are present.

### Global calibration status

- **WARNING:** 7,081 blocks (100.00%)

### Scientific interpretation

A calibration warning means that the current forecast should be treated
with additional caution when interpreting its numerical probability.
It does not by itself prove that the underlying XGBoost model has failed.

---

## 5. Risk / Alert Layer

The risk layer derives operational decision scores from the existing
calibrated probabilities.

The combined monsoon risk is explicitly an **operational score** and
must not be interpreted as a calibrated probability.

### Latest alert distribution

- **GREEN:** 0 blocks (0.00%)
- **YELLOW:** 7,081 blocks (100.00%)
- **ORANGE:** 0 blocks (0.00%)
- **RED:** 0 blocks (0.00%)


### Forecast confidence

- **NORMAL:** 0 blocks (0.00%)
- **MODERATE:** 0 blocks (0.00%)
- **LOW:** 7,081 blocks (100.00%)

---

## 6. Operational Risk Statistics

- Mean onset risk score: **0.0000**
- Mean break risk score: **0.0000**
- Mean combined monsoon risk: **0.5500**
- Maximum combined monsoon risk: **0.5500**

---

## 7. Scientific Limitations

1. Forecast skill can vary spatially and temporally.
2. Calibration performance can change under distribution shift.
3. Operational decision scores are not probabilities.
4. Calibration warnings must be considered when interpreting the forecast.
5. The current forecast should not be treated as a replacement for official
   meteorological warnings or advisories.
6. A new calibrator should only be introduced after independent
   out-of-sample calibration data are available.
7. No probability rescaling was performed in this production run.

---

## 8. Model Integrity

The following were preserved during report generation:

- Frozen XGBoost models
- Frozen calibration artifacts
- Original calibrated probabilities
- Raw model scores
- Calibration status
- Model version
- Calibration version
- Production engine version

No retraining was performed.

No calibration artifact was replaced.

No probability manipulation was performed.

---

## 9. Artifact Lineage

### Production forecast

`forecast/production_engine/production_forecast_2025-09-30.parquet`

### Risk / alert forecast

`forecast/risk/risk_alert_forecast_2025-09-30.parquet`

### Scientific report

`forecast/reports/scientific_forecast_report_2025-09-30.md`

### Machine-readable report

`forecast/reports/scientific_forecast_report_2025-09-30.json`

### Model summary

`forecast/reports/scientific_model_summary_2025-09-30.csv`

### Block summary

`forecast/reports/scientific_block_summary_2025-09-30.csv`

---

## 10. Final Scientific Statement

This artifact represents the production output of the frozen SIH26086
forecast pipeline for the specified forecast period and block coverage.

The report preserves the distinction between:

- model probability,
- calibration status,
- operational risk score,
- alert level,
- forecast confidence.

This separation is intentional and is required for scientifically
transparent operational use.