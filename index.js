const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const API_KEY = process.env.NOWPAYMENTS_API_KEY;

app.post("/create-payment", async (req, res) => {
  try {
    const { price_amount, price_currency } = req.body;

    const response = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount,
        price_currency
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
    res.status(500).send("Error creating payment");
  }
});

app.get("/", (req, res) => {
  res.send("Crypto payments working");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
