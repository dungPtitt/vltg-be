const priceList = require('../../models/Timviec365/Timviec/priceList.model');
const functions = require('../../services/functions');

exports.getPriceList = async(req, res, next) => {
    try {
        const data = await priceList.find();

        if (data.length !== 0) return await functions.success(res, 'Thành công', data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, )
    }
};