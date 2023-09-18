const functions = require('../../services/functions');
const Thu = require('../../models/Timviec365/CV/Thu');
const NganhThu = require('../../models/Timviec365/CV/NganhThu');

// lấy danh sách mẫu thư
exports.getThu = async(req, res, next) => {
    try {
        const data = await functions.getDataDonThu(Thu, {});

        if (data) return await functions.success(res, 'Lấy mẫu THU thành công', data);

        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };
};

// tìm thư theo ngành
exports.getByNganh = async(req, res, next) => {
    try {
        const cateId = req.params.cateId;
        const data = await functions.getDataDonThu(Thu, { cateId: cateId }); // tìm theo id Ngành

        if (data) return await functions.success(res, `THU theo ngành ${cateId}`, data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};

// lấy danh sách ngành thư
exports.getNganhThu = async(req, res, next) => {
    try {
        const data = await NganhThu.find().select('_id name');

        if (data.length > 0) return functions.success(res, 'Danh sách ngành THU', data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// xem trước 
exports.previewThu = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const data = await Thu.findOne({ _id: _id }).select('_id image view');

        if (!data) return await functions.setError(res, 'Không có dữ liệu', 404);

        let view = data.view + 1; // cập nhật số lượng xem 
        await Thu.updateOne({ _id: _id }, { view: view });
        return await functions.success(res, 'Lấy mâũ THU thanh công', data);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// xem chi tiết thư ( tạo)
exports.detailThu = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const user = req.user.data;
        const data = await Thu.findOne({ _id: _id }).select('_id name htmlVi htmlCn htmlJp htmlKr htmlEn view');

        if (data) {
            let view = data.view + 1; // cập nhật số lượng xem 
            await Thu.updateOne({ _id: _id }, { view: view });

            const token = await functions.createToken(user, '24h');
            res.setHeader('authorization', `Bearer ${token}`);

            return await functions.success(res, 'Lấy THU thành công', data);
        };
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};