 //Ngành thư
 const mongoose = require('mongoose');
 const LetterIndustrySchema = new mongoose.Schema({
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
     collection: 'LetterIndustry',
     versionKey: false
 });

 module.exports = mongoose.model('LetterIndustry', LetterIndustrySchema);