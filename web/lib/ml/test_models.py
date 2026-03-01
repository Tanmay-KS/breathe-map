# test_models.py

import pandas as pd
import joblib

# ----------------------------
# 1. LOAD SAVED MODELS
# ----------------------------

aqi_model = joblib.load("aqi_model.pkl")
cluster_model = joblib.load("cluster_model.pkl")
cluster_scaler = joblib.load("cluster_scaler.pkl")

print("Models loaded successfully!")

# ----------------------------
# 2. CREATE NEW ZONE DATA
# (simulate backend input)
# ----------------------------

new_zone = {
    "trafficDensity": 70,
    "populationDensity": 60,
    "roadLength": 10,
    "temperature": 35,
    "humidity": 50,
    "timeOfDay": 18,
    "landUseType": "Commercial"
}

# Convert to DataFrame
zone_df = pd.DataFrame([new_zone])

# ----------------------------
# 3. PREPARE DATA FOR AQI MODEL
# ----------------------------

zone_df_encoded = pd.get_dummies(zone_df)

# IMPORTANT:
# Ensure same columns as training data
train_columns = joblib.load("aqi_model.pkl").feature_names_in_

for col in train_columns:
    if col not in zone_df_encoded:
        zone_df_encoded[col] = 0

zone_df_encoded = zone_df_encoded[train_columns]

# ----------------------------
# 4. PREDICT AQI
# ----------------------------

predicted_aqi = aqi_model.predict(zone_df_encoded)[0]

print("Predicted AQI:", round(predicted_aqi, 2))

# ----------------------------
# 5. PREPARE DATA FOR CLUSTERING
# ----------------------------

cluster_input = pd.DataFrame([{
    "AQI": predicted_aqi,
    "trafficDensity": new_zone["trafficDensity"],
    "populationDensity": new_zone["populationDensity"],
    "roadLength": new_zone["roadLength"]
}])

scaled_input = cluster_scaler.transform(cluster_input)

cluster_label = cluster_model.predict(scaled_input)[0]

print("Predicted Cluster:", cluster_label)