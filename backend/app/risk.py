def categorize_risk(score: float) -> str:
    if score is None:
        return "UNKNOWN"
    if score < 0.10: return "VERY LOW"
    if score < 0.25: return "LOW"
    if score < 0.50: return "MODERATE"
    if score < 0.75: return "HIGH"
    return "VERY HIGH"
