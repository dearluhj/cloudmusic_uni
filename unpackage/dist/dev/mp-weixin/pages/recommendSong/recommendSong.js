"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/config.js");
const _sfc_main = {
  data() {
    return {
      today: new Date().getDate(),
      recommendSonglist: [],
      musicIndex: 0
    };
  },
  methods: {
    async getrecommendSonglist() {
      let songList = await utils_request.request("/recommend/songs", {}, {}, "post");
      this.recommendSonglist = songList.data;
    },
    //跳转到音乐播放页面
    handletosongPlaydetail(e) {
      let {
        id,
        index
      } = e.currentTarget.dataset;
      common_vendor.index.$map.set("currentPlayid", id);
      this.musicIndex = index;
      common_vendor.index.navigateTo({
        url: "/pages/songPlaydetail/songPlaydetail"
      });
    }
  },
  onLoad(options) {
    let cookie = common_vendor.index.getStorageSync("userCookie");
    if (!cookie) {
      common_vendor.index.showToast({
        title: "请先登录",
        icon: "error",
        success() {
          setTimeout(() => {
            common_vendor.index.redirectTo({
              url: "/pages/login/passwordlogin/login"
            });
          }, 1e3);
        }
      }, 1e3);
    } else {
      this.getrecommendSonglist();
      common_vendor.index.$on("musicSwitchtype", (type) => {
        let {
          musicIndex,
          recommendSonglist
        } = this;
        if (type === "next") {
          musicIndex === recommendSonglist.dailySongs.length - 1 && (musicIndex = -1);
          musicIndex++;
        } else {
          musicIndex === 0 && (musicIndex = recommendSonglist.dailySongs.length);
          musicIndex--;
        }
        this.musicIndex = musicIndex;
        common_vendor.index.$emit("getMusicid", {
          id: recommendSonglist.dailySongs[musicIndex].id,
          index: musicIndex
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.today),
    b: common_vendor.f($data.recommendSonglist.dailySongs, (item, index, i0) => {
      return {
        a: item.al.picUrl,
        b: item.id,
        c: index,
        d: common_vendor.o((...args) => $options.handletosongPlaydetail && $options.handletosongPlaydetail(...args), item.id),
        e: common_vendor.t(item.name),
        f: common_vendor.t(item.ar[0].name),
        g: item.id,
        h: index,
        i: common_vendor.o((...args) => $options.handletosongPlaydetail && $options.handletosongPlaydetail(...args), item.id),
        j: item.id
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-51ee5e64"], ["__file", "E:/微信开发者工具/项目目录/小程序入门/myCloudMusic_uniapp/pages/recommendSong/recommendSong.vue"]]);
wx.createPage(MiniProgramPage);
