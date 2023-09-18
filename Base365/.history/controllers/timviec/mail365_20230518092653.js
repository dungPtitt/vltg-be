const functions = require('../../services/functions');
const Mail365 = require('../../models/Timviec365/CV/mail365');
const DanhMucMail365 = require('../../models/Timviec365/CV/DanhMucMail365');


// ds danh mục email trang chủ ( lấy thư gửi ứng viên)
exports.getCategories = async(req, res, next) => {
    try {
        const data = await DanhMucMail365.find({ cateId: 1 });

        if (data) return await functions.success(res, 'Thành công', data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// ds email theo mẫu
exports.findBySample = async(req, res, next) => {
    try {

    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// ds email theo danh mục
exports.findBy = async(req, res, next) => {
    try {

    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// xem trước email
exports.preview = async(req, res, next) => {
    try {

    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// chi tiết email
exports.viewDetail = async(req, res, next) => {
    try {

    } catch (err) {
        return functions.setError(res, err.message);
    };
};