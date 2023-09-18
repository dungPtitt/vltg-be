const functions = require('../../services/functions');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');

// so sánh lương -----loading
exports.findByCondition = async(req, res, next) => {
    try {
        const Nganh = await newTV365.find({ fieldName: { $regex: 'Nhân viên', $options: 'i' } }).select('_id');

        console.log(Nganh)
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};