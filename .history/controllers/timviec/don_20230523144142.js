const functions = require('../../services/functions');
const DonXinViec = require('../../models/Timviec365/CV/Application');
const NganhDon = require('../../models/Timviec365/CV/ApplicationCategory');
const DonUV = require('../../models/Timviec365/CV/ApplicationUV');

// lấy danh sách mẫu đơn
exports.getDon = async(req, res, next) => {
    try {
        const data = await DonXinViec.find({});

        if (data.length) return await functions.success(res, 'Lấy mẫu DON thành công', { data });

        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };
};

// tìm đơn theo ngành
exports.getByNganh = async(req, res, next) => {
    try {
        const cateId = req.body.cateId;
        const data = await DonXinViec.find({ cateId }); // tìm theo id Ngành

        if (data.length) return await functions.success(res, `DON theo ngành ${cateId}`, { data });

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};

// lấy danh sách ngành đơn
exports.getNganhDon = async(req, res, next) => {
    try {
        const data = await NganhDon.find();

        if (data.length) return functions.success(res, 'Danh sách ngành DON', { data });

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// xem trước
exports.previewDon = async(req, res, next) => {
    try {
        const _id = req.body._id;
        const data = await DonXinViec.findOne({ _id }).select('_id image view');

        if (!data) return await functions.setError(res, 'Không có dữ liệu', 404);
        data.view = 0
            // cập nhật số lượng xem 
        await DonXinViec.updateOne({ _id }, { $set: { view: data.view + 1 } });
        return await functions.success(res, 'Lấy mâũ DON thanh công', { data });
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// xem chi tiết ( tạo)
exports.detailDon = async(req, res, next) => {
    try {
        const _id = req.body._id;
        const user = req.user.data;
        const data = await DonXinViec.findOne({ _id }).select('_id name htmlVi htmlCn htmlJp htmlKr htmlEn view color langId');

        if (data) {
            // cập nhật số lượng xem 
            await DonXinViec.updateOne({ _id }, { $set: { view: data.view + 1 } });

            const token = await functions.createToken(user, '24h');
            res.setHeader('authorization', `Bearer ${token}`);

            return await functions.success(res, 'Lấy DON thành công', { data });
        };
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//lưu và tải đơn
exports.saveDon = async(req, res, next) => {
    try {
        const imageFile = req.file;
        const userId = req.user.data._id;
        const data = req.body; // Id, html,  lang
        const checkImage = await functions.checkImage(imageFile.path);
        if (checkImage == false) return await functions.setError(res, 'Lưu thất bại 2', 404);

        const uploadImage = await functions.uploadAndCheckPathIMG(userId, imageFile, 'application');
        if (uploadImage.status != 'EXIT') return await functions.setError(res, 'Upload ảnh thất bại', 404);

        const donUV = {
            userId: userId,
            donId: data._id,
            html: data.html,
            nameImage: uploadImage.nameImage,
            lang: data.lang,
            status: data.status,
        };

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
            return await functions.success(res, 'Lưu thành công', newDonUV);;

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
        const data = {

            name: req.body.name,
            alias: req.body.alias,
            metaH1: req.body.metaH1,
            content: req.body.content,
            cId: req.body.cId,
            metaTitle: req.body.metaTitle,
            metaKey: req.body.metaKey,
            metaDes: req.body.metaDes,
            metaTt: req.body.metaTt,
            status: req.body.status,
        };

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
        return functions.setError(res, err.message);
    }
};

// sửa NganhDon- findNganhDon & updateNganhDon
exports.findNganhDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.body._id;
        const data = await NganhDon.findOne({ _id });

        if (data) return functions.success(res, 'Thành công', { data });

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};
exports.updateNganhDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.body._id;
        const nganhDon = {

            name: req.body.name,
            alias: req.body.alias,
            metaH1: req.body.metaH1,
            content: req.body.content,
            cId: req.body.cId,
            metaTitle: req.body.metaTitle,
            metaKey: req.body.metaKey,
            metaDes: req.body.metaDes,
            metaTt: req.body.metaTt,
            status: req.body.status,
        };
        const data = await NganhDon.findOneAndUpdate({ _id }, nganhDon);

        if (data) return functions.success(res, 'Cập nhật thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//xóa NganhDon
exports.deleteNganhDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.body._id;
        const data = await NganhDon.findOneAndDelete({ _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// tạo mới mẫu DonXinViec
exports.createDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập', 404);
        const data = {

            name: req.body.name,
            nameSub: req.body.name,
            alias: req.body.alias,
            image: req.body.image,
            price: req.body.price,
            view: 0,
            favourite: 0,
            downLoad: 0,
            color: req.body.color,
            htmlVi: req.body.htmlVi,
            cateId: req.body.cateId,
            status: req.body.status,
            vip: req.body.vip,
            htmlEn: req.body.htmlEn,
            htmlCn: req.body.htmlCn,
            htmlJp: req,
            htmlKr: req.body.html,
            langId: req.body.langId,
        };

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

// sửa mẫu Don - findDon & updateDon
exports.findDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.body._id;
        const data = await DonXinViec.findOne({ _id });

        if (data) return functions.success(res, 'Thành công', { data });

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};
exports.updateDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.body._id;
        const don = {

            name: req.body.name,
            nameSub: req.body.name,
            alias: req.body.alias,
            image: req.body.image,
            price: req.body.price,
            view: 0,
            favourite: 0,
            downLoad: 0,
            color: req.body.color,
            htmlVi: req.body.htmlVi,
            cateId: req.body.cateId,
            status: req.body.status,
            vip: req.body.vip,
            htmlEn: req.body.htmlEn,
            htmlCn: req.body.htmlCn,
            htmlJp: req,
            htmlKr: req.body.html,
            langId: req.body.langId,
        };
        const data = await DonXinViec.findOneAndUpdate({ _id }, don);

        if (data) return await functions.success(res, 'Cập nhật thành công', );

        return await functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//xóa mẫu DonXinViec
exports.deleteDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.body._id;
        const data = await DonXinViec.findOneAndDelete({ _id });

        if (data) return await functions.success(res, 'Đã xóa thành công', );

        return await functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message)
    };
};

// ds ngành đơn
exports.getApplyCategory = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const data = await NganhDon.find();

        if (data.length) return await functions.success(res, 'Thành công', );

        return await functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message)
    };
};