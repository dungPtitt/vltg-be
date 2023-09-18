const priceList = require('../../models/Timviec365/Timviec/priceList.model');
const functions = require('../../services/functions');

exports.getPriceList = async(req, res, next) => {
    try {
        const data = await priceList.findOne();
    } catch (err) {
        return functions.setError(res, err.message, )
    }
};