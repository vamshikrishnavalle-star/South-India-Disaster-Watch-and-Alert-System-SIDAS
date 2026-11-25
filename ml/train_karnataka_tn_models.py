# ml/train_karnataka_tn_models.py
import json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

print("🤖 Training Dedicated Models for Karnataka and Tamil Nadu...")

np.random.seed(42)
n_samples = 2000

# ==========================================
# 1. KARNATAKA DISASTER RISK MODEL
# ==========================================
# Features: rain_24h, rain_72h, reservoir_inflow_k_cusecs, elevation_m, urban_density
rain_24h_ka = np.random.exponential(scale=24, size=n_samples)
rain_72h_ka = rain_24h_ka * np.random.uniform(1.2, 2.7, size=n_samples)
reservoir_inflow_k_cusecs_ka = np.random.exponential(scale=120, size=n_samples) # e.g. Almatti / KRS
elevation_m_ka = np.random.choice([15, 650, 920, 1150, 1400], size=n_samples) # 1150+ = Kodagu/Charmadi Ghats
urban_density_ka = np.random.choice([0.1, 0.4, 0.9], size=n_samples) # 0.9 = Bengaluru BBMP

ka_labels = []
ka_hazards = []

for i in range(n_samples):
    r24 = rain_24h_ka[i]
    r72 = rain_72h_ka[i]
    inflow = reservoir_inflow_k_cusecs_ka[i]
    elev = elevation_m_ka[i]
    urban = urban_density_ka[i]
    
    # Highland Landslide / Ghat Flash Flood (Kodagu / Western Ghats)
    if elev > 900 and (r72 > 200 or r24 > 140):
        ka_labels.append(3) # Red
        ka_hazards.append("Landslide / Ghat Surge (Kodagu)")
    # Almatti / Krishna Mega Inflow Inundation
    elif inflow > 450 or (inflow > 300 and r72 > 150):
        ka_labels.append(3 if inflow > 500 else 2)
        ka_hazards.append("Riverine Deluge (Almatti/KRS)")
    # Bengaluru Urban Underpass Inundation
    elif urban > 0.8 and r24 > 90:
        ka_labels.append(3 if r24 > 130 else 2)
        ka_hazards.append("Urban Flood (Bengaluru Valley)")
    elif r24 > 50 or inflow > 200:
        ka_labels.append(1)
        ka_hazards.append("Localized Advisory")
    else:
        ka_labels.append(0)
        ka_hazards.append("Normal")

df_ka = pd.DataFrame({
    'rain_24h': rain_24h_ka,
    'rain_72h': rain_72h_ka,
    'reservoir_inflow_k_cusecs': reservoir_inflow_k_cusecs_ka,
    'elevation_m': elevation_m_ka,
    'urban_density': urban_density_ka,
    'severity': ka_labels
})

X_ka = df_ka[['rain_24h', 'rain_72h', 'reservoir_inflow_k_cusecs', 'elevation_m', 'urban_density']]
y_ka = df_ka['severity']
X_train_ka, X_test_ka, y_train_ka, y_test_ka = train_test_split(X_ka, y_ka, test_size=0.2, random_state=42)

rf_ka = RandomForestClassifier(n_estimators=30, max_depth=6, random_state=42)
rf_ka.fit(X_train_ka, y_train_ka)
acc_ka = rf_ka.score(X_test_ka, y_test_ka)
print(f"✅ Karnataka Model Accuracy: {acc_ka * 100:.2f}%")

ka_metadata = {
    "state": "Karnataka",
    "model_name": "karnataka_disaster_risk_scorer",
    "version": "v1.0",
    "accuracy": round(float(acc_ka), 4),
    "features": list(X_ka.columns),
    "feature_importances": {col: round(float(imp), 4) for col, imp in zip(X_ka.columns, rf_ka.feature_importances_)},
    "key_stations": [
        {"name": "Krishna Raja Sagara (KRS Dam)", "type": "Cauvery Dam Reservoir", "frl_ft": 124.8, "warning_cusecs": 80000, "danger_cusecs": 120000},
        {"name": "Bengaluru Urban (BBMP)", "type": "Urban Runoff Radar", "warning_mm": 65, "danger_mm": 130},
        {"name": "Almatti Dam (Bagalkote)", "type": "Upper Krishna Reservoir", "frl_m": 519.6, "danger_cusecs": 350000},
        {"name": "Bhagamandala (Kodagu)", "type": "Western Ghats Landslide Radar", "warning_mm": 120, "danger_mm": 200}
    ]
}

Path("server/models").mkdir(parents=True, exist_ok=True)
with open("server/models/karnataka_model.json", "w") as f:
    json.dump(ka_metadata, f, indent=2)


# ==========================================
# 2. TAMIL NADU DISASTER RISK MODEL
# ==========================================
# Features: rain_24h, northeast_monsoon_cum_mm, wind_gust_kmph, reservoir_release_cusecs, coastal_proximity_km
rain_24h_tn = np.random.exponential(scale=28, size=n_samples)
nem_cum_mm_tn = rain_24h_tn * np.random.uniform(1.4, 3.2, size=n_samples) # Northeast Monsoon cumulative
wind_gust_kmph_tn = np.random.weibull(a=1.4, size=n_samples) * 22
reservoir_release_cusecs_tn = np.random.exponential(scale=6500, size=n_samples) # Chembarambakkam / Mettur
coastal_proximity_km_tn = np.random.uniform(1, 240, size=n_samples)

tn_labels = []
tn_hazards = []

for i in range(n_samples):
    r24 = rain_24h_tn[i]
    nem = nem_cum_mm_tn[i]
    w = wind_gust_kmph_tn[i]
    rel = reservoir_release_cusecs_tn[i]
    coast = coastal_proximity_km_tn[i]
    
    # Chembarambakkam / Adyar River Catastrophic Flood (2015 Scenario)
    if rel > 22000 or (rel > 15000 and r24 > 150):
        tn_labels.append(3)
        tn_hazards.append("Catastrophic Dam Inundation (Adyar/Cauvery)")
    # Severe Cyclonic Landfall (Gaja / Michaung)
    elif coast < 60 and (w > 85 or (w > 65 and r24 > 120)):
        tn_labels.append(3 if w > 100 else 2)
        tn_hazards.append("Cyclone / Storm Surge")
    # Southern TN Cloudburst (Dec 2023 Scenario)
    elif r24 > 180 or nem > 350:
        tn_labels.append(3 if r24 > 250 else 2)
        tn_hazards.append("Extreme Monsoon Cloudburst")
    elif r24 > 60 or rel > 8000:
        tn_labels.append(1)
        tn_hazards.append("Heavy Rainfall Advisory")
    else:
        tn_labels.append(0)
        tn_hazards.append("Normal")

df_tn = pd.DataFrame({
    'rain_24h': rain_24h_tn,
    'nem_cum_mm': nem_cum_mm_tn,
    'wind_gust_kmph': wind_gust_kmph_tn,
    'reservoir_release_cusecs': reservoir_release_cusecs_tn,
    'coastal_proximity_km': coastal_proximity_km_tn,
    'severity': tn_labels
})

X_tn = df_tn[['rain_24h', 'nem_cum_mm', 'wind_gust_kmph', 'reservoir_release_cusecs', 'coastal_proximity_km']]
y_tn = df_tn['severity']
X_train_tn, X_test_tn, y_train_tn, y_test_tn = train_test_split(X_tn, y_tn, test_size=0.2, random_state=42)

rf_tn = RandomForestClassifier(n_estimators=30, max_depth=6, random_state=42)
rf_tn.fit(X_train_tn, y_train_tn)
acc_tn = rf_tn.score(X_test_tn, y_test_tn)
print(f"✅ Tamil Nadu Model Accuracy: {acc_tn * 100:.2f}%")

tn_metadata = {
    "state": "Tamil Nadu",
    "model_name": "tamil_nadu_disaster_risk_scorer",
    "version": "v1.0",
    "accuracy": round(float(acc_tn), 4),
    "features": list(X_tn.columns),
    "feature_importances": {col: round(float(imp), 4) for col, imp in zip(X_tn.columns, rf_tn.feature_importances_)},
    "key_stations": [
        {"name": "Chembarambakkam Reservoir (Adyar)", "type": "Urban Reservoir", "frl_ft": 24.0, "safe_discharge_cusecs": 8000, "danger_cusecs": 20000},
        {"name": "Mettur Dam (Stanley Reservoir)", "type": "Cauvery River Dam", "frl_ft": 120.0, "danger_inflow_cusecs": 150000},
        {"name": "Cuddalore / Delta Coast", "type": "Cyclone Radar", "warning_wind": 55, "danger_wind": 85},
        {"name": "Kayalpattinam / Thamirabarani", "type": "Extreme Cloudburst Radar", "warning_mm": 100, "danger_mm": 250}
    ]
}

with open("server/models/tamilnadu_model.json", "w") as f:
    json.dump(tn_metadata, f, indent=2)

print("🚀 Karnataka and Tamil Nadu Models trained and exported successfully!")
