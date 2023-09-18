import mongoose from 'mongoose'; // ngôn ngữ cv
const CVLangSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        type: Number
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
    collection: 'CVLang',
    versionKey: false
});

export default mongoose.model("CVLang", CVLangSchema)