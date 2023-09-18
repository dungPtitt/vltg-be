const functions = require('../../services/functions');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');

// so sánh lương -----loading
exports.findByCondition = async(req, res, next) => {
    try {
        const Nganh = await newTV365.find({ title: { $regex: '', $options: 'i' } }).select('newMoney.minValue newMoney.maxValue');
        let value = [];
        Nganh.map(obj => {
            if (obj.newMoney.minValue) {
                value.push(obj.newMoney.minValue);
            }
            if (obj.newMoney.maxValue) {
                value.push(obj.newMoney.maxValue);
            }
        })
        const k13 = value.filter(obj => 1000000 <= obj && obj < 3000000).length;
        const k35 = value.filter(obj => 3000000 <= obj && obj < 5000000)
        const k57 = value.filter(obj => 5000000 <= obj && obj < 7000000)
        const k710 = value.filter(obj => 7000000 <= obj && obj < 10000000)
        const k1015 = value.filter(obj => 10000000 <= obj && obj < 15000000)
        const k1520 = value.filter(obj => 15000000 <= obj && obj < 20000000)
        const k12030 = value.filter(obj => 20000000 <= obj && obj < 30000000)
        const k30 = value.filter(obj => 30000000 <= obj)

        console.log();
        const data = {

        };
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};