const mongoose = require('mongoose');
const newTV365Schema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    userID: String,
    // tiêu đề
    title: String,
    newMd5: String,
    // tên tiêu đè không đấu
    alias: String,
    // link quay lại
    redirect301: {
        type: String,
        default: ""
    },
    // thể loại việc làm
    cateID: {
        type: Number,
        ref: ''
    },
    //thể loại tag
    tagID: Number,
    // thành phố
    cityID: {
        type: Number,
    },
    // quận huyện
    districtID: {
        type: String,
    },
    // dịa chỉ
    address: String,
    //giá trị trong option trong khoảng , nếu là 1 thì không phải option trong khoảng
    money: Number,
    // cấp bậc
    capBac: Number,
    //kinh nghiệm
    exp: Number,
    //giới tính
    sex: Number,
    //bằng cấp
    bangCap: Number,
    //sô lượng
    soLuong: Number,
    //hình thức
    hinhThuc: Number,
    // độ tuổi
    doTuoi: Number,
    // thời gian tạo bài đăng
    createTime: Date,
    // thới gian update
    updateTime: Date,
    // thời gian vip của bài post
    vipTime: Date,
    vip: Number,
    cateTime: Date,
    // 0 là chưa được duyệt 1 là ngược lại
    active: Number,
    // thể loại
    type: Number,
    //
    over: Number,
    // số lượng xem
    viewCount: Number,
    // hạn nộp
    hanNop: Date,
    post: Number,
    renew: {
        type: Number,
        default: 0
    },
    hot: {
        type: Number,
        default: 0
    },
    do: {
        type: Number,
        default: 0
    },
    cao: {
        type: Number,
        default: 0
    },
    nganh: {
        type: Number,
        default: 0
    },
    ghim: {
        type: Number,
        default: 0
    },
    thuc: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    ut: {
        type: Number,
        default: 0
    },
    hideAdmin: {
        type: Number,
        default: 0
    },
    sendVip: {
        type: Number,
        default: 0
    },
    newMutil: {
        // mô tả công việc
        moTa: String,
        // yêu cầu    
        yeuCau: String,
        //quyền lợi
        quyenLoi: String,
        //hô sơ 
        hoSo: {
            type: String,
        },
        //tiêu đề seo
        titleSeo: {
            type: String,
        },
        // nọi dung seo
        desSeo: {
            type: String,
        },
        // hoa hồng nhận được
        hoaHong: {
            type: String,
        },
        tgtv: {
            type: String,
        },
        lv: {
            type: String,
        },
        baoLuu: String,
        timeBaoLuu: {
            type: Date,
        },
        jobPosting: {
            type: Number,
        },
        // video bài post
        videoType: {
            type: String,
        },
        videoActive: {
            type: String,
        },
        // link video
        link: String,
        // list ảnh bài post
        images: [{
            type: String,
        }]

    },
    newMoney: {
        // thể loại
        type: {
            type: Number,
        },
        // từ mức    
        minValue: Number,
        //đến mức
        maxValue: Number,
        // loại tiền
        unit: {
            type: Number,
        }
    },

}, {
    collection: 'NewTV365',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("NewTV365", newTV365Schema);