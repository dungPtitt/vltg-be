const functions = require('../../services/functions');
const New = require('../../models/Timviec365/Timviec/newTV365.model');
const SalaryLevel = require('../../models/Timviec365/Timviec/SalaryLevel');

// so sánh lương -----loading
exports.findSalary = async(req, res, next) => {
    try {
        const cityID = req.body.cityID;

        const result = await New.aggregate([{
                $match: {
                    cityID: { $in: cityID }
                }
            },
            {
                $group: {
                    _id: '$money',
                    cityID: { $addToSet: '$cityID' },
                    title: { $addToSet: '$Tile' },
                    _id: { $addToSet: '$_id' },
                    CountLevel: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'SalaryLevel',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'salarylevelInfo'
                }
            },
            {
                $unwind: '$salarylevelInfo'
            },
            {
                $project: {
                    _id: 0,
                    cityID: { $arrayElemAt: ['$cityID', 0] },
                    title: { $arrayElemAt: ['$title', 0] },
                    _id: { $arrayElemAt: ['$_id', 0] },
                    CountLevel: 1
                }
            }
        ]);

        console.log(result);

        return await functions.success(res, 'Thành công');
    } catch (err) {
        return functions.setError(res, err.message);
    }
};