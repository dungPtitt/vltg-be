const functions = require('../../services/functions');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');

// so sánh lương -----loading
exports.findByCondition = async(req, res, next) => {
    try {
        const Nganh = await newTV365.find({ title: { $regex: 'Nhân viên', $options: 'i' } }).select('newMoney.minValue newMoney.maxValue');
        let value = [];
        Nganh.map(obj => {
            if (obj.newMoney.minValue) {
                value.push(obj.newMoney.minValue);
            }
            if (obj.newMoney.maxValue) {
                value.push(obj.newMoney.maxValue);
            }
        })

        console.log(Nganh);
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};