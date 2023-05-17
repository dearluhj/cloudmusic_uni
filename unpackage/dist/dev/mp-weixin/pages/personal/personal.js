"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/config.js");
let startCoordY = 0, offsetCoordY = 0;
const _sfc_main = {
  data() {
    return {
      coverTransform: 0,
      coverTransition: 0,
      userInfo: {},
      userPlayrecord: []
    };
  },
  methods: {
    handlestart(e) {
      startCoordY = e.touches[0].clientY;
      this.coverTransition = 0;
    },
    handlemove(e) {
      let currentY = e.touches[0].clientY;
      offsetCoordY = currentY - startCoordY;
      if (offsetCoordY < 0) {
        return;
      }
      if (offsetCoordY > 80) {
        offsetCoordY = 80;
      }
      this.coverTransform = offsetCoordY;
    },
    handlecancel() {
      this.coverTransform = 0;
      this.coverTransition = 0.6;
    },
    //更新用户信息
    async updateUsercurrentInfo() {
      let res = await utils_request.request("/login/status", {
        timestamp: Date.now()
      }, {}, "post");
      if (res.data.profile) {
        this.userInfo = res.data.profile;
        this.getUserPlayrecord();
      }
    },
    //获取最近播放信息
    async getUserPlayrecord() {
      let uid = this.userInfo.userId;
      let recordres = await utils_request.request("/user/record", {
        uid,
        type: 1
      }, {}, "post");
      recordres.weekData.splice(10);
      recordres.weekData.map((item, index) => {
        item.id = index;
      });
      this.userPlayrecord = recordres.weekData;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let cookie = common_vendor.index.getStorageSync("userCookie");
    if (cookie) {
      this.updateUsercurrentInfo();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.backgroundUrl || "/static/image/personal/bgImg3.jpg",
    b: $data.userInfo.avatarUrl || "/static/image/personal/missing-face.png",
    c: common_vendor.t($data.userInfo.nickname || "游客"),
    d: common_vendor.o((...args) => $options.handlecancel && $options.handlecancel(...args)),
    e: common_vendor.o((...args) => $options.handlemove && $options.handlemove(...args)),
    f: common_vendor.o((...args) => $options.handlestart && $options.handlestart(...args)),
    g: common_vendor.o((...args) => $options.handlecancel && $options.handlecancel(...args)),
    h: !$data.userPlayrecord.length
  }, !$data.userPlayrecord.length ? {} : {
    i: common_vendor.f($data.userPlayrecord, (item, k0, i0) => {
      return {
        a: item.song.al.picUrl,
        b: common_vendor.t(item.song.name),
        c: item.song
      };
    })
  }, {
    j: "translateY(" + $data.coverTransform + "rpx)",
    k: $data.coverTransition + "s"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6ae23533"], ["__file", "E:/微信开发者工具/项目目录/小程序入门/myCloudMusic_uniapp/pages/personal/personal.vue"]]);
wx.createPage(MiniProgramPage);
