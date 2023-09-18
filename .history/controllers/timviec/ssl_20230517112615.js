const functions = require('../../services/functions');

// so sánh lương
exports.findByCondition = async(req, res, next) => {
    try {

    } catch (err) {
        return functions.setError(res, err.message, );
    };
};