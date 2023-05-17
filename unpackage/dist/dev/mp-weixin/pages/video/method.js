"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
let videoMap = /* @__PURE__ */ new Map();
async function getInitializeMsg() {
  let cookie = common_vendor.index.getStorageSync("userCookie");
  if (cookie) {
    let tabres = await utils_request.request("/video/category/list", {
      timestamp: Date.now()
    }, {}, "post");
    this.videoTablist = tabres.data;
    this.navId = tabres.data[0].id;
    this.getVideolist(this.navId);
  } else {
    common_vendor.index.showToast({
      title: "您还未登录",
      icon: "error",
      success() {
        setTimeout(() => {
          common_vendor.index.redirectTo({
            url: "/pages/login/passwordlogin/passwordlogin"
          });
        }, 1e3);
      }
    }, 1e3);
  }
}
function handleNav(e) {
  let navId = e.target.dataset.id;
  if (e.target.dataset.name == "text") {
    this.navId = navId;
    this.videoList = [];
    this.videoOffset = 0;
    this.getVideolist(navId);
  }
}
async function getVideolist(id, offset = 0, addlist = false) {
  common_vendor.index.showLoading({
    title: "正在加载",
    mask: true
  });
  let videolistres = await utils_request.request("/video/group", {
    id,
    offset,
    timestamp: Date.now()
  });
  videolistres.datas.forEach((item) => {
    item.id = item.data.vid || item.data.id;
  });
  let videofewlist = this.videoList;
  offset && addlist ? videofewlist.push(...videolistres.datas) : videofewlist = videolistres.datas;
  for (let i = 0; i < videofewlist.length; i++) {
    let videoUrl;
    if (id === 1e3) {
      videoUrl = await utils_request.request("/mv/url", {
        id: videofewlist[i].data.id
      });
      videofewlist[i].urls = videoUrl.data;
    } else {
      videoUrl = await utils_request.request("/video/url", {
        id: videofewlist[i].data.vid
      });
      videofewlist[i].urls = videoUrl.urls[0];
    }
  }
  this.videoList = videofewlist;
  this.isTriggered = false;
  common_vendor.index.hideLoading();
}
function changeVideostatus(e) {
  this.videoPlayid = e.currentTarget.dataset.id;
}
function videoTimerecord(e) {
  videoMap.set(e.currentTarget.dataset.id, e.detail.currentTime);
  this.videoTimerecordlist = videoMap;
}
function handleVideopalytime(e) {
  let playtime = this.videoTimerecordlist ? this.videoTimerecordlist.get(e.currentTarget.dataset.id) : 0;
  if (!playtime)
    playtime = 0;
  let videoObj = common_vendor.index.createVideoContext(e.currentTarget.dataset.id);
  videoObj.seek(playtime);
}
function updateScrollview() {
  this.getVideolist(this.navId);
}
function addScrollviewvideo() {
  this.videoOffset = this.videoOffset + 1;
  this.getVideolist(this.navId, this.videoOffset, true);
}
const method = {
  addScrollviewvideo,
  updateScrollview,
  handleVideopalytime,
  videoTimerecord,
  changeVideostatus,
  getVideolist,
  handleNav,
  getInitializeMsg,
  videoMap
};
exports.method = method;
