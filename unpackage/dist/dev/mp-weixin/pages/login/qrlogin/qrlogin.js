"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
require("../../../utils/config.js");
const _sfc_main = {
  data() {
    return {
      imageUrl: "",
      currentqrStatus: true,
      qrstatueMsg: ""
    };
  },
  methods: {
    getcurrentTime() {
      return Date.now();
    },
    //获取二维码图片
    async getqrimage() {
      let key = await utils_request.request("/login/qr/key", {
        timestamp: this.getcurrentTime()
      }, {});
      key = key.data.unikey;
      let qrimgbase = await utils_request.request("/login/qr/create", {
        key,
        qrimg: true,
        timestamp: this.getcurrentTime()
      }, {});
      qrimgbase = qrimgbase.data.qrimg;
      this.imageUrl = qrimgbase;
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.checkqrStatus(key);
    },
    //二维码轮询
    checkqrStatus(key) {
      this.timer = setInterval(async () => {
        let res = await utils_request.request("/login/qr/check", {
          key,
          timestamp: this.getcurrentTime(),
          isLogin: true
        }, {});
        if (res.code == 802) {
          this.qrstatueMsg = "扫码成功，请在手机上确认";
          this.currentqrStatus = false;
        } else if (res.code == 800) {
          clearInterval(this.timer);
          this.qrstatueMsg = "二维码已过期，请点击二维码刷新";
          this.imageUrl = "/static/image/waiting.png";
          this.currentqrStatus = true;
        } else if (res.code == 803) {
          clearInterval(this.timer);
          this.qrstatueMsg = "授权登录成功";
          this.currentqrStatus = false;
          let statusres = await utils_request.request("/login/status", {
            timestamp: this.getcurrentTime()
          }, {}, "post");
          common_vendor.index.setStorage({
            key: "userInfo",
            data: JSON.stringify(statusres.data.profile),
            encrypt: true,
            success() {
              common_vendor.index.showToast({
                title: "页面即将跳转",
                icon: "success"
              }, 2e3);
            }
          });
          let redirectTime = setTimeout(() => {
            clearTimeout(redirectTime);
            common_vendor.index.reLaunch({
              url: "/pages/personal/personal"
            });
          }, 2e3);
        }
      }, 1e3);
    }
  },
  onLoad() {
    this.getqrimage();
  },
  onUnload() {
    clearInterval(this.timer);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentqrStatus
  }, $data.currentqrStatus ? {
    b: common_vendor.o((...args) => $options.getqrimage && $options.getqrimage(...args)),
    c: $data.imageUrl
  } : {}, {
    d: !$data.currentqrStatus
  }, !$data.currentqrStatus ? {} : {}, {
    e: common_vendor.t($data.qrstatueMsg)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d56e4e35"], ["__file", "E:/微信开发者工具/项目目录/小程序入门/myCloudMusic_uniapp/pages/login/qrlogin/qrlogin.vue"]]);
wx.createPage(MiniProgramPage);
