const functions = require('../../services/functions');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');

// so sánh lương
exports.findByCondition = async(req, res, next) => {
    try {
        const cityID = req.query.cityID || 1;

        const money = [
            { min: 1, max: 3 },
            { min: 3, max: 5 },
            { min: 5, max: 7 },
            { min: 7, max: 10 },
            { min: 7, max: 10 },
            { min: 10, max: 15 },
            { min: 15, max: 20 },
            { min: 20, max: 30 },
            { min: 30, max: Infinity },
        ];

        const query = money.map((range) => ({
            money: { $gte: range.min, $lt: range.max },
        }));

        newTV365.find(cityID, { 'newMoney.unit': 1 }, { $or: query });

    } catch (err) {
        return functions.setError(res, err.message, );
    };
};