import mongoose from 'mongoose';
const DanhMucThuSchema = new mongoose.Schema(
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
        sapo:{
            type: String
        },
        content:{
            type: String
        },
        menu:{
            type: Number
        },
        sort:{
            type: Number
        },
        status:{
            type: Number
        }

    },
    { collection: 'DanhMucThu',
      versionKey: false}
);

export default mongoose.model("DanhMucThu", DanhMucThuSchema)