const functions = require('../../services/functions');
const New = require('../../models/Timviec365/Timviec/newTV365.model');
const SalaryLevel = require('../../models/Timviec365/Timviec/SalaryLevel');

exports.findSalary = async(req, res, next) => {
    try {
        const cityID = [req.body.cityID];

        const result = await New.find({
                cityID: { $in: cityID },
                $or: [
                    { title: { $regex: /chuyên.*viên.*kinh.*doanh/i } },
                ],
            })
            .populate('SalaryLevel')
            .select('cityID salarylevel.title salarylevel._id')
            .lean();

        console.log(result);

        return await functions.success(res, 'Thành công');
        // return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};