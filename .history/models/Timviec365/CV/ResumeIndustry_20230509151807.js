import mongoose from 'mongoose';
const NganhHoSoSchema = new mongoose.Schema(
    {
       _id:{
        type: Number,
        require: true
       },
       name:{
        type: Number
       },
       alias:{
        type: String
       },
       metaH1:{
        type: String
       },
       content:{
        type: String
       },
       cId:{
        type: Number
       },
       metaTitle:{
        type: String
       },
       metaKey:{
        type: String
       },
       metaDes:{
        type: String
       },
       status:{
        type: Number
       }
    },
    { collection: 'NganhHoSo',
      versionKey: false}
);

export default mongoose.model("NganhHoSo", NganhHoSoSchema)