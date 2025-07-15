import numpy as np
import pandas as pd
import yfinance as yf
from fastapi import FastAPI
from pydantic import BaseModel
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import joblib
import ta
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="KLSE LSTM V2 Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1️⃣ Load model and scaler
model = load_model("lstm_klse_advanced_v2.h5", compile=False)
scaler = joblib.load("klse_scaler_v2.pkl")

# 2️⃣ Features used during training
features = ['Stock_Close', 'KLSE_Close', 'RSI', 'MACD', 'SMA', 'EMA', 'Stock_Volume']

def prepare_data():
    stock = yf.download("1155.KL", period="1y", interval="1d")
    index = yf.download("^KLSE", period="1y", interval="1d")

    if isinstance(stock.columns, pd.MultiIndex):
        stock.columns = [col[0] for col in stock.columns]
    if isinstance(index.columns, pd.MultiIndex):
        index.columns = [col[0] for col in index.columns]

    df = pd.DataFrame({
        'Stock_Close': stock['Close'],
        'Stock_Volume': stock['Volume'],
        'KLSE_Close': index['Close']
    })

    df['RSI'] = ta.momentum.RSIIndicator(df['Stock_Close'], window=14).rsi()
    df['MACD'] = ta.trend.MACD(df['Stock_Close']).macd()
    df['SMA'] = ta.trend.SMAIndicator(df['Stock_Close'], window=14).sma_indicator()
    df['EMA'] = ta.trend.EMAIndicator(df['Stock_Close'], window=14).ema_indicator()
    df.dropna(inplace=True)

    return df

@app.get("/predict")
def predict_next_10_days():
    df = prepare_data()
    scaled_data = scaler.transform(df[features])

    window = scaled_data[-60:]
    predictions = []

    for _ in range(10):
        input_seq = np.array([window])
        scaled_pred = model.predict(input_seq, verbose=0)
        padded = np.hstack([scaled_pred, np.zeros((1, len(features) - 1))])
        pred_price = scaler.inverse_transform(padded)[0][0]
        predictions.append(round(pred_price, 2))

        # simulate appending predicted row to window for next prediction
        next_row = np.hstack([scaled_pred[0], np.mean(window[:, 1:], axis=0)])
        window = np.vstack([window[1:], next_row])

    # Get last 60 business days of actual data
    history = df[-60:]
    history_dates = history.index.strftime('%Y-%m-%d').tolist()
    history_prices = history['Stock_Close'].values.tolist()

    # Generate next 10 business days from the last date in df
    from datetime import timedelta
    import pandas as pd
    last_date = df.index[-1]
    future_dates = pd.bdate_range(last_date + timedelta(days=1), periods=10).strftime('%Y-%m-%d').tolist()

    return {
        "forecast": predictions,
        "dates": future_dates,
        "history_dates": history_dates,
        "history_prices": history_prices
    }
