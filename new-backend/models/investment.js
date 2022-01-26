const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const investmentSchema = new Schema({
    name: { type: String, required: true },
    short_name_handle: { type: String, required: true },
    date: { type: String },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    value: { type: Number, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Investment", investmentSchema);