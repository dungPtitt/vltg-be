const functions = require('../../services/functions');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');

// so sánh lương -----loading
exports.findSalary = async(req, res, next) => {
    try {
        const SalaryLevel = require('./models/salaryLevel'); // Import schema/model for salaryLevel collection
        const New = require('./models/new'); // Import schema/model for new collection

        const hanNopThreshold = 1653325200;

        New.aggregate([{
                    $match: {
                        new_han_nop: { $gt: hanNopThreshold },
                        $or: [
                            { $text: { $search: '"chuyên viên kinh doanh"' } },
                            { new_title: { $regex: 'chuyên.*viên.*kinh.*doanh', $options: 'i' } },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'salarylevel',
                        localField: 'new_money',
                        foreignField: 'salarylevelid',
                        as: 'salarylevel',
                    },
                },
                {
                    $unwind: '$salarylevel',
                },
                {
                    $group: {
                        _id: { new_money: '$new_money', tile: '$salarylevel.tile', salarylevelid: '$salarylevel.salarylevelid' },
                        new_city: { $first: '$new_city' },
                        tile: { $first: '$salarylevel.tile' },
                        salarylevelid: { $first: '$salarylevel.salarylevelid' },
                        CountLevel: { $sum: 1 },
                    },
                },
                {
                    $lookup: {
                        from: 'salarylevel',
                        localField: '_id.salarylevelid',
                        foreignField: 'salarylevelid',
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
                        tile: '$salarylevelInfo.tile',
                        salarylevelid: 1,
                        CountLevel: 1,
                    },
                },
            ])
            .exec((err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(result);
            });


        return await functions.success(res, 'Thành công', data);
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};