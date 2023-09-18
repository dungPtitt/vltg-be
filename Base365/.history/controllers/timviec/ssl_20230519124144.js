const functions = require('../../services/functions');
const New = require('../../models/Timviec365/Timviec/newTV365.model');
const SalaryLevel = require('../../models/Timviec365/Timviec/SalaryLevel');

exports.findSalary = async(req, res, next) => {
    try {
        // const cityID = [req.body.cityID];

        const result = await New.aggregate([{
                $match: {
                    $or: [
                        { $text: { $search: '+chuyên +viên +kinh +doanh' } },
                        { title: { $regex: 'chuyên.*viên.*kinh.*doanh' } }
                    ]
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

        console.log(result);



        return await functions.success(res, 'Thành công');
        // return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};