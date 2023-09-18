const functions = require('../../services/functions');
const DonXinViec = require('../../models/Timviec365/CV/DonXinViec');
const NganhDon = require('../../models/Timviec365/CV/NganhDon');
const DonUV = require('../../models/Timviec365/CV/DonUV');

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
        const data = await DonXinViec.findOne({ _id: _id }).select('_id name htmlVi htmlCn htmlJp htmlKr htmlEn view color langId');

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
exports.saveDon = async(req, res, next) => {
    try {
        const nameImage = req.file;
        const userId = req.user.data._id;
        const data = req.body; // Id, html,  lang
        const checkImage = await functions.checkImage(nameImage.path);
        const donUV = {
            userId: userId,
            donId: data._id,
            html: data.html,
            nameImage: nameImage.filename,
            lang: data.lang,
        };

        if (checkImage == true) {
            const don = await DonXinViec.findOne({ _id: data._id }).select('download');
            if (!don) return await functions.setError(res, 'Lưu thất bại 1', 404);
            let _id = 1;
            await functions.getMaxID(DonUV)
                .then(res => {
                    if (res) {
                        _id = res + 1;
                    }
                });

            donUV._id = _id;
            const newDonUV = await DonUV.create(donUV);

            if (newDonUV) {
                // cập nhật số lượt download 
                await DonXinViec.updateOne({ _id: cv._id }, { $set: { download: cv.download + 1 } });
                return await functions.success(res, 'Lưu thành công', newDonUV);
            };
            return await functions.setError(res, 'Lưu thất bại 2', 404);
        };
        return functions.setError(res, 'Lỗi ảnh', 404);

    } catch (e) {
        functions.setError(res, e.message, );
    }
};

// thêm mới NganhDon
exports.createNganhDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(NganhDon)
            .then(res => {
                if (res) {
                    _id = res + 1;
                }
            });
        data._id = _id;
        await NganhDon.create(data);
        return await functions.success(res, 'Tạo mới NganhcDon thành công', );
    } catch (err) {
        return functions.setError(req, err.message);
    }
};

// lấy dữ liệu NganhDon cũ
exports.findNganhDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await NganhDon.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(req, err.message);
    };
};

// update NganhDon
exports.updateNganhDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await NganhDon.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(req, err.message);
    };
};

//xóa NganhDon
exports.deleteNganhDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await NganhDon.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(req, err.message);
    };
};

// tạo mới mẫu DonXinViec
exports.createDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập', 404);
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(DonXinViec)
            .then(res => {
                if (res) {
                    _id = res + 1;
                }
            });
        data._id = _id;
        await DonXinViec.create(data);
        return await functions.success(res, 'Tạo mới DonXinViec thành công', );
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// lấy dữ liệu mẫu DonXinViec cũ
exports.findDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await DonXinViec.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// update dữ liệu mẫu DonXinViec
exports.updateDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await DonXinViec.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(req, err.message);
    };
};

//xóa mẫu DonXinViec
exports.deleteDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await DonXinViec.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(req, err.message)
    };
};