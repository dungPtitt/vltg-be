const functions = require('../../services/functions');
const DonXinViec = require('../../models/Timviec365/CV/DonXinViec');
const NganhDon = require('../../models/Timviec365/CV/NganhDon');

// lấy danh sách mẫu đơn
exports.getDon = async(req, res, next) => {
    try {
        const data = await functions.getDataDonThu(DonXinViec, {});

        if (data) return await functions.success(res, 'Lấy mẫu DON thành công', data);

        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };
};

// tìm đơn theo ngành
exports.getByNganh = async(req, res, next) => {
    try {
        const cateId = req.params.cateId;
        const data = await functions.getDataDonThu(DonXinViec, { cateId: cateId }); // tìm theo id Ngành

        if (data) return await functions.success(res, `DON theo ngành ${cateId}`, data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};

// lấy danh sách ngành đơn
exports.getNganhDon = async(req, res, next) => {
    try {
        const data = await NganhDon.find().select('_id name');

        if (data.length > 0) return functions.success(res, 'Danh sách ngành DON', data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// xem trước
exports.previewDon = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const data = await DonXinViec.findOne({ _id: _id }).select('_id image view');

        if (!data) return await functions.setError(res, 'Không có dữ liệu', 404);
        let view = data.view + 1; // cập nhật số lượng xem 
        await DonXinViec.updateOne({ _id: _id }, { view: view });
        return await functions.success(res, 'Lấy mâũ DON thanh công', data);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// xem chi tiết ( tạo)
exports.detailDon = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const user = req.user.data;
        const data = await DonXinViec.findOne({ _id: _id }).select('_id name htmlVi htmlCn htmlJp htmlKr htmlEn view color');

        if (data) {
            let view = data.view + 1; // cập nhật số lượng xem 
            await DonXinViec.updateOne({ _id: _id }, { view: view });

            const token = await functions.createToken(user, '24h');
            res.setHeader('authorization', `Bearer ${token}`);

            return await functions.success(res, 'Lấy DON thành công', data);
        };
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};