const functions = require('../../services/functions');
const New = require('../../models/Timviec365/Timviec/newTV365.model');
const SalaryLevel = require('../../models/Timviec365/Timviec/SalaryLevel');

// so sánh lương -----loading
exports.findSalary = async(req, res, next) => {
    try {
        let data = [{
                _id: 2,
                title: '1000000-3000000',
                order: 0,
            },
            {
                _id: 3,
                title: '3000000-5000000',
                order: 0,
            },
            {
                _id: 4,
                title: '5000000-7000000',
                order: 0,
            },
            {
                _id: 5,
                title: '7000000-10000000',
                order: 0,
            },
            {
                _id: 6,
                title: '10000000-12000000',
                order: 0,
            },
            {
                _id: 7,
                title: '15000000-20000000',
                order: 0,
            },
            {
                _id: 8,
                title: '20000000-25000000',
                order: 0,
            },
            {
                _id: 9,
                title: '3000000-0',
                order: 0,
            },
            {
                _id: 10,
                title: '20000000-30000000',
                order: 0,
            },
            {
                _id: 11,
                title: '12000000-15000000',
                order: 0,
            }, {
                _id: 12,
                title: '25000000-30000000',
                order: 0,
            },
            {
                _id: 13,
                title: '40000000-0',
                order: 0,
            }
        ]
        data.map(obj => SalaryLevel.create(obj))
            // New.aggregate([{
            //             $match: {
            //                 $or: [
            //                     { $text: { $search: '"chuyên viên kinh doanh"' } },
            //                     { title: { $regex: 'chuyên.*viên.*kinh.*doanh', $options: 'i' } },
            //                 ],
            //             },
            //         },
            //         {
            //             $lookup: {
            //                 from: 'salarylevel',
            //                 localField: 'newMoney',
            //                 foreignField: '_id',
            //                 as: 'salarylevel',
            //             },
            //         },
            //         {
            //             $unwind: '$salarylevel',
            //         },
            //         {
            //             $group: {
            //                 _id: { newMoney: '$newMoney', title: '$salarylevel.title', _id: '$salarylevel._id' },
            //                 cityID: { $first: '$cityID' },
            //                 title: { $first: '$salarylevel.title' },
            //                 _id: { $first: '$salarylevel._id' },
            //                 CountLevel: { $sum: 1 },
            //             },
            //         },
            //         {
            //             $lookup: {
            //                 from: 'salarylevel',
            //                 localField: '_id._id',
            //                 foreignField: '_id',
            //                 as: 'salarylevelInfo',
            //             },
            //         },
            //         {
            //             $unwind: '$salarylevelInfo',
            //         },
            //         {
            //             $project: {
            //                 _id: 0,
            //                 cityID: 1,
            //                 title: '$salarylevelInfo.title',
            //                 _id: 1,
            //                 CountLevel: 1,
            //             },
            //         },
            //     ])
            //     .exec((err, result) => {
            //         if (err) {
            //             console.error(err);
            //             return;
            //         }
            //         console.log(result);
            //     });



        // return await functions.success(res, 'Thành công', data);
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};