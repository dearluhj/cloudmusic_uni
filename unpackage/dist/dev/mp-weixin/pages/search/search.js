"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/config.js");
const _sfc_main = {
  data() {
    return {
      searchValue: "",
      topSearchlist: [],
      defaultSearch: "",
      searchSuggestlist: {},
      searchHistorylist: []
    };
  },
  methods: {
    handleInput(e) {
      this.getSearchsuggest();
    },
    //获取热搜榜数据
    async getTopsearchlist() {
      let list = await utils_request.request("/search/hot/detail");
      this.topSearchlist = list.data;
    },
    //获取默认搜索
    async getDefaultsearch() {
      let res = await utils_request.request("/search/default");
      this.defaultSearch = res.data.showKeyword;
    },
    //获取搜索建议
    async getSearchsuggest() {
      if (this.suggestTimer) {
        clearTimeout(this.suggestTimer);
      }
      this.suggestTimer = setTimeout(async () => {
        if (this.searchValue) {
          let suggestList = await utils_request.request("/search/suggest", {
            keywords: this.searchValue,
            type: "mobile"
          });
          this.searchSuggestlist = suggestList.result;
        } else {
          this.searchSuggestlist = {};
        }
      }, 300);
    },
    //搜索
    goSearch() {
      let historyList = this.searchHistorylist || [], index;
      index = historyList.findIndex((item) => {
        return item.value === this.searchValue;
      });
      if (index !== -1) {
        historyList.splice(index, 1);
      }
      historyList.unshift({
        value: this.searchValue,
        timeStamp: Date.now()
      });
      this.searchHistorylist = historyList;
      common_vendor.index.setStorageSync("search_history", historyList);
    },
    //删除历史记录
    clearHistory() {
      common_vendor.index.showModal({
        title: "删除历史记录提醒",
        content: "是否确认删除所有？",
        success: (res) => {
          if (res.confirm) {
            this.searchHistorylist = [];
            common_vendor.index.removeStorageSync("search_history");
          }
        }
      });
    },
    //获取搜索历史记录
    getsearchHistory() {
      let reslist = common_vendor.index.getStorageSync("search_history");
      this.searchHistorylist = reslist;
    }
  },
  onLoad() {
    this.getTopsearchlist();
    this.getDefaultsearch();
    this.getsearchHistory();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goSearch && $options.goSearch(...args)),
    b: $data.defaultSearch,
    c: common_vendor.o([($event) => $data.searchValue = $event.detail.value, (...args) => $options.handleInput && $options.handleInput(...args)]),
    d: $data.searchValue,
    e: $data.searchHistorylist.length
  }, $data.searchHistorylist.length ? {
    f: common_vendor.o((...args) => $options.clearHistory && $options.clearHistory(...args)),
    g: common_vendor.f($data.searchHistorylist, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.value),
        b: item.timeStamp
      };
    })
  } : {}, {
    h: common_vendor.f($data.topSearchlist, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(index + 1),
        b: common_vendor.t(item.searchWord),
        c: item.iconUrl
      }, item.iconUrl ? {
        d: item.iconUrl
      } : {}, {
        e: item.searchWord
      });
    }),
    i: $data.searchValue
  }, $data.searchValue ? {
    j: common_vendor.t('搜索内容："' + $data.searchValue + '"'),
    k: common_vendor.f($data.searchSuggestlist.allMatch, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.keyword),
        b: item.keyword
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c10c040c"], ["__file", "E:/微信开发者工具/项目目录/小程序入门/myCloudMusic_uniapp/pages/search/search.vue"]]);
wx.createPage(MiniProgramPage);
