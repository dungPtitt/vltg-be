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

//lưu và tải đơn
exports.saveCV = async(req, res, next) => {
    try {
        const nameImage = req.image;
        const userId = req.user.data._id;
        const data = req.body; // cv gồm cvId, html,  
        const cv = await CV.findOne({ _id: data._id }).select('download');
        const checkAvatar = await functions.checkImage(nameImage.path);
        const cvUV = {
            userId: userId,
            cvId: data._id,
            html: data.html,
            nameImage: nameImage.filename,
        };

        if (checkAvatar == true) {
            if (!cv) return await functions.setError(res, 'Lưu thất bại 1', 404);
            let _id = 1;
            await functions.getMaxID(CVUV)
                .then(res => {
                    if (res) {
                        _id = res + 1;
                    }
                });

            cvUV._id = _id;
            const newCVUV = await CVUV.create(cvUV);

            if (newCVUV) {
                // cập nhật số luot download 
                await CV.updateOne({ _id: cv._id }, { $set: { download: cv.download + 1 } });
                return await functions.success(res, 'Lưu thành công', newCVUV);
            };
            return await functions.setError(res, 'Lưu thất bại 2', 404);
        };
        return functions.setError(res, 'Lỗi ảnh', 404);

    } catch (e) {
        functions.setError(res, e.message, );
    }
};