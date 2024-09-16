const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const TICKER=require('./models/TickerSchema');

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(cors());
require("dotenv").config();


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error: ", err));



async function fetchTickers(req, res, next) {
  try {

    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = Object.values(response.data).slice(0, 10); 
    // console.log(tickers);
    await TICKER.deleteMany(); 
    const tickerDocs = tickers.map(ticker => ({
      name: ticker.name,
      last: ticker.last,
      buy: ticker.buy,
      sell: ticker.sell,
      volume: ticker.volume,
      base_unit: ticker.base_unit
    }));
    await TICKER.insertMany(tickerDocs); 
    next(); 

  } catch (error) {
    console.error("Error fetching data from WazirX API: ", error);
    res.status(500).send("Error fetching tickers.");
  }
}

app.get('/', (req, res) => {
    try {
      res.sendFile(path.join(__dirname, '../frontend/index.html'));
    } catch (error) {
      console.log("Error in / ", error);
    }
  });


app.get('/get-tickers', fetchTickers, async (req, res) => {
  try {
    const tickers = await TICKER.find(); 
    res.json(tickers); 

  } catch (error) {
    console.error("Error retrieving tickers from database: ", error);
    res.status(500).send("Error retrieving tickers.");
  }
});


app.listen(4100, (err) => {
  if (err) console.log("Error starting server");
  else console.log("Server listening on port 4100");
});
