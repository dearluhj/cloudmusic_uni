import config from "./config";
export default (url, data = {}, headerres = {}, method = 'GET') => {
  let cookie = uni.getStorageSync('userCookie'),
    header;
  if (cookie) {
    header = {
      cookie,
      ...headerres
    }
  } else {
    header = {
      ...headerres
    }
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: config.host + url,
      data,
      method,
      header,
      success: (res) => {
        if (data.isLogin && res.cookies.length) {
          uni.setStorage({
            key: "Cookies",
            data: JSON.stringify(res.cookies),
            encrypt: false
          })
          uni.setStorage({
            key: "userCookie",
            data: res.cookies.find((item) => item.indexOf("MUSIC_U=") >= 0)
          })
        }
        if (res.statusCode.toString()[0] != '2') {
          reject(res.statusCode);
        } else {
          resolve(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}