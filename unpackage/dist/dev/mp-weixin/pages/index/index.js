"use strict";
const utils_request = require("../../utils/request.js");
const common_vendor = require("../../common/vendor.js");
require("../../utils/config.js");
const NavHeader = () => "../../components/NavHeader/NavHeader.js";
const _sfc_main = {
  components: {
    NavHeader
  },
  data() {
    return {
      mess: 456,
      bannerList: [],
      personalList: [],
      toprankList: [],
      toprankIndex: 0,
      toprankTotal: 5
    };
  },
  onLoad: async function(options) {
    let bannerData, personalData;
    try {
      [bannerData, personalData] = await Promise.all([utils_request.request("/banner", {
        type: 1
      }), utils_request.request("/personalized", {
        limit: 10
      })]);
    } catch (error) {
      console.log(error);
    }
    this.bannerList = bannerData;
    this.personalList = personalData;
    let arr;
    arr = await utils_request.request("/toplist/detail");
    arr.list.splice(6);
    arr.list.forEach(async (item) => {
      let res;
      res = await utils_request.request("/playlist/detail", {
        id: item.id
      });
      res.playlist.tracks.splice(3);
      this.toprankList.push(res.playlist);
    });
  },
  methods: {
    aclick: function() {
    }
  }
};
if (!Array) {
  const _easycom_NavHeader2 = common_vendor.resolveComponent("NavHeader");
  _easycom_NavHeader2();
}
const _easycom_NavHeader = () => "../../components/NavHeader/NavHeader.js";
if (!Math) {
  _easycom_NavHeader();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.bannerList.banners, (item, k0, i0) => {
      return {
        a: item.pic,
        b: item.bannerId
      };
    }),
    b: common_vendor.p({
      title: "推荐歌单",
      content: "为你精心推荐"
    }),
    c: common_vendor.f($data.personalList.result, (item, k0, i0) => {
      return {
        a: item.picUrl,
        b: common_vendor.t(item.name),
        c: item.id
      };
    }),
    d: common_vendor.p({
      title: "排行榜",
      content: "热歌风向标"
    }),
    e: common_vendor.f($data.toprankList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.f(item.tracks, (item2, index2, i1) => {
          return {
            a: item2.al.picUrl,
            b: common_vendor.t(index2 + 1),
            c: common_vendor.t(item2.name),
            d: common_vendor.f(item2.ar, (item3, index3, i2) => {
              return common_vendor.e({
                a: index3 > 0
              }, index3 > 0 ? {} : {}, {
                b: common_vendor.t(item3.name),
                c: item3.id
              });
            }),
            e: item2.id
          };
        }),
        c: item.id
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "E:/微信开发者工具/项目目录/小程序入门/myCloudMusic_uniapp/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
