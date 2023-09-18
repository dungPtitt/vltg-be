const functions = require('../../services/functions');
const lv = require('../../models/Timviec365/Timviec/lv');

// danh sách lĩnh vực ngành nghề
exports.getLV = async(req, res, next) => {
    try {

    } catch (err) {
        return functions.setError(res, err.message);
    };
};