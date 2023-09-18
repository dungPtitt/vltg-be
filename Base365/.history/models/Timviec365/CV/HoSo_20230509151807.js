import mongoose from 'mongoose';
const HoSoSchema = new mongoose.Schema(
    {
        _id:{
            type: Number
        },
        name:{
            type: String
        },
        alias:{
            type: String
        },
        image:{
            type: String
        },
        price:{
            type: Number
        },
        view:{
            type: Number
        },
        favourite:{
            type:Number
        },
        downLoad:{
            type: Number
        },
        html:{
            type: String
        },
        color:{
            type: String
        },
        cateId:{
            type: Number
        },
        status:{
            type: Number
        },
        vip:{
            type: Number
        },
    },
    { collection: 'HoSo',
      versionKey: false}
);

export default mongoose.model("HoSo", HoSoSchema)