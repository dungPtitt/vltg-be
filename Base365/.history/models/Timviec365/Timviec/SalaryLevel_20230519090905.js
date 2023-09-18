const mongoose = require('mongoose');
const SalaryLevelSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    title: String,
    order: Number,
    cateID: Date,

}, {
    collection: 'SalaryLevel',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("SalaryLevel", SalaryLevelSchema);