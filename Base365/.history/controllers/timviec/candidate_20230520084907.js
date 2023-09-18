const Users = require('../../models/Users');
const blog = require('../../models/Timviec365/Timviec/Blog/Blog.model');
const hoso = require('../../models/Timviec365/Timviec/Candicate/hoso');
const CVUV = require('../../models/Timviec365/CV/CVUV');
const donUV = require('../../models/Timviec365/CV/DonUV');
const HoSoUV = require('../../models/Timviec365/CV/HoSoUV');
const ThuUV = require('../../models/Timviec365/CV/ThuUV');
const CV = require('../../models/Timviec365/CV/CV');
const like = require('../../models/Timviec365/CV/like');
const userUnset = require('../../models/Timviec365/Timviec/Candicate/UserUnset');
const newTV365 = require('../../models/Timviec365/Timviec/Company/New.model');
const nopHoSo = require('../../models/Timviec365/Timviec/Candicate/ApplyForJob.model');
const luuViecLam = require('../../models/Timviec365/Timviec/Candicate/UserSavePost.model');
//mã hóa mật khẩu
const md5 = require('md5');
//token
var jwt = require('jsonwebtoken');
const axios = require('axios');
const functions = require('../../services/functions');
const { token } = require('morgan');
const fs = require('fs');
const path = require('path');


exports.index = (req, res, next) => {
    res.json('123 123123123')
}

//đăng kí ứng viên B1
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
            const candiTitle = req.body.candiTitle
            const uRegis = req.body.uRegis

            // check số điện thoại đã đăng kí trong bảng user
            let CheckEmail = await functions.checkEmail(email)
            let CheckPhoneNumber = await functions.checkPhoneNumber(phoneTK);

            if (CheckPhoneNumber) { //check định dạng sdt
                let checkUser = await functions.getDatafindOne(Users, { phoneTK, type: 0 })

                if (checkUser) { // check trùng số điện thoại trong user
                    return functions.setError(res, "Số điện thoại đã được đăng kí", 200);
                } else {
                    if (!email || CheckEmail) { // check định dạng email
                        // const newID
                        const maxID = await userUnset.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                        if (maxID) {
                            newID = Number(maxID._id) + 1;
                        } else newID = 1
                        const maxIDUser = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                        if (maxIDUser) {
                            newIDUser = Number(maxIDUser._id) + 1;
                        } else newIDUser = 1;

                        let findUserUv = await functions.getDatafindOne(userUnset, { usePhoneTk: phoneTK, type: 0 })
                        if (findUserUv) {
                            let updateUserUv = await functions.getDatafindOneAndUpdate(userUnset, { usePhoneTk: phoneTK, type: 0 }, {
                                usePass: password,
                                useFirstName: userName,
                                useMail: email,
                                useCity: city,
                                useQh: district,
                                useAddr: address,
                                uRegis: uRegis,
                                useCvCate: candiCateID,
                                useCvCity: candiCityID,
                                useCvTitle: candiTitle,
                                type: 0
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
                                useCvTitle: candiTitle,
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
                        req.body._id = newIDUser
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

//đăng kí ứng viên B2 bằng video
exports.RegisterB2VideoUpload = async(req, res, next) => {
    try {
        if (req && req.body && req.file) {
            const videoUpload = req.file
            const videoLink = req.body.videoLink
            const phoneTK = req.user.data.phoneTK
            const password = req.user.data.password
            const userName = req.user.data.userName
            const email = req.user.data.email
            const city = req.user.data.city
            const district = req.user.data.district
            const address = req.user.data.address
            const from = req.user.data.uRegis
            const candiCateID = req.user.data.candiCateID
            const candiCityID = req.user.data.candiCityID
            const candiTitle = req.user.data.candiTitle
            const type = req.user.data.type

            let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK, type: 0 })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) { // check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            } else {
                const maxID = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                }
                const maxIDTimviec = await Users.findOne({}, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).lean();
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
                        inForPerson: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiTitle: candiTitle,
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
                        inForPerson: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiTitle: candiTitle,
                            video: videoLink,
                            videoType: 2,
                            videoActive: 1
                        }
                    })
                    let saveUser = User.save()
                }
                let deleteUser = userUnset.findOneAndDelete({ usePhoneTk: phoneTK, type: 0 })
                return functions.success(res, "Đăng kí thành công")
            }
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }


}

//đăng kí ứng viên bước 2 bằng cách upload cv
exports.RegisterB2CvUpload = async(req, res, next) => {
    try {

        if (req && req.body && req.files) {
            const birthday = req.body.birthday
            const exp = req.body.exp
            const candiHocVan = req.body.candiHocVan
            const candiSchool = req.body.candiSchool
            const fileUpload = req.files
            const videoLink = req.body.videoLink
            const phoneTK = req.user.data.phoneTK
            const password = req.user.data.password
            const userName = req.user.data.userName
            const email = req.user.data.email
            const city = req.user.data.city
            const district = req.user.data.district
            const address = req.user.data.address
            const from = req.user.data.uRegis
            const candiCateID = req.user.data.candiCateID
            const candiCityID = req.user.data.candiCityID
            const candiTitle = req.user.data.candiTitle
            const type = req.user.data.type
            let cvUpload, videoUpload

            if (!fileUpload.cvUpload) {
                return functions.setError(req, "không tải Cv", 200)
            }
            if (fileUpload.cvUpload) {
                cvUpload = fileUpload.cvUpload
            }
            if (fileUpload.videoUpload) {
                videoUpload = fileUpload.videoUpload
                if (videoUpload.size > (100 * 1024 * 1024)) {
                    return functions.setError(req, "dung lượng file vượt quá 100 MB", 200)
                }
            }
            let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK, type: 0 })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) { // check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            } else {
                const maxID = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                } else newID = 1
                const maxIDTimviec = await Users.findOne({}, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).lean();
                if (maxIDTimviec) {
                    newIDTimviec = Number(maxIDTimviec.idTimViec365) + 1;
                } else newIDTimviec = 1
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
                        birthday: birthday,
                        inForPerson: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiTitle: candiTitle,
                            exp: exp,
                            candiHocVan: candiHocVan,
                            candiSchool: candiSchool,
                            video: videoUpload[0].filename,
                            cv: cvUpload[0].filename,
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
                        inForPerson: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiTitle: candiTitle,
                            exp: exp,
                            candiHocVan: candiHocVan,
                            candiSchool: candiSchool,
                            video: videoLink,
                            cv: cvUpload[0].filename,
                            videoType: 2,
                            videoActive: 1
                        }
                    })
                    let saveUser = User.save()
                }
                let deleteUser = userUnset.findOneAndDelete({ usePhoneTk: phoneTK, type: 0 })
                return functions.success(res, "Đăng kí thành công")
            }
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }


}

// b1: gửi mã otp tới tên tài khoản được nhập
exports.sendOTP = async(req, res, next) => {
    try {
        Users.create({
            _id: 2,
            phoneTK: '0981641139',
            userName: 'vantrung',
            type: 0,
            password: 'eeee',
        })
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

//đổi mật khẩu 
//B1L gửi otp
exports.sendOTPChangePass = async(req, res, next) => {
    try {
        const user = req.user.data.phoneTK;
        const type = req.user.data.type
        if (await functions.checkPhoneNumber(user) && await functions.getDatafindOne(Users, { phoneTK: user, type: type })) {
            await functions.getDataAxios("http://43.239.223.142:9000/api/users/RegisterMailOtp", { user })
                .then((response) => {
                    const otp = response.data.otp;
                    if (otp) {
                        return Users.updateOne({ phoneTK: user, type: type }, {
                            $set: {
                                otp: otp
                            }
                        });
                    }
                    functions.setError(res, "Gửi OTP lỗi 1", );
                })
                .then(() => {
                    functions.getDatafindOne(Users, { phoneTK: user, type: type }, )
                        .then(async(response) => {
                            const token = await functions.createToken(response, '30m'); // tạo token chuyển lên headers
                            res.setHeader('authorization', `Bearer ${token}`);
                            return functions.success(res, 'Gửi OTP thành công');
                        });
                });

        } else if (await functions.checkEmail(user) && await functions.getDatafindOne(Users, { email: user, type: type }, )) {
            await functions.getDataAxios("http://43.239.223.142:9000/api/users/RegisterMailOtp", { user })
                .then((response) => {
                    const otp = response.data.otp;
                    if (otp) {
                        return Users.updateOne({ email: user, type: type }, {
                            $set: {
                                otp: otp
                            }
                        });
                    }
                    functions.setError(res, 'Gửi OTP lỗi 2', );
                })
                .then(() => {
                    Users.findOne({ email: user, type: type })
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

//đăng kí = cách làm cv trên site
exports.RegisterB2CvSite = async(req, res, next) => {
    try {
        if (req && req.body && req.file) {
            const imageUpload = req.file
            const lang = req.body.lang
            const html = JSON.stringify(req.body.html)
            const cvId = req.body.cvId
            const status = req.body.status
            const heightCv = req.body.heightCv
            const scan = req.body.scan
            const state = req.body.state
            const phoneTK = req.user.data.phoneTK
            const password = req.user.data.password
            const userName = req.user.data.userName
            const email = req.user.data.email
            const city = req.user.data.city
            const district = req.user.data.district
            const address = req.user.data.address
            const from = req.user.data.uRegis
            const candiCateID = req.user.data.candiCateID
            const candiCityID = req.user.data.candiCityID
            const candiTitle = req.user.data.candiTitle
            const type = req.user.data.type

            let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK, type: type })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) { // check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            } else {
                const maxID = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                }
                const maxIDTimviec = await Users.findOne({}, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).lean();
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
                    inForPerson: {
                        user_id: 0,
                        candiCateID: candiCateID,
                        candiCityID: candiCityID,
                        candiTitle: candiTitle,
                    }
                })
                User.save()
                let CvUv = new CVUV({
                    _id: newIDCv,
                    userId: newIDTimviec,
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

                let deleteUser = userUnset.findOneAndDelete({ usePhoneTk: phoneTK, type: type })
                return functions.success(res, "Đăng kí thành công")
            }
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }


}

//ứng viên đăng nhập
exports.loginUv = async(req, res, next) => {

    if (req.body.phoneTK && req.body.password) {
        const type = 0;
        const phoneTK = req.body.phoneTK
        const password = req.body.password

        let checkPhoneNumber = await functions.checkPhoneNumber(phoneTK);
        if (checkPhoneNumber) {
            let findUser = await functions.getDatafindOne(Users, { phoneTK, type: 0 })
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

// trang qlc trong hoàn thiện hồ sơ
exports.completeProfileQlc = async(req, res, next) => {
    try {
        let phoneTK = String(req.user.data.phoneTK)
        let newAI = []
        let newCv = []
        let newBlog = []
        console.log(req.user.data)
        let candiCateID = Number(req.user.data.inForPerson.candiCateID.split(",")[0])

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

// danh sách cv xin việc và cv yêu thích của ứng viên
exports.cvXinViec = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data.idTimViec365
            let findCvUv = await functions.pageFind(CVUV, { userId }, { _id: 1 }, skip, limit)
            const totalCount = await CVUV.countDocuments({ userId: userId })
            const totalPages = Math.ceil(totalCount / pageSize)

            let findFavorCvUv = await functions.pageFind(like, { userId: userId, type: 1 }, { _id: 1 }, skip, limit)
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

// danh sách đơn xin việc và đơn yêu thích của ứng viên
exports.donXinViec = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data.idTimViec365
            let findDonUv = await functions.pageFind(donUV, { userId }, { _id: 1 }, skip, limit)
            const totalCount = await donUV.countDocuments({ userId: userId })
            const totalPages = Math.ceil(totalCount / pageSize)

            let findFavorDonUv = await functions.pageFind(like, { userId: userId, type: 3 }, { _id: 1 }, skip, limit)
            const totalCountFavor = await like.countDocuments({ userId: userId, type: 3 })
            const totalPagesFavor = Math.ceil(totalCountFavor / pageSize)
            if (findDonUv) {
                functions.success(res, "Hiển thị những đơn xin việc Đã tạo và yêu thích thành công", { donUV: { totalCount, totalPages, listDon: findDonUv }, donUVFavor: { totalCountFavor, totalPagesFavor, listDonFavor: findFavorDonUv } });
            }
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// danh sách thư xin việc và thư yêu thích của ứng viên
exports.thuXinViec = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data.idTimViec365
            let findThuUv = await functions.pageFind(ThuUV, { userId }, { _id: 1 }, skip, limit)
            const totalCount = await ThuUV.countDocuments({ userId: userId })
            const totalPages = Math.ceil(totalCount / pageSize)

            let findFavorThuUv = await functions.pageFind(like, { userId: userId, type: 0 }, { _id: 1 }, skip, limit)
            const totalCountFavor = await like.countDocuments({ userId: userId, type: 0 })
            const totalPagesFavor = Math.ceil(totalCountFavor / pageSize)
            if (findThuUv) {
                functions.success(res, "Hiển thị những Thư xin việc Đã tạo và yêu thích thành công", { ThuUV: { totalCount, totalPages, listThu: findThuUv }, ThuUVFavor: { totalCountFavor, totalPagesFavor, listThuFavor: findFavorThuUv } });
            }
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// danh sách hồ sơ xin việc và hồ sơ yêu thích của ứng viên
exports.hosoXinViec = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data.idTimViec365
            let findHoSoUv = await functions.pageFind(HoSoUV, { userId }, { _id: 1 }, skip, limit)
            const totalCount = await HoSoUV.countDocuments({ userId: userId })
            const totalPages = Math.ceil(totalCount / pageSize)

            let findFavorHoSoUv = await functions.pageFind(like, { userId: userId, type: 2 }, { _id: 1 }, skip, limit)
            const totalCountFavor = await like.countDocuments({ userId: userId, type: 2 })
            const totalPagesFavor = Math.ceil(totalCountFavor / pageSize)
            if (findHoSoUv) {
                functions.success(res, "Hiển thị những HoSo xin việc Đã tạo và yêu thích thành công", { HoSoUV: { totalCount, totalPages, listHoSo: findHoSoUv }, HoSoUVFavor: { totalCountFavor, totalPagesFavor, listHoSoFavor: findFavorHoSoUv } });
            }
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//danh sách tin ứng tuyển ứng viên đã ứng tuyển
exports.listJobCandidateApply = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data.idTimViec365
            let listJobUv = await functions.pageFind(applyForJob, { userID: userId }, { _id: 1 }, skip, limit)
            const totalCount = await applyForJob.countDocuments({ userID: userId })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listJobUv) {
                functions.success(res, "Hiển thị những việc làm ứng viên đã ứng tuyển thành công", { listJobCandidateApply: { totalCount, totalPages, listJob: listJobUv } });
            }
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//danh sách tin ứng tuyển ứng viên đã lưu
exports.listJobCandidateSave = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data.idTimViec365
            let listJobUvSave = await functions.pageFind(userSavePost, { userID: userId }, { _id: 1 }, skip, limit)
            const totalCount = await applyForJob.countDocuments({ userID: userId })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listJobUvSave) {
                functions.success(res, "Hiển thị những việc làm ứng viên đã ứng tuyển thành công", { listJobCandidateSave: { totalCount, totalPages, listJob: listJobUvSave } });
            }
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật thông tin liên hệ
exports.updateContactInfo = async(req, res, next) => {
    try {
        if (req.user && req.body.name && req.body.phone && req.body.address && req.body.birthday &&
            req.body.gioitinh && req.body.honnhan && req.body.thanhpho && req.body.quanhuyen) {
            let userId = req.user.data.idTimViec365
            let userName = req.body.name
            let phone = req.body.phone
            let address = req.body.address
            let birthday = req.body.birthday
            let gender = req.body.gioitinh
            let married = req.body.honnhan
            let city = req.body.thanhpho
            let district = req.body.quanhuyen
            let avatarUser = req.file
            let updateUser = await functions.findOneAndUpdateUser(userId, {
                userName: userName,
                phone: phone,
                address: address,
                city: city,
                district: district,
                avatarUser: avatarUser.filename,
                inForPerson: {
                    birthday: birthday,
                    gender: gender,
                    married: married,
                }
            })
            if (updateUser) {
                functions.success(res, "Cập nhật thông tin liên hệ thành công,");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật công việc mong muốn
exports.updateDesiredJob = async(req, res, next) => {
    try {
        if (req.user && req.body.candiTitle && req.body.candiLoaiHinh && req.body.candiCityID && req.body.candiCateID &&
            req.body.exp && req.body.candiCapBac && req.body.candiMoney) {

            let userId = req.user.data.idTimViec365
            let candiTitle = req.body.title
            let candiLoaiHinh = req.body.ht
            let candiCityID = req.body.city
            let candiCateID = req.body.cate
            let exp = req.body.kn
            let candiCapBac = req.body.capbac
            let candiMoney = req.body.money_kg
            let candiMoneyUnit = req.body.money_unit
            let candiMoneyType = req.body.money_type
            let candiMoneyMin = req.body.money_min
            let candiMoneyMax = req.body.money_max

            let updateUser = await functions.findOneAndUpdateUser(userId, {
                inForPerson: {
                    candiCateID: candiCateID,
                    exp: exp,
                    candiCapBac: candiCapBac,
                    candiTitle: candiTitle,
                    candiLoaiHinh: candiLoaiHinh,
                    candiCityID: candiCityID,
                    candiMoney: candiMoney,
                    candiMoneyUnit: candiMoneyUnit,
                    candiMoneyType: candiMoneyType,
                    candiMoneyMin: candiMoneyMin,
                    candiMoneyMax: candiMoneyMax,
                }
            })
            if (updateUser) {
                functions.success(res, "Cập nhật thông tin công việc mong muốn thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật mục tiêu nghề nghiệp
exports.updateCareerGoals = async(req, res, next) => {
    try {
        if (req.user && req.body.muctieu) {

            let userId = req.user.data.idTimViec365
            let candiMucTieu = req.body.muctieu
            let updateUser = await functions.findOneAndUpdateUser(userId, {
                inForPerson: {
                    candiMucTieu: candiMucTieu,
                }
            })
            if (updateUser) {
                functions.success(res, "Cập nhật mục tiêu nghề nghiệp thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật kỹ năng bản thân
exports.updateSkills = async(req, res, next) => {
    try {
        if (req.user && req.body.kynang) {

            let userId = req.user.data.idTimViec365
            let candiSkills = req.body.kynang
            let updateUser = await functions.findOneAndUpdateUser(userId, {
                inForPerson: {
                    candiSkills: candiSkills,
                }
            })
            if (updateUser) {
                functions.success(res, "Cập nhật Kỹ năng bản thân thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật thông tin người tham chiếu
exports.updateReferencePersonInfo = async(req, res, next) => {
    try {
        if (req.user && req.body.referencePersonName && req.body.referencePersonEmail &&
            req.body.referencePersonPhone && req.body.referencePersonPosition && req.body.referencePersonCompany) {

            let userId = req.user.data.idTimViec365
            let referencePersonName = req.body.referencePersonName
            let referencePersonEmail = req.body.referencePersonEmail
            let referencePersonPhone = req.body.referencePersonPhone
            let referencePersonPosition = req.body.referencePersonPosition
            let referencePersonCompany = req.body.referencePersonCompany
            let updateUser = await functions.findOneAndUpdateUser(userId, {
                inForPerson: {
                    referencePersonName: referencePersonName,
                    referencePersonEmail: referencePersonEmail,
                    referencePersonPhone: referencePersonPhone,
                    referencePersonPosition: referencePersonPosition,
                    referencePersonCompany: referencePersonCompany,
                }
            })
            if (updateUser) {
                functions.success(res, "Cập nhật Thông tin người tham chiếu thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Cập nhật video giới thiệu
exports.updateIntroVideo = async(req, res, next) => {
    try {
        if (req.user) {
            let userId = req.user.data.idTimViec365
            let videoLink = req.body.videoLink
            if (req.file && !videoLink) {
                let videoName = req.file.filename
                let updateUser = await functions.findOneAndUpdateUser(userId, {
                    inForPerson: {
                        video: videoName,
                        videoType: 0
                    }
                })
                if (updateUser) {
                    functions.success(res, "Cập nhật Video giới thiệu bản thân thành công");
                }
            } else if (!req.body.file && videoLink) {
                let updateUser = await functions.findOneAndUpdateUser(userId, {
                    inForPerson: {
                        video: videoLink,
                        videoType: 1
                    }
                })
                if (updateUser) {
                    functions.success(res, "Cập nhật Video giới thiệu bản thân thành công");
                }
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật video giới thiệu", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Thêm dữ liệu bằng cấp học vấn
exports.addDegree = async(req, res, next) => {
    try {
        if (req.user && req.body.bc && req.body.truonghoc && req.body.chuyennganh && req.body.xeploai && req.body.bosungth && req.body.onetime && req.body.twotime) {

            let userId = req.user.data.idTimViec365
            let degree = req.body.bc
            let school = req.body.truonghoc
            let major = req.body.chuyennganh
            let rate = req.body.xeploai
            let implement = req.body.bosungth
            let start = req.body.onetime
            let end = req.body.twotime
            const maxID = await Users.findOne({ idTimViec365: userId }, { "inForPerson.candiDegree.id": 1 }).sort({ "inForPerson.candiDegree.id": -1 }).limit(1).lean();
            if (maxID.inForPerson.candiDegree[0]) {
                newID = Number(maxID.inForPerson.candiDegree[maxID.inForPerson.candiDegree.length - 1].id + 1);
            } else newID = 1
            let addDegree = {
                id: newID,
                degree,
                school,
                major,
                rate,
                implement,
                start,
                end
            }

            let updateUser = await functions.findOneAndUpdateUser(userId, {
                $push: {
                    "inForPerson.candiDegree": addDegree
                }
            })
            if (updateUser) {
                functions.success(res, "Thêm bằng cấp học vấn thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi thêm bằng cấp học vấn", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật bằng cấp học vấn
exports.updateDegree = async(req, res, next) => {
    try {
        if (req.user && req.body.bc && req.body.truonghoc && req.body.chuyennganh && req.body.xeploai && req.body.bosungth && req.body.onetime && req.body.twotime && req.body.idhv) {

            let userId = req.user.data.idTimViec365
            let degree = req.body.bc
            let school = req.body.truonghoc
            let major = req.body.chuyennganh
            let rate = req.body.xeploai
            let implement = req.body.bosungth
            let start = req.body.onetime
            let end = req.body.twotime
            let id = Number(req.body.idhv)
            let updateDegree = {
                id: id,
                degree,
                school,
                major,
                rate,
                implement,
                start,
                end
            }

            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiDegree.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiDegree.id": id
                    },
                ]
            }, {
                $set: {
                    "inForPerson.candiDegree.$": updateDegree
                },
            })
            if (updateUser) {
                functions.success(res, "Cập nhật bằng cấp học vấn thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật bằng cấp học vấn", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//xóa bằng cấp học vấn
exports.deleteDegree = async(req, res, next) => {
    try {
        if (req.user && req.body.bc && req.body.truonghoc && req.body.chuyennganh && req.body.xeploai && req.body.bosungth && req.body.onetime && req.body.twotime && req.body.idhv) {

            let userId = req.user.data.idTimViec365
            let degree = req.body.bc
            let school = req.body.truonghoc
            let major = req.body.chuyennganh
            let rate = req.body.xeploai
            let implement = req.body.bosungth
            let start = req.body.onetime
            let end = req.body.twotime
            let id = Number(req.body.idhv)
            let deleteDegree = {
                id: id,
                degree,
                school,
                major,
                rate,
                implement,
                start,
                end
            }

            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiDegree.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiDegree.id": id
                    },
                ]
            }, {
                $pull: {
                    "inForPerson.candiDegree.$": deleteDegree
                },
            })
            if (updateUser) {
                functions.success(res, "Xóa bằng cấp học vấn thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi xóa bằng cấp học vấn", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//làm mới hồ sơ
exports.RefreshProfile = async(req, res, next) => {
    try {
        if (req.user) {
            let userId = req.user.data.idTimViec365
            let updateUser = await functions.findOneAndUpdateUser(userId, {
                updatedAt: new Date(Date.now())
            })
            if (updateUser) {
                functions.success(res, "Làm mới hồ sơ thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Cập nhật ảnh đại diện
exports.updateAvatarUser = async(req, res, next) => {
    try {
        if (req.user) {
            let userId = req.user.data.idTimViec365
            if (req.file) {
                let imageName = req.file.filename
                let updateUser = await functions.findOneAndUpdateUser(userId, {
                    avatarUser: imageName
                })
                if (updateUser) {
                    functions.success(res, "Cập nhật ảnh đại diện thành công");
                }
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật ảnh đại diện", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//tải hồ sơ của tôi lên (cv)
exports.upLoadHoSo = async(req, res, next) => {
    try {
        if (req.user && req.body.cvname) {
            let userId = req.user.data.idTimViec365
            let nameHoSo = req.body.nameHoSo
            if (req.file) {
                const targetDirectory = `public/candidate/${userId}`;
                // Đặt lại tên file
                const originalname = req.file.originalname;
                const extension = originalname.split('.').pop();
                const uniqueSuffix = Date.now();
                const newFilename = nameHoSo + uniqueSuffix + '.' + extension;

                // Đường dẫn tới file cũ
                const oldFilePath = req.file.path;

                // Đường dẫn tới file mới
                const newFilePath = path.join(targetDirectory, newFilename);

                // Di chuyển file và đổi tên file
                fs.rename(oldFilePath, newFilePath, async function(err) {
                    if (err) {
                        console.error(err);
                        return functions.setError(res, "Lỗi khi đổi tên file", 400);
                    }
                })

                const maxID = await hoso.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                } else newID = 1

                let findhoso = await functions.getDatafind(hoso, { userId })
                if (findhoso.length < 3) {
                    let hosoUv = new hoso({
                        _id: newID,
                        userId: userId,
                        name: newFilename,
                        createTime: new Date(Date.now()),
                    })
                    let savehosoUv = hosoUv.save()
                    findhoso.push(hosoUv)
                    if (savehosoUv) {
                        functions.success(res, "Tải lên hồ sơ thành công", findhoso);
                    }

                } else return functions.setError(res, "Bạn chỉ có thể upload tối đa 3 hồ sơ", 400);
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi tải lên hồ sơ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Thêm dữ liệu Ngoại ngữ tin học
exports.addNgoaiNgu = async(req, res, next) => {
    try {
        if (req.user && req.body.chungchi && req.body.sodiem && req.body.ngoaingu) {

            let userId = req.user.data.idTimViec365
            let chungChi = req.body.chungchi
            let point = req.body.sodiem
            let ngoaiNgu = req.body.ngoaingu

            const maxID = await Users.findOne({ idTimViec365: userId }, { "inForPerson.candiNgoaiNgu.id": 1 }).sort({ "inForPerson.candiNgoaiNgu.id": -1 }).limit(1).lean();
            if (maxID.inForPerson.candiNgoaiNgu[0]) {
                newID = Number(maxID.inForPerson.candiNgoaiNgu[maxID.inForPerson.candiNgoaiNgu.length - 1].id + 1);
            } else newID = 1
            let addNgoaiNgu = {
                id: newID,
                chungChi,
                point,
                ngoaiNgu,
            }

            let updateUser = await functions.findOneAndUpdateUser(userId, {
                $push: {
                    "inForPerson.candiNgoaiNgu": addNgoaiNgu
                }
            })
            if (updateUser) {
                functions.success(res, "Thêm ngoại ngữ thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi thêm ngoại ngữ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật Ngoại ngữ tin học
exports.updateNgoaiNgu = async(req, res, next) => {
    try {
        if (req.user && req.body.chungchi && req.body.sodiem && req.body.ngoaingu && req.body.idnn) {

            let userId = req.user.data.idTimViec365
            let chungChi = req.body.chungchi
            let point = req.body.sodiem
            let ngoaiNgu = req.body.ngoaingu
            let id = Number(req.body.idnn)
            let updateNgoaiNgu = {
                id: id,
                chungChi,
                point,
                ngoaiNgu,
            }

            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiNgoaiNgu.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiNgoaiNgu.id": id
                    },
                ]
            }, {
                $set: {
                    "inForPerson.candiNgoaiNgu.$": updateNgoaiNgu
                },
            })
            if (updateUser) {
                functions.success(res, "Cập nhật ngoại ngữ thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật ngoại ngữ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//xóa Ngoại ngữ tin học
exports.deleteNgoaiNgu = async(req, res, next) => {
    try {
        if (req.user && req.body.chungchi && req.body.sodiem && req.body.ngoaingu && req.body.idnn) {

            let userId = req.user.data.idTimViec365
            let chungChi = req.body.chungchi
            let point = req.body.sodiem
            let ngoaiNgu = req.body.ngoaingu
            let id = Number(req.body.idnn)
            let deleteNgoaiNgu = {
                id: id,
                chungChi,
                point,
                ngoaiNgu,
            }
            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiNgoaiNgu.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiNgoaiNgu.id": id
                    },
                ]
            }, {
                $pull: {
                    "inForPerson.candiNgoaiNgu.$": deleteNgoaiNgu
                },
            })
            if (updateUser) {
                functions.success(res, "Xóa Ngoại ngữ thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi xóa ngoại ngữ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Thêm dữ liệu Kinh nghiệm làm việc
exports.addExp = async(req, res, next) => {
    try {
        if (req.user && req.body.chucdanh && req.body.congty && req.body.motaexp && req.body.onetime && req.body.twotime) {

            let userId = req.user.data.idTimViec365
            let jobTitle = req.body.chucdanh
            let company = req.body.congty
            let desExp = req.body.motaexp
            let start = req.body.onetime
            let end = req.body.twotime

            const maxID = await Users.findOne({ idTimViec365: userId }, { "inForPerson.candiExp.id": 1 }).sort({ "inForPerson.candiExp.id": -1 }).limit(1).lean();
            if (maxID.inForPerson.candiExp[0]) {
                newID = Number(maxID.inForPerson.candiExp[maxID.inForPerson.candiExp.length - 1].id + 1);
            } else newID = 1
            let addExp = {
                id: newID,
                jobTitle,
                company,
                desExp,
                start,
                end
            }

            let updateUser = await functions.findOneAndUpdateUser(userId, {
                $push: {
                    "inForPerson.candiExp": addExp
                }
            })
            if (updateUser) {
                functions.success(res, "Thêm kinh nghiệm làm việc thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi thêm kinh nghiệm làm việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật Kinh nghiệm làm việc
exports.updateExp = async(req, res, next) => {
    try {
        if (req.user && req.body.chucdanh && req.body.congty && req.body.motaexp && req.body.onetime && req.body.twotime && req.body.idkn) {

            let userId = req.user.data._id
            let jobTitle = req.body.chucdanh
            let company = req.body.congty
            let desExp = req.body.motaexp
            let start = req.body.onetime
            let end = req.body.twotime
            let id = req.body.idkn
            let updateExp = {
                id,
                jobTitle,
                company,
                desExp,
                start,
                end
            }

            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiExp.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiExp.id": id
                    },
                ]
            }, {
                $set: {
                    "inForPerson.candiExp.$": updateExp
                },
            })
            if (updateUser) {
                functions.success(res, "Cập nhật kinh nghiệm làm việc thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kinh nghiệm làm việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//xóa Kinh nghiệm làm việc
exports.deleteExp = async(req, res, next) => {
    try {
        if (req.user && req.body.chucdanh && req.body.congty && req.body.motaexp && req.body.onetime && req.body.twotime && req.body.idkn) {

            let userId = req.user.data.idTimViec365
            let jobTitle = req.body.chucdanh
            let company = req.body.congty
            let desExp = req.body.motaexp
            let start = req.body.onetime
            let end = req.body.twotime
            let id = req.body.idkn
            let deleteExp = {
                id,
                jobTitle,
                company,
                desExp,
                start,
                end
            }
            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiExp.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiExp.id": id
                    },
                ]
            }, {
                $pull: {
                    "inForPerson.candiExp.$": deleteExp
                },
            })
            if (updateUser) {
                functions.success(res, "Xóa kinh nghiệm làm việc thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi xóa kinh nghiệm làm việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//hiển thị danh sách ứng viên theo tỉnh thành, vị trí
exports.selectiveUv = async(req, res, next) => {
    try {

        let page = Number(req.body.page)
        let pageSize = Number(req.body.pageSize)
        let city = req.body.city
        let cate = req.body.cate
        const skip = (page - 1) * pageSize;
        const limit = pageSize;

        if (city && !cate) {
            let findUv = await functions.pageFindV2(Users, { type: 0, city: city }, {
                userName: 1,
                city: 1,
                district: 1,
                address: 1,
                avatarUser: 1,
                isOnline: 1,
                inForPerson: 1
            }, { updatedAt: -1 }, skip, limit)
            const totalCount = await Users.countDocuments({ type: 0, city: city })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (findUv) {
                functions.success(res, "Hiển thị ứng viên theo vị trí, ngành nghề thành công", { totalCount, totalPages, listUv: findUv });
            }
        } else if (!city && cate) {
            let listUv = []
            let findUv = await functions.pageFindV2(Users, { type: 0 }, {
                userName: 1,
                city: 1,
                district: 1,
                address: 1,
                avatarUser: 1,
                isOnline: 1,
                inForPerson: 1
            }, { updatedAt: -1 }, skip, limit)
            for (let i = 0; i < findUv.length; i++) {
                let listCateId = findUv[i].inForPerson.candiCateID.split(',')
                if (listCateId.includes(cate)) {
                    listUv.push(findUv[i])
                }
            }
            const totalCount = listUv.length
            const totalPages = Math.ceil(totalCount / pageSize)
            if (findUv) {
                functions.success(res, "Hiển thị ứng viên theo vị trí, ngành nghề thành công", { totalCount, totalPages, listUv: listUv });
            }
        } else if (city && cate) {
            let listUv = []
            let findUv = await functions.pageFindV2(Users, { type: 0, city: city }, {
                userName: 1,
                city: 1,
                district: 1,
                address: 1,
                avatarUser: 1,
                isOnline: 1,
                inForPerson: 1
            }, { updatedAt: -1 }, skip, limit)
            console.log(findUv)
            for (let i = 0; i < findUv.length; i++) {
                let listCateId = findUv[i].inForPerson.candiCateID.split(',')
                if (listCateId.includes(cate)) {
                    listUv.push(findUv[i])
                }
            }
            const totalCount = listUv.length
            const totalPages = Math.ceil(totalCount / pageSize)
            if (findUv) {
                functions.success(res, "Hiển thị ứng viên theo vị trí, ngành nghề thành công", { totalCount, totalPages, listUv: listUv });
            }
        } else if (!city && !cate) {
            let findRandomUv = await functions.pageFindV2(Users, { type: 0 }, {
                userName: 1,
                city: 1,
                district: 1,
                address: 1,
                avatarUser: 1,
                isOnline: 1,
                inForPerson: 1
            }, { updatedAt: -1 }, skip, limit)
            const totalCount = await Users.countDocuments({ type: 0 })
            const totalPages = Math.ceil(totalCount / pageSize)

            if (findRandomUv) {
                functions.success(res, "Hiển thị ứng viên ngẫu nhiên thành công", { totalCount, totalPages, listUv: findRandomUv });
            }
        }


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi hiển thị ứng viên theo vị trí, ngành nghề", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//hiển thị ứng viên được gợi ý theo Ai365
exports.candidateAI = async(req, res, next) => {
    try {
        let list = []
        let uvAI = await functions.getDataAxios("http://43.239.223.10:4001/recommendation_ungvien", {
            site: "uvtimviec365",
            use_id: req.body.use_id,
            pagination: 1,
            size: 20,
        })
        for (let i = 0; i < uvAI.data.item.length; i++) {
            let findUvAI = await functions.getDatafindOne(Users, { idTimViec365: uvAI.data.item[i].use_id })
            if (findUvAI) {
                list.push(findUvAI)
            }
            if (list.length == 12) {
                break
            }
        }
        console.log(uvAI.data.item)
        if (uvAI) {
            functions.success(res, "Hiển thị ứng viên ngẫu nhiên theo ai thành công", { list });
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi hiển thị ứng viên ngẫu nhiên theo ai", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//hiển thị thông tin chi tiết ứng viên theo 3 cách đăng kí
exports.infoCandidate = async(req, res, next) => {
    try {
        if (req.body.iduser) {
            let userId = req.body.iduser
            let CvUv = functions.getDatafindOne(CVUV, { userId: userId })
            let userInfo = await functions.findOneUser(userId)
            if (userInfo) {
                if (req.user && req.user.data.type == 1) {
                    let companyId = req.user.data.idTimViec365
                    let checkApplyForJob = await functions.getDatafindOne(applyForJob, { userID: userId, comID: companyId })
                    let checkPoint = await functions.getDatafindOne(pointUsed, { uscID: companyId, useID: userId })
                    if (checkApplyForJob && checkPoint) {
                        userInfo.statusCheck = true
                        functions.success(res, "Hiển thị chi tiết ứng viên thành công", { userInfo, CvUv, checkStatus: true });
                    } else {
                        userInfo.phoneTK = "đăng nhập để xem sdt đăng kí"
                        userInfo.phone = "đăng nhập để xem sdt"
                        userInfo.email = "đăng nhập để xem email"
                        userInfo.emailContact = "đăng nhập để xem email liên hệ"
                        functions.success(res, "Hiển thị chi tiết ứng viên thành công", { userInfo, CvUv, checkStatus: false });

                    }

                } else {
                    userInfo.phoneTK = "đăng nhập để xem sdt đăng kí"
                    userInfo.phone = "đăng nhập để xem sdt"
                    userInfo.email = "đăng nhập để xem email"
                    userInfo.emailContact = "đăng nhập để xem email liên hệ"
                    functions.success(res, "Hiển thị chi tiết ứng viên thành công", { userInfo, CvUv, checkStatus: false });
                }
            } else return functions.setError(res, "Không có thông tin user", 400);


        } else return functions.setError(res, "thông tin truyền lên không đầy đủ", 400);

    } catch (e) {
        console.log("Đã có lỗi xảy ra khi xóa kinh nghiệm làm việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//ứng viên ứng tuyển 
exports.candidateApply = async(req, res, next) => {
    try {
        if (req.user && req.body.idtin) {
            let newId = req.body.idtin
            let userId = req.user.data.idTimViec365
            let cv = req.user.data.inForPerson.cv
            let newIDMax
            const maxID = await applyForJob.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
            if (maxID) {
                newIDMax = Number(maxID._id) + 1;
            } else newIDMax = 1
            let checkApplyForJob = await functions.getDatafindOne(applyForJob, { userID: userId, newID: newId })
            let checkNew = await functions.getDatafindOne(newTV365, { _id: newId })
            if (checkApplyForJob) {
                return functions.setError(res, "Ứng viên đã nộp hồ sơ", 400);
            } else if (!checkNew) {
                return functions.setError(res, "Không tồn tại tin đăng này", 400);
            } else {
                let newApplyForJob = new applyForJob({
                    _id: newIDMax,
                    userID: userId,
                    newID: newId,
                    time: new Date(Date.now()),
                    cv: cv
                })
                newApplyForJob.save()
                if (newApplyForJob) {
                    functions.success(res, "ứng viên ứng tuyển thành công")
                }
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi xóa kinh nghiệm làm việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//ứng viên lưu tin
exports.candidateSavePost = async(req, res, next) => {
    try {
        if (req.user && req.body.idtin) {
            let newId = req.body.idtin
            let userId = req.user.data.idTimViec365
            let newIDMax
            const maxID = await userSavePost.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
            if (maxID) {
                newIDMax = Number(maxID._id) + 1;
            } else newIDMax = 1
            let checkUserSavePost = await functions.getDatafindOne(userSavePost, { userID: userId, newID: newId })
            let checkNew = await functions.getDatafindOne(newTV365, { _id: newId })
            if (checkUserSavePost) {
                return functions.setError(res, "Ứng viên đã nộp hồ sơ", 400);
            } else if (!checkNew) {
                return functions.setError(res, "Không tồn tại tin đăng này", 400);
            } else {
                let newUserSavePost = new userSavePost({
                    _id: newIDMax,
                    userID: userId,
                    newID: newId,
                    saveTime: new Date(Date.now()),
                })
                newUserSavePost.save()
                if (newUserSavePost) {
                    functions.success(res, "ứng viên lưu tin ứng tuyển thành công")
                }
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi ứng viên lưu tin ứng tuyển", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}