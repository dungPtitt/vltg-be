const mongoose = require('mongoose');
const newTV365Schema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    userID: Number,
    // tiêu đề
    title: {
        type: String,
        default: null,
    },
    newMd5: {
        type: String,
        default: null,
    },
    // tên tiêu đè không đấu
    alias: {
        type: String,
        default: null,
    },
    // link quay lại
    redirect301: {
        type: String,
        default: ""
    },
    // thể loại việc làm
    cateID: [{
        type: String,
        default: null,
    }],
    //thể loại tag
    tagID: {
        type: Number,
        default: null,
    },
    // thành phố
    cityID: [{
        type: String,
    }],
    default: [],
    // quận huyện
    districtID: {
        type: String,
        default: null,
    },
    // dịa chỉ
    address: {
        type: String,
        default: null,
    },
    //giá trị trong option trong khoảng , nếu là 1 thì không phải option trong khoảng
    money: {
        type: Number,
        default: 0
    },
    // cấp bậc
    capBac: {
        type: Number,
        default: 0
    },
    //kinh nghiệm
    exp: {
        type: Number,
        default: 0
    },
    //giới tính
    sex: String,
    //bằng cấp
    bangCap: {
        type: Number,
        default: 0
    },
    //sô lượng
    soLuong: {
        type: Number,
        default: 0
    },
    //hình thức
    hinhThuc: {
        type: Number,
        default: 0
    },
    // độ tuổi
    doTuoi: {
        type: Number,
        default: 0
    },
    // thời gian tạo bài đăng
    createTime: {
        type: Date,
        default: null,
    },
    // thới gian update
    updateTime: {
        type: Date,
        default: null,
    },
    // thời gian vip của bài post
    vipTime: {
        type: Date,
        default: null,
    },
    vip: Number,
    cateTime: {
        type: Date,
        default: null,
    },
    // 0 là chưa được duyệt 1 là ngược lại
    active: {
        type: Number,
        default: 0
    },
    // thể loại
    type: {
        type: Number,
        default: 0
    },
    //
    over: {
        type: Number,
        default: 0
    },
    // số lượng xem
    viewCount: {
        type: Number,
        default: 0
    },
    // hạn nộp
    hanNop: {
        type: Date,
        default: null,
    },
    post: {
        type: Number,
        default: 0
    },
    renew: {
        type: Number,
        default: 0
    },
    newHot: {
        type: Number,
        default: 0
    },
    newDo: {
        type: Number,
        default: 0
    },
    newCao: {
        type: Number,
        default: 0
    },
    newGap: {
        type: Number,
        default: 0
    },
    newNganh: {
        type: Number,
        default: 0
    },
    newGhim: {
        type: Number,
        default: 0
    },
    newThuc: {
        type: Number,
        default: 0
    },
    newOrder: {
        type: Number,
        default: 0
    },
    newUt: {
        //
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
        moTa: {
            type: String,
            default: null,
        },
        // yêu cầu    
        yeuCau: {
            type: String,
            default: null,
        },
        //quyền lợi
        quyenLoi: {
            type: String,
            default: null,
        },
        //hô sơ  nhà tuyển dụng cần để ứng viên có
        hoSo: {
            type: String,
            default: null,
        },
        //tiêu đề seo
        titleSeo: {
            type: String,
            default: null,
        },
        // nọi dung seo
        desSeo: {
            type: String,
        },
        // hoa hồng nhận được
        hoaHong: {
            type: String,
            default: null,
        },
        tgtv: {
            type: String,
            default: null,
        },
        lv: {
            type: String,
            default: null,
        },
        baoLuu: {
            type: String,
            default: null,
        },
        timeBaoLuu: {
            type: Date,
            default: null,
        },
        jobPosting: {
            type: Number,
        },
        // video bài post
        videoType: {
            type: String,
            default: null,
        },
        videoActive: {
            type: String,
            default: null,
        },
        // link video
        link: {
            type: String,
            default: null,
        },
        // list ảnh bài post
        images: [{
            type: String,
            default: null,
        }]

    },
    newMoney: {
        // thể loại
        type: {
            type: Number,
            default: null
        },
        // từ mức    
        minValue: {
            type: Number,
            default: null
        },
        //đến mức
        maxValue: {
            type: Number,
            default: null
        },
        // loại tiền
        unit: {
            type: Number,
            default: 1
        }
    },

}, {
    collection: 'NewTV365',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("NewTV365", newTV365Schema);