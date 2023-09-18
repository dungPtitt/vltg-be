const functions = require('../../services/functions');
const HoSo = require('../../models/Timviec365/CV/HoSo');
const HoSoUV = require('../../models/Timviec365/CV/HoSoUV');

// lấy danh sách mẫu syll
exports.getSYLL = async(req, res, next) => {
    try {
        const data = await HoSo.find({}).sort('-_id').select('price image name');

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
        const data = await HoSo.findOne({ _id: _id }).select('_id name htmlVi htmlCn htmlJp htmlKr htmlEn view color langId');

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

//lưu và tải syll
exports.saveSYLL = async(req, res, next) => {
    try {
        const nameImage = req.file;
        const userId = req.user.data._id;
        const data = req.body; // Id, html, lang 
        const checkImage = await functions.checkImage(nameImage.path);
        const hoSoUV = {
            userId: userId,
            hoSoId: data._id,
            html: data.html,
            nameImage: nameImage.filename,
            lang: data.lang,
        };

        if (checkImage == true) {
            const hoSo = await HoSo.findOne({ _id: data._id }).select('download');
            if (!hoSo) return await functions.setError(res, 'Lưu thất bại 1', 404);
            let _id = 1;
            await functions.getMaxID(HoSoUV)
                .then(res => {
                    if (res) {
                        _id = res + 1;
                    }
                });

            hoSoUV._id = _id;
            const newHoSoUV = await HoSoUV.create(hoSoUV);

            if (newHoSoUV) {
                // cập nhật số lượt download 
                await HoSo.updateOne({ _id: cv._id }, { $set: { download: cv.download + 1 } });
                return await functions.success(res, 'Lưu thành công', newHoSoUV);
            };
            return await functions.setError(res, 'Lưu thất bại 2', 404);
        };
        return functions.setError(res, 'Lỗi ảnh', 404);

    } catch (e) {
        functions.setError(res, e.message, );
    }
};

// tạo mới mẫSYLL
exports.createSYLL = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập', 404);
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(HoSo)
            .then(res => {
                if (res) {
                    _id = res + 1;
                }
            });
        data._id = _id;
        await HoSo.create(data);
        return await functions.success(res, 'Tạo mới SYLL thành công', );
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// lấy dữ liệu mẫu SYLL cũ
exports.findSYLL = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await HoSo.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// update dữ liệu mẫu SYLL
exports.updateSYLL = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await HoSo.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//xóa mẫu SYLL
exports.deleteSYLL = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await HoSo.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};