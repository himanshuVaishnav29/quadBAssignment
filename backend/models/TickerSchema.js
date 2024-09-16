const mongoose=require("mongoose");

const tickerSchema=new mongoose.Schema({
    name: String,
    last: String,
    buy: String,
    sell: String,
    volume: String,
    base_unit: String
});

const TICKER=mongoose.model("tickers",tickerSchema);
module.exports=TICKER;