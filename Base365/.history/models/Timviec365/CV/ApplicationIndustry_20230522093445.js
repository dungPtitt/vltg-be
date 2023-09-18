//ngành dơnd xin việc
const mongoose = require('mongoose');
const ApplicationIndustrySchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
    },
    alias: {
        type: String
    },
    metaH1: {
        type: String
    },
    content: {
        type: String
    },
    cId: {
        type: Number
    },
    metaTitle: {
        type: String
    },
    metaKey: {
        type: String
    },
    metaDes: {
        type: String
    },
    metaTt: {
        type: String
    },
    status: {
        type: Number
    }
}, {
    collection: 'ApplicationIndustry',
    versionKey: false
});

module.exports = mongoose.model('ApplicationIndustry', ApplicationIndustrySchema);