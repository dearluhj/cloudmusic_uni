"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  methods: {
    loginVerify() {
      let {
        phone,
        password
      } = this;
      if (!phone) {
        common_vendor.index.showToast({
          title: "手机号不能为空",
          icon: "error",
          duration: 2e3
        });
        return;
      }
      if (!password) {
        common_vendor.index.showToast({
          title: "密码不能为空",
          icon: "error",
          duration: 2e3
        });
        return;
      }
      let reg = /^1[3-9]\d{9}$/;
      if (!reg.test(phone)) {
        common_vendor.index.showToast({
          title: "手机号格式有误",
          icon: "error",
          duration: 2e3
        });
        return;
      }
      common_vendor.index.showToast({
        title: "验证成功",
        icon: "success",
        duration: 2e3
      });
    },
    //空回调
    donotcare() {
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o([($event) => $data.phone = $event.detail.value, (...args) => $options.donotcare && $options.donotcare(...args)]),
    b: $data.phone,
    c: common_vendor.o([($event) => $data.password = $event.detail.value, (...args) => $options.donotcare && $options.donotcare(...args)]),
    d: $data.password,
    e: common_vendor.o((...args) => $options.loginVerify && $options.loginVerify(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a3034b86"], ["__file", "E:/微信开发者工具/项目目录/小程序入门/myCloudMusic_uniapp/pages/login/passwordlogin/passwordlogin.vue"]]);
wx.createPage(MiniProgramPage);
