"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/passwordlogin/passwordlogin.js";
  "./pages/login/qrlogin/qrlogin.js";
  "./pages/recommendSong/recommendSong.js";
  "./pages/songPlaydetail/songPlaydetail.js";
  "./pages/search/search.js";
  "./pages/video/video.js";
  "./pages/personal/personal.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.$map = /* @__PURE__ */ new Map();
  },
  onShow: function() {
  },
  onHide: function() {
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/微信开发者工具/项目目录/小程序入门/myCloudMusic_uniapp/App.vue"]]);
require("./vue-devtools/hook.js");
require("./vue-devtools/backend.js");
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
