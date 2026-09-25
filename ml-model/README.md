# Land Acquisition Delay Prediction — ML Model
**SIH26017 | Ministry of Rural Development**

## What's in this folder
- `data/land_acquisition_dataset.csv` — synthetic dataset (2000 projects) used to train the model, since no real dataset was provided by SIH
- `model_building.ipynb` — full notebook: data generation logic, EDA, model training, evaluation, explainability
- `delay_model.pkl` — final trained model, ready to load and use

## What's inside `delay_model.pkl`
A dictionary with 4 objects:
| Key | What it is |
|---|---|
| `classifier` | Random Forest — predicts `is_delayed` (True/False) |
| `regressor` | Random Forest — predicts `delay_probability` (0–100%) |
| `label_encoders` | Encoders for categorical columns — must be used before prediction |
| `feature_importance` | DataFrame ranking which features drive delay the most |

## How to load it
```python
import pickle

with open('delay_model.pkl', 'rb') as f:
    saved = pickle.load(f)

clf_model = saved['classifier']
reg_model = saved['regressor']
label_encoders = saved['label_encoders']
feature_importance = saved['feature_importance']