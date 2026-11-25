# ml/train_model.py
import json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

print("🤖 Training SIDAS South India Disaster Risk Prediction Model...")

# 1. Generate Historical Dataset (1,200 South Indian Weather Records)
np.random.seed(42)
n_samples = 1200

# Feature Inputs:
# - rain_24h (mm)
# - rain_48h_cum (mm)
# - wind_speed (km/h)
# - temp_c (°C)
# - humidity (%)
# - elevation_m (meters)
# - coastal_dist_km (km)

rain_24h = np.random.exponential(scale=25, size=n_samples)
rain_48h = rain_24h * np.random.uniform(1.2, 2.5, size=n_samples)
wind_speed = np.random.weibull(a=1.5, size=n_samples) * 20
temp_c = np.random.normal(loc=32, scale=6, size=n_samples)
humidity = np.random.uniform(40, 98, size=n_samples)
elevation_m = np.random.choice([15, 45, 120, 450, 900, 1500], size=n_samples)
coastal_dist_km = np.random.uniform(2, 350, size=n_samples)

# Rule-based Target Classification: 0: Low, 1: Moderate (Yellow), 2: High (Orange), 3: Severe (Red)
labels = []
hazards = []

for i in range(n_samples):
    r24 = rain_24h[i]
    r48 = rain_48h[i]
    w = wind_speed[i]
    t = temp_c[i]
    elev = elevation_m[i]
    coast = coastal_dist_km[i]
    
    # Landslide Condition (High elevation + heavy rain)
    if elev > 600 and r48 > 140:
        labels.append(3) # Red
        hazards.append("Landslide")
    # Cyclone Condition (High wind + near coast)
    elif coast < 60 and w > 65:
        labels.append(3 if w > 90 else 2)
        hazards.append("Cyclone")
    # Flood Condition (Extreme rainfall)
    elif r24 > 110 or r48 > 180:
        labels.append(3 if r24 > 150 else 2)
        hazards.append("Flood")
    elif r24 > 50:
        labels.append(1) # Yellow
        hazards.append("Flood")
    # Heatwave Condition (High temp in AP/TS inland)
    elif t > 41 and coast > 100:
        labels.append(2 if t > 44 else 1)
        hazards.append("Heatwave")
    else:
        labels.append(0) # Green / Normal
        hazards.append("None")

df = pd.DataFrame({
    'rain_24h': rain_24h,
    'rain_48h': rain_48h,
    'wind_speed': wind_speed,
    'temp_c': temp_c,
    'humidity': humidity,
    'elevation_m': elevation_m,
    'coastal_dist_km': coastal_dist_km,
    'risk_level': labels,
    'hazard': hazards
})

# 2. Train Random Forest Model
X = df[['rain_24h', 'rain_48h', 'wind_speed', 'temp_c', 'humidity', 'elevation_m', 'coastal_dist_km']]
y = df['risk_level']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=20, max_depth=6, random_state=42)
clf.fit(X_train, y_train)

# Evaluation
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred, target_names=['Green', 'Yellow', 'Orange', 'Red']))

# 3. Export Trained Weights and Feature Importance to JSON
importances = dict(zip(X.columns, clf.feature_importances_.round(4)))

exported_model = {
    "model_name": "RandomForest_DisasterRisk_v1",
    "accuracy_score": float((y_pred == y_test).mean()),
    "feature_importances": importances,
    "classes": ["Green", "Yellow", "Orange", "Red"],
    "trees_count": len(clf.estimators_)
}

models_dir = Path(__file__).resolve().parent.parent / "server" / "models"
models_dir.mkdir(parents=True, exist_ok=True)
output_path = models_dir / "disaster_model.json"

with open(output_path, "w") as f:
    json.dump(exported_model, f, indent=2)

print(f"✅ Model trained and parameters saved to `{output_path}`!")
