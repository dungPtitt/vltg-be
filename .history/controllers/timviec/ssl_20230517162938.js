const functions = require('../../services/functions');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');

// so sánh lương
exports.findByCondition = async(req, res, next) => {
    try {
        const cityID = req.query.cityID || 1;
        const nganh = req.query.nganh;

        const a = await newTV365.aggregate([{
                $group: {
                    _id: null,
                    maxMxV: { $max: '$newMoney.maxValue' },
                    minMxV: { $min: '$newMoney.maxValue' },
                    maxMnV: { $max: '$newMoney.minValue' },
                    minMnV: { $min: '$newMoney.minValue' },
                    avgMxV: { $avg: '$newMoney.maxValue' },
                    avgMnV: { $avg: '$newMoney.minValue' },
                },
            },
            {
                $project: {
                    _id: 0,
                    maxMxV: 1,
                    minMxV: 1,
                    maxMnV: 1,
                    minValue: 1,
                    avgValueMx: 1,
                    avgValueMn: 1,
                },
            },
        ]).then((result) => {
            console.log(result, 111);
            return {
                maxValue: Math.max(result.maxMxV, result.maxMnV),
                minValue: Math.min(result.minMxV, result.minMnV),
                avgValue: (result.avgMxV + result.avgMnV) / 2,

            };
        })

        console.log(a)

        const data = await newTV365.find(cityID, nganh, { 'newMoney.unit': 1 }, { $or: query });
        console.log(data);
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};