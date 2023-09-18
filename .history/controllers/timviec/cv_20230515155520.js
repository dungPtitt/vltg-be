const functions = require('../../services/functions');
const CV = require('../../models/Timviec365/CV/CV');
const CVUV = require('../../models/Timviec365/CV/CVUV');
const NganhCV = require('../../models/Timviec365/CV/NganhCV');


// insert CV
exports.insertDataCV = async(req, res, next) => {
    try {
        const data = await functions.getDataAxios('https://timviec365.vn/cv365/api_nodejs/get_tbl_cv.php?page=1', {});
        await data.forEach(async element => {
            const cv = {
                _id: element.id,
                name: element.name,
                alias: element.alias,
                urlAlias: element.url_alias,
                urlCanonical: element.url_canonical,
                image: element.image,
                price: element.price,
                color: element.colors,
                view: element.view,
                favorite: element.love,
                download: element.download,
                vip: element.vip,
                cvIndex: element.cv_index,
                cId: element.cid,
                content: element.content,
                motaCv: element.mota_cv,
                htmlVi: element.html_vi,
                htmlEn: element.html_en,
                htmlJp: element.html_jp,
                htmlCn: element.html_cn,
                htmlKr: element.html_kr,
                cateId: element.cate_id,
                langId: element.lang_id,
                designId: element.design_id,
                exp: element.exp,
                nhuCau: element.nhucau,
                metaTitle: element.meta_title,
                metaKey: element.meta_key,
                metaDes: element.meta_des,
                thuTu: element.thutu,
                full: element.full,
                status: element.status,
                cvPoint: element.cv_point,
            };
            await CV.create(cv);

        });
        return await functions.success(res, "Thành công");
    } catch (err) {
        functions.setError(res, err.message);
    };
};

// lấy tất cả danh sách mẫu CV
exports.getListCV = async(req, res, next) => {
    try {
        const data = await functions.getDataCVSortById({});
        if (data) {
            return await functions.success(res, 'Lấy mẫu CV thành công', data);
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

        if (data.length > 0) return functions.success(res, 'Danh sách ngành cv', data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// lấy theo điều kiện --- func getDataCV nhận 2 tham số là điều kiện và cách sắp xếp( cập nhật mới hoặc download)
exports.getListCVByCondition = async(req, res, next) => {
    try {
        const cate_id = req.query.cate_id;
        const lang_id = req.query.lang_id;
        const design_id = req.query.design_id;
        const sort = req.query.sort; // 0 ||1 (_id|| download)
        let data = [];
        if (sort == 1) {
            if (cate_id || lang_id || design_id) {
                if (cate_id) {
                    data = await functions.getDataCVSortByDownload({ cate_id: cate_id });
                    return await functions.success(res, 'Lấy dữ liệu thành công', data);
                };
                if (lang_id) {
                    data = await functions.getDataCVSortByDownload({ lang_id: lang_id });
                    return await functions.success(res, 'Lấy dữ liệu thành công', data);
                };
                if (design_id) {
                    data = await functions.getDataCVSortByDownload({ design_id: design_id });
                    return await functions.success(res, 'Lấy dữ liệu thành công', data);
                };
            };

            data = await functions.getDataCVSortByDownload({});
            return await functions.success(res, 'Lấy dữ liệu thành công', data);
        } else {
            if (cate_id) {
                data = await functions.getDataCVSortById({ cate_id: cate_id });
                return await functions.success(res, 'Lấy dữ liệu thành công', data);
            };
            if (lang_id) {
                data = await functions.getDataCVSortById({ lang_id: lang_id });
                return await functions.success(res, 'Lấy dữ liệu thành công', data);
            };
            if (design_id) {
                data = await functions.getDataCVSortById({ design_id: design_id });
                return await functions.success(res, 'Lấy dữ liệu thành công', data);
            };
            data = await functions.getDataCVSortById({});
            return await functions.success(res, 'Lấy dữ liệu thành công', data);
        };
    } catch (e) {
        functions.setError(res, e.message, );
    }
};

//xem trước CV
exports.previewCV = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const data = await CV.findOne({ _id: _id }).select('_id lang_id name image mota_cv colors view ');

        if (data) {
            let view = data.view + 1; // cập nhật số lượng xem 
            await CV.updateOne({ _id: _id }, { view: view });

            return await functions.success(res, 'Lấy mẫu cv thành công', data);
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
        const lang_id = req.query.lang_id;

        // lang_id: 0,1,2,3,4,5 tương ứng tất cả, việt, anh, nhật, trung, hàn 
        const html = ['html_vi html_en html_jp html_cn html_kr', 'html_vi', 'html_en', 'html_jp', 'html_cn', 'html_kr'];
        const html_lang = html[lang_id];
        const data = await CV.findOne({ _id: _id }).select(`_id name ${html_lang} view cate_id color lang`);

        if (!data) {
            await functions.setError(res, 'Không có dữ liệu', 404);
        }
        let view = data.view + 1; // cập nhật số lượng xem 
        await CV.updateOne({ _id: _id }, { view: view });
        return await functions.success(res, 'Lấy CV thành công', data);
    } catch (e) {
        functions.setError(res, e.message, );
    };
};

//lưu và tải cv
exports.saveCV = async(req, res, next) => {
    try {
        const nameImage = req.image;
        const userId = req.user.data._id;
        const data = req.body; // Id, html,   
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

// xem CV viết sẵn
exports.viewAvailable = async(req, res, next) => {
    try {
        const cateId = req.params.cateId;
        const data = await CV.findOne({ cateId }).sort('-cvPoint').select('');
        if (!data) return await functions.setError(res, 'Không có dữ liệu', 404);
        return await functions.success(res, 'Thành công cv viết sẵn', data);
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