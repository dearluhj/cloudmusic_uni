"use strict";
const common_vendor = require("../common/vendor.js");
const utils_config = require("./config.js");
const request = (url, data = {}, headerres = {}, method = "GET") => {
  let cookie = common_vendor.index.getStorageSync("userCookie"), header;
  if (cookie) {
    header = {
      cookie,
      ...headerres
    };
  } else {
    header = {
      ...headerres
    };
  }
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: utils_config.config.host + url,
      data,
      method,
      header,
      success: (res) => {
        if (data.isLogin && res.cookies.length) {
          common_vendor.index.setStorage({
            key: "Cookies",
            data: JSON.stringify(res.cookies),
            encrypt: false
          });
          common_vendor.index.setStorage({
            key: "userCookie",
            data: res.cookies.find((item) => item.indexOf("MUSIC_U=") >= 0)
          });
        }
        if (res.statusCode.toString()[0] != "2") {
          reject(res.statusCode);
        } else {
          resolve(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
exports.request = request;
