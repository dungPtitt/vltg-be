const mongoose = require('mongoose');
const lvSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    // tên lĩnh vực
    nameTag: String,
    cityTag: Number,
    cateID: Number,
    parentID: Number,
    leverID: Number,
    keywordTag: String,
    TagContent: String,
    link301: String,
    tagVlgy: String,
    tagNdgy: String,
    tagIndex: Number

}, {
    collection: 'Linh_Vuc',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Linh_Vuc", lvSchema);