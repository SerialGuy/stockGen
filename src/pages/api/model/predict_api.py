from fastapi import FastAPI
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import yfinance as yf
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
import pandas.tseries.offsets as offsets

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load LSTM model
model = load_model("lstm_klse_model.h5", compile=False)
model.compile(optimizer='adam', loss='mean_squared_error')

@app.get("/predict")
def predict_next_30_days():
    try:
        # Download last 2 years of stock + KLSE index
        stock = yf.download("1155.KL", period="2y", interval="1d")
        index = yf.download("^KLSE", period="2y", interval="1d")

        # Extract Close prices and align by date
        stock_close = stock[['Close']].rename(columns={'Close': 'Stock_Close'})
        index_close = index[['Close']].rename(columns={'Close': 'KLSE_Close'})
        df = stock_close.join(index_close, how='inner').dropna()

        # Scale both columns together
        scaler = MinMaxScaler()
        scaled_data = scaler.fit_transform(df)

        # Use last 60 days as input sequence
        seq_len = 60
        input_seq = scaled_data[-seq_len:]

        # Predict next 30 days
        forecast_scaled = []
        current_input = input_seq.copy()

        for _ in range(30):
            prediction = model.predict(current_input.reshape(1, seq_len, 2), verbose=0)
            # Create next input: [predicted_stock_close, previous_KLSE_close]
            next_input = np.array([[prediction[0][0], current_input[-1][1]]])
            forecast_scaled.append(next_input[0])
            current_input = np.append(current_input[1:], next_input, axis=0)

        # Convert scaled forecast to original values
        forecast_scaled = np.array(forecast_scaled)
        padded_data = np.vstack([scaled_data, forecast_scaled])
        unscaled = scaler.inverse_transform(padded_data)

        # Extract only the forecast part (first column = stock price)
        forecast = unscaled[-30:, 0]

        # Get last 60 business days of actual data
        history = df[-60:]
        history_dates = history.index.strftime('%Y-%m-%d').tolist()
        history_prices = history['Stock_Close'].values.tolist()

        # Generate next 30 business days from the last date in df
        last_date = df.index[-1]
        future_dates = pd.bdate_range(last_date + timedelta(days=1), periods=30).strftime('%Y-%m-%d').tolist()

        return {
            "forecast": forecast.tolist(),
            "dates": future_dates,
            "history_dates": history_dates,
            "history_prices": history_prices
        }

    except Exception as e:
        return {"error": str(e)}
