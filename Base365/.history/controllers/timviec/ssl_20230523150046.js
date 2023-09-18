const functions = require('../../services/functions');
const New = require('../../models/Timviec365/UserOnSite/Company/New');
const SalaryLevel = require('../../models/Timviec365/SalaryLevel');

exports.findSalary = async(req, res, next) => {
    try {
        const cityID = [req.body.cityID];
        const keyword = req.body.keyword || '';
        let data = [];
        if (cityID[0]) {
            data = await New.aggregate([{
                    $match: {
                        cityID: { $in: cityID },
                        title: { $regex: `${keyword}`, $options: "i" }
                    }
                },
                {
                    $group: {
                        _id: '$money',
                        cityID: { $first: '$cityID' },
                        title: { $first: '$title' },
                        CountLevel: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'SalaryLevel',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'salaryLevel'
                    }
                },
                {
                    $unwind: '$salaryLevel'
                },
                {
                    $project: {
                        _id: 0,
                        city: '$cityID',
                        title: '$salaryLevel.title',
                        _id: '$salaryLevel._id',
                        CountLevel: 1
                    }
                }
            ]);
        } else {
            data = await New.aggregate([{
                    $match: {
                        title: { $regex: `${keyword}`, $options: "i" }
                    }
                },
                {
                    $group: {
                        _id: '$money',
                        cityID: { $first: '$cityID' },
                        title: { $first: '$title' },
                        CountLevel: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'SalaryLevel',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'salaryLevel'
                    }
                },
                {
                    $unwind: '$salaryLevel'
                },
                {
                    $project: {
                        _id: 0,
                        city: '$cityID',
                        title: '$salaryLevel.title',
                        _id: '$salaryLevel._id',
                        CountLevel: 1
                    }
                }
            ]);
        }


        if (data.length) return await functions.success(res, 'Thành công', { data });

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};