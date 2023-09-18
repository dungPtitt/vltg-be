const functions = require('../../services/functions');
const New = require('../../models/Timviec365/Timviec/newTV365.model');
const SalaryLevel = require('../../models/Timviec365/Timviec/SalaryLevel');

exports.findSalary = async(req, res, next) => {
    try {
        const cityID = [req.body.cityID];

        const New = require('../../models/New');
        const SalaryLevel = require('../../models/SalaryLevel');

        const result = await New.aggregate([{
                $lookup: {
                    from: 'salarylevels', // Tên collection trong MongoDB
                    localField: 'new_money',
                    foreignField: 'salarylevelid',
                    as: 'salarylevel',
                },
            },
            {
                $unwind: '$salarylevel',
            },
            {
                $match: {
                    new_han_nop: { $gt: 1653325200 },
                    $or: [
                        { $text: { $search: '+chuyên +viên +kinh +doanh' } },
                        { new_title: /chuyên.*viên.*kinh.*doanh/i },
                    ],
                },
            },
            {
                $group: {
                    _id: {
                        money: '$new_money',
                        title: '$salarylevel.Tile',
                        salarylevelid: '$salarylevel.salarylevelid',
                    },
                    new_city: { $first: '$new_city' },
                    Tile: { $first: '$salarylevel.Tile' },
                    salarylevelid: { $first: '$salarylevel.salarylevelid' },
                    CountLevel: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'salarylevels', // Tên collection trong MongoDB
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
                    title: '$salarylevelInfo.Tile',
                    salarylevelid: '$_id.salarylevelid',
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