"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      value: "default"
    },
    content: {
      type: String,
      value: "default"
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.title),
    b: common_vendor.t($props.content)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ec928d66"], ["__file", "E:/微信开发者工具/项目目录/小程序入门/myCloudMusic_uniapp/components/NavHeader/NavHeader.vue"]]);
wx.createComponent(Component);
