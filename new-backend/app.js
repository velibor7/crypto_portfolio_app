const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

const app = express();

app.use(cors())

const PORT = 5000;

const stocks = [
  { id: 1, ticker: "AAPL", price: 497.48 },
  { id: 2, ticker: "MSFT", price: 213.02 },
  { id: 3, ticker: "AMZN", price: 3284.72 },
];

function getRandomStock() {
  return Math.round(Math.random() * (2 - 0) + 0);
}

function getRandomPrice() {
  return Math.random() * (5000 - 20) + 20;
}

app.get("/stocks", function (req, res) {
  res.status(200).json({ success: true, data: stocks });
});

app.get("/realtime-price", function (req, res) {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  setInterval(() => {
    console.log("sending new data...");
    res.write(
      "data: " +
        JSON.stringify({ ...stocks[getRandomStock()], price: getRandomPrice() })
    );
    res.write("\n\n");
  }, 10000);


});




    // `mongodb+srv://velibor:znhpEduQFqVzy8jt@cluster0.eddqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.eddqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log(`connected to db :), listening on: ${PORT}`);
    app.listen(5000);
  })
  .catch((err) => {
    console.log("failed to connect to db");
    console.log(err);
  });


// app.listen(PORT, function () {
  // console.log(`Server is running on ${PORT}`);
// });

// znhpEduQFqVzy8jt

// mongodb+srv://velibor:<password>@cluster0.eddqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority