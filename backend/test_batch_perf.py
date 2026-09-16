import time
import json
import urllib.request
import concurrent.futures

url = 'http://127.0.0.1:8000/predict/batch'

# Generate 7123 rows
features = {
    'rainfall_mm': 0.0, 'rain_3d': 0.0, 'rain_5d': 0.0, 'rain_7d': 0.0, 'rain_15d': 0.0, 'rain_30d': 0.0,
    'rain_days_7d': 0.0, 'dry_days_7d': 0.0, 'rain_days_15d': 0.0, 'dry_days_15d': 0.0,
    'consecutive_dry_days': 0.0, 'u925': 0.0, 'v925': 0.0, 'speed925': 0.0, 'u850': 0.0, 'v850': 0.0,
    'speed850': 0.0, 'wind_shear': 0.0, 'rh925': 0.0, 'rh850': 0.0, 'dmi': 0.0, 'RMM1': 0.0,
    'RMM2': 0.0, 'phase': 0.0, 'amplitude': 0.0, 'oni': 0.0, 'day_of_year': 0.0, 'month': 0.0,
    'monsoon_day': 0.0, 'olr': 0.0, 'olr_3d_mean': 0.0, 'olr_5d_mean': 0.0, 'olr_climatology': 0.0,
    'olr_anomaly': 0.0
}

payload_100 = json.dumps({
    'block_ids': [f'block_{i}' for i in range(100)],
    'features': [features for _ in range(100)]
}).encode('utf-8')

payload_7123 = json.dumps({
    'block_ids': [f'block_{i}' for i in range(7123)],
    'features': [features for _ in range(7123)]
}).encode('utf-8')

def make_request(payload):
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    start = time.time()
    try:
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
    except Exception as e:
        status = 500
        print(e)
    return time.time() - start, status

# Warmup
make_request(payload_100)

# Latency test 100
t_100, s_100 = make_request(payload_100)
print(f'Batch 100 rows latency: {t_100*1000:.2f} ms')

# Latency test 7123
t_7123, s_7123 = make_request(payload_7123)
print(f'Batch 7123 rows latency: {t_7123*1000:.2f} ms')
