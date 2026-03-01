# train_aqi_model.py

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# ----------------------------
# 1. CREATE SYNTHETIC DATASET
# ----------------------------

np.random.seed(42)

num_samples = 1000

trafficDensity = np.random.randint(0, 101, num_samples)
populationDensity = np.random.randint(0, 101, num_samples)
roadLength = np.random.uniform(1, 20, num_samples)
temperature = np.random.uniform(20, 45, num_samples)
humidity = np.random.uniform(30, 90, num_samples)
timeOfDay = np.random.randint(0, 24, num_samples)

landUseType = np.random.choice(
    ["Residential", "Commercial", "Industrial", "Green", "Mixed"],
    num_samples
)

# AQI formula (logical rule for realism)
aqi = (
    0.5 * trafficDensity +
    0.3 * populationDensity +
    5 * roadLength +
    0.2 * temperature -
    0.1 * humidity
)

# Industrial zones worse air
aqi += np.where(landUseType == "Industrial", 30, 0)

# Green zones better air
aqi -= np.where(landUseType == "Green", 20, 0)

# Add small noise
aqi += np.random.normal(0, 10, num_samples)

# Create DataFrame
data = pd.DataFrame({
    "trafficDensity": trafficDensity,
    "populationDensity": populationDensity,
    "roadLength": roadLength,
    "temperature": temperature,
    "humidity": humidity,
    "timeOfDay": timeOfDay,
    "landUseType": landUseType,
    "AQI": aqi
})

# Save dataset
data.to_csv("dataset.csv", index=False)

print("Dataset created successfully!")
# ----------------------------
# 2. PREPARE DATA
# ----------------------------

# Convert landUseType text into numeric columns
data = pd.get_dummies(data, columns=["landUseType"], drop_first=True)

# X = input features
X = data.drop("AQI", axis=1)

# y = target variable
y = data["AQI"]

# Split data into training and testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ----------------------------
# 3. TRAIN MODEL
# ----------------------------

model = LinearRegression()

# Train the model
model.fit(X_train, y_train)
# ----------------------------
# CROSS VALIDATION
# ----------------------------

cv_scores = cross_val_score(
    model,
    X,
    y,
    cv=5,
    scoring="r2"
)

print("\nCross Validation R2 Scores:", cv_scores)
print("Average CV R2:", round(cv_scores.mean(), 3))
# ----------------------------
# 4. EVALUATE MODEL
# ----------------------------

# Predict on test data
y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\nModel Evaluation:")
print("Mean Absolute Error:", round(mae, 2))
print("R2 Score:", round(r2, 2))

# ----------------------------
# 5. SAVE MODEL
# ----------------------------

joblib.dump(model, "aqi_model.pkl")

print("\nModel saved as aqi_model.pkl")

# ----------------------------
# 6. EXAMPLE PREDICTION
# ----------------------------

sample = X.iloc[0:1]
prediction = model.predict(sample)

print("Example Predicted AQI:", round(prediction[0], 2))