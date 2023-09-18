import mongoose from 'mongoose';
const HoSoUVSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            require: true
        },
        userId:{
            type: Number
        },
        tId:{
            type: Number
        },
        lang:{
            type: String
        },
        html:{
            type: String
        },
        nameImg:{
            type: String
        },
        status:{
            type: Number
        }
    },
    { collection: 'HoSoUV',
      versionKey: false}
);

export default mongoose.model("HoSoUV", HoSoUVSchema)