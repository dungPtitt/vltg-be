const functions = require('../../services/functions');
const Mail365 = require('../../models/Timviec365/CV/mail365');
const DanhMucMail365 = require('../../models/Timviec365/CV/DanhMucMail365');


// ds danh mục email trang chủ 
exports.getCategories = async(req, res, next) => {
    try {
        const cateId = { cateId: req.body.cateId } || {};
        const data = await DanhMucMail365.find({ cateId });

        if (data) return await functions.success(res, 'Thành công', data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// ds email theo mẫu
exports.findByCategory = async(req, res, next) => {
    try {
        const cateId = req.body.cateId;
        const data = await Mail365.find(cateId);

        if (data) return await functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// xem trước email
exports.preview = async(req, res, next) => {
    try {
        const _id = req.body._id;
        const data = await Mail365.findOne(_id).select('name image view');

        if (!data) return functions.setError(res, 'Không có dữ liệu', 404);

        await Mail365.updateOne(_id, { $set: { view: data.view + 1, } });
        return functions.success(res, 'Thành công', data);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// chi tiết email
exports.viewDetail = async(req, res, next) => {
    try {
        const user = req.user;
        const _id = req.body._id;
        const data = await Mail365.findOne(_id);

        if (!data) return functions.setError(res, 'Không có dữ liệu', 404);

        await Mail365.updateOne(_id, { $set: { view: data.view + 1, } });

        const token = await functions.createToken(user, '24h');
        await res.setHeader('authorization', `Bearer ${token}`);

        return functions.success(res, 'Thành công', data);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};