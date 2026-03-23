const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const API_KEY = process.env.NOWPAYMENTS_API_KEY;

app.get("/", (req, res) => {
  res.send("Crypto payments working");
});

app.post("/create-payment", async (req, res) => {
  try {
    const { price_amount, price_currency, order_id } = req.body;

    const response = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount,
        price_currency,
        order_id,
        ipn_callback_url: "https://crypto-payments-app-da3m.onrender.com/ipn",
        success_url: "https://atucha.shop",
        cancel_url: "https://atucha.shop"
      },
      {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      error: "Error creating payment",
      details: error.response?.data || error.message
    });
  }
});

app.post("/ipn", (req, res) => {
  console.log("NOWPayments IPN received:", req.body);
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
