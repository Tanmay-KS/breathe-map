# train_cluster_model.py

import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

# ----------------------------
# 1. LOAD DATA
# ----------------------------

data = pd.read_csv("dataset.csv")

# Select features for clustering
features = data[[
    "AQI",
    "trafficDensity",
    "populationDensity",
    "roadLength"
]]

# ----------------------------
# 2. SCALE FEATURES
# ----------------------------

scaler = StandardScaler()

scaled_features = scaler.fit_transform(features)

# ----------------------------
# 3. TRAIN KMEANS
# ----------------------------

kmeans = KMeans(n_clusters=3, random_state=42)

kmeans.fit(scaled_features)

# Assign cluster labels
data["Cluster"] = kmeans.labels_

print("Clustering complete!")

# ----------------------------
# 4. SAVE MODEL + SCALER
# ----------------------------

joblib.dump(kmeans, "cluster_model.pkl")
joblib.dump(scaler, "cluster_scaler.pkl")

print("Cluster model saved as cluster_model.pkl")
print("Scaler saved as cluster_scaler.pkl")

# ----------------------------
# 5. INTERPRET CLUSTERS
# ----------------------------

print("\nCluster Summary:")
print(data.groupby("Cluster")[[
    "AQI",
    "trafficDensity",
    "populationDensity",
    "roadLength"
]].mean())