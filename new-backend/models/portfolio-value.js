const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const portfolioValueSchema = new Schema({
    date: { type: String },
    value: { type: Number, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("PortfolioValue", portfolioValueSchema);
