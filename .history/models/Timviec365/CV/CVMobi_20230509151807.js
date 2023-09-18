import mongoose from 'mongoose';
const CVMobiSchema = new mongoose.Schema(
    {
        tcmId:{
            type: Number
        },
        tcmCvId:{
            type: Number
        },
        oldImgCvMobi:{
            type: String
        },
        createTime:{
            type: Date
        },
        renderAgain:{
            type: Number
        },
        renderCount:{
            type: Number
        }
    },
    { collection: 'CVMobi',
      versionKey: false}
);

export default mongoose.model("CVMobi", CVMobiSchema)