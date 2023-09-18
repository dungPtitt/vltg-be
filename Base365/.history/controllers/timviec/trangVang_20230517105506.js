const functions = require('../../services/functions');
const lv = require('../../models/Timviec365/Timviec/lv');
const Users = require('../../models/Users');

// danh sách lĩnh vực ngành nghề
exports.getLV = async(req, res, next) => {
    try {
        const data = await lv.find();

        if (data.length > 0) return functions.success(res, 'Thành công', data);

        return await functions.setError(ré, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// tìm kiếm công ty theo điều kiện
exports.findCompany = async(req, res, next) => {
    try {
        const keyword = req.query.keyword || '';
        const diadiem = req.query.diadiem || 0;
        let data = 0;

        if (diadiem == 0) { data = Users.find({ type: 1 }, { city: diadiem }, { 'inForCompany.tagLinhVuc': { $regex: keyword } }) };

        data =


    } catch (err) {
        return functions.setError(res, err.message);
    };
};