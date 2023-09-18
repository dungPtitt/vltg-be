const priceList = require('../../models/Timviec365/PriceList/PriceList');
const functions = require('../../services/functions');

// danh mục bảng giá
exports.getPriceList = async(req, res, next) => {
    try {
        const data = await priceList.find();

        if (data.length > 0) return await functions.success(res, 'Thành công', data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, )
    }
};

// chi tiết gói dich vụ
exports.viewDetail = async(req, res, next) => {
    try {
        const _id = req.body._id;
        const data = await priceList.findOne({ _id: _id });

        if (data) return await functions.success(res, 'Thành công', data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, )
    }
};