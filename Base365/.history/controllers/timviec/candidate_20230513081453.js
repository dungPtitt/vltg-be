const Users = require('../../models/Timviec365/Timviec/Users');
const blog = require('../../models/Timviec365/Timviec/blog.model');
const CVUV = require('../../models/Timviec365/CV/CVUV');
const CV = require('../../models/Timviec365/CV/CV');
const like = require('../../models/Timviec365/CV/like');
const userUnset = require('../../models/Timviec365/Timviec/userUnset');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');
//mã hóa mật khẩu
const md5 = require('md5');
//token
var jwt = require('jsonwebtoken');
const axios = require('axios');
const functions = require('../../services/functions');
const { token } = require('morgan');


exports.index = (req, res, next) => {
    res.json('123 123123123')
}

exports.RegisterB1 = async(req, res, next) => {
    try {
        if (req.body.phoneTK) {
            const phoneTK = req.body.phoneTK
            const password = md5(req.body.password)
            const userName = req.body.userName
            const email = req.body.email
            const city = req.body.city
            const district = req.body.district
            const address = req.body.address
            const candiCateID = req.body.candiCateID
            const candiCityID = req.body.candiCityID
            const candiMucTieu = req.body.candiMucTieu
            const uRegis = req.body.uRegis

            // check số điện thoại đã đăng kí trong bảng user
            let CheckEmail = await functions.checkEmail(email)
            let CheckPhoneNumber = await functions.checkPhoneNumber(phoneTK);

            if (CheckPhoneNumber) { //check định dạng sdt
                let checkUser = await functions.getDatafindOne(Users, { phoneTK })

                if (checkUser) { // check trùng số điện thoại trong user
                    return res.status(200).json(setError(200, "Số điện thoại đã được đăng kí"));
                } else {
                    if (!email || CheckEmail) { // check định dạng email
                        // const newID
                        const maxID = await userUnset.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                        if (maxID) {
                            newID = Number(maxID._id) + 1;
                        } else newID = 1
                        let findUserUv = await functions.getDatafindOne(userUnset, { usePhoneTk: phoneTK })
                        if (findUserUv) {
                            let updateUserUv = await functions.getDatafindOneAndUpdate(userUnset, { usePhoneTk: phoneTK }, {
                                usePass: password,
                                useFirstName: userName,
                                useMail: email,
                                useCity: city,
                                useQh: district,
                                useAddr: address,
                                uRegis: uRegis,
                                useCvCate: candiCateID,
                                useCvCity: candiCityID,
                                useCvTitle: candiMucTieu
                            })

                        } else {
                            let UserUV = new userUnset({
                                _id: newID,
                                usePhoneTk: phoneTK,
                                usePass: password,
                                useFirstName: userName,
                                useMail: email,
                                useCity: city,
                                useQh: district,
                                useAddr: address,
                                uRegis: uRegis,
                                useCvCate: candiCateID,
                                useCvCity: candiCityID,
                                useCvTitle: candiMucTieu,
                                usePhone: "",
                                useCreateTime: new Date(Date.now()),
                                useLink: "",
                                useActive: 0,
                                useDelete: 0,
                                type: 0,


                            })
                            let saveUserUV = UserUV.save()
                        }
                        req.body.password = md5(req.body.password)
                        const token = await functions.createToken(req.body, "2d")

                        return functions.success(res, 'Them moi hoặc cập nhật UV chua hoan thanh ho so thanh cong', token)
                    } else return functions.setError(res, "Email không hợp lệ", 200);
                }
            } else return functions.setError(res, "Số điện thoại không hợp lệ", 200);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí B1", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }

}

exports.RegisterB2VideoUpload = async(req, res, next) => {
    try {
        if (req && req.body && req.body.token && req.file) {
            const token = req.body.token
            const videoUpload = req.file
            const videoLink = req.body.videoLink
            const userInfo = await functions.decodeToken(token, "2d")
            const phoneTK = userInfo.data.phoneTK
            const password = userInfo.data.password
            const userName = userInfo.data.userName
            const email = userInfo.data.email
            const city = userInfo.data.city
            const district = userInfo.data.district
            const address = userInfo.data.address
            const from = userInfo.data.uRegis
            const candiCateID = userInfo.data.candiCateID
            const candiCityID = userInfo.data.candiCityID
            const candiMucTieu = userInfo.data.candiMucTieu

            let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) { // check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            } else {
                const maxID = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                }
                const maxIDTimviec = await Users.findOne({ type: 0 }, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).lean();
                if (maxIDTimviec) {
                    newIDTimviec = Number(maxIDTimviec.idTimViec365) + 1;
                }
                if (videoUpload && !videoLink) { // check video tải lên là file video
                    let User = new Users({
                        _id: newID,
                        phoneTK: phoneTK,
                        password: password,
                        userName: userName,
                        type: 0,
                        email: email,
                        city: city,
                        district: district,
                        address: address,
                        from: from,
                        idTimViec365: newIDTimviec,
                        authentic: 0,
                        createdAt: new Date(Date.now()),
                        inForCandidateTV365: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiMucTieu: candiMucTieu,
                            video: videoUpload.filename,
                            videoType: 1,
                            videoActive: 1
                        }
                    })
                    let saveUser = User.save()
                }
                if (videoLink && !videoUpload) { //check video upload là link

                    let User = new Users({
                        _id: newID,
                        phoneTK: phoneTK,
                        password: password,
                        userName: userName,
                        type: 0,
                        email: email,
                        city: city,
                        district: district,
                        address: address,
                        from: from,
                        idTimViec365: newIDTimviec,
                        authentic: 0,
                        createdAt: new Date(Date.now()),
                        inForCandidateTV365: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiMucTieu: candiMucTieu,
                            video: videoLink,
                            videoType: 2,
                            videoActive: 1
                        }
                    })
                    let saveUser = User.save()
                }
                let deleteUser = userUnset.findOneAndDelete({ usePhoneTk: phoneTK })
                return functions.success(res, "Đăng kí thành công")
            }
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }


}

exports.login = async(req, res, next) => {

    if (req.body.phoneTK && req.body.password) {
        const type = 0;
        const phoneTK = req.body.phoneTK
        const password = req.body.password

        let checkPhoneNumber = await functions.checkPhoneNumber(phoneTK);
        if (checkPhoneNumber) {
            let findUser = await functions.getDatafindOne(Users, { phoneTK })
            if (!findUser) {
                return functions.setError(res, "không tìm thấy tài khoản trong bảng user", 200)
            }
            let checkPassword = await functions.verifyPassword(password, findUser.password)
            if (!checkPassword) {
                return functions.setError(res, "Mật khẩu sai", 200)
            }
            if (findUser.type == type) {
                let login = {
                    account: phoneTK,
                    password: password,
                    type: 0
                }
                const token = await functions.createToken(login, "2d")
                return functions.success(res, 'Đăng nhập thành công', token)
            }


        } else {
            return functions.setError(res, "không đúng định dạng số điện thoại", 200)
        }
    }
}

exports.RegisterB2CvUpload = async(req, res, next) => {
    try {

        if (req && req.body && req.body.token && req.files) {

            const token = req.body.token
            const birthday = req.body.birthday
            const candiExp = req.body.candiExp
            const candiHocVan = req.body.candiHocVan
            const candiSchool = req.body.candiSchool
            const fileUpload = req.files
            const videoLink = req.body.videoLink
            const userInfo = await functions.decodeToken(token, "2d")
            const phoneTK = userInfo.data.phoneTK
            const password = userInfo.data.password
            const userName = userInfo.data.userName
            const email = userInfo.data.email
            const city = userInfo.data.city
            const district = userInfo.data.district
            const address = userInfo.data.address
            const from = userInfo.data.uRegis
            const candiCateID = userInfo.data.candiCateID
            const candiCityID = userInfo.data.candiCityID
            const candiMucTieu = userInfo.data.candiMucTieu
            let cvUpload, videoUpload
            for (let i = 0; i < fileUpload.length; i++) {
                if (!fileUpload[i].fieldname == "cvUpload") {
                    return functions.setError(req, "không tải Cv", 200)
                }
                if (fileUpload[i].fieldname == "cvUpload") {
                    cvUpload = fileUpload[i]
                }
                if (fileUpload[i].fieldname == "videoUpload") {
                    videoUpload = fileUpload[i]
                    if (videoUpload.size > (100 * 1024 * 1024)) {
                        return functions.setError(req, "dung lượng file vượt quá 100 MB", 200)
                    }
                }
            }

            let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) { // check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            } else {
                const maxID = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                }
                const maxIDTimviec = await Users.findOne({ type: 0 }, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).lean();
                if (maxIDTimviec) {
                    newIDTimviec = Number(maxIDTimviec.idTimViec365) + 1;
                }
                if (videoUpload && !videoLink) { // check video tải lên là file video
                    console.log(1)
                    let User = new Users({
                        _id: newID,
                        phoneTK: phoneTK,
                        password: password,
                        userName: userName,
                        type: 0,
                        email: email,
                        city: city,
                        district: district,
                        address: address,
                        from: from,
                        idTimViec365: newIDTimviec,
                        authentic: 0,
                        createdAt: new Date(Date.now()),
                        birthday: birthday,
                        inForCandidateTV365: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiMucTieu: candiMucTieu,
                            candiExp: candiExp,
                            candiHocVan: candiHocVan,
                            candiSchool: candiSchool,
                            video: videoUpload.filename,
                            cv: cvUpload.filename,
                            videoType: 1,
                            videoActive: 1
                        }
                    });
                    User.save();
                }
                if (videoLink && !videoUpload) { //check video upload là link

                    let User = new Users({
                        _id: newID,
                        phoneTK: phoneTK,
                        password: password,
                        userName: userName,
                        type: 0,
                        email: email,
                        city: city,
                        district: district,
                        address: address,
                        from: from,
                        idTimViec365: newIDTimviec,
                        authentic: 0,
                        createdAt: new Date(Date.now()),
                        birthday: birthday,
                        inForCandidateTV365: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiMucTieu: candiMucTieu,
                            candiExp: candiExp,
                            candiHocVan: candiHocVan,
                            candiSchool: candiSchool,
                            video: videoLink,
                            cv: cvUpload.filename,
                            videoType: 2,
                            videoActive: 1
                        }
                    })
                    let saveUser = User.save()
                }
                let deleteUser = userUnset.findOneAndDelete({ usePhoneTk: phoneTK })
                return functions.success(res, "Đăng kí thành công")
            }
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }


}

exports.AddUserChat365 = async(req, res, next) => {
    try {
        // for(let i=0;i<325900;i=i+100){
        let takeData = await axios({
            method: "post",
            url: "http://43.239.223.142:9006/api/users/TakeDataUser",
            data: {
                count: 0
            },
            headers: { "Content-Type": "multipart/form-data" }
        });
        for (let j = 0; j < takeData.data.data.length; j++) {
            let CheckEmail = await functions.CheckEmail(takeData.data.data.email)
            let CheckPhoneNumber = await functions.CheckPhoneNumber(takeData.data.data.email)
            let checkUser = await functions.getDatafindOne(Users, { phoneTK: takeData.data.data.email, type: takeData.data.data.email })
            if (!checkUser && CheckPhoneNumber) {
                let user = new Users({
                    _id: takeData.data.data._id,
                    idQLC: takeData.data.data.id365,
                    type: takeData.data.data.type365,
                    phoneTK: takeData.data.data.email,
                    password: takeData.data.data.password,
                    userName: takeData.data.data.userName,
                    avatarUser: takeData.data.data.avatarUser,
                    lastActivedAt: takeData.data.data.lastActive,
                    isOnline: takeData.data.data.isOnline,
                    idTimViec365: takeData.data.data.idTimviec,
                    from: takeData.data.data.fromWeb,
                    chat365_secret: takeData.data.data.secretCode,
                    latitude: takeData.data.data.latitude,
                    longitude: takeData.data.data.longitude,
                })
            }
            if (!checkUser && CheckEmail) {
                let user = new Users({
                    _id: takeData.data.data._id,
                    idQLC: takeData.data.data.id365,
                    type: takeData.data.data.type365,
                    email: takeData.data.data.email,
                    password: takeData.data.data.password,
                    userName: takeData.data.data.userName,
                    avatarUser: takeData.data.data.avatarUser,
                    lastActivedAt: takeData.data.data.lastActive,
                    isOnline: takeData.data.data.isOnline,
                    idTimViec365: takeData.data.data.idTimviec,
                    from: takeData.data.data.fromWeb,
                    chat365_secret: takeData.data.data.secretCode,
                    latitude: takeData.data.data.latitude,
                    longitude: takeData.data.data.longitude,
                })
            }
        }
        // }
        res.json(await functions.success("Add dữ liệu thành công"))

    } catch (e) {
        console.log("add sữu liệu lỗi", e);
        functions.setError(res, 'Add sữu liệu lỗi', 404)
    }

}

// đôit mật khẩu
// b1: gửi mã otp tới tên tài khoản được nhập
exports.sendOTP = async(req, res, next) => {
    try {
        const user = req.body.user;
        if (await functions.checkPhoneNumber(user) && await functions.getDatafindOne(Users, { phoneTK: user })) {
            await functions.getDataAxios("http://43.239.223.142:9000/api/users/RegisterMailOtp", { user })
                .then((response) => {

                    const otp = response.data.otp;
                    if (otp) {
                        return Users.updateOne({ phoneTK: user }, {
                            $set: {
                                otp: otp
                            }
                        });
                    }
                    functions.setError(res, "Gửi OTP lỗi 1", );
                })
                .then(() => {
                    functions.getDatafindOne(Users, { phoneTK: user }, )
                        .then(async(response) => {
                            const token = await functions.createToken(response, '30m'); // tạo token chuyển lên headers
                            res.setHeader('authorization', `Bearer ${token}`);
                            return functions.success(res, 'Gửi OTP thành công');
                        });
                });

        } else if (await functions.checkEmail(user) && await functions.getDatafindOne(Users, { email: user }, )) {
            await functions.getDataAxios("http://43.239.223.142:9000/api/users/RegisterMailOtp", { user })
                .then((response) => {
                    const otp = response.data.otp;
                    if (otp) {
                        return Users.updateOne({ email: user }, {
                            $set: {
                                otp: otp
                            }
                        });
                    }
                    functions.setError(res, 'Gửi OTP lỗi 2', );
                })
                .then(() => {
                    Users.findOne({ email: user })
                        .then(async(response) => {
                            const token = await functions.createToken(response, '30m');
                            res.setHeader('authorization', `Bearer ${token}`);
                            return functions.success(res, 'Gửi OTP thành công');
                        });
                });
        } else {
            return functions.setError(res, "Tài khoản không tồn tại. ", 404)
        }
    } catch (e) {
        return functions.setError(res, "Gửi OTP lỗi3", )
    }

};

// b2: xác nhận mã otp
exports.confirmOTP = async(req, res, next) => {
    try {
        const _id = req.user.data._id;
        const otp = req.body.otp;
        const verify = await Users.findOne({ _id: _id, otp }); // tìm user với dk có otp === otp người dùng nhập

        if (verify) {
            const token = await functions.createToken(verify, '30m');
            res.setHeader('authorization', `Bearer ${token}`);
            return functions.success(res, 'Xác thực OTP thành công', );
        } else {
            return functions.setError(res, "Otp không chính xác 1", 404);
        }
    } catch (e) {
        return functions.setError(res, 'Xác nhận OTP lỗi', );
    }

};

//b3: đổi mật khẩu
exports.changePassword = async(req, res, next) => {
    try {
        const password = req.body.password;
        const _id = req.user.data._id;

        if (_id && password) {
            await Users.updateOne({ _id: _id }, { // update mật khẩu
                $set: {
                    password: md5(password)
                }
            });
            return functions.success(res, 'Đổi mật khẩu thành công');
        };
        return functions.setError(res, 'Đổi mật khẩu lỗi', 404);
    } catch (e) {
        return functions.setError(res, 'Đổi mật khẩu lỗi', );
    }
};
exports.RegisterB2CvSite = async(req, res, next) => {
    try {
        if (req && req.body && req.body.token && req.file) {
            const token = req.body.token
            const imageUpload = req.file
            const lang = req.body.lang
            const html = JSON.stringify(req.body.html)
            console.log(html)
            const cvId = req.body.cvId
            const status = req.body.status
            const heightCv = req.body.heightCv
            const scan = req.body.scan
            const state = req.body.state
            const userInfo = await functions.decodeToken(token, "2d")
            const phoneTK = userInfo.data.phoneTK
            const password = userInfo.data.password
            const userName = userInfo.data.userName
            const email = userInfo.data.email
            const city = userInfo.data.city
            const district = userInfo.data.district
            const address = userInfo.data.address
            const from = userInfo.data.uRegis
            const candiCateID = userInfo.data.candiCateID
            const candiCityID = userInfo.data.candiCityID
            const candiMucTieu = userInfo.data.candiMucTieu


            let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) { // check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            } else {
                const maxID = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                }
                const maxIDTimviec = await Users.findOne({ type: 0 }, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).lean();
                if (maxIDTimviec) {
                    newIDTimviec = Number(maxIDTimviec.idTimViec365) + 1;
                }
                const maxIDCv = await CVUV.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxIDCv) {
                    newIDCv = Number(maxIDCv._id) + 1
                } else {
                    newIDCv = 0
                }
                let User = new Users({
                    _id: newID,
                    phoneTK: phoneTK,
                    password: password,
                    userName: userName,
                    type: 0,
                    email: email,
                    city: city,
                    district: district,
                    address: address,
                    from: from,
                    idTimViec365: newIDTimviec,
                    authentic: 0,
                    createdAt: new Date(Date.now()),
                    inForCandidateTV365: {
                        user_id: 0,
                        candiCateID: candiCateID,
                        candiCityID: candiCityID,
                        candiMucTieu: candiMucTieu,
                    }
                })
                User.save()
                let CvUv = new CVUV({
                    _id: newIDCv,
                    userId: newID,
                    cvId: cvId,
                    lang: lang,
                    html: html,
                    nameImage: imageUpload.filename,
                    timeEdit: new Date(Date.now()),
                    status: status,
                    scan: scan,
                    state: state,
                    heightCv: heightCv,
                })
                CvUv.save()

                let deleteUser = userUnset.findOneAndDelete({ usePhoneTk: phoneTK })
                return functions.success(res, "Đăng kí thành công")
            }
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }


}

exports.loginUv = async(req, res, next) => {

    if (req.body.phoneTK && req.body.password) {
        const type = 0;
        const phoneTK = req.body.phoneTK
        const password = req.body.password

        let checkPhoneNumber = await functions.checkPhoneNumber(phoneTK);
        if (checkPhoneNumber) {
            let findUser = await functions.getDatafindOne(Users, { phoneTK })
            if (!findUser) {
                return functions.setError(res, "không tìm thấy tài khoản trong bảng user", 200)
            }
            let checkPassword = await functions.verifyPassword(password, findUser.password)
            if (!checkPassword) {
                return functions.setError(res, "Mật khẩu sai", 200)
            }
            if (findUser.type == type) {
                const token = await functions.createToken(findUser, "2d")
                return functions.success(res, 'Đăng nhập thành công', token)
            } else return functions.setError(res, "tài khoản này không phải tài khoản cá nhân", 200)


        } else {
            return functions.setError(res, "không đúng định dạng số điện thoại", 200)
        }
    }
}

exports.completeProfileQlc = async(req, res, next) => {
    try {
        let phoneTK = String(req.user.data.phoneTK)
        let newAI = []
        let newCv = []
        let newBlog = []
        console.log(req.user.data)
        let candiCateID = Number(req.user.data.inForCandidateTV365.candiCateID.split(",")[0])

        let takeData = await axios({
            method: "post",
            url: "http://43.239.223.10:4001/recommendation_tin_ungvien",
            data: {
                site_job: "timviec365",
                site_uv: "uvtimviec365",
                new_id: candiCateID,
                size: 20,
                pagination: 1,
            },
            headers: { "Content-Type": "multipart/form-data" }
        });
        let listNewId = takeData.data.data.list_id.split(",")
        for (let i = 0; i < listNewId.length; i++) {
            listNewId[i] = Number(listNewId[i])
        }

        let findNew = await functions.getDatafind(newTV365, { _id: { $in: listNewId } })
        for (let i = 0; i < findNew.length; i++) {
            newAI.push(findNew[i])
        }

        let findCv = await functions.getDatafind(CV, {})

        for (let i = 0; i < findCv.length; i++) {
            newCv.push(findCv[i])
        }

        let findBlog = await functions.getDatafind(blog, { categoryID: candiCateID })
        for (let i = 0; i < findBlog.length; i++) {
            newBlog.push(findBlog[i])
        }


        functions.success(res, "Hiển thị qlc thành công", { newAI, newCv, newBlog })
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }

}

exports.cvXinViec = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data._id
            let findCvUv = await functions.pageFind(CVUV, { userId }, { _id: 1 }, skip, limit)
            const totalCount = await CVUV.countDocuments({ userId: userId })
            const totalPages = Math.ceil(totalCount / pageSize)

            let findFavorCvUv = await functions.pageFind(like, { userId }, { _id: 1 }, skip, limit)
            const totalCountFavor = await like.countDocuments({ userId: userId, type: 1 })
            const totalPagesFavor = Math.ceil(totalCountFavor / pageSize)
            if (findCvUv) {
                functions.success(res, "Hiển thị những CV Đã tạo và yêu thích thành công", { CVUV: { totalCount, totalPages, listCv: findCvUv }, CVUVFavor: { totalCountFavor, totalPagesFavor, listCvFavor: findFavorCvUv } });
            }
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.donXinViec = async(req, res, next) => {
    try {
        if (req.body.user) {
            let start = Number(req.body.start)
            let count = Number(req.body.count)
            let end = start + count
            let userId = req.body.user.data._id
            let findCvUv = functions.pageFind(CVUV, { userId: userId }, { _id: $slice[start, end] })
                // let findFavorCv = functions.pageFind(CV,{},{})
            if (findCvUv) {
                functions.success(res, "Hiển thị những CV Đã tạo và yêu thích thành công", findCvUv)
            }
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}