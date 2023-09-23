const Users = require('../../models/Users');
const JobCategory = require('../../models/ViecLamTheoGio/JobCategory');
const UvCvmm = require('../../models/ViecLamTheoGio/UvCvmm');
const UvKnlv = require('../../models/ViecLamTheoGio/UvKnlv');
const ViecLam = require('../../models/ViecLamTheoGio/ViecLam');
const CaLamViec = require('../../models/ViecLamTheoGio/CaLamViec');
const UngTuyen = require('../../models/ViecLamTheoGio/UngTuyen');
const UvSaveVl = require('../../models/ViecLamTheoGio/UvSaveVl');
const NtdSaveUv = require('../../models/ViecLamTheoGio/NtdSaveUv');
const NtdXemUv = require('../../models/ViecLamTheoGio/NtdXemUv');
const XemUv = require('../../models/ViecLamTheoGio/XemUv');
const ThongBaoUv = require('../../models/ViecLamTheoGio/ThongBaoUv');
const ThongBaoNtd = require('../../models/ViecLamTheoGio/ThongBaoNtd');
const City = require('../../models/City');
const functions = require('../../services/functions');
const vltgService = require('../../services/VLTG/functions');
const dotenv = require("dotenv");
dotenv.config();
const folder_img = "user_ntd";

exports.danhSachTinTuyenDungMoi = async(req, res, next) => {
  try{
    let id_ntd = req.user.data.idTimViec365;
    let type = req.user.data.type;
    if(type == 1) {
      let {page, pageSize} = req.body;
      if(!page) page = 1;
      if(!pageSize) pageSize = 6;
      page = Number(page);
      pageSize = Number(pageSize);
      const skip = (page-1)*pageSize;
      let time = functions.convertTimestamp(Date.now());
      let today = time;
      time = time - 86400;
      let count_vlhh=0;
      let count_vlshh=0;
      let count_vltn=0;
      let count_vlch=0;
      let viecLam = await ViecLam.find({id_ntd: id_ntd}, {id_vieclam: 1, vi_tri: 1, alias: 1, fist_time: 1, last_time: 1, time_td: 1}).sort({id_vieclam: -1}).skip(skip).limit(pageSize).lean();
      for(let i=0; i<viecLam.length; i++) {
        if(viecLam.vl_created_time > today) count_vltn++;
        if(viecLam.time_td >= today) count_vlch++;
        else count_vlhh;
        if(((today-viecLam.last_time) < 172800) && ((today-viecLam.last_time) > 0)) count_vlshh++; 
      }
      return functions.success(res, "Danh sach tin tuyen dung moi nhat", {data: viecLam});
    }
    return functions.setError(res, "Not company", 403);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.quanLyChung = async(req, res, next) => {
  try{
    let id_ntd = req.user.data.idTimViec365;
    let type = req.user.data.type;
    if(type == 1) {
      let {page, pageSize} = req.body;
      if(!page) page = 1;
      if(!pageSize) pageSize = 6;
      page = Number(page);
      pageSize = Number(pageSize);
      const skip = (page-1)*pageSize;
      const currentDate = new Date();
      let time = functions.convertTimestamp(Date.now());
      let today = currentDate.setHours(0, 0, 0, 0);
      today = functions.convertTimestamp(today);
      time = time - 86400;
      let count_vlhh=0;
      let count_vlshh=0;
      let count_vltn=0;
      let count_vlch=0;

      //lay ra tin tuyen dung moi nhat
      let viecLamMoiNhat = await ViecLam.find({id_ntd: id_ntd}, {id_vieclam: 1, vi_tri: 1, alias: 1, fist_time: 1, last_time: 1, time_td: 1}).sort({id_vieclam: -1}).skip(skip).limit(pageSize).lean();

      for(let i=0; i<viecLamMoiNhat.length; i++) {
        let totalUnnTuyen = await functions.findCount(UngTuyen, {id_viec: viecLamMoiNhat[i].id_vieclam});
        viecLamMoiNhat[i].totalUnnTuyen = totalUnnTuyen;
      }
      let viecLam = await ViecLam.find({id_ntd: id_ntd});
      for(let i=0; i<viecLam.length; i++) {
        if(viecLam[i].vl_created_time >= time) count_vltn++;
        if(viecLam[i].time_td >= today) count_vlch++;
        else count_vlhh;
        if(((today-viecLam[i].last_time) < 172800) && ((today-viecLam[i].last_time) > 0)) count_vlshh++; 

        //lay ra luot ung tuyen
        let luotUngTuyen = await functions.findCount(UngTuyen, {id_viec: viecLam[i].id_vieclam});
        viecLam[i].luotUngTuyen = luotUngTuyen;
      }
      //ung vien ung tuyen moi nhat
      let hoSoUngTuyen = await UngTuyen.aggregate([
        {$match: {id_ntd: id_ntd}},
        {$sort: {id_ungtuyen: -1}},
        {$limit: 4},
        {
          $lookup: {
              from: "VLTG_ViecLam",
              localField: "id_viec",
              foreignField: "id_vieclam",
              as: "ViecLam"
          }
        },
        {$unwind: { path: "$ViecLam", preserveNullAndEmptyArrays: true }},
        {
          $lookup: {
              from: "Users",
              localField: "id_uv",
              foreignField: "idTimViec365",
              pipeline: [
                  { $match: { idTimViec365: { $nin: [0, null] } } },
              ],
              as: "UngVien"
          }
        },
        {$unwind: { path: "$UngVien", preserveNullAndEmptyArrays: true }},
        {
          $project: {
              "id_ungtuyen": "$id_ungtuyen",
              "uv_name": "$UngVien.userName",
              "vl_vitri": "$ViecLam.vi_tri",
              "vl_alias": "$ViecLam.alias",
              "created_at": "$created_at",
          }
        }
      ]);
      let ntd = await Users.findOne({idTimViec365: id_ntd, type: 1}, {"inforVLTG.diem_free": 1});
      let diem_free = 0;
      if(ntd) diem_free = (ntd.inforVLTG && ntd.inforVLTG.diem_free) ? ntd.inforVLTG.diem_free: 0;
      let totalHoSoUngTuyen = await functions.findCount(UngTuyen, {id_ntd: id_ntd});
      let totalLocDiem = await functions.findCount(NtdXemUv, {id_ntd: id_ntd});
      let info = {
        totalHoSoUngTuyen: totalHoSoUngTuyen,
        totalLocDiem: totalLocDiem,
        totalChuyenVienGuiUv: 0,
        vlSapHetHan: count_vlshh,
        vlHetHan: count_vlhh,
        vlConHan: count_vlch,
        vlTrongNgay: count_vltn,
        diemDocFree: diem_free
      };
      return functions.success(res, "Danh sach tin tuyen dung moi nhat", {info, viecLamMoiNhat, hoSoUngTuyen});
    }
    return functions.setError(res, "Not company", 403);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.danhSachUvTheoGio = async(req, res, next) => {
  try{
    let {page, pageSize, id_nganh, id_city} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 9;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;
    let id_ntd = (req.user && req.user.data)? req.user.data.idTimViec365: null;
    // inforVLTG.uv_search
    let condition = {idTimViec365: {$nin: [null, 0]}, type: {$in: [0, 2]}, "inforVLTG.uv_search": 1};
    let condition2 = {};
    if(id_nganh) condition2["CVMM.nganh_nghe"] = new RegExp(id_nganh, 'i');
    if(id_city) condition.city = Number(id_city);
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
      {$match: condition2},
      {
        $project: {
            "_id": "$_id",
            "idTimViec365": "$idTimViec365",
            "district": "$district",
            "city": "$city",
            "userName": "$userName",
            "phone": "$phone",
            "address": "$address",
            "avatarUser": "$avatarUser",
            "createdAt": "$createdAt",
            "updatedAt": "$updatedAt",
            "uv_cvmm": "$CVMM.cong_viec",
        }
      }
    ]);
    //kiem tra ntd da xem, luu ung vien chua
    for(let i=0; i<danhSachUngVien.length; i++) {
      let check_ntd_xem_uv = false;
      let check_xem_uv = false;
      let check_ntd_save_uv = false;
      let id_uv = danhSachUngVien[i].idTimViec365;

      //dung diem loc de xem
      let ntd_xem_uv = await NtdXemUv.findOne({id_ntd: id_ntd, id_uv: id_uv});
      if(ntd_xem_uv) check_ntd_xem_uv = true;
      
      let ntd_save_uv = await NtdSaveUv.findOne({id_ntd: id_ntd, id_uv: id_uv});
      if(ntd_save_uv) check_ntd_save_uv = true;

      let xem_uv = await XemUv.findOne({xm_id_ntd: id_ntd, xm_id_uv: id_uv});
      if(xem_uv) check_xem_uv = true;

      danhSachUngVien[i].check_ntd_xem_uv = check_ntd_xem_uv;
      danhSachUngVien[i].check_xem_uv = check_xem_uv;
      danhSachUngVien[i].check_ntd_save_uv = check_ntd_save_uv;
    }
    let total = await Users.aggregate([
      {$match: condition},
      {
        $lookup: {
            from: "VLTG_UvCvmm",
            localField: "idTimViec365",
            foreignField: "id_uv_cvmm",
            as: "CVMM"
        }
      },
      {$unwind: { path: "$CVMM", preserveNullAndEmptyArrays: true }},
      {$match: condition2},
      {
          $count: "count"
      }
    ]);
    total = total.length != 0 ? total[0].count : 0;
    return functions.success(res, "Lay ra danh sach thanh cong", {total, data: danhSachUngVien});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.thongKeUngVien = async(req, res, next) => {
  try{
    let condition = {idTimViec365: {$nin: [null, 0]}, type: {$in: [0, 2]}, "inforVLTG.uv_search": 1};
    let totalHinhThuc = [];
    let listCandidate = await Users.aggregate([
      {$match: condition},
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
            "district": "$district", 
            "city": "$city", 
            "userName": "$userName", 
            "phone": "$phone", 
            "phoneTK": "$phoneTK", 
            "address": "$address", 
            "avatarUser": "$avatarUser", 
            "createdAt": "$createdAt", 
            "updatedAt": "$updatedAt", 
            "uv_cong_viec": "$CVMM.cong_viec",
            "uv_hinh_thuc": "$CVMM.hinh_thuc",
            "uv_nganh_nghe": "$CVMM.nganh_nghe",
            "uv_dia_diem": "$CVMM.dia_diem",
        }
      }
    ]);
    for(let i=1; i<=3; i++) {
      let total = listCandidate.filter((e) => e.uv_hinh_thuc == i).length;
      totalHinhThuc.push(total);
    }

    //ung vien theo nganh nghe
    let nganhNghe = await JobCategory.find({jc_id: {$lt: 11}}, {jc_id: 1, jc_name: 1}).sort({jc_id: 1}).limit(10).lean();
    for(let i=0; i<nganhNghe.length; i++) {
      let total = listCandidate.filter((e) => {
        if(e.uv_nganh_nghe) {
          let arr_nn = e.uv_nganh_nghe.split(", ");
          let check = arr_nn.includes(String(nganhNghe[i].jc_id));
          if(check) return true;
        }
        return false;
      });
      nganhNghe[i].total = total.length;
    }
    //ung vien theo tinh thanh
    let totaTinhThanh = [];
    let tinhThanh = await City.find({}, {_id: 1, name: 1}).lean();
    for(let i=0; i<tinhThanh.length; i++) {
      let total = listCandidate.filter((e) => {
        if(e.uv_dia_diem) {
          let arr_dd = e.uv_dia_diem.split(", ");
          let check = arr_dd.includes(String(tinhThanh[i]._id));
          if(check) return true;
        }
        return false;
      });
      if(total.length < 1) continue;
      tinhThanh[i].total = total.length;
      totaTinhThanh.push(tinhThanh[i]);
    }
    return functions.success(res, "Thong ke ung vien theo hinh thuc, nganh nghe, tinh thanh", {totalHinhThuc, totaNganhNghe: nganhNghe, totaTinhThanh});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.thongKeDanhSachUngVien = async(req, res, next) => {
  try{
    let {page, pageSize, id_nganh, id_hinhthuc, id_city, key} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 10;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;
    let condition = {idTimViec365: {$nin: [null, 0]}, type: 0, "inforVLTG.uv_search": 1};
    let condition2 = {};

    if(id_nganh) condition2["uv_nganh_nghe"] = new RegExp(`\\b${id_nganh}\\b`);
    if(id_hinhthuc) condition2["uv_hinh_thuc"] = Number(id_hinhthuc);
    if(id_city) condition2["uv_dia_diem"] = new RegExp(`\\b${id_city}\\b`);
    if(key) condition2["uv_cong_viec"] = new RegExp(key, 'i');
    let danhSachUngVien = await Users.aggregate([
      {$match: condition},
      {$sort: {updatedAt: -1}},
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
            "district": "$district", 
            "city": "$city", 
            "userName": "$userName", 
            "phone": "$phone", 
            "type": "$type", 
            "phoneTK": "$phoneTK", 
            "address": "$address", 
            "avatarUser": "$avatarUser", 
            "createdAt": "$createdAt", 
            "updatedAt": "$updatedAt", 
            "uv_cong_viec": "$CVMM.cong_viec",
            "uv_hinh_thuc": "$CVMM.hinh_thuc",
            "uv_nganh_nghe": "$CVMM.nganh_nghe",
            "uv_dia_diem": "$CVMM.dia_diem",
        }
      },
      {$match: condition2},
    ]);
    //kiem tra ntd da xem, luu ung vien chua
    let id_ntd = (req.user && req.user.data)? req.user.data.idTimViec365: null;
    for(let i=0; i<danhSachUngVien.length; i++) {
      let check_ntd_xem_uv = false;
      let check_xem_uv = false;
      let check_ntd_save_uv = false;
      let id_uv = danhSachUngVien[i].idTimViec365;

      let ntd_xem_uv = await NtdXemUv.findOne({id_ntd: id_ntd, id_uv: id_uv});
      if(ntd_xem_uv) check_ntd_xem_uv = true;
      
      let ntd_save_uv = await NtdSaveUv.findOne({id_ntd: id_ntd, id_uv: id_uv});
      if(ntd_save_uv) check_ntd_save_uv = true;

      let xem_uv = await XemUv.findOne({xm_id_ntd: id_ntd, xm_id_uv: id_uv});
      if(xem_uv) check_xem_uv = true;

      danhSachUngVien[i].check_ntd_xem_uv = check_ntd_xem_uv;
      danhSachUngVien[i].check_xem_uv = check_xem_uv;
      danhSachUngVien[i].check_ntd_save_uv = check_ntd_save_uv;
    }
    let total = await Users.aggregate([
      {$match: condition},
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
            "district": "$district", 
            "city": "$city", 
            "userName": "$userName", 
            "phone": "$phone", 
            "phoneTK": "$phoneTK", 
            "address": "$address", 
            "avatarUser": "$avatarUser", 
            "createdAt": "$createdAt", 
            "updatedAt": "$updatedAt", 
            "uv_cong_viec": "$CVMM.cong_viec",
            "uv_hinh_thuc": "$CVMM.hinh_thuc",
            "uv_nganh_nghe": "$CVMM.nganh_nghe",
            "uv_dia_diem": "$CVMM.dia_diem",
        }
      },
      {$match: condition2},
      {
          $count: "count"
      }
    ]);
    total = total.length != 0 ? total[0].count : 0;

    return functions.success(res, "Thong ke danh sach ung vien theo hinh thuc, nganh nghe, tinh thanh", {total, data: danhSachUngVien});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.chiTietUngVien = async(req, res, next) => {
  try{
    let id_uv = req.body.id_uv;
    let time = functions.convertTimestamp(Date.now());
    if(id_uv) {
      id_uv = Number(id_uv);
      let id_ntd = null;
      if(req.user && req.user.data) id_ntd = req.user.data.idTimViec365;
      let ungVien = await Users.findOne({idTimViec365: id_uv});
      if(ungVien) {
        //cap nhat vao model XemUv
        let maxIdXemUv = await functions.getMaxIdByField(XemUv, 'xm_id');
        let fieldXemUv = {xm_time_created: time};
        let xemUv = await XemUv.findOne({xm_id_ntd: id_ntd, xm_id_uv: id_uv});
        if(!xemUv) {
          fieldXemUv = {...fieldXemUv, xm_id: maxIdXemUv, xm_id_ntd: id_ntd, xm_id_uv: id_uv};
        }
        await XemUv.findOneAndUpdate({xm_id_ntd: id_ntd, xm_id_uv: id_uv}, fieldXemUv, {new: true, upsert: true});
        //cap nhat luot xem
        let luot_xem = (ungVien.inforVLTG && ungVien.inforVLTG.luot_xem)? ungVien.inforVLTG.luot_xem: 0;
        luot_xem++;
        await Users.findOneAndUpdate({idTimViec365: id_uv}, {"inforVLTG.luot_xem": luot_xem}, {new: true});

        //lay ra thong tin ung vien
        ungVien = await Users.aggregate([
          {$match: {idTimViec365: id_uv}},
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
            $lookup: {
                from: "VLTG_UvKnlv",
                localField: "idTimViec365",
                foreignField: "id_uv_knlv",
                as: "KNLV"
            }
          },
          {
            $project: {
                "_id": "$_id", 
                "idTimViec365": "$idTimViec365", 
                "district": "$district", 
                "city": "$city", 
                "userName": "$userName", 
                "phone": "$phone", 
                "address": "$address",
                "email": "$email",
                "avatarUser": "$avatarUser",
                "createdAt": "$createdAt", 
                "updatedAt": "$updatedAt",  
                "birthday": "$inForPerson.account.birthday",
                "gender": "$inForPerson.account.gender",
                "married": "$inForPerson.account.married",
                "experience": "$inForPerson.account.experience",
                "education": "$inForPerson.account.education",
                "uv_day": "$inforVLTG.uv_day",
                "uv_search": "$inforVLTG.uv_search",
                "luot_xem": "$inforVLTG.luot_xem",
                "diem_free": "$inforVLTG.diem_free",
                "diem_mua": "$inforVLTG.diem_mua",
                "uv_cong_viec": "$CVMM.cong_viec",
                "uv_nganh_nghe": "$CVMM.nganh_nghe",
                "uv_dia_diem": "$CVMM.dia_diem",
                "uv_lever": "$CVMM.lever",
                "uv_hinh_thuc": "$CVMM.hinh_thuc",
                "uv_luong": "$CVMM.luong",
                "uv_ky_nang": "$CVMM.ky_nang",
                "KNLV": "$KNLV",
            }
          },
        ]);
        ungVien = ungVien[0];
        //lay ra ten nganh nghe
        let arrNameNN = [];
        let nganhNghe = ungVien.uv_nganh_nghe;
        if(nganhNghe) {
          nganhNghe = nganhNghe.split(", ");
          for(let i=0; i<nganhNghe.length; i++) {
            let nameNN = await JobCategory.findOne({jc_id: Number(nganhNghe[i])}, {jc_id: 1, jc_name: 1});
            if(nameNN) arrNameNN.push(nameNN);
          }
        }
        ungVien.arrNameNN = arrNameNN;

        //lay ra danh sach ung vien lien quan
        let condition = {idTimViec365: {$nin: [null, 0, id_uv]}, type: {$in: [0, 2]}};
        let condition2 = {"CVMM.nganh_nghe": new RegExp(`\\b${nganhNghe[0]}\\b`)};
        let listUVLienQuan = await Users.aggregate([
          {$match: condition},
          {$sort: {idTimViec365: -1}},
          {$limit: 6},
          {
            $lookup: {
                from: "VLTG_UvCvmm",
                localField: "idTimViec365",
                foreignField: "id_uv_cvmm",
                as: "CVMM"
            }
          },
          {$unwind: { path: "$CVMM", preserveNullAndEmptyArrays: true }},
          {$match: condition2},
          {
            $project: {
                "_id": "$_id", 
                "idTimViec365": "$idTimViec365", 
                "district": "$district", 
                "city": "$city", 
                "userName": "$userName", 
                "phone": "$phone", 
                "phoneTK": "$phoneTK", 
                "address": "$address", 
                "avatarUser": "$avatarUser", 
                "createdAt": "$createdAt", 
                "updatedAt": "$updatedAt", 
                "uv_cong_viec": "$CVMM.cong_viec",
                "uv_nganh_nghe": "$CVMM.nganh_nghe",
            }
          }
        ]);

        //check nha tuyen tuyen dung luu ung vien
        let check_save_uv = false;
        let ntd_save_uv = await NtdSaveUv.findOne({id_ntd: id_ntd, id_uv: id_uv});
        if(ntd_save_uv) check_save_uv = true;
        ungVien.check_save_uv = check_save_uv;

        //check nha tuyen dung xem ung vien
        let check_xem_uv = false;
        let ntd_xem_uv = await NtdXemUv.findOne({id_ntd: id_ntd, id_uv: id_uv});
        if(ntd_xem_uv) {
          check_xem_uv = true;
        }else {
          delete ungVien.email;
          delete ungVien.phone;
        }
        ungVien.check_xem_uv = check_xem_uv;

        return functions.success(res, "Xem chi tiet ung vien thanh cong", {data: ungVien, listUVLienQuan});
      }
      return functions.setError(res, "Ung vien not found!", 404);
    }
    return functions.setError(res, "Missing input id_uv!", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.dangTin = async(req, res, next) => {
  try{
    let id_ntd = req.user.data.idTimViec365;
    let type = req.user.data.type;
    if(type == 1) {
      let time = functions.convertTimestamp(Date.now());
      let time10p = time - 600;
      let viecLam1 = await ViecLam.find({id_ntd: id_ntd, vl_created_time: {$gte: time10p}});
      let viecLam2 = await ViecLam.find({id_ntd: id_ntd, vl_created_time: {$gte: time}});
      let vi_tri = req.body.vi_tri;
      if(!vi_tri) return functions.setError(res, "Missing input vi_tri!", 405);
      let checkTrungTitle = await ViecLam.findOne({id_ntd: id_ntd, vi_tri: vi_tri});
      if(!checkTrungTitle) {
        if(viecLam1.length<=0 && viecLam2.length<=24) {

          let {nganh_nghe, dia_diem, quan_huyen, cap_bac, hinh_thuc,
            ht_luong, //co dinh or uoc luong
            tra_luong,//hình thức trả lương
            luong, luong_fist, luong_end, thoi_gian, hoa_hong, so_luong, hoc_van, time_td, fist_time, last_time, alias, mo_ta, gender, yeu_cau, quyen_loi, ho_so, name_lh, phone_lh, address_lh, email_lh,
          } = req.body;

          let fieldCheck = [vi_tri, dia_diem, hinh_thuc, ht_luong, tra_luong, hoc_van, so_luong, nganh_nghe, cap_bac, time_td, fist_time, last_time, 
            mo_ta, gender, yeu_cau, quyen_loi, ho_so, name_lh , phone_lh, address_lh];
          
          for(let i=0; i<fieldCheck.length; i++) {
            if(!fieldCheck[i]) {
              return functions.setError(res, `Missing input value ${i+1}`, 405);
            }
          }
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
        return functions.setError(res, "Mỗi tin của bạn cần đăng cách nhau 10 phút tối đa 24 tin/ngày!", 400);
      }
      return functions.setError(res, "Title bi trung!", 400);
    }
    return functions.setError(res, "Not company", 403);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.danhSachTinDaDang = async(req, res, next) => {
  try{
    let {page, pageSize, id_viec} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 6;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;
    let id_ntd = req.user.data.idTimViec365;
    let condition = {id_ntd: id_ntd};
    if(id_viec) condition.id_vieclam = Number(id_viec);
    let total = await functions.findCount(ViecLam, condition);
    let danhSachViecLam = await functions.pageFindWithFields(ViecLam, condition, {
      id_vieclam: 1, vi_tri: 1, alias: 1, dia_diem: 1, nganh_nghe: 1,luot_xem: 1,time_td: 1, fist_time: 1, last_time: 1, active: 1
    }, {time_td: -1}, skip, pageSize);
    for(let i=0; i<danhSachViecLam.length; i++) {
      let jc_id = Number(danhSachViecLam[i].nganh_nghe);
      let nganhNghe = await JobCategory.findOne({jc_id: jc_id}, {jc_id: 1, jc_name: 1});
      if(nganhNghe) danhSachViecLam[i].nganhNghe = nganhNghe;
      let totalUngTuyen = await functions.findCount(UngTuyen, {id_viec: danhSachViecLam[i].id_vieclam});
      danhSachViecLam[i].totalUngTuyen = totalUngTuyen;
    }
    return functions.success(res, "danh sach tin da dang", {total, data: danhSachViecLam});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.suaTin = async(req, res, next) => {
  try{
    let id_ntd = req.user.data.idTimViec365;
    let type = req.user.data.type;
    if(type == 1) {
      let time = functions.convertTimestamp(Date.now());
      let {id_vieclam, nganh_nghe, dia_diem, quan_huyen, cap_bac, hinh_thuc,
            ht_luong, //co dinh or uoc luong
            tra_luong, //hình thức trả lương
            luong, luong_fist, luong_end, thoi_gian, hoa_hong, so_luong, hoc_van, 
            time_td, fist_time, last_time, alias, mo_ta, gender, yeu_cau, 
            quyen_loi, ho_so, name_lh, phone_lh, address_lh, email_lh, vi_tri
        } = req.body;
      if(id_vieclam) {
        id_vieclam = Number(id_vieclam);
        let fieldCheck = [vi_tri, dia_diem, hinh_thuc, ht_luong, tra_luong, hoc_van, so_luong, nganh_nghe, cap_bac, time_td, fist_time, last_time, 
          mo_ta, gender, yeu_cau, quyen_loi, ho_so, name_lh , phone_lh, address_lh];
        
        for(let i=0; i<fieldCheck.length; i++) {
          if(!fieldCheck[i]) {
            return functions.setError(res, `Missing input value ${i+1}`, 405);
          }
        }
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
              name_lh, phone_lh, address_lh, email_lh, created_at: time}, {new: true});
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
      return functions.setError(res, "Missing input id_vieclam!", 400);
    }
    return functions.setError(res, "Not company", 403);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.lamMoiTin = async(req, res, next) => {
  try{
    let id_vieclam = req.body.id_vieclam;
    if(id_vieclam) {
      let time = functions.convertTimestamp(Date.now());
      let viecLam = await ViecLam.findOneAndUpdate({id_vieclam: Number(id_vieclam)}, {created_at: time}, {new: true});
      if(viecLam) {
        return functions.success(res, "Lam moi tin thanh cong");
      }
      return functions.setError(res, "Viec lam not found!", 404);
    }
    return functions.setError(res, "Missing input id_vieclam", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.ungVienMoiUngTuyen = async(req, res, next) => {
  try{
    let {page, pageSize, status} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 6;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;
    let id_ntd = req.user.data.idTimViec365;
    let condition = {id_ntd: id_ntd};
    if(status) condition.status = Number(status); 
    let ungVienMoiUngTuyen = await UngTuyen.aggregate([
      {$match: condition},
      {$sort: {id_ungtuyen: -1}},
      {$skip: skip},
      {$limit: pageSize},
      {
        $lookup: {
            from: "VLTG_ViecLam",
            localField: "id_viec",
            foreignField: "id_vieclam",
            as: "ViecLam"
        }
      },
      {$unwind: { path: "$ViecLam", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
            from: "Users",
            localField: "id_uv",
            foreignField: "idTimViec365",
            pipeline: [
                { $match: { idTimViec365: { $nin: [0, null] } } },
            ],
            as: "UngVien"
        }
      },
      {$unwind: { path: "$UngVien", preserveNullAndEmptyArrays: true }},
      {
        $project: {
          "id_ungtuyen": "$id_ungtuyen",
          "id_uv": "$id_uv",
          "id_ntd": "$id_ntd",
          "id_viec": "$id_viec",
          "ca_lam": "$ca_lam",
          "gio_lam": "$gio_lam",
          "day": "$day",
          "ghi_chu": "$ghi_chu",
          "status": "$status",
          "created_at": "$created_at",
          "uv_userName": "$UngVien.userName",
          "uv_phone": "$UngVien.phone",
          "uv_city": "$UngVien.city",
          "uv_address": "$UngVien.address",
          "vl_vitri": "$ViecLam.vi_tri",
          "vl_alias": "$ViecLam.alias",
        }
      }
    ]);
    let total = await functions.findCount(UngTuyen, condition);
    return functions.success(res, "danh sach ung vien moi ung tuyen", {total, data: ungVienMoiUngTuyen});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateStatusUngTuyen = async(req, res, next) => {
  try{
    let {id_ungtuyen, status} = req.body;
    if(id_ungtuyen) {
      id_ungtuyen = Number(id_ungtuyen);
      let ungTuyen = await UngTuyen.findOneAndUpdate({id_ungtuyen: id_ungtuyen}, {status: status});
      if(ungTuyen) {
        return functions.success(res, "Update status ung tuyen thanh cong");
      }
      return functions.setError(res, "Ung tuyen not found!", 404);
    }
    return functions.setError(res, "Missing input value", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateGhiChuUngTuyen = async(req, res, next) => {
  try{
    let {id_ungtuyen, ghi_chu} = req.body;
    if(id_ungtuyen) {
      id_ungtuyen = Number(id_ungtuyen);
      let ungTuyen = await UngTuyen.findOneAndUpdate({id_ungtuyen: id_ungtuyen}, {ghi_chu: ghi_chu});
      if(ungTuyen) {
        return functions.success(res, "Update chi chu ung tuyen thanh cong");
      }
      return functions.setError(res, "Ung tuyen not found!", 404);
    }
    return functions.setError(res, "Missing input value", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//ung vien tu diem loc
exports.ungVienTuDiemLoc = async(req, res, next) => {
  try{
    let {page, pageSize, ket_qua} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 6;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;
    let id_ntd = req.user.data.idTimViec365;
    let condition = {id_ntd: id_ntd};
    if(ket_qua) condition.ket_qua = Number(ket_qua); 
    let ungVienMoiUngTuyen = await NtdXemUv.aggregate([
      {$match: condition},
      {$sort: {stt: -1}},
      {$skip: skip},
      {$limit: pageSize},
      {
        $lookup: {
            from: "Users",
            localField: "id_uv",
            foreignField: "idTimViec365",
            pipeline: [
                { $match: { idTimViec365: { $nin: [0, null] } } },
            ],
            as: "UngVien"
        }
      },
      {$unwind: { path: "$UngVien", preserveNullAndEmptyArrays: true }},
      {
        $project: {
          "stt": "$stt",
          "id_ntd": "$id_ntd",
          "id_uv": "$id_uv",
          "ket_qua": "$ket_qua",
          "ghi_chu": "$ghi_chu",
          "time_created": "$time_created",
          "uv_userName": "$UngVien.userName",
          "uv_phone": "$UngVien.phone",
          "uv_city": "$UngVien.city",
          "uv_address": "$UngVien.address",
          "uv_day": "$UngVien.inforVLTG.uv_day",
        }
      }
    ]);
    let total = await functions.findCount(NtdXemUv, condition);
    return functions.success(res, "danh sach ung vien moi ung tuyen", {total, data: ungVienMoiUngTuyen});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateKetQuaNtdXemUv = async(req, res, next) => {
  try{
    let {stt, ket_qua} = req.body;
    if(stt) {
      stt = Number(stt);
      let ntdXemUv = await NtdXemUv.findOneAndUpdate({stt: stt}, {ket_qua: ket_qua});
      if(ntdXemUv) {
        return functions.success(res, "Update ket_qua nha tuyen dung xem ung vien thanh cong");
      }
      return functions.setError(res, "NtdXemUv not found!", 404);
    }
    return functions.setError(res, "Missing input stt", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateGhiChuNtdXemUv = async(req, res, next) => {
  try{
    let {stt, ghi_chu} = req.body;
    if(stt) {
      stt = Number(stt);
      let ntdXemUv = await NtdXemUv.findOneAndUpdate({stt: stt}, {ghi_chu: ghi_chu});
      if(ntdXemUv) {
        return functions.success(res, "Update chi chu nha tuyen dung xem ung vien thanh cong");
      }
      return functions.setError(res, "NtdXemUv not found!", 404);
    }
    return functions.setError(res, "Missing input stt", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.getDiem = async(req, res, next) => {
  try{
    let id_ntd = req.user.data.idTimViec365;
    let ntd = await Users.findOne({idTimViec365: id_ntd}, {inforVLTG: 1});
    if(ntd) {
      return functions.success(res, "Get diem thanh cong", {data: ntd});
    }
    return functions.setError(res, "Nha tuyen dung not found!", 404);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.ntdXemUv = async(req, res, next) => {
  try{
    let id_ntd = req.user.data.idTimViec365;
    let ntd = await Users.findOne({idTimViec365: id_ntd}, {inforVLTG: 1});
    let id_uv = req.body.id_uv;
    if(ntd && id_uv) {
      id_uv = Number(id_uv);
      let ungVien = await Users.findOne({idTimViec365: id_uv});
      if(ungVien) {
        let check = await NtdXemUv.findOne({id_ntd: id_ntd, id_uv: id_uv});
        if(check) return functions.setError(res, "Nha tuyen dung da xem tt cua ung vien!");
        let time = functions.convertTimestamp(Date.now());
        let diem_free = 0;
        let diem_mua = 0;
        if(ntd.inforVLTG) {
          diem_free = ntd.inforVLTG.diem_free;
          diem_mua = ntd.inforVLTG.diem_mua;
        }
        let diem_t = diem_free + diem_mua;
        if(diem_t>0) {
          if(diem_free > 0) {
            diem_free -= 1;
            await Users.findOneAndUpdate({idTimViec365: id_ntd}, {"inforVLTG.diem_free": diem_free});
          }else {
            diem_mua -= 1;
            await Users.findOneAndUpdate({idTimViec365: id_ntd}, {"inforVLTG.diem_mua": diem_mua});
          }
          //
          let maxId = await functions.getMaxIdByField(NtdXemUv, 'stt');
          let ntdXemUv = new NtdXemUv({
            stt: maxId,
            id_ntd: id_ntd,
            id_uv: id_uv,
            ket_qua: 1,
            time_created: time
          });
          ntdXemUv = await ntdXemUv.save();
          if(ntdXemUv) {
            //them vao model thong bao
            let maxIdTb = await functions.getMaxIdByField(ThongBaoUv, 'tb_id');
            let ntd_name = ntd.userName? ntd.userName: "";
            let ntd_avatar = ntd.avatarUser? ntd.avatarUser: "";
            let thongBao = new ThongBaoUv({
              tb_id: maxIdTb,
              tb_uv: id_uv,
              tb_ntd: id_ntd,
              tb_name: ntd_name,
              tb_avatar: ntd_avatar,
              created_at: time
            });
            await thongBao.save();
            //gui mail
            await vltgService.sendEmailUv(ntd, ungVien);
            return functions.success(res, "Nha tuyen dung xem ung vien thanh cong!");
          }
          return functions.setError(res, "Nha tuyen dung xem ung vien that bai!", 500);
        }
        return functions.setError(res, "Nha tuyen dung khong du diem!", 400);
      }
      return functions.setError(res, "Ung vien not found!", 404);
    }
    return functions.setError(res, "Nha tuyen dung not found or missing input id_uv!", 404);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.congThemDiem = async(req, res, next) => {
  try{
    let id_ntd = req.user.data.idTimViec365;
    let ntd = await Users.findOneAndUpdate({idTimViec365: id_ntd}, {"inforVLTG.diem_free": 100}, {new: true});
    if(ntd) {
      return functions.success(res, "Cong diem thanh cong");
    }
    return functions.setError(res, "Nha tuyen dung not found!", 404);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//ung vien da xem
exports.ungVienDaXem = async(req, res, next) => {
  try{
    let {page, pageSize} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 6;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;
    let id_ntd = req.user.data.idTimViec365;
    let condition = {xm_id_ntd: id_ntd};
    let ungVienDaXem = await XemUv.aggregate([
      {$match: condition},
      {$sort: {xm_id: -1}},
      {$skip: skip},
      {$limit: pageSize},
      {
        $lookup: {
            from: "Users",
            localField: "xm_id_uv",
            foreignField: "idTimViec365",
            pipeline: [
                { $match: { idTimViec365: { $nin: [0, null] } } },
            ],
            as: "UngVien"
        }
      },
      {$unwind: { path: "$UngVien", preserveNullAndEmptyArrays: true }},
      {
        $project: {
          "xm_id": "$xm_id",
          "xm_id_ntd": "$xm_id_ntd",
          "xm_id_uv": "$xm_id_uv",
          "xm_time_created": "$xm_time_created",
          "uv_userName": "$UngVien.userName",
          "uv_city": "$UngVien.city",
          "uv_address": "$UngVien.address",
          "uv_birthday": "$UngVien.inForPerson.account.birthday",
          "uv_day": "$UngVien.inforVLTG.uv_day",
        }
      }
    ]);
    let total = await functions.findCount(XemUv, condition);
    return functions.success(res, "danh sach ung vien moi ung tuyen", {total, data: ungVienDaXem});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//xoa ung vien da xem
exports.xoaUngVienDaXem = async(req, res, next) => {
  try{
    let id = req.body.id;
    if(id) {
      id = Number(id);
      let xemUv = await XemUv.findOneAndDelete({xm_id: id});
      if(xemUv) {
        return functions.success(res, "Xoa ung vien khoi danh sach thanh cong!");
      }
      return functions.setError(res, "Ban ghi not found!", 404);
    } 
    return functions.setError(res, "Missing input id", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//--------------ung vien da luu
exports.ungVienDaLuu = async(req, res, next) => {
  try{
    let {page, pageSize} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 6;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;
    let id_ntd = req.user.data.idTimViec365;
    let condition = {id_ntd: id_ntd};
    let ungVienDaLuu = await NtdSaveUv.aggregate([
      {$match: condition},
      {$sort: {id: -1}},
      {$skip: skip},
      {$limit: pageSize},
      {
        $lookup: {
            from: "Users",
            localField: "id_uv",
            foreignField: "idTimViec365",
            pipeline: [
                { $match: { idTimViec365: { $nin: [0, null] } } },
            ],
            as: "UngVien"
        }
      },
      {$unwind: { path: "$UngVien", preserveNullAndEmptyArrays: true }},
      {
        $project: {
          "id": "$id",
          "id_ntd": "$id_ntd",
          "id_uv": "$id_uv",
          "created_at": "$created_at",
          "uv_userName": "$UngVien.userName",
          "uv_city": "$UngVien.city",
          "uv_address": "$UngVien.address",
          "uv_phone": "$UngVien.phone",
          "uv_birthday": "$UngVien.inForPerson.account.birthday",
          "uv_day": "$UngVien.inforVLTG.uv_day",
        }
      }
    ]);
    let total = await functions.findCount(NtdSaveUv, condition);
    for(let i=0; i<ungVienDaLuu.length; i++) {
      let id_uv = ungVienDaLuu[i].id_uv;
      let ntdXemUv = await NtdXemUv.findOne({id_ntd: id_ntd, id_uv: id_uv});
      let check_xem_uv = false;
      if(ntdXemUv) {
        check_xem_uv = true;
      }else {
        let phone = ungVienDaLuu[i].uv_phone;
        if(phone) phone = phone.substring(0, 4);
        ungVienDaLuu[i].uv_phone = phone;
      }
      ungVienDaLuu[i].check_xem_uv = check_xem_uv;
    }
    return functions.success(res, "danh sach ung vien moi ung tuyen", {total, data: ungVienDaLuu});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//xoa ung vien da luu
exports.xoaUngVienDaLuu = async(req, res, next) => {
  try{
    let id_uv = req.body.id_uv;
    let id_ntd = req.user.data.idTimViec365;
    if(id_uv && id_ntd) {
      id_uv = Number(id_uv);
      let ntdSaveUv = await NtdSaveUv.findOneAndDelete({id_uv: id_uv, id_ntd: id_ntd});
      if(ntdSaveUv) {
        return functions.success(res, "Xoa ung vien khoi danh sach thanh cong!");
      }
      return functions.setError(res, "Ban ghi not found!", 404);
    } 
    return functions.setError(res, "Missing input", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.ntdSaveUv = async(req, res, next) => {
  try{
    let id_ntd = req.user.data.idTimViec365;
    let id_uv = req.body.id_uv;
    if(id_uv) {
      id_uv = Number(id_uv);
      let ntd = await Users.findOne({idTimViec365: id_ntd});
      let ungVien = await Users.findOne({idTimViec365: id_uv});
      if(ntd && ungVien) {
        let maxId = await functions.getMaxIdByField(NtdSaveUv, 'id');
        let ntdSaveUv = new NtdSaveUv({
          id: maxId,
          id_ntd: id_ntd,
          id_uv: id_uv,
          created_at: Date.now()
        });
        ntdSaveUv = await ntdSaveUv.save();
        if(ntdSaveUv) {
          //them vao model thong bao
          let maxIdTb = await functions.getMaxIdByField(ThongBaoUv, 'tb_id');
          let ntd_name = ntd.userName? ntd.userName: "";
          let ntd_avatar = ntd.avatarUser? ntd.avatarUser: "";
          let time = functions.convertTimestamp(Date.now());
          let thongBao = new ThongBaoUv({
            tb_id: maxIdTb,
            tb_uv: id_uv,
            tb_ntd: id_ntd,
            tb_name: ntd_name,
            tb_avatar: ntd_avatar,
            created_at: time
          });
          await thongBao.save();
          return functions.success(res, "Nha tuyen dung luu ung vien thanh cong!");
        }
        return functions.setError(res, "Ntd luu ung vien that bai", 405);
      }
      return functions.setError(res, "Nha tuyen dung or Ung vien khong ton tai", 404);
    }
    return functions.setError(res, "Missing input id_uv", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.getThongBaoNtd = async(req, res, next) => {
  try{
    let $id_ntd = req.user.data.idTimViec365;
    let thongBao = await ThongBaoNtd.find({td_ntd: $id_ntd});
    return functions.success(res, "Lay ra thong bao thanh cong", {data: thongBao});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.xoaThongBaoNtd = async(req, res, next) => {
  try{
    let tb_id = req.body.tb_id;
    if(tb_id && tb_id.length>0) {
      let arrIdDelete = tb_id.map(idItem => parseInt(idItem));
      await ThongBaoNtd.deleteMany({ tb_id: { $in: arrIdDelete } });
      return functions.success(res, 'Delete Thong bao thanh cong!');
    }
    return functions.setError(res, "Missing input tb_id", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.getInfoCompany = async(req, res, next) => {
  try{
    let id_ntd = req.user.data.idTimViec365;
    let ntd = await Users.findOne({idTimViec365: id_ntd, type: 1}, {
      "idTimViec365": "$idTimViec365",
      "userName": "$userName",
      "email": "$email",
      "emailContact": "$emailContact",
      "avatarUser": "$avatarUser",
      "com_size": "$inForCompany.com_size",
      "phone": "$phone",
      "phoneTK": "$phoneTK",
      "city": "$city",
      "district": "$district",
      "address": "$address",
      "createdAt": "$createdAt",
      "usc_name": "$inForCompany.timviec365.usc_name",
      "usc_name_add": "$inForCompany.timviec365.usc_name_add",
      "usc_name_phone": "$inForCompany.timviec365.usc_name_phone",
      "usc_name_email": "$inForCompany.timviec365.usc_name_email",
      "usc_mst": "$inForCompany.timviec365.usc_mst",
      "usc_website": "$inForCompany.timviec365.usc_website",
      "description": "$inForCompany.description",
    }).lean();
    if(ntd) {
      let time_created = ntd.createdAt;
      if(!time_created) time_created = functions.convertTimestamp(Date.now());
      ntd.linkAvatar = vltgService.getLinkFile(folder_img, time_created, ntd.avatarUser);
      return functions.success(res, "lay ra thong tin thanh cong!", {data: ntd});
    }
    return functions.setError(res, "Nha tuyen dung not found!", 404);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateInfoCompany = async(req, res, next) => {
  try{
    let id_ntd = req.user.data.idTimViec365;
    let time = functions.convertTimestamp(Date.now());
    let {userName, phone, city, district, address, description, com_size, usc_name, usc_name_add, usc_name_phone, usc_name_email, usc_mst, usc_website} = req.body;
    if(userName && phone && city && district && address && description && com_size && usc_name && usc_name_add && usc_name_phone && usc_name_email) {
      let checkPhone1 = await functions.checkPhoneNumber(phone);
      let checkPhone2 = await functions.checkPhoneNumber(usc_name_phone);
      if(checkPhone1 && checkPhone2) {
        let ntd = await Users.findOneAndUpdate({idTimViec365: id_ntd, type: 1}, {
          userName: userName,
          phone: phone,
          city: city,
          district: district,
          address: address,
          updatedAt: time,
          "inForCompany.description": description,
          "inForCompany.com_size": com_size,
          "inForCompany.timviec365.usc_name": usc_name,
          "inForCompany.timviec365.usc_name_add": usc_name_add,
          "inForCompany.timviec365.usc_name_phone": usc_name_phone,
          "inForCompany.timviec365.usc_name_email": usc_name_email,
          "inForCompany.timviec365.usc_mst": usc_mst,
          "inForCompany.timviec365.usc_website": usc_website,
        }, {new: true});
        if(ntd) {
          return functions.success(res, "Cap nhat thong tin thanh cong!");
        }
        return functions.setError(res, "Nha tuyen dung not found!", 404);
      }
      return functions.setError(res, "Invalid phone number!", 400);
    }
    return functions.setError(res, "Missing input value!", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateAvatarCompany = async(req, res, next) => {
  try{
    let id_ntd = req.user.data.idTimViec365;
    let ntd = await Users.findOne({idTimViec365: id_ntd, type: 1});
    let time = functions.convertTimestamp(Date.now());
    if(ntd) {
      if(req.files && req.files.avatar) {
        let avatar = req.files.avatar;
        let check = await vltgService.checkFile(avatar.path);
        if(check) {
          let time_created = ntd.createdAt;
          if(!time_created) time_created = time;
          let nameAvatar = await vltgService.uploadFileNameRandom(folder_img, time_created, avatar);
          await Users.findOneAndUpdate({idTimViec365: id_ntd, type: 1}, {avatarUser: nameAvatar, updatedAt: time}, {new: true});
          return functions.success(res, "Update avatar company success!");
        }
        return functions.setError(res, "Anh khong dung dinh dang hoac qua lon!", 400);
      }
      return functions.setError(res, "Missing input avatar!", 400);
    }
    return functions.setError(res, "Nha tuyen dung khong ton tai!", 400);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}