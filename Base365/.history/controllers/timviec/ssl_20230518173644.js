const functions = require('../../services/functions');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');

// so sánh lương -----loading
// so sánh theo từ khóa
exports.findByKeyword = async(req, res, next) => {
    try {
        const cityID = req.body.cityID || null;
        const keyword = req.body.keyword || '';
        let result = [];
        if (cityID) {
            result = await newTV365.find({ cityID: { $in: [`${cityID}`] }, title: { $regex: `${keyword}`, $options: 'i' } }).select('newMoney.minValue newMoney.maxValue');
        } else {
            result = await newTV365.find({ title: { $regex: `${keyword}`, $options: 'i' } }).select('newMoney.minValue newMoney.maxValue');
        }

        let tl = 0;
        let value = [];
        result.map(obj => {
            if (obj.newMoney.minValue) {
                value.push(obj.newMoney.minValue);
            }
            if (obj.newMoney.maxValue) {
                value.push(obj.newMoney.maxValue);
            }
            if (!obj.newMoney.minValue && !obj.newMoney.maxValue) {
                tl += 1;
            }
        })
        const m13 = value.filter(obj => 1000000 <= obj && obj < 3000000).length;
        const m35 = value.filter(obj => 3000000 <= obj && obj < 5000000).length;
        const m57 = value.filter(obj => 5000000 <= obj && obj < 7000000).length;
        const m710 = value.filter(obj => 7000000 <= obj && obj < 10000000).length;
        const m1015 = value.filter(obj => 10000000 <= obj && obj < 15000000).length;
        const m1520 = value.filter(obj => 15000000 <= obj && obj < 20000000).length;
        const m2030 = value.filter(obj => 20000000 <= obj && obj < 30000000).length;
        const m30 = value.filter(obj => 30000000 <= obj).length

        const data = {
            keyword,
            cityID,
            thuongluong: tl,
            m13,
            m35,
            m57,
            m710,
            m1015,
            m1520,
            m2030,
            m30

        };
        return await functions.success(res, 'Thành công', data);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};

//so sánh theo ngành
exports.findByCategory = async(req, res, next) => {
    try {
        const cityID = req.body.cityID || null;
        const cateID = req.body.cateID;
        let result = [];
        if (cityID) {
            result = await newTV365.find({ cityID: { $in: [`${cityID}`] }, cateID: { $in: [`${cateID}`] } }).select('newMoney.minValue newMoney.maxValue');
        } else {
            result = await newTV365.find({ cateID: { $in: [`${cateID}`] } }).select('newMoney.minValue newMoney.maxValue');
        }

        let tl = 0;
        let value = [];
        result.map(obj => {
            if (obj.newMoney.minValue) {
                value.push(obj.newMoney.minValue);
            }
            if (obj.newMoney.maxValue) {
                value.push(obj.newMoney.maxValue);
            }
            if (!obj.newMoney.minValue && !obj.newMoney.maxValue) {
                tl += 1;
            }
        })
        const m13 = value.filter(obj => 1000000 <= obj && obj < 3000000).length;
        const m35 = value.filter(obj => 3000000 <= obj && obj < 5000000).length;
        const m57 = value.filter(obj => 5000000 <= obj && obj < 7000000).length;
        const m710 = value.filter(obj => 7000000 <= obj && obj < 10000000).length;
        const m1015 = value.filter(obj => 10000000 <= obj && obj < 15000000).length;
        const m1520 = value.filter(obj => 15000000 <= obj && obj < 20000000).length;
        const m2030 = value.filter(obj => 20000000 <= obj && obj < 30000000).length;
        const m30 = value.filter(obj => 30000000 <= obj).length

        const data = {
            cateID,
            cityID,
            thuongluong: tl,
            m13,
            m35,
            m57,
            m710,
            m1015,
            m1520,
            m2030,
            m30

        };
        return await functions.success(res, 'Thành công', data);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};