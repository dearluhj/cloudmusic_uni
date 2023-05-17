"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/config.js");
const _sfc_main = {
  data() {
    return {
      isPlay: false,
      //音乐是否播放中
      musicId: 0,
      musicDetail: {},
      musicUrl: [],
      currentMusicindex: 0,
      //当前播放列表索引值
      currentPlaytime: "",
      //当前播放时长、
      musicTotaltime: "",
      //音乐总时长
      progressBarlength: 0,
      //进度条长度
      progressIsmove: false
      //进度条拖动中
    };
  },
  methods: {
    //获取音乐详细信息
    async getMusicdetail() {
      common_vendor.index.showLoading({
        title: "正在加载",
        mask: true
      });
      let musicDetail = await utils_request.request("/song/detail", {
        ids: this.musicId
      });
      this.musicDetail = musicDetail;
      this.currentPlaytime = common_vendor.dayjs(0).format("mm:ss");
      this.musicTotaltime = common_vendor.dayjs(musicDetail.songs[0].dt).format("mm:ss");
      this.progressBarlength = 0;
      this.getMusicurl();
    },
    //初始化音乐实例
    initMusicmanager() {
      this.musicManager = common_vendor.index.getBackgroundAudioManager();
      this.musicManager.onPlay(() => {
        this.isPlay = true;
      });
      this.musicManager.onPause(() => {
        this.isPlay = false;
      });
      this.musicManager.onStop(() => {
        this.isPlay = false;
      });
      this.musicManager.onEnded(() => {
        this.handleSwitchmusic();
      });
      this.musicManager.onTimeUpdate(() => {
        let progressBarlength;
        progressBarlength = (this.musicManager.currentTime / this.musicManager.duration * 420).toFixed(2);
        this.currentPlaytime = common_vendor.dayjs(this.musicManager.currentTime * 1e3).format("mm:ss");
        if (!this.progressIsmove) {
          this.progressBarlength = progressBarlength;
        }
      });
    },
    //获取音乐播放地址
    async getMusicurl() {
      let musicUrl = await utils_request.request("/song/url", {
        id: this.musicId
      });
      this.musicUrl = musicUrl.data;
      this.musicManager.src = this.musicUrl[0].url;
      this.musicManager.title = this.musicDetail.songs[0].name;
      this.isPlay = true;
      common_vendor.index.hideLoading();
    },
    //切换歌曲/上一首或下一首
    handleSwitchmusic(e = "next") {
      common_vendor.index.$emit("musicSwitchtype", e.currentTarget ? e.currentTarget.dataset.name : e);
      common_vendor.index.$on("getMusicid", (data) => {
        common_vendor.index.$map.set("currentPlayid", data.id);
        this.musicId = data.id;
        this.getMusicdetail();
        common_vendor.index.$off("getMusicid");
      });
    },
    // 更改音乐播放状态
    handleMusicPlay() {
      this.isPlay = !this.isPlay;
      if (this.isPlay) {
        this.musicManager.play();
      } else {
        this.musicManager.pause();
      }
    },
    //进度条滑动
    handleProgressin(e) {
      this.barX = e.currentTarget.offsetLeft * 2;
      this.progressIsmove = true;
    },
    handleProgressmove(e) {
      let currentX = e.touches[0].clientX * 2;
      let barWidth = currentX - this.barX;
      barWidth > 420 && (barWidth = 420);
      barWidth < 0 && (barWidth = 0);
      this.progressBarlength = barWidth;
    },
    handleProgressout(e) {
      let seektime = parseInt(this.progressBarlength / 420 * this.musicManager.duration);
      this.musicManager.seek(seektime);
      this.progressIsmove = false;
    }
  },
  created() {
    this.musicId = common_vendor.index.$map.get("currentPlayid");
    this.getMusicdetail();
    this.initMusicmanager();
  },
  onLoad() {
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.musicDetail.songs[0].name),
    b: common_vendor.f($data.musicDetail.songs[0].ar, (item, index, i0) => {
      return {
        a: common_vendor.t((index ? "/" : "") + item.name),
        b: item.id
      };
    }),
    c: common_vendor.n($data.isPlay ? "active" : ""),
    d: $data.musicDetail.songs[0].al.picUrl || "/static/image/personal/missing-face.png",
    e: common_vendor.n($data.isPlay ? "active" : "paused"),
    f: common_vendor.t($data.currentPlaytime),
    g: common_vendor.o((...args) => $options.handleProgressout && $options.handleProgressout(...args)),
    h: common_vendor.o((...args) => $options.handleProgressout && $options.handleProgressout(...args)),
    i: common_vendor.o((...args) => $options.handleProgressin && $options.handleProgressin(...args)),
    j: common_vendor.o((...args) => $options.handleProgressmove && $options.handleProgressmove(...args)),
    k: $data.progressBarlength + "rpx",
    l: common_vendor.t($data.musicTotaltime),
    m: common_vendor.o((...args) => $options.handleSwitchmusic && $options.handleSwitchmusic(...args)),
    n: common_vendor.n(!$data.isPlay ? "icon-bofang" : "icon-pause"),
    o: common_vendor.o((...args) => $options.handleMusicPlay && $options.handleMusicPlay(...args)),
    p: common_vendor.o((...args) => $options.handleSwitchmusic && $options.handleSwitchmusic(...args)),
    q: $data.musicDetail.songs[0].al.picUrl
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9d6b56c3"], ["__file", "E:/微信开发者工具/项目目录/小程序入门/myCloudMusic_uniapp/pages/songPlaydetail/songPlaydetail.vue"]]);
wx.createPage(MiniProgramPage);
