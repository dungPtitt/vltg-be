const functions = require('../../services/functions');

// danh sách lĩnh vực ngành nghề
exports.getLV = async(req, res, next) => {
    try {

    } catch (err) {
        return functions.setError(res, err.message);
    };
};