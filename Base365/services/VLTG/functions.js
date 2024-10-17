// gửi mail
const nodemailer = require("nodemailer");
// tạo biến môi trường
const dotenv = require("dotenv");
// gọi api
const axios = require("axios");
// check ảnh và video
const fs = require("fs");
//
const path = require("path");
//check ảnh
const { promisify } = require("util");

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif"];
const functions = require("../functions");
const Users = require("../../models/Users");
const AdminUser = require("../../models/ViecLamTheoGio/AdminUser");
const AdminUserRight = require("../../models/ViecLamTheoGio/AdminUserRight");

dotenv.config();

// hàm cấu hình mail
const transport = nodemailer.createTransport({
  host: process.env.NODE_MAILER_HOST,
  port: Number(process.env.NODE_MAILER_PORT),
  service: process.env.NODE_MAILER_SERVICE,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

exports.sendEmailUv = async (ntd, ungVien) => {
  let body = `<body style="width: 100%;background-color: #dad7d7;text-align: justify;padding: 0;margin: 0;font-family: arial;padding-top: 20px;padding-bottom: 20px;">
            <table style="width: 700px;background:#fff; margin:0 auto;border-collapse: collapse;color: #000">
                <tr style="height: 120px;background-image: url(https://vieclamtheogio.timviec365.vn/images/banner_mailxemUV.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;padding: 0px 30px;box-sizing: border-box;">
                </tr>
                <tr><td style="padding-bottom: 20px;background: #dad7d7"></td></tr>
                <tr  style="float: left;padding:10px 15px 0px 15px;min-height: 175px;">
                    <td colspan="2">
                        <p style="font-size: 16px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-top: 15px;">Xin chào ${ntd.userName}</p>
                        <p style="font-size: 16px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-top: 5px;">Cám ơn bạn đã tin tưởng Vieclamtheogio.timviec365.vn là cầu nối giúp bạn tìm kiếm công việc mong muốn.</p>
                        <p style="font-size: 16px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-top: 5px;"><span><a style="    font-weight: bold;color: #307df1;text-decoration: none;" href="https://vieclamtheogio.timviec365.vn/ung-vien-${ntd.idTimViec365}.html">Hồ sơ của bạn</a> trên website Vieclamtheogio.timviec365.vn đã được nhà tuyển dụng <span><a style="font-weight: bold;color: #307df1;text-decoration: none;" href="https://vieclamtheogio.timviec365.vn/'.'-co' . ${ntd.idTimViec365} .'.html">${ntd.userName}</a> xem</span>. Bạn có thể tham khảo các công việc tương tự xem có phù hợp với mình không nhé!</p> 
                        <p style="font-size: 16px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-top: 5px;">Trân trọng!</p>
                    </td>
                </tr> 
                <tr><td style="padding-bottom: 20px;background: #dad7d7"></td></tr>
                
                <tr><td style="padding-bottom: 20px;background: #dad7d7"></td></tr>
                <tr  style="float: left;padding:0px 15px 0px 15px;min-height: 115px;">
                    <td>
                        <p style="margin: 0;font-size: 14px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-top: 15px;color: #307df1">Công ty Cổ phần Thanh toán Hưng Hà</p>
                        <p style="margin: 0;font-size: 14px;margin: 0;line-height: 19px;color:#4D4D4D"><span style="color: #307df1">VP1: </span>Tầng 4, B50, Lô 6, KĐT Định Công - Hoàng Mai - Hà Nội</p>
                        <p style="margin: 0;font-size: 14px;margin: 0;line-height: 19px;margin-bottom: 5px;color:#4D4D4D"><span style="color: #307df1">VP2: </span> Thôn Thanh Miếu, Xã Việt Hưng, Huyện Văn Lâm, Tỉnh Hưng Yên</p>
                        <p style="margin: 0;font-size: 14px;margin: 0;line-height: 19px;margin-bottom: 5px;color:#4D4D4D"><span style="color: #307df1">Hotline:</span> 1900633682 - ấn phím 1</p>
                        <p style="margin: 0;font-size: 14px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-bottom: 15px;color:#4D4D4D"><span style="color: #307df1">Email hỗ trợ:</span> timviec365.vn@gmail.com</p>
                    </td>
                </tr>
                <tr><td style="padding-bottom: 39px;background: #dad7d7"></td></tr>
            </table>
            </body>`;
  let subject =
    "[Vieclamtheogio.Timviec365.vn] Nhà tuyển dụng vừa xem hồ sơ của bạn";
  let options = {
    from: process.env.AUTH_EMAIL,
    to: ungVien.email,
    subject: subject,
    html: body,
  };
  transport.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: " + info.response);
    }
  });
};

exports.sendEmailNtd = async (ntd, ungVien, viecLam) => {
  let uv_name = ungVien.userName;
  let ntd_name = ntd.userName;
  let vi_tri = viecLam.vi_tri;
  let body = `<body style="width: 100%;background-color: #dad7d7;text-align: justify;padding: 0;margin: 0;font-family: unset;padding-top: 20px;padding-bottom: 20px;">
    <table style="width: 600px;background:#fff; margin:0 auto;border-collapse: collapse;color: #000">
        <tr style="height: 165px;background-image: url(https://timviec365.vn/images/email/bg1.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;padding: 0px 30px;box-sizing: border-box;">
        <td style="padding-top: 23px;float: left;">
            <img src="https://timviec365.vn/images/email/logo2.png">
        </td>
        <td style="text-align: left;float: right;">
            <ul style="margin-top: 15px;padding-left: 0px;">
                <li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Đăng tin tuyển dụng miễn phí</span></li>
                <li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Không giới hạn tin đăng tuyển dụng</span></li>
                <li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Biểu mẫu nhân sự chuyên nghiệp</span></li>
            </ul>          
        </td>
        </tr>
        <tr  style="float: left;padding:10px 30px 30px 30px;min-height: 289px;">
        <td colspan="2">
            <p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-top: 15px;">Xin chào ${ntd_name}</p>
            <p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Ứng viên <span style="color: #307df1">${uv_name}</span> đã ứng tuyển vào tin đăng <span style="color: #307df1;">${vi_tri}.</span> của quý công ty</p>            
                <p style="margin: 10px 0px 0px 0px; font-size: 18px;padding-left: 70px;"><span>Họ và tên:  </span><span>${uv_name}</span></p>
                <p style="margin: 5px 0px 10px 0px; font-size: 18px;padding-left: 70px;"><span>Địa chỉ:  </span><span>${ungVien.address}</span></p>

            <p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Để xem thông tin chi tiết ứng viên và tải CV ứng viên vui lòng nhấn nút:</p>
            <p style="margin: auto;margin-top: 20px;text-align: center;border-radius: 5px;width: 265px;height: 45px;background:#307df1;border-radius: 5px;"><a href="https://vieclamtheogio.timviec365.vn/ung-vien-${ungVien.idTimViec365}.html" style="color: #fff;text-decoration: none;font-size: 18px;line-height: 43px;">Xem chi tiết ứng viên</a></p>
        </td>
        </tr>`;
  let subject = uv_name + " - Timviec365.vn đã ứng tuyển vào vị trí " + vi_tri;
  let options = {
    from: process.env.AUTH_EMAIL,
    to: ntd.email,
    subject: subject,
    html: body,
  };
  transport.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: " + info.response);
    }
  });
};

exports.checkCompany = async (req, res, next) => {
  let id_ntd = req?.user?.data?._id;
  let ntd = await Users.findOne({ _id: id_ntd, type: 1 });
  if (ntd) {
    return next();
  }
  return functions.setError(res, "Not company or company not found!");
};

exports.checkCandidate = async (req, res, next) => {
  let uv = await Users.findOne({ _id: req?.user?.data?._id, type: 0 });
  if (uv) {
    return next();
  }
  return functions.setError(res, "Not candidate or candidate not found!");
};

// ham check admin viec lam theo gio
exports.checkAdmin = async (req, res, next) => {
  let user = req.user.data;
  let admin = await functions.getDatafindOne(AdminUser, {
    adm_id: user.adm_id,
    adm_active: 1,
  });
  if (admin && admin.adm_active == 1) {
    req.infoAdmin = admin;
    return next();
  }
  return functions.setError(res, "is not admin VLTG or not active");
};

//check quyen admin
exports.checkRight = (moduleId, perId) => {
  return async (req, res, next) => {
    try {
      if (!moduleId || !perId) {
        return functions.setError(res, "Missing input moduleId or perId", 505);
      }
      let infoAdmin = req.infoAdmin;
      if (infoAdmin.adm_isadmin) return next();
      let permission = await AdminUserRight.findOne(
        { adu_admin_id: infoAdmin.adm_id, adu_admin_module_id: moduleId },
        { adu_add: 1, adu_edit: 1, adu_delete: 1 }
      );
      if (!permission) {
        return functions.setError(res, "No right", 403);
      }
      if (perId == 1) return next();
      if (perId == 2 && permission.adu_add == 1) return next();
      if (perId == 3 && permission.adu_edit == 1) return next();
      if (perId == 4 && permission.adu_delete == 1) return next();
      return functions.setError(res, "No right", 403);
    } catch (e) {
      return res.status(505).json({ message: e });
    }
  };
};

// hàm check ảnh
exports.checkFile = async (filePath) => {
  if (typeof filePath !== "string") {
    return false;
  }
  const { size } = await promisify(fs.stat)(filePath);
  if (size > MAX_FILE_SIZE) {
    return false;
  }
  //check dinh dang file
  let fileCheck = path.extname(filePath);
  if (allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false) {
    return false;
  }
  return true;
};

exports.uploadFileNameRandom = async (folder, time_created, file_img) => {
  let filename = "";
  const date = new Date(time_created * 1000);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const timestamp = Math.round(date.getTime() / 1000);

  const dir = `../storage/base365/vltg/pictures/${folder}/${year}/${month}/${day}/`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  filename = `${timestamp}-user-${file_img.originalFilename}`.replace(/,/g, "");
  const filePath = dir + filename;
  fs.readFile(file_img.path, (err, data) => {
    if (err) {
      console.log(err);
    }
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
  return filename;
};

exports.getLinkFile = (folder, time, fileName) => {
  if (!fileName) return "";
  let date = new Date(time * 1000);
  const y = date.getFullYear();
  const m = ("0" + (date.getMonth() + 1)).slice(-2);
  const d = ("0" + date.getDate()).slice(-2);
  let link =
    process.env.local +
    `/base365/vltg/pictures/${folder}/${y}/${m}/${d}/${fileName}`;
  return link;
};
