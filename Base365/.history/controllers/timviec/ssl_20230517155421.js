const functions = require('../../services/functions');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');

// so sánh lương
exports.findByCondition = async(req, res, next) => {
    try {

        newTV365.create({
            _id: 4,
            nganh: 1,
            cityID: 1,
            newMoney: {
                type: 4,
                minValue: 2,
                maxValue: 5,
                unit: 1,
            }
        })
        const cityID = req.query.cityID || 1;
        const nganh = req.query.nganh;

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
            'newMoney.minValue': { $gte: range.min, $lt: range.max }
        }, { 'newMoney.maxValue': { $gte: range.min, $lt: range.max } }));

        newTV365.find(cityID, nganh, { 'newMoney.unit': 1 }, { $or: query });
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};