"use strict";
const pages_video_method = require("./method.js");
const common_vendor = require("../../common/vendor.js");
require("../../utils/request.js");
require("../../utils/config.js");
const _sfc_main = {
  data() {
    return {
      videoTablist: [],
      navId: 0,
      videoList: [],
      //视频总数据
      videoOffset: 0,
      //视频页数
      videoPlayid: "",
      videoTimerecordlist: "",
      isTriggered: false
      //当前下拉刷新是否已完成
    };
  },
  methods: {
    ...pages_video_method.method
  },
  onLoad() {
    this.getInitializeMsg();
  },
  onShareAppMessage() {
    return {
      title: "网易云音乐",
      path: "/pages/video/video",
      imageUrl: "/static/image/video/logo.png"
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.videoTablist, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.n(item.id === $data.navId ? "active" : ""),
        c: "nav" + item.id,
        d: item.id,
        e: item.id
      };
    }),
    b: "nav" + $data.navId,
    c: common_vendor.o((...args) => _ctx.handleNav && _ctx.handleNav(...args)),
    d: common_vendor.f($data.videoList, (item, k0, i0) => {
      return common_vendor.e({
        a: item.data.creator.avatarUrl || item.data.imgurl16v9,
        b: common_vendor.t(item.data.creator.nickname || ""),
        c: common_vendor.t(item.data.praisedCount || item.data.likeCount),
        d: common_vendor.t(item.data.commentCount),
        e: $data.videoPlayid === (item.data.vid || "v" + item.data.id)
      }, $data.videoPlayid === (item.data.vid || "v" + item.data.id) ? {
        f: common_vendor.o((...args) => _ctx.handleVideopalytime && _ctx.handleVideopalytime(...args), item.id),
        g: item.data.vid || "v" + item.data.id,
        h: item.data.vid || "v" + item.data.id,
        i: common_vendor.o((...args) => _ctx.videoTimerecord && _ctx.videoTimerecord(...args), item.id),
        j: item.urls.url
      } : {
        k: common_vendor.o((...args) => _ctx.handleVideopalytime && _ctx.handleVideopalytime(...args), item.id),
        l: item.data.vid || "v" + item.data.id,
        m: item.data.coverUrl
      }, {
        n: common_vendor.o((...args) => _ctx.changeVideostatus && _ctx.changeVideostatus(...args), item.id),
        o: item.data.vid || "v" + item.data.id,
        p: common_vendor.t(item.data.title || item.data.name),
        q: item.id
      });
    }),
    e: common_vendor.o((...args) => _ctx.updateScrollview && _ctx.updateScrollview(...args)),
    f: common_vendor.o((...args) => _ctx.addScrollviewvideo && _ctx.addScrollviewvideo(...args)),
    g: $data.isTriggered
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/微信开发者工具/项目目录/小程序入门/myCloudMusic_uniapp/pages/video/video.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
