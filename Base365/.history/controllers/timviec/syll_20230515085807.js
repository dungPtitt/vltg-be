const functions = require('../../services/functions');
const HoSo = require('../../models/Timviec365/CV/HoSo');

// lấy danh sách mẫu syll
exports.getSYLL = async(req, res, next) => {
    try {
        const data = await HoSo.find({}).sort('-_id').select('price image');

        if (data) return await functions.success(res, 'Lấy mẫu SYLL thành công', data);

        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };
};

// xem trước
exports.previewSYLL = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const data = await HoSo.findOne({ _id: _id }).select('_id image view');

        if (!data) return await functions.setError(res, 'Không có dữ liệu', 404);
        // cập nhật số lượng xem 
        await HoSo.updateOne({ _id: _id }, { $set: { view: data.view + 1 } }, );
        return await functions.success(res, 'Lấy mâũ SYLL thanh công', data);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// xem chi tiết ( tạo)
exports.detailSYLL = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const user = req.user.data;
        const data = await HoSo.findOne({ _id: _id }).select('_id name htmlVi htmlCn htmlJp htmlKr htmlEn view color');

        if (data) {
            // cập nhật số lượng xem 
            await HoSo.updateOne({ _id: _id }, { $set: { view: data.view + 1 } }, );

            const token = await functions.createToken(user, '24h');
            res.setHeader('authorization', `Bearer ${token}`);

            return await functions.success(res, 'Lấy SYLL thành công', data);
        };
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};