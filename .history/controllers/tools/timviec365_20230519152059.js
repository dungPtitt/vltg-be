const fnc = require('../../services/functions');
const AdminUser = require('../../models/Timviec365/Timviec/adminUser.model');
const Modules = require('../../models/Timviec365/Timviec/modules.model');
const KeyWord = require('../../models/Timviec365/Timviec/keyword.model');
const CV = require('../../models/Timviec365/CV/CV');
const NewTV365 = require('../../models/Timviec365/Timviec/Company/New.model')
const Linh_Vuc = require('../../models/Timviec365/Timviec/Lv.model')
const CategoryBlog = require('../../models/Timviec365/Timviec/Blog/category')

// hàm thêm dữ liệu vào bảng newTV365
exports.toolNewTV365 = async(req, res, next) => {
    try {
        // let result = true;
        // let count = 0;
        // do {
        let data = await fnc.getDataAxios('https://timviec365.vn/email2/testh4.php')
        if (data.length > 0) {
            data.forEach(async element => {
                let cityArray = element.new_city.split(",").map(String);
                let districtArray = element.new_qh_id.split(",").map(String);
                const newTV = new NewTV365({
                    _id: element.new_id,
                    userID: element.usc_id,
                    title: element.new_title,
                    cateID: element.new_cat_id,
                    cityID: cityArray,
                    districtID: districtArray,
                    address: element.new_addr,
                    capBac: element.new_cap_bac,
                    exp: element.new_exp,
                    sex: element.new_gioi_tinh,
                    bangCap: element.new_bang_cap,
                    hinhThuc: element.new_hinh_thuc,
                    doTuoi: element.key_301,
                    money: element.new_money,
                    createTime: new Date(element.new_create_time * 1000),
                    updateTime: new Date(element.new_update_time * 1000),
                    hanNop: new Date(element.new_han_nop * 1000),
                    newHot: element.new_hot,
                    newCao: element.new_cao,
                    newGhim: element.new_ghim,
                    newGap: element.new_gap,
                    newMutil: {
                        moTa: element.new_mota,
                        yeuCau: element.new_yeucau,
                        quyenLoi: element.new_quyenloi,
                        hoSo: element.new_ho_so,
                    },
                    newMoney: {
                        type: element.nm_type,
                        minValue: element.nm_min_value,
                        maxValue: element.nm_max_value,
                        unit: element.nm_unit,
                    }
                })
                await newTV.save();

            });
        }
        // count += 20;
        // console.log(count)
        //     } else result = false;
        // }
        // while (result)
        await fnc.success(res, 'thành công', { data });

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm thêm dữ liệu vào bảng Keyword
exports.toolKeyword = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/api/get_keyword.php?page=' + page)
            listKey = data;
            if (listKey.length > 0) {
                listKey.forEach(async element => {
                    let keyWord = await fnc.getDatafindOne(KeyWord, { _id: element.key_id })
                    if (keyWord == null) {
                        const decodedStringNdgy = Buffer.from(element.key_ndgy, 'base64').toString('utf-8'); // Giải mã chuỗi
                        const decodedStringTeaser = Buffer.from(element.key_teaser, 'base64').toString('utf-8'); // Giải mã chuỗi
                        const key = new KeyWord({
                            _id: element.key_id,
                            name: element.key_name,
                            lq: element.key_lq,
                            cateID: element.key_cate_id,
                            cityID: element.key_city_id,
                            qhID: element.key_qh_id,
                            cbID: element.key_cb_id,
                            teaser: decodedStringTeaser,
                            type: element.key_type,
                            err: element.key_err,
                            qhKcn: element.key_qh_kcn,
                            cateLq: element.key_cate_lq,
                            title: element.key_tit,
                            description: element.key_desc,
                            keyword: element.key_key,
                            h1: element.key_h1,
                            createTime: new Date(element.key_time * 1000),
                            redirect301: element.key_301,
                            index: element.key_index,
                            baoHam: element.key_bao_ham,
                            tdgy: element.key_tdgy,
                            ndgy: decodedStringNdgy,
                        })
                        await key.save();
                    }
                    return functions.setError(res, 'trùng _id')

                });
                page++
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm thêm dữ liệu vào bảng AdminUser
exports.toolAddAdminUSer = async(req, res, next) => {
    try {

        let data = await functions.getDataAxios('https://timviec365.vn/api/get_user_admin.php?page=1')

        for (let i = 0; i < data.length; i++) {
            let bophan = 0;
            let stt = 0;
            if (data[i].adm_bophan != 0) {
                const maxIdKD = await AdminUser.findOne({ bophan: 1 }, {}, { sort: { stt: -1 } }) || 0;
                stt = maxIdKD.stt || 0;
                bophan = 1;
            }
            if (data[i].adm_ntd != 0) {
                const maxIdNTD = await AdminUser.findOne({ bophan: 3 }, {}, { sort: { stt: -1 } }) || 0;
                stt = maxIdNTD.stt || 0;
                bophan = 3;

            }
            if (data[i].adm_nhaplieu != 0) {
                bophan = 2;
                const maxIdNL = await AdminUser.findOne({ bophan: 2 }, {}, { sort: { stt: -1 } }) || 0;
                stt = maxIdNL.stt || 0;
            }
            let adminCheck = await fnc.getDatafindOne(AdminUser, { _id: data[i].adm_id })
            if (adminCheck == null) {
                const admin = new AdminUser({
                    _id: data[i].adm_id,
                    loginName: data[i].adm_loginname,
                    password: data[i].adm_password,
                    name: data[i].adm_name,
                    email: data[i].adm_email,
                    author: data[i].adm_author,
                    address: data[i].adm_address,
                    phone: data[i].adm_phone,
                    mobile: data[i].adm_mobile,
                    accesModule: data[i].adm_access_module,
                    accessCategory: data[i].adm_access_category,
                    date: data[i].adm_date,
                    isadmin: data[i].adm_isadmin,
                    active: data[i].adm_active,
                    langID: data[i].lang_id,
                    delete: data[i].adm_delete,
                    allCategory: data[i].adm_all_category,
                    editAll: data[i].adm_edit_all,
                    adminID: data[i].admin_id,
                    bophan: bophan,
                    stt: Number(stt) + 1 || null,
                    empID: data[i].emp_id,

                })
                await admin.save();
            }
            return functions.setError(res, 'trùng _id')
        }


        return functions.success(res, 'thêm thành công', data)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

//hàm thêm dữ liệu của lĩnh vực
exports.toolLV = async(req, res, next) => {
    try {
        let result = true,
            page = 1;
        do {
            let data = await functions.getDataAxios('https://timviec365.vn/api/get_trang_vang.php?page=' + page)
            if (data.length > 0) {
                for (i = 0; i < data.length; i++) {
                    const decodedStringConten = Buffer.from(data[i].tag_content, 'base64').toString('utf-8'); // Giải mã chuỗi
                    const decodedStringNdgy = Buffer.from(data[i].tag_ndgy, 'base64').toString('utf-8'); // Giải mã chuỗi
                    let lv = new Linh_Vuc({
                        _id: data[i].id,
                        nameTag: data[i].name_tag,
                        cityTag: data[i].city_tag,
                        cateID: data[i].cate_id,
                        parentID: data[i].parent_id,
                        leverID: data[i].level_id,
                        keywordTag: data[i].keyword_tag,
                        TagContent: decodedStringConten,
                        link301: data[i].link_301,
                        tagVlgy: data[i].tag_vlgy,
                        tagNdgy: decodedStringNdgy,
                        tagIndex: data[i].tag_index,

                    })
                    await lv.save();
                }
                page++
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm thêm dữ liệu category blog
exports.toolCategoryBlog = async(req, res, next) => {
    try {
        let data = await fnc.getDataAxios('https://timviec365.vn/api_nodejs/get_list_category_blog.php')
        if (data.length > 0) {
            data.forEach(async element => {
                const category = new CategoryBlog({
                    _id: element.cat_id,
                    name: element.cat_name,
                    adminID: element.admin_id,
                    langID: element.lang_id,
                    title: element.cat_title,
                    keyword: element.cat_keyword,
                    nameRewrite: element.cat_name_rewrite,
                    link: element.cat_link,
                    picture: element.cat_picture,
                    type: element.cat_type,
                    form: element.cat_form,
                    description: element.cat_description,
                    parentID: element.cat_parent_id,
                    hasChild: element.cat_has_child,
                    order: element.cat_order,
                    active: element.cat_active,
                    show: element.cat_show,
                    home: element.cat_home,
                })
                await category.save();

            });
        }
        await fnc.success(res, 'thành công', { data });

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// // insert CV
exports.toolCV = async(req, res, next) => {
    try {
        //         const data = await functions.getDataAxios('https://timviec365.vn/cv365/api_nodejs/get_tbl_cv.php?page=1', {});
        //         await data.forEach(async element => {
        //             let htmlVi = {
        //                 css: {
        //                     color: ,
        //                     font: ,
        //                     font_size: ,
        //                     font_spacing:
        //                 },
        //                 cv_title: ,
        //                 avatar: ,
        //                 name: ,
        //                 position: ,
        //                 introduction: ,
        //                 menu: [{
        //                         id: ,
        //                         order: ,
        //                         content: {
        //                             title: ,
        //                             content: {
        //                                 type: ,
        //                                 content: {
        //                                     birthday: ,
        //                                     sex: ,
        //                                     phone: ,
        //                                     email: ,
        //                                     address: ,
        //                                     face:
        //                                 }
        //                             }
        //                         }
        //                     },

        //                 ],
        //                 experiences: [{
        //                         id: ,
        //                         order: 1,
        //                         content: {
        //                             title: ,
        //                             content: [{
        //                                 title: ,
        //                                 date: ,
        //                                 subtitle: content:
        //                             }]
        //                         }
        //                     },

        //                 ]
        //             }
        //             const cv = new CV({
        //                 _id: element.id,
        //                 name: element.name,
        //                 alias: element.alias,
        //                 urlAlias: element.url_alias,
        //                 urlCanonical: element.url_canonical,
        //                 image: element.image,
        //                 price: element.price,
        //                 color: element.colors,
        //                 view: element.view,
        //                 favorite: element.love,
        //                 download: element.download,
        //                 vip: element.vip,
        //                 cvIndex: element.cv_index,
        //                 cId: element.cid,
        //                 content: element.content,
        //                 motaCv: element.mota_cv,
        //                 htmlVi: element.html_vi,
        //                 htmlEn: element.html_en,
        //                 htmlJp: element.html_jp,
        //                 htmlCn: element.html_cn,
        //                 htmlKr: element.html_kr,
        //                 cateId: element.cate_id,
        //                 langId: element.lang_id,
        //                 designId: element.design_id,
        //                 exp: element.exp,
        //                 nhuCau: element.nhucau,
        //                 metaTitle: element.meta_title,
        //                 metaKey: element.meta_key,
        //                 metaDes: element.meta_des,
        //                 thuTu: element.thutu,
        //                 full: element.full,
        //                 status: element.status,
        //                 cvPoint: element.cv_point,
        //             });
        //             await CV.create(cv);

        //         });
        return await functions.success(res, "Thành công");
    } catch (err) {
        functions.setError(res, err.message);
    };
}