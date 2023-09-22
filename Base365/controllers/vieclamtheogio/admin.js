const AdminUser = require('../../models/ViecLamTheoGio/AdminUser');
const AdminUserRight = require('../../models/ViecLamTheoGio/AdminUserRight');
const Modules = require('../../models/ViecLamTheoGio/Modules');
const ViecLam = require('../../models/ViecLamTheoGio/ViecLam');
const vltgService = require('../../services/VLTG/functions');
const JobCategory = require('../../models/ViecLamTheoGio/JobCategory');
const UvCvmm = require('../../models/ViecLamTheoGio/UvCvmm');
const CaLamViec = require('../../models/ViecLamTheoGio/CaLamViec');
const Users = require('../../models/Users');
const City2 = require('../../models/ViecLamTheoGio/City2');
const functions = require('../../services/functions');
const md5 = require('md5');
const folder_img_uv = "user_uv";
const folder_img_ntd = "user_ntd";


exports.loginAdmin = async(req, res, next) => {
  try{
    let {loginName, password} = req.body;
    if(loginName && password) {
      let admin = await AdminUser.findOne({adm_loginname: loginName, adm_delete: 0, adm_active: 1});
      let time = functions.convertTimestamp(Date.now());
      if(admin) {
        let checkPassword = await functions.verifyPassword(password, admin.adm_password);
        if(checkPassword) {
          let updateAdmin = await AdminUser.findOneAndUpdate({adm_loginname: loginName}, {
            adm_date: time,
          }, {new: true});
          let data = {
            adm_id: updateAdmin.adm_id,
            adm_loginname: updateAdmin.adm_loginname,
            adm_name: updateAdmin.adm_name,
            adm_email: updateAdmin.adm_email,
            adm_author: updateAdmin.adm_author,
            adm_date: updateAdmin.adm_date,
            adm_isadmin: updateAdmin.adm_isadmin,
            lang_id: updateAdmin.lang_id,
            adm_all_category: updateAdmin.adm_all_category,
            adm_edit_all: updateAdmin.adm_edit_all,
          }
          const token = await functions.createToken(data, "1d");
          return functions.success(res, 'Đăng nhập thành công', { token: token })
        }
        return functions.setError(res, "Wrong password", 407);
      }
      return functions.setError(res, "Not admin or not active!", 406);
    }
    return functions.setError(res, "Missing input value!", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.getInfoAdmin = async(req, res, next) => {
  try{
    let id_admin = req.infoAdmin.adm_id;
    id_admin = Number(id_admin);
    let admin = await AdminUser.findOne({adm_id: id_admin}).lean();
    if (admin) {
      let adminRight;
      if (admin.adm_isadmin != 1) {
          adminRight = await AdminUserRight.aggregate([
              { $match: { adu_admin_id: id_admin } },
              {
                  $lookup: {
                      from: "VLTG_Modules",
                      localField: "adu_admin_module_id",
                      foreignField: "mod_id",
                      as: "Module"
                  }
              },
              {$match: {"Module": {$ne: []}}},
              { $unwind: { path: "$Module", preserveNullAndEmptyArrays: true } },
              {
                  $project: {
                      "mod_id": "$adu_admin_module_id",
                      "adu_add": "$adu_add",
                      "adu_edit": "$adu_edit",
                      "adu_delete": "$adu_delete",
                      "mod_path": "$Module.mod_path",
                      "mod_order": "$Module.mod_order",
                      "mod_listname": "$Module.mod_listname",
                      "mod_listfile": "$Module.mod_listfile",
                      "lang_id": "$Module.lang_id",
                      "mod_checkloca": "$Module.mod_checkloca",
                  }
              },
              { $sort: { mod_order: 1 } }
          ]);
      } else {
          adminRight = await Modules.find({}).sort({ mod_order: 1 });
      }
      admin = { ...admin, adminRight };
      return functions.success(res, "Get list module success", { admin });
    }
    return functions.setError(res, "Admin not found!", 404);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.changePasswordAdminLogin = async (req, res, next) => {
    try {
        let idAdmin = req.infoAdmin.adm_id;
        let findUser = await AdminUser.findOne({ adm_id: idAdmin });
        if (findUser) {
            const oldPass = req.body.oldPass;
            const newPass = req.body.newPass;
            if (oldPass && newPass) {
                let checkPassword = await functions.verifyPassword(oldPass, findUser.adm_password)
                if (checkPassword) {
                    let updatePassword = await AdminUser.findOneAndUpdate({ adm_id: idAdmin }, {
                        adm_password: md5(newPass),
                    }, { new: true });
                    if (updatePassword) {
                        return functions.success(res, "Update password success!");
                    }
                    return functions.setError(res, "Update password fail!", 407);
                }
                return functions.setError(res, "Wrong password!", 406);
            }
            return functions.setError(res, "Missing input value!", 405);
        }
        return functions.setError(res, "Admin not found!", 404);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.changePasswordAdmin = async (req, res, next) => {
    try {
      let {id_admin, password} = req.body;
      if(id_admin && password) {
        let findUser = await AdminUser.findOneAndUpdate({adm_id: id_admin}, {adm_password: md5(password)}, { new: true });
        if(findUser) {
          return functions.success(res, "Update password success!");
        }
        return functions.setError(res, "Admin not found", 404);
      }
      return functions.setError(res, "Missing input value!", 405);
    } catch (error) {
      return functions.setError(res, error.message);
    }
}

exports.changeInfoAdminLogin = async (req, res, next) => {
    try {
        let idAdmin = req.infoAdmin.adm_id;
        let findUser = await AdminUser.findOne({ adm_id: idAdmin });
        if (findUser) {
            let email = req.body.email;
            let checkEmail = await functions.checkEmail(email);
            if (email && checkEmail) {
                let updateInfo = await AdminUser.findOneAndUpdate({ adm_id: idAdmin }, {
                    adm_email: email,
                }, { new: true });
                if (updateInfo) {
                    return functions.success(res, "Update info admin success!");
                }
                return functions.setError(res, "Update info admin fail!", 407);
            }
            return functions.setError(res, "Missing input email or invalid email!", 405);
        }
        return functions.setError(res, "Admin not found!", 404);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.getModules = async(req, res, next) => {
  try{
    let 
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.danhSachUngVienAndNtd = async(req, res, next) => {
  try{
    let {type, idTimViec365, page, pageSize, phone, email, fromDate, toDate, source} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 30;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;
    let condition = {idTimViec365: {$nin: [null, 0]}, inforVLTG: {$ne: null}};

    //phan biet danh sach nha tuyen dung <> ung vien
    //tk ung vien
    let folder_img = "user_ntd";
    if(type == 1) {
      condition.type = 0;
      folder_img = "user_uv";
    }else {
      condition.type = 1;
    }

    //tim kiem
    if(phone) condition.phone = new RegExp(phone, 'i');
    if(email) condition.email = new RegExp(email, 'i');
    // tu ngay den ngay
    fromDate = functions.convertTimestamp(fromDate); 
    toDate = functions.convertTimestamp(toDate); 
    if (fromDate && !toDate) condition.createdAt = { $gte: fromDate };
    if (toDate && !fromDate) condition.createdAt = { $lte: toDate };
    if (toDate && fromDate) condition.createdAt = { $gte: fromDate, $lte: toDate };
    //
    if(source) condition["inforVLTG.source"] = Number(source);
    if(idTimViec365) condition.idTimViec365 = Number(idTimViec365);
    let danhSachUngVien = await Users.aggregate([
      {$match: condition},
      {$sort: {idTimViec365: -1}},
      {$skip: skip},
      {$limit: pageSize},
      {
        $lookup: {
            from: "VLTG_UvCvmm",
            localField: "idTimViec365",
            foreignField: "id_uv_cvmm",
            as: "CVMM"
        }
      },
      {$unwind: { path: "$CVMM", preserveNullAndEmptyArrays: true }},
      {
        $project: {
            "_id": "$_id", 
            "idTimViec365": "$idTimViec365", 
            "userName": "$userName", 
            "phone": "$phone", 
            "email": "$email", 
            "password": "$password", 
            "city": "$city", 
            "district": "$district", 
            "address": "$address", 
            "type": "$type", 
            "avatarUser": "$avatarUser", 
            "createdAt": "$createdAt", 
            "day": "$inforVLTG.uv_day", 
            "cong_viec": "$CVMM.cong_viec",
            "dia_diem": "$CVMM.dia_diem",
            "nganh_nghe": "$CVMM.nganh_nghe",
            "source": "$inforVLTG.source",
            "active": "$inforVLTG.active",
        }
      },
    ]);
    for(let i=0; i<danhSachUngVien.length; i++) {
      let time_created = danhSachUngVien[i].createdAt;
      if(!time_created) time_created = functions.convertTimestamp(Date.now());
      let linkAvatar = vltgService.getLinkFile(folder_img, time_created, danhSachUngVien[i].avatarUser);
      danhSachUngVien[i].linkAvatar = linkAvatar;
    }
    const total = await functions.findCount(Users, condition);

    return functions.success(res, "Thong ke danh sach ung vien theo hinh thuc, nganh nghe, tinh thanh", {total, data: danhSachUngVien});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.createUngVien = async(req, res, next) => {
  try{
    let {userName, phone, email, password, city, district, address, uv_congviec, uv_diadiem, uv_nganhnghe, day} = req.body;
    if(userName && phone && email && password && city && district && address && uv_congviec && uv_diadiem && uv_diadiem.length>0 && uv_nganhnghe && uv_nganhnghe.length>0 && day && day.length>0) {
      let checkPhone = functions.checkPhoneNumber(phone);
      let checkEmail = functions.checkEmail(email);
      if(checkPhone && checkEmail) {
        let time_created = functions.convertTimestamp(Date.now());
        let avatar = (req.files && req.files.avatar)? req.files.avatar: null;
        let nameAvatar = "";
        if(avatar) {
          let checkAvatar = await vltgService.checkFile(avatar.path);
          if(checkAvatar) {
            nameAvatar = await vltgService.uploadFileNameRandom(folder_img_uv, time_created, avatar);
          }else {
            return functions.setError(res, "Invalid image", 400);
          }
        }
        day = day.join(", ");
        uv_nganhnghe = uv_nganhnghe.join(", ");
        uv_diadiem = uv_diadiem.join(", ");
        let alias = functions.renderAlias(userName);
        const maxIdVLTG = await functions.getMaxIdByField(Users, 'idTimViec365');
        const max_id = await functions.getMaxIdByField(Users, '_id');
        let user = new Users({
          _id: max_id,
          idTimViec365: maxIdVLTG,
          type: 0,
          userName: userName,
          alias: alias,
          phone: phone,
          email: email,
          password: md5(password),
          city: city,
          district: district,
          address: address,
          avatarUser: nameAvatar,
          createdAt: time_created,
          updatedAt: time_created,
          "inforVLTG.uv_day": day,
          "inforVLTG.uv_active": 1,
        });
        user = await user.save();
        if(user) {
          let cvmm = new UvCvmm({
            id_uv_cvmm: maxIdVLTG,
            cong_viec: uv_congviec,
            nganh_nghe: uv_nganhnghe,
            dia_diem: uv_diadiem
          });
          await cvmm.save();
          return functions.success(res, "Create ung vien sucess!");
        }
        return functions.setError(res, "Create ung vien fail!");
      }
      return functions.setError(res, "phone or email invalid", 401);
    }
    return functions.setError(res, "Missing input value!", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateUngVien = async(req, res, next) => {
  try{
    let {idTimViec365, userName, phone, email, password, city, district, address, uv_congviec, uv_diadiem, uv_nganhnghe, day} = req.body;
    if(idTimViec365 && userName && phone && email && password && city && district && address && uv_congviec && uv_diadiem && uv_diadiem.length>0 && uv_nganhnghe && uv_nganhnghe.length>0 && day && day.length>0) {
      let checkPhone = functions.checkPhoneNumber(phone);
      let checkEmail = functions.checkEmail(email);
      idTimViec365 = Number(idTimViec365);
      if(checkPhone && checkEmail) {
        let time_created = functions.convertTimestamp(Date.now());
        let avatar = (req.files && req.files.avatar)? req.files.avatar: null;
        let nameAvatar = "";
        if(avatar) {
          let checkAvatar = await vltgService.checkFile(avatar.path);
          if(checkAvatar) {
            nameAvatar = await vltgService.uploadFileNameRandom(folder_img_uv, time_created, avatar);
          }else {
            return functions.setError(res, "Invalid image", 400);
          }
        }
        day = day.join(", ");
        uv_nganhnghe = uv_nganhnghe.join(", ");
        uv_diadiem = uv_diadiem.join(", ");
        let alias = functions.renderAlias(userName);
        let user = await Users.findOneAndUpdate({idTimViec365: idTimViec365, type: 0}, {
          userName: userName,
          alias: alias,
          phone: phone,
          email: email,
          password: md5(password),
          city: city,
          district: district,
          address: address,
          avatarUser: nameAvatar,
          updatedAt: time_created,
          "inforVLTG.uv_day": day,
        }, {new: true});
        if(user) {
          let fieldCvmm = {
            cong_viec: uv_congviec,
            nganh_nghe: uv_nganhnghe,
            dia_diem: uv_diadiem
          };
          let cvmm = await UvCvmm.findOne({id_uv_cvmm: idTimViec365});
          if(!cvmm) {
            fieldCvmm.id_uv_cvmm = idTimViec365;
          }
          await UvCvmm.findOneAndUpdate({id_uv_cvmm: idTimViec365}, fieldCvmm, {new: true, upsert: true});
          return functions.success(res, "Update ung vien sucess!");
        }
        return functions.setError(res, "Ung vien not found!");
      }
      return functions.setError(res, "phone or email invalid", 401);
    }
    return functions.setError(res, "Missing input value!", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.activeUngVien = async (req, res, next) => {
  try{
    let {id_uv, active} = req.body;
    if(id_uv) {
      id_uv = Number(id_uv);
      if(!active) active = 0;
      let ungVien = await Users.findOneAndUpdate({idTimViec365: id_uv, type: 0}, {"inforVLTG.uv_active": active});
      if(ungVien) {
        return functions.success(res, "active ung vien thanh cong!");
      }
      return functions.setError(res, "Ung vien not found!", 404);
    }
    return functions.setError(res, "Missing input id_uv", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//-----nha tuyen dung
exports.createCompany = async(req, res, next) => {
  try{
    let {userName, phone, email, password, city, district, address} = req.body;
    if(userName && phone && email && password && city && district && address) {
      let checkPhone = functions.checkPhoneNumber(phone);
      let checkEmail = functions.checkEmail(email);
      if(checkPhone && checkEmail) {
        let time_created = functions.convertTimestamp(Date.now());
        let avatar = (req.files && req.files.avatar)? req.files.avatar: null;
        let nameAvatar = "";
        if(avatar) {
          let checkAvatar = await vltgService.checkFile(avatar.path);
          if(checkAvatar) {
            nameAvatar = await vltgService.uploadFileNameRandom(folder_img_uv, time_created, avatar);
          }else {
            return functions.setError(res, "Invalid image", 400);
          }
        }
        let alias = functions.renderAlias(userName);
        const maxIdVLTG = await functions.getMaxIdByField(Users, 'idTimViec365');
        const max_id = await functions.getMaxIdByField(Users, '_id');
        let user = new Users({
          _id: max_id,
          idTimViec365: maxIdVLTG,
          type: 1,
          userName: userName,
          alias: alias,
          phone: phone,
          email: email,
          password: md5(password),
          city: city,
          district: district,
          address: address,
          avatarUser: nameAvatar,
          createdAt: time_created,
          updatedAt: time_created,
          "inforVLTG.ntd_active": 1,
        });
        user = await user.save();
        if(user) {
          return functions.success(res, "Create nha tuyen dung sucess!");
        }
        return functions.setError(res, "Create nha tuyen dung fail!");
      }
      return functions.setError(res, "phone or email invalid", 401);
    }
    return functions.setError(res, "Missing input value!", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateCompany = async(req, res, next) => {
  try{
    let {idTimViec365, userName, phone, email, password, city, district, address} = req.body;
    if(idTimViec365 && userName && phone && email && password && city && district && address) {
      let checkPhone = functions.checkPhoneNumber(phone);
      let checkEmail = functions.checkEmail(email);
      idTimViec365 = Number(idTimViec365);
      if(checkPhone && checkEmail) {
        let time_created = functions.convertTimestamp(Date.now());
        let avatar = (req.files && req.files.avatar)? req.files.avatar: null;
        let nameAvatar = "";
        if(avatar) {
          let checkAvatar = await vltgService.checkFile(avatar.path);
          if(checkAvatar) {
            nameAvatar = await vltgService.uploadFileNameRandom(folder_img_uv, time_created, avatar);
          }else {
            return functions.setError(res, "Invalid image", 400);
          }
        }
        let alias = functions.renderAlias(userName);
        let user = await Users.findOneAndUpdate({idTimViec365: idTimViec365, type: 1}, {
          userName: userName,
          alias: alias,
          phone: phone,
          email: email,
          password: md5(password),
          city: city,
          district: district,
          address: address,
          avatarUser: nameAvatar,
          updatedAt: time_created,
        }, {new: true});
        if(user) {
          return functions.success(res, "Update ung vien sucess!");
        }
        return functions.setError(res, "Ung vien not found!");
      }
      return functions.setError(res, "phone or email invalid", 401);
    }
    return functions.setError(res, "Missing input value!", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.activeCompany = async (req, res, next) => {
  try{
    let {id_ntd, active} = req.body;
    if(id_ntd) {
      id_ntd = Number(id_ntd);
      if(!active) active = 0;
      let ntd = await Users.findOneAndUpdate({idTimViec365: id_ntd, type: 1}, {"inforVLTG.ntd_active": active});
      if(ntd) {
        return functions.success(res, "active ung vien thanh cong!");
      }
      return functions.setError(res, "Ung vien not found!", 404);
    }
    return functions.setError(res, "Missing input id_ntd", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//----quan ly tin
exports.danhSachTin = async(req, res, next) => {
  try{
    let {page, pageSize, id_vieclam, id_ntd, vi_tri, name_ntd, fromDate, toDate} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 30;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;

    let condition = {id_ntd: {$nin: [0, null]}};
    let condition2 = {};

    if(id_vieclam) condition.id_vieclam = Number(id_vieclam);
    if(id_ntd) condition.id_ntd = Number(id_ntd);
    if(vi_tri) condition.vi_tri = new RegExp(vi_tri, 'i');
    if(name_ntd) condition2["NTD.userName"] = new RegExp(name_ntd, 'i');

    // tu ngay den ngay
    fromDate = functions.convertTimestamp(fromDate); 
    toDate = functions.convertTimestamp(toDate); 
    if (fromDate && !toDate) condition.vl_created_time = { $gte: fromDate };
    if (toDate && !fromDate) condition.vl_created_time = { $lte: toDate };
    if (toDate && fromDate) condition.vl_created_time = { $gte: fromDate, $lte: toDate };

    let danhSachTin = await ViecLam.aggregate([
      {$match: condition},
      {$sort: {id_vieclam: -1}},
      {$skip: skip},
      {$limit: pageSize},
      {
        $lookup: {
            from: "Users",
            localField: "id_ntd",
            foreignField: "idTimViec365",
            pipeline: [
                { $match: {idTimViec365: {$nin: [0, null]}, inforVLTG: {$ne: null}, type: 1 } },
            ],
            as: "NTD"
        }
      },
      {$unwind: { path: "$NTD", preserveNullAndEmptyArrays: true }},
      {$match: condition2},
      {$project: {
            "id_vieclam": "$id_vieclam",
            "id_ntd": "$id_ntd",
            "hoc_van": "$hoc_van",
            "tra_luong": "$tra_luong",
            "dia_diem": "$dia_diem",
            "quan_huyen": "$quan_huyen",
            "thoi_gian": "$thoi_gian",
            "vi_tri": "$vi_tri",
            "alias": "$alias",
            "hinh_thuc": "$hinh_thuc",
            "muc_luong": "$muc_luong",
            "ht_luong": "$ht_luong",
            "hoa_hong": "$hoa_hong",
            "so_luong": "$so_luong",
            "nganh_nghe": "$nganh_nghe",
            "cap_bac": "$cap_bac",
            "time_td": "$time_td",
            "fist_time": "$fist_time",
            "last_time": "$last_time",
            "mo_ta": "$mo_ta",
            "gender": "$gender",
            "yeu_cau": "$yeu_cau",
            "quyen_loi": "$quyen_loi",
            "ho_so": "$ho_so",
            "luot_xem": "$luot_xem",
            "name_lh": "$name_lh",
            "phone_lh": "$phone_lh",
            "address_lh": "$address_lh",
            "email_lh": "$email_lh",
            "vl_created_time": "$vl_created_time",
            "active": "$active",
            "created_at": "$created_at",
            "vl_index": "$vl_index",
            "userName": "$NTD.userName",
        }
      }
    ]);
    let total = await ViecLam.aggregate([
      {$match: condition},
      {
        $lookup: {
            from: "Users",
            localField: "id_ntd",
            foreignField: "idTimViec365",
            as: "NTD"
        }
      },
      {$unwind: { path: "$NTD", preserveNullAndEmptyArrays: true }},
      {$match: condition2},
      {
          $count: "count"
      },
    ]);
    total = total.length != 0 ? total[0].count : 0;
    return functions.success(res, "Get viec lam thanh cong", {total, data: danhSachTin});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.createTin = async(req, res, next) => {
  try{
    let {id_ntd, vi_tri, so_luong, nganh_nghe, cap_bac, thoi_gian, hoa_hong, dia_diem, quan_huyen, hinh_thuc,
      ht_luong, //co dinh or uoc luong
      tra_luong,//hình thức trả lương
      luong, luong_fist, luong_end, hoc_van, time_td, fist_time, last_time, alias, mo_ta, gender, yeu_cau, quyen_loi, ho_so, name_lh, phone_lh, address_lh, email_lh,
    } = req.body;

    let fieldCheck = [vi_tri, id_ntd, dia_diem, hinh_thuc, ht_luong, tra_luong, hoc_van, so_luong, nganh_nghe, cap_bac, time_td, fist_time, last_time, 
      mo_ta, gender, yeu_cau, quyen_loi, ho_so, name_lh , phone_lh, address_lh];

    for(let i=0; i<fieldCheck.length; i++) {
      if(!fieldCheck[i]) {
        return functions.setError(res, `Missing input value ${i+1}`, 405);
      }
    }
    id_ntd = Number(id_ntd);
    let time = functions.convertTimestamp(Date.now());
    let ntd = await Users.findOne({idTimViec365: id_ntd, type: 1});
    if(ntd) {
      let checkTrungTitle = await ViecLam.findOne({id_ntd: id_ntd, vi_tri: vi_tri});
      if(!checkTrungTitle) {
        if(functions.checkDate(time_td) && functions.checkDate(fist_time) && functions.checkDate(last_time)) {
          if(functions.checkPhoneNumber(phone_lh)) {
            alias = functions.renderAlias(vi_tri);
            time_td = functions.convertTimestamp(time_td);
            let muc_luong;
            if(ht_luong == 1) {
              muc_luong = luong;
            }else {
              muc_luong = `${luong_fist} - ${luong_end}`;
            }
            let maxId = await functions.getMaxIdByField(ViecLam, 'id_vieclam');

            let viecLam = new ViecLam({ id_vieclam: maxId, id_ntd: id_ntd, vi_tri, nganh_nghe, dia_diem, quan_huyen, cap_bac, hinh_thuc, ht_luong, tra_luong, muc_luong, thoi_gian, hoa_hong, so_luong, hoc_van, time_td, fist_time, last_time, alias, mo_ta, gender, yeu_cau, quyen_loi, ho_so,
              luot_xem: 0, name_lh, phone_lh, address_lh, email_lh, vl_created_time: time,active: 0, created_at: time,});
            //
            viecLam = await viecLam.save();
            //them vao model ca lam viec
            let {ca1_fist, ca1_last, day1, ca2_fist, ca2_last, day2, ca3_fist, ca3_last, day3, ca4_fist, ca4_last, day4, ca5_fist, ca5_last, day5} = req.body;
            if(ca1_fist && ca1_last && day1) {
              day1 = day1.join(", 1");
              day1 = "1"+day1;
              let maxIdCaLamViec = await functions.getMaxIdByField(CaLamViec, 'ca_id');
              let caLamViec = new CaLamViec({ca_id: maxIdCaLamViec, ca_id_viec: maxId, ca_start_time: ca1_fist , ca_end_time: ca1_last, day: day1});
              await caLamViec.save();
            }
            //ca2
            if(ca2_fist && ca2_last && day2) {
              day2 = day2.join(", 2");
              day2 = "2"+day2;
              let maxIdCaLamViec = await functions.getMaxIdByField(CaLamViec, 'ca_id');
              let caLamViec = new CaLamViec({ca_id: maxIdCaLamViec, ca_id_viec: maxId, ca_start_time: ca2_fist , ca_end_time: ca2_last, day: day2});
              await caLamViec.save();
            }
            //ca3
            if(ca3_fist && ca3_last && day3) {
              day3 = day3.join(", 3");
              day3 = "3"+day3;
              let maxIdCaLamViec = await functions.getMaxIdByField(CaLamViec, 'ca_id');
              let caLamViec = new CaLamViec({ca_id: maxIdCaLamViec, ca_id_viec: maxId, ca_start_time: ca3_fist , ca_end_time: ca3_last, day: day3});
              await caLamViec.save();
            }
            //ca4
            if(ca4_fist && ca4_last && day4) {
              day4 = day4.join(", 4");
              day4 = "4"+day4;
              let maxIdCaLamViec = await functions.getMaxIdByField(CaLamViec, 'ca_id');
              let caLamViec = new CaLamViec({ca_id: maxIdCaLamViec, ca_id_viec: maxId, ca_start_time: ca4_fist , ca_end_time: ca4_last, day: day4});
              await caLamViec.save();
            }
            //ca5
            if(ca5_fist && ca5_last && day5) {
              day5 = day5.join(", 5");
              day5 = "5"+day5;
              let maxIdCaLamViec = await functions.getMaxIdByField(CaLamViec, 'ca_id');
              let caLamViec = new CaLamViec({ca_id: maxIdCaLamViec, ca_id_viec: maxId, ca_start_time: ca5_fist , ca_end_time: ca5_last, day: day5});
              await caLamViec.save();
            }
            return functions.success(res, "Dang tin thnh cong!");
          }
          return functions.setError(res, "Invalid phone", 406);
        }
        return functions.setError(res, "Invalid date", 406);
      }
      return functions.setError(res, "Title bi trung!", 400);
    }
    return functions.setError(res, "Nha tuyen dung not found!", 404);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateTin = async(req, res, next) => {
  try{
    let {id_vieclam, id_ntd, vi_tri, so_luong, nganh_nghe, cap_bac, thoi_gian, hoa_hong, dia_diem, quan_huyen, hinh_thuc,
      ht_luong, //co dinh or uoc luong
      tra_luong,//hình thức trả lương
      luong, luong_fist, luong_end, hoc_van, time_td, fist_time, last_time, alias, mo_ta, gender, yeu_cau, quyen_loi, ho_so, name_lh, phone_lh, address_lh, email_lh,
    } = req.body;

    let fieldCheck = [id_vieclam, id_ntd, vi_tri, dia_diem, hinh_thuc, ht_luong, tra_luong, hoc_van, so_luong, nganh_nghe, cap_bac, time_td, fist_time, last_time, 
      mo_ta, gender, yeu_cau, quyen_loi, ho_so, name_lh , phone_lh, address_lh];

    for(let i=0; i<fieldCheck.length; i++) {
      if(!fieldCheck[i]) {
        return functions.setError(res, `Missing input value ${i+1}`, 405);
      }
    }
    id_ntd = Number(id_ntd);
    id_vieclam = Number(id_vieclam);
    let time = functions.convertTimestamp(Date.now());
    let ntd = await Users.findOne({idTimViec365: id_ntd, type: 1});
    if(ntd) {
      if(functions.checkDate(time_td) && functions.checkDate(fist_time) && functions.checkDate(last_time)) {
          if(functions.checkPhoneNumber(phone_lh)) {
            alias = functions.renderAlias(vi_tri);
            time_td = functions.convertTimestamp(time_td);
            let muc_luong;
            if(ht_luong == 1) {
              muc_luong = luong;
            }else {
              muc_luong = `${luong_fist} - ${luong_end}`;
            }
            let viecLam = await ViecLam.findOneAndUpdate({id_vieclam: id_vieclam} ,{id_ntd: id_ntd, vi_tri, nganh_nghe, dia_diem, quan_huyen, cap_bac, hinh_thuc, ht_luong, tra_luong, muc_luong, thoi_gian, hoa_hong, so_luong, hoc_van, time_td, fist_time, last_time, alias, mo_ta, gender, yeu_cau, quyen_loi, ho_so,
              name_lh, phone_lh, address_lh, email_lh}, {new: true});
            //
            if(!viecLam) functions.setError(res, "Viec lam not found!", 404);

            //them vao model ca lam viec
            let caLamViec = await CaLamViec.deleteMany({ca_id_viec: id_vieclam});
            let {ca1_fist, ca1_last, day1, ca2_fist, ca2_last, day2, ca3_fist, ca3_last, day3, ca4_fist, ca4_last, day4, ca5_fist, ca5_last, day5} = req.body;
            if(ca1_fist && ca1_last && day1) {
              day1 = day1.join(", 1");
              day1 = "1"+day1;
              let maxIdCaLamViec = await functions.getMaxIdByField(CaLamViec, 'ca_id');
              let caLamViec = new CaLamViec({ca_id: maxIdCaLamViec, ca_id_viec: id_vieclam, ca_start_time: ca1_fist , ca_end_time: ca1_last, day: day1});
              await caLamViec.save();
            }
            //ca2
            if(ca2_fist && ca2_last && day2) {
              day2 = day2.join(", 2");
              day2 = "2"+day2;
              let maxIdCaLamViec = await functions.getMaxIdByField(CaLamViec, 'ca_id');
              let caLamViec = new CaLamViec({ca_id: maxIdCaLamViec, ca_id_viec: id_vieclam, ca_start_time: ca2_fist , ca_end_time: ca2_last, day: day2});
              await caLamViec.save();
            }
            //ca3
            if(ca3_fist && ca3_last && day3) {
              day3 = day3.join(", 3");
              day3 = "3"+day3;
              let maxIdCaLamViec = await functions.getMaxIdByField(CaLamViec, 'ca_id');
              let caLamViec = new CaLamViec({ca_id: maxIdCaLamViec, ca_id_viec: id_vieclam, ca_start_time: ca3_fist , ca_end_time: ca3_last, day: day3});
              await caLamViec.save();
            }
            //ca4
            if(ca4_fist && ca4_last && day4) {
              day4 = day4.join(", 4");
              day4 = "4"+day4;
              let maxIdCaLamViec = await functions.getMaxIdByField(CaLamViec, 'ca_id');
              let caLamViec = new CaLamViec({ca_id: maxIdCaLamViec, ca_id_viec: id_vieclam, ca_start_time: ca4_fist , ca_end_time: ca4_last, day: day4});
              await caLamViec.save();
            }
            //ca5
            if(ca5_fist && ca5_last && day5) {
              day5 = day5.join(", 5");
              day5 = "5"+day5;
              let maxIdCaLamViec = await functions.getMaxIdByField(CaLamViec, 'ca_id');
              let caLamViec = new CaLamViec({ca_id: maxIdCaLamViec, ca_id_viec: id_vieclam, ca_start_time: ca5_fist , ca_end_time: ca5_last, day: day5});
              await caLamViec.save();
            }
            return functions.success(res, "Sua tin thnh cong!");
          }
          return functions.setError(res, "Invalid phone", 406);
        }
        return functions.setError(res, "Invalid date", 406);
    }
    return functions.setError(res, "Nha tuyen dung not found", 404);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.activeTin = async(req, res, next) => {
  try{
    let {id_vieclam, active} = req.body;
    if(id_vieclam) {
      id_vieclam = Number(id_vieclam);
      if(!active) active = 0;
      let viecLam = await ViecLam.findOneAndUpdate({id_vieclam: id_vieclam}, {active: active});
      if(viecLam) {
        return functions.success(res, "active viec lam thanh cong!");
      }
      return functions.setError(res, "Viec lam not found!", 404);
    }
    return functions.setError(res, "Missing input id_vieclam", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//----tag
exports.danhSachTagAndCategory = async(req, res, next) => {
  try{
    let {page, pageSize, jc_id, jc_name, type} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 30;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;

    let condition = {};
    if(type==1) {
      condition.jc_parent = {$gt: 0};
    }else {
      condition.jc_parent = 0;
    }
    if(jc_id) condition.jc_id = Number(jc_id);
    if(jc_name) condition.jc_name = new RegExp(jc_name, 'i');
    let danhSachTag = await functions.pageFind(JobCategory, condition, {jc_id: -1}, skip, pageSize);
    let total = await functions.findCount(JobCategory, condition);
    return functions.success(res, "Lay ra tag thanh cong", {total, data: danhSachTag});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.createTagAndCategory = async(req, res, next) => {
  try{
    let {jc_parent, jc_name} = req.body;
    if(jc_name) {
      let maxId = await functions.getMaxIdByField(JobCategory, 'jc_id');
      if(!jc_parent) jc_parent = 0;
      let tag = new JobCategory({
        jc_id: maxId,
        jc_parent: jc_parent,
        jc_name: jc_name
      });
      tag = await tag.save();
      if(tag) {
        return functions.success(res, "Create tag success");
      }
      return functions.setError(res, "Create tag fail", 405);
    }
    return functions.setError(res, "Missing input value", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateTagAndCategory = async(req, res, next) => {
  try{
    let {jc_id, jc_bv, key_tdgy, key_ndgy} = req.body;
    if(jc_id && jc_bv && key_tdgy && key_ndgy) {
      jc_id = Number(jc_id);
      let tag = await JobCategory.findOneAndUpdate({jc_id: jc_id}, {
        jc_bv: jc_bv,
        key_tdgy: key_tdgy,
        key_ndgy: key_ndgy
      }, {new : true});
      if(tag) {
        return functions.success(res, "Update tag success");
      }
      return functions.setError(res, "Update tag fail", 405);
    }
    return functions.setError(res, "Missing input value", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//-----tinh thanh
exports.danhSachCity = async(req, res, next) => {
  try{
    let {page, pageSize, cit_id, type} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 30;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;

    let condition = {};
    if(type==1) {
      condition.cit_parent = {$gt: 0};
    }else {
      condition.cit_parent = 0;
    }
    if(cit_id) condition.cit_id = Number(cit_id);
    let danhSachCity = await functions.pageFind(City2, condition, {cit_id: 1}, skip, pageSize);
    let total = await functions.findCount(City2, condition);
    return functions.success(res, "Lay ra tag thanh cong", {total, data: danhSachCity});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateCity = async(req, res, next) => {
  try{
    let {cit_id, cit_bv, cit_tdgy, cit_ndgy, cit_time} = req.body;
    if(cit_id && cit_bv && cit_tdgy && cit_ndgy && cit_time) {
      cit_id = Number(cit_id);
      let city = await City2.findOneAndUpdate({cit_id: cit_id}, {
        cit_bv: cit_bv,
        cit_tdgy: cit_tdgy,
        cit_ndgy: cit_ndgy,
        cit_time: cit_time,
      }, {new : true});
      if(city) {
        return functions.success(res, "Update city success");
      }
      return functions.setError(res, "Update city fail", 405);
    }
    return functions.setError(res, "Missing input value", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//---------------xoa 1 or xoa nhieu
exports.deleteManyByModule = async (req, res, next) => {
    try {
        let moduleId = req.body.moduleId;
        let arrId = req.body.arrId;
        if (moduleId && arrId && arrId.length > 0) {
            let arrIdDelete = arrId.map(idItem => parseInt(idItem));

            //ung vien va nha tuyen dung
            if (moduleId == 95 || moduleId==96) {
                await Users.deleteMany({ idTimViec365: { $in: arrIdDelete } });
                if(moduleId == 95) {
                  await UvCvmm.deleteMany({ id_uv_cvmm: { $in: arrIdDelete } });
                }
                return functions.success(res, 'xóa thành công!');
            }
            //tin tuyen dung
            if (moduleId == 97) {
                await ViecLam.deleteMany({ id_vieclam: { $in: arrIdDelete } });
                await CaLamViec.deleteMany({ca_id_viec: { $in: arrIdDelete }});
                return functions.success(res, 'xóa thành công!');
            }
            //tag va nganh nghe
            if (moduleId == 94 || moduleId == 57) {
                await JobCategory.deleteMany({ jc_id: { $in: arrIdDelete } });
                return functions.success(res, 'xóa thành công!');
            }
            //city va district
            if (moduleId == 38 || moduleId == 93) {
                await City2.deleteMany({ cit_id: { $in: arrIdDelete } });
                return functions.success(res, 'xóa thành công!');
            }
            return functions.setError(res, "Truyen dung moduleId muon xoa", 406);
        }
        return functions.setError(res, "Truyen moduleId va arrId dang mang", 405);
    } catch (error) {
        return functions.setError(res, error.message);
    }
}