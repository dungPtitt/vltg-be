const functions = require('../../services/functions');
const CV = require('../../models/Timviec365/CV/CV');
const CVUV = require('../../models/Timviec365/CV/CVUV');
const NganhCV = require('../../models/Timviec365/CV/CVIndustry');
const fs = require('fs').promises;
const path = require('path');


// lấy tất cả danh sách mẫu CV
exports.getListCV = async(req, res, next) => {
    try {
        const data = await functions.getDataCVSortById({});
        if (data) {
            return await functions.success(res, 'Lấy mẫu CV thành công', { data });
        };
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };
};

// lấy danh sách ngành cv
exports.getNganhCV = async(req, res, next) => {
    try {
        const data = await NganhCV.find().select('_id name');

        if (data.length > 0) return functions.success(res, 'Danh sách ngành cv', { data });

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// lấy theo điều kiện --- func getDataCV nhận 2 tham số là điều kiện và cách sắp xếp( cập nhật mới hoặc download)
exports.getListCVByCondition = async(req, res, next) => {
    try {
        const cateId = req.query.cateId;
        const langId = req.query.langId;
        const designId = req.query.designId;
        const sort = req.query.sort || 0; // 0 ||1 (_id|| download)
        let data = [];
        if (sort != 0 && sort != 1) return await functions.setError(res, "Không có dữ liệu", 404);
        if (sort == 1) {
            if (cateId || langId || designId) {
                if (cateId) {
                    data = await functions.getDataCVSortByDownload({ cateId });
                    return await functions.success(res, 'Lấy dữ liệu thành công', { data });
                };
                if (langId) {
                    data = await functions.getDataCVSortByDownload({ langId });
                    return await functions.success(res, 'Lấy dữ liệu thành công', { data });
                };
                if (designId) {
                    data = await functions.getDataCVSortByDownload({ designId });
                    return await functions.success(res, 'Lấy dữ liệu thành công', { data });
                };
            };

            data = await functions.getDataCVSortByDownload({});
            return await functions.success(res, 'Lấy dữ liệu thành công', { data });
        } else {
            if (cateId) {
                data = await functions.getDataCVSortById({ cateId });
                return await functions.success(res, 'Lấy dữ liệu thành công', { data });
            };
            if (langId) {
                data = await functions.getDataCVSortById({ langId });
                return await functions.success(res, 'Lấy dữ liệu thành công', { data });
            };
            if (designId) {
                data = await functions.getDataCVSortById({ designId });
                return await functions.success(res, 'Lấy dữ liệu thành công', { data });
            };
            data = await functions.getDataCVSortById({});
            return await functions.success(res, 'Lấy dữ liệu thành công', { data });
        };
    } catch (e) {
        functions.setError(res, e.message, );
    }
};

//xem trước CV
exports.previewCV = async(req, res, next) => {
    try {
        const _id = req.body._id;
        const data = await CV.findOne({ _id }).select('_id langId name image motaCv color view ');

        if (data) {
            // cập nhật số lượng xem 
            await CV.updateOne({ _id }, { $set: { view: data.view + 1 } });

            return await functions.success(res, 'Lấy mẫu cv thành công', { data });
        }
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (e) {
        functions.setError(res, e.message, );
    };

};

// chi tiết cv ( tạo cv)
exports.detailCV = async(req, res, text) => {
    try {
        const _id = req.query._id;
        const data = await CV.findOne({ _id }).select('_id name htmlVi htmlEn htmlJp htmlCn htmlKr view cateId color langId');

        if (!data) return await functions.setError(res, 'Không có dữ liệu', 404);

        // cập nhật số lượng xem 
        await CV.updateOne({ _id }, { $set: { view: data.view + 1 } });
        return await functions.success(res, 'Lấy CV thành công', { data });
    } catch (e) {
        functions.setError(res, e.message, );
    };
};

//lưu và tải cv
exports.saveCV = async(req, res, next) => {
    try {
        const nameImage = req.file;
        const userId = req.user.data._id;
        const data = req.body;
        const checkAvatar = await functions.checkImage(nameImage.path);

        const timestamp = Date.now();
        const imagePath = await fs.readFile(nameImage.path);
        const uploadDir = `public/candidate/${userId}`;
        const uploadFileName = `${timestamp}_${nameImage.originalFilename}.jpg`;
        const uploadPath = path.join(uploadDir, uploadFileName);
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(uploadPath, imagePath);

        const check = async function checkFileExistence(filePath) {
            try {
                await fs.access(filePath);
                console.log('Tập tin đã tồn tại.');
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log('Tập tin không tồn tại.');
                } else {
                    console.error('Đã xảy ra lỗi khi kiểm tra tập tin:', error);
                }
            }
        };
        check(uploadPath)
        if (check(uploadPath) !== 'Tập tin đã tồn tại.') return await functions.setError(res, 'Lỗi ảnh', 404)

        const cvUV = {
            userId: userId,
            cvId: data._id,
            html: data.html,
            nameImage: nameImage.filename,
            lang: data.lang,
            status: data.status,
            deleteCv: data.deleteCv || 0,
            heightCv: data.heightCv || 0,
            scan: data.scan,
            state: data.state
        };
        if (checkAvatar == true) {
            const cv = await CV.findOne({ _id: data._id }).select('download');
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
            console.log(newCVUV);
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

// xem CV viết sẵn
exports.viewAvailable = async(req, res, next) => {
    try {
        const cateId = req.body.cateId;
        const data = await CV.findOne({ cateId }).sort('-cvPoint').select('');

        if (!data) return await functions.setError(res, 'Không có dữ liệu', 404);

        // cập nhật số lượng xem 
        await CV.updateOne({ _id: data._id }, { $set: { view: data.view + 1 } });

        return await functions.success(res, 'Thành công cv viết sẵn', { data });
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// tính điểm cv
exports.countPoints = async(req, res, next) => {
    try {
        const _id = req.query.id; // id cv
        const point = +req.query.p; // số point đc cộng
        const cv = await CV.findOne({ _id });
        if (cv) {

            const data = await CV.updateOne({ _id }, { $set: { cvPoint: cv.cvPoint + point } }).select('');
            if (data) return await functions.success(res, 'Cập nhật điểm cv thành công');
        }
        return await functions.setError(res, 'Không có dũ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// tạo mới mẫu cv
exports.createCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập', 404);
        const data = {
            name: req.body.name,
            alias: req.body.alias,
            urlAlias: req.body.urlAlias,
            view: 0,
            favorite: 0,
            download: 0,
            urlCanonical: req.body.urlCanonical,
            cvIndex: req.body.cvIndex,
            cId: req.body.cId,
            image: req.body.image,
            price: req.body.price,
            full: req.body.full,
            designId: req.body.designId,
            langId: req.body.langId,
            content: req.body.content,
            motaCv: req.body.motaCv,
            htmlVi: req.body.htmlVi,
            htmlEn: req.body.htmlEn,
            htmlJp: req.body.htmlJp,
            htmlCn: req.body.htmlCn,
            htmlKr: req.body.htmlKr,
            color: req.body.color,
            metaTitle: req.body.metaTitle,
            metaKey: req.body.metaKey,
            metaDes: req.body.metaDes,
            thuTu: req.body.thuTu,
            status: req.body.status,
            vip: req.body.vip,
        };

        let _id = 1;
        await functions.getMaxID(CV)
            .then(res => {
                if (res) {
                    _id = res + 1;
                }
            });
        data._id = _id;
        await CV.create(data);
        return await functions.success(res, 'Tạo mới cv thành công', );
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// sửa mẫu cv - findCV & updateCV
exports.findCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.body._id;
        const data = await CV.findOne({ _id });

        if (data) return functions.success(res, 'Thành công', { data });

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};
exports.updateCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.body._id;
        const cv = {
            name: req.body.name,
            alias: req.body.alias,
            urlAlias: req.body.urlAlias,
            urlCanonical: req.body.urlCanonical,
            cvIndex: req.body.cvIndex,
            cId: req.body.cId,
            image: req.body.image,
            price: req.body.price,
            full: req.body.full,
            designId: req.body.designId,
            langId: req.body.langId,
            content: req.body.content,
            motaCv: req.body.motaCv,
            htmlVi: req.body.htmlVi,
            htmlEn: req.body.htmlEn,
            htmlJp: req.body.htmlJp,
            htmlCn: req.body.htmlCn,
            htmlKr: req.body.htmlKr,
            color: req.body.color,
            metaTitle: req.body.metaTitle,
            metaKey: req.body.metaKey,
            metaDes: req.body.metaDes,
            thuTu: req.body.thuTu,
            status: req.body.status,
            vip: req.body.vip,
        }
        const data = await CV.findOneAndUpdate({ _id }, cv);
        if (data) return functions.success(res, 'Cập nhật thành công');

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//xóa mẫu cv
exports.deleteCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.body._id;
        const data = await CV.findOneAndDelete({ _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// thêm ngành cv vào danh sách NganhCV
exports.createNganhCV = async(req, res, next) => {
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
        await functions.getMaxID(NganhCV)
            .then(res => {
                if (res) {
                    _id = res + 1;
                }
            });
        data._id = _id;
        await NganhCV.create(data);
        return await functions.success(res, 'Tạo mới NganhcCV thành công', );
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// sửa NganhCV- findNganhCV & updateNganhCV
exports.findNganhCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.body._id;
        const data = await NganhCV.findOne({ _id });

        if (data) return functions.success(res, 'Thành công', { data });

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};
exports.updateNganhCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.body._id;
        const nganhCV = {
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
        const data = await NganhCV.findOneAndUpdate({ _id }, nganhCV);

        if (data) return functions.success(res, 'Cập nhật thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//xóa NganhCV
exports.deleteNganhCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.body._id;
        const data = await NganhCV.findOneAndDelete({ _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};