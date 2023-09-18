const functions = require('../../services/functions');
const New = require('../../models/Timviec365/Timviec/newTV365.model');
const SalaryLevel = require('../../models/Timviec365/Timviec/SalaryLevel');

exports.findSalary = async(req, res, next) => {
    try {
        const cityID = [req.body.cityID];

        const result = await New.aggregate([{
                $lookup: {
                    from: 'SalaryLevel', // Tên collection trong MongoDB
                    localField: 'money',
                    foreignField: '_id',
                    as: 'salarylevel',
                },
            },
            {
                $unwind: '$salarylevel',
            },
            {
                $match: {
                    cityID: { $in: cityID },
                },
            },
            {
                $group: {
                    _id: {
                        money: '$money',
                        title: '$salarylevel.title',
                        salarylevelid: '$salarylevel._id',
                    },
                    cityID: { $push: '$cityID' },
                    title: { $first: '$salarylevel.title' },
                    _id: { $first: '$salarylevel._id' },
                    CountLevel: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'SalaryLevel', // Tên collection trong MongoDB
                    localField: '_id',
                    foreignField: '_id',
                    as: 'salarylevelInfo',
                },
            },
            {
                $unwind: '$salarylevelInfo',
            },
            {
                $project: {
                    _id: 0,
                    new_city: 1,
                    title: '$salarylevelInfo.title',
                    _id: '$_id',
                    CountLevel: 1,
                },
            },
        ]);

        console.log(result);



        return await functions.success(res, 'Thành công');
        // return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};