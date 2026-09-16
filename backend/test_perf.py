import time
import json
import urllib.request
import concurrent.futures

url = 'http://127.0.0.1:8000/predict'
payload = json.dumps({
    'rainfall_mm': 0.0, 'rain_3d': 0.0, 'rain_5d': 0.0, 'rain_7d': 0.0, 'rain_15d': 0.0, 'rain_30d': 0.0,
    'rain_days_7d': 0.0, 'dry_days_7d': 0.0, 'rain_days_15d': 0.0, 'dry_days_15d': 0.0,
    'consecutive_dry_days': 0.0, 'u925': 0.0, 'v925': 0.0, 'speed925': 0.0, 'u850': 0.0, 'v850': 0.0,
    'speed850': 0.0, 'wind_shear': 0.0, 'rh925': 0.0, 'rh850': 0.0, 'dmi': 0.0, 'RMM1': 0.0,
    'RMM2': 0.0, 'phase': 0.0, 'amplitude': 0.0, 'oni': 0.0, 'day_of_year': 0.0, 'month': 0.0,
    'monsoon_day': 0.0, 'olr': 0.0, 'olr_3d_mean': 0.0, 'olr_5d_mean': 0.0, 'olr_climatology': 0.0,
    'olr_anomaly': 0.0
}).encode('utf-8')

req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})

def make_request():
    start = time.time()
    try:
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
    except Exception as e:
        status = 500
    return time.time() - start, status

# Warmup
make_request()

# Latency test
times = []
for _ in range(50):
    t, status = make_request()
    times.append(t)

print(f'Average latency: {sum(times)/len(times)*1000:.2f} ms')
print(f'Max latency: {max(times)*1000:.2f} ms')

# Concurrency test
start = time.time()
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    results = list(executor.map(lambda _: make_request(), range(100)))
total_time = time.time() - start

successes = sum(1 for t, s in results if s == 200)
print(f'Concurrency test (100 reqs, 20 workers): {total_time:.2f}s, {successes}/100 successes')
