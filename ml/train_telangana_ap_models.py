# ml/train_telangana_ap_models.py
import json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

print("🤖 Training Dedicated Models for Telangana and Andhra Pradesh...")

np.random.seed(42)
n_samples = 2000

# ==========================================
# 1. TELANGANA DISASTER RISK MODEL
# ==========================================
# Key Hazards: Urban Flooding (Hyderabad/Musi), Riverine Flooding (Bhadrachalam/Godavari), Severe Heatwaves (Ramagundam/Nalgonda)
rain_24h_ts = np.random.exponential(scale=22, size=n_samples)
rain_72h_ts = rain_24h_ts * np.random.uniform(1.3, 2.8, size=n_samples)
upstream_inflow_k_cusecs_ts = np.random.exponential(scale=180, size=n_samples) # e.g. Kaleshwaram / Sripada Yellampalli / Medigadda
temp_max_ts = np.random.normal(loc=35, scale=5.5, size=n_samples)
humidity_ts = np.random.uniform(30, 95, size=n_samples)
urban_density_factor_ts = np.random.choice([0.2, 0.5, 0.9], size=n_samples) # 0.9 = Core Hyderabad GHMC

ts_labels = [] # 0: Normal, 1: Moderate (Yellow), 2: High (Orange), 3: Severe (Red)
ts_hazards = []

for i in range(n_samples):
    r24 = rain_24h_ts[i]
    r72 = rain_72h_ts[i]
    inflow = upstream_inflow_k_cusecs_ts[i]
    t = temp_max_ts[i]
    urban = urban_density_factor_ts[i]
    
    # Bhadrachalam / Godavari Riverine Surge
    if inflow > 800 or (r72 > 200 and inflow > 500):
        ts_labels.append(3) # Red (Exceeds 53 ft 3rd Danger)
        ts_hazards.append("Riverine Flood (Godavari)")
    # Hyderabad Urban Flash Flood
    elif urban > 0.8 and r24 > 100:
        ts_labels.append(3 if r24 > 140 else 2)
        ts_hazards.append("Urban Flash Flood (Musi Basin)")
    elif r24 > 50 or inflow > 350:
        ts_labels.append(1)
        ts_hazards.append("Localized Inundation")
    # Severe Heatwave
    elif t > 43.5:
        ts_labels.append(3 if t > 46.0 else 2)
        ts_hazards.append("Severe Heatwave")
    elif t > 40.5:
        ts_labels.append(1)
        ts_hazards.append("Heatwave Warning")
    else:
        ts_labels.append(0)
        ts_hazards.append("Normal")

df_ts = pd.DataFrame({
    'rain_24h': rain_24h_ts,
    'rain_72h': rain_72h_ts,
    'upstream_inflow_k_cusecs': upstream_inflow_k_cusecs_ts,
    'temp_max': temp_max_ts,
    'humidity': humidity_ts,
    'urban_density': urban_density_factor_ts,
    'severity': ts_labels
})

X_ts = df_ts[['rain_24h', 'rain_72h', 'upstream_inflow_k_cusecs', 'temp_max', 'humidity', 'urban_density']]
y_ts = df_ts['severity']
X_train_ts, X_test_ts, y_train_ts, y_test_ts = train_test_split(X_ts, y_ts, test_size=0.2, random_state=42)

rf_ts = RandomForestClassifier(n_estimators=30, max_depth=6, random_state=42)
rf_ts.fit(X_train_ts, y_train_ts)
acc_ts = rf_ts.score(X_test_ts, y_test_ts)
print(f"✅ Telangana Model Accuracy: {acc_ts * 100:.2f}%")

ts_metadata = {
    "state": "Telangana",
    "model_name": "telangana_disaster_risk_scorer",
    "version": "v1.0",
    "accuracy": round(float(acc_ts), 4),
    "features": list(X_ts.columns),
    "feature_importances": {col: round(float(imp), 4) for col, imp in zip(X_ts.columns, rf_ts.feature_importances_)},
    "key_stations": [
        {"name": "Bhadrachalam (Godavari)", "type": "Riverine Gauge", "warning_ft": 43, "danger_ft": 48, "second_danger_ft": 53},
        {"name": "Hyderabad (Musi / GHMC)", "type": "Urban Runoff", "warning_mm": 50, "danger_mm": 115},
        {"name": "Ramagundam / Peddapalli", "type": "Heatwave Index", "warning_c": 41, "danger_c": 44}
    ]
}

Path("server/models").mkdir(parents=True, exist_ok=True)
with open("server/models/telangana_model.json", "w") as f:
    json.dump(ts_metadata, f, indent=2)


# ==========================================
# 2. ANDHRA PRADESH DISASTER RISK MODEL
# ==========================================
# Key Hazards: Coastal Cyclones (Vizag/Kakinada/Nellore), Delta Floods (Dowleswaram / Prakasam Barrage)
wind_speed_ap = np.random.weibull(a=1.4, size=n_samples) * 24
coastal_dist_km_ap = np.random.uniform(1, 200, size=n_samples)
rain_24h_ap = np.random.exponential(scale=26, size=n_samples)
barrage_discharge_lakh_cusecs_ap = np.random.exponential(scale=6.5, size=n_samples) # e.g. Dowleswaram Sir Arthur Cotton Barrage
sea_swell_m_ap = np.random.uniform(0.5, 5.5, size=n_samples)

ap_labels = []
ap_hazards = []

for i in range(n_samples):
    w = wind_speed_ap[i]
    coast = coastal_dist_km_ap[i]
    r24 = rain_24h_ap[i]
    discharge = barrage_discharge_lakh_cusecs_ap[i]
    swell = sea_swell_m_ap[i]
    
    # Severe Cyclonic Storm / Landfall
    if coast < 50 and (w > 85 or (w > 65 and swell > 3.5)):
        ap_labels.append(3 if w > 100 else 2)
        ap_hazards.append("Cyclone / Storm Surge")
    # Dowleswaram / Prakasam Mega Delta Discharge
    elif discharge > 17.5 or (discharge > 12.0 and r24 > 100): # 3rd warning level >17.75 lakh cusecs
        ap_labels.append(3)
        ap_hazards.append("Delta Flood (Dowleswaram/Prakasam)")
    elif discharge > 10.0 or r24 > 65:
        ap_labels.append(2 if discharge > 13.0 else 1)
        ap_hazards.append("Delta Warning Stage")
    elif coast < 80 and w > 50:
        ap_labels.append(1)
        ap_hazards.append("Squally Coastal Wind")
    else:
        ap_labels.append(0)
        ap_hazards.append("Normal")

df_ap = pd.DataFrame({
    'wind_speed': wind_speed_ap,
    'coastal_dist_km': coastal_dist_km_ap,
    'rain_24h': rain_24h_ap,
    'barrage_discharge_lakh_cusecs': barrage_discharge_lakh_cusecs_ap,
    'sea_swell_m': sea_swell_m_ap,
    'severity': ap_labels
})

X_ap = df_ap[['wind_speed', 'coastal_dist_km', 'rain_24h', 'barrage_discharge_lakh_cusecs', 'sea_swell_m']]
y_ap = df_ap['severity']
X_train_ap, X_test_ap, y_train_ap, y_test_ap = train_test_split(X_ap, y_ap, test_size=0.2, random_state=42)

rf_ap = RandomForestClassifier(n_estimators=30, max_depth=6, random_state=42)
rf_ap.fit(X_train_ap, y_train_ap)
acc_ap = rf_ap.score(X_test_ap, y_test_ap)
print(f"✅ Andhra Pradesh Model Accuracy: {acc_ap * 100:.2f}%")

ap_metadata = {
    "state": "Andhra Pradesh",
    "model_name": "andhra_pradesh_disaster_risk_scorer",
    "version": "v1.0",
    "accuracy": round(float(acc_ap), 4),
    "features": list(X_ap.columns),
    "feature_importances": {col: round(float(imp), 4) for col, imp in zip(X_ap.columns, rf_ap.feature_importances_)},
    "key_stations": [
        {"name": "Dowleswaram Barrage (Godavari)", "type": "Delta Barrage", "warning_level": "10.00 ft (1st Warning)", "danger_level": "13.75 ft (2nd Warning)", "hfl_level": "17.75 ft (3rd Warning / 25L Cusecs)"},
        {"name": "Prakasam Barrage (Krishna)", "type": "Delta Barrage", "warning_discharge": "3.97 Lakh Cusecs", "danger_discharge": "5.69 Lakh Cusecs"},
        {"name": "Visakhapatnam Coast", "type": "Cyclone Radar", "warning_wind": 50, "danger_wind": 85}
    ]
}

with open("server/models/andhra_model.json", "w") as f:
    json.dump(ap_metadata, f, indent=2)

print("🚀 Both State Models trained and exported successfully!")
