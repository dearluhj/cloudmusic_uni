<template>
	<!--pages/search/search.wxml-->
	<view class="searchContainer">
		<view class="searchHeader">
			<view class="search" @tap="goSearch">
				<text class="iconfont icon-search"></text>
			</view>
			<view class="searchbox">
				<input type="text" placeholder-class="placeholder" :placeholder="defaultSearch" @input="handleInput"
					v-model="searchValue" />
			</view>
			<view class="cancle">
				<navigator open-type="navigateBack" hover-class="none" delta="1">取消</navigator>
			</view>
		</view>
		<!-- 历史记录 -->
		<view class="searchHistory" v-if="searchHistorylist.length">
			<view class="historytitle">
				<text>历史记录</text>
				<text class="iconfont icon-shanchu" @tap="clearHistory"></text>
			</view>
			<view class="historycontent">
				<view class="item" v-for="item in searchHistorylist" :key="item.timeStamp">
					{{item.value}}
				</view>
			</view>
		</view>
		<view class="trendingSearch">
			<view class="title">热搜榜</view>
			<view class="trendContent">
				<view class="item" v-for="(item,index) in topSearchlist" :key="item.searchWord">
					<text>{{index+1}}</text>
					<text class="name">{{item.searchWord}}</text>
					<image v-if="item.iconUrl" :src="item.iconUrl" mode="" />
				</view>
			</view>
		</view>
		<!-- 搜索列表建议 -->
		<view v-if="searchValue" class="searchSuggest">
			<view class="title">
				{{'搜索内容："'+searchValue+'"'}}
			</view>
			<view class="suggestlist">
				<view class="item" v-for="item in searchSuggestlist.allMatch" :key="item.keyword">
					<text class="iconfont icon-search"></text>
					<text class="name">{{item.keyword}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "../../utils/request"

	export default {
		data() {
			return {
				searchValue: '',
				topSearchlist: [],
				defaultSearch: '',
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
				let list = await request("/search/hot/detail");

				this.topSearchlist = list.data

			},
			//获取默认搜索
			async getDefaultsearch() {
				let res = await request("/search/default");

				this.defaultSearch = res.data.showKeyword

			},
			//获取搜索建议
			async getSearchsuggest() {
				//防抖
				if (this.suggestTimer) {
					clearTimeout(this.suggestTimer);
				}
				this.suggestTimer = setTimeout(async () => {
					if (this.searchValue) {
						let suggestList = await request("/search/suggest", {
							keywords: this.searchValue,
							type: 'mobile'
						});

						this.searchSuggestlist = suggestList.result

					} else {

						this.searchSuggestlist = {}

					}
				}, 300);
			},
			//搜索
			goSearch() {
				//写入搜索记录
				let historyList = this.searchHistorylist || [],
					index;
				index = historyList.findIndex((item) => {
					return item.value === this.searchValue;
				})
				if (index !== -1) {
					historyList.splice(index, 1);
				}

				historyList.unshift({
					value: this.searchValue,
					timeStamp: Date.now()
				});

				this.searchHistorylist = historyList

				uni.setStorageSync('search_history', historyList);
			},
			//删除历史记录
			clearHistory() {
				uni.showModal({
					title: '删除历史记录提醒',
					content: '是否确认删除所有？',
					success: (res) => {
						if (res.confirm) {

							this.searchHistorylist = []

							uni.removeStorageSync('search_history');
						}
					}
				})
			},
			//获取搜索历史记录
			getsearchHistory() {
				let reslist = uni.getStorageSync('search_history');

				this.searchHistorylist = reslist

			},
		},
		onLoad() {
			this.getTopsearchlist();
			this.getDefaultsearch();
			this.getsearchHistory();
		},
	}
</script>

<style lang="scss" scoped>
	/* pages/search/search.wxss */
	.searchContainer {
		padding: 15rpx;
		position: relative;

		.searchHeader {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}

	.searchHeader {
		.search {
			font-size: 36rpx;
			color: #535353;
		}

		.searchbox {
			flex-grow: 1;
			margin: 0 15rpx;
			background-color: rgba(226, 226, 226, 0.2);
			font-size: 26rpx;
			border-radius: 10rpx;
		}

		.searchbox {
			input {
				padding: 10rpx;
			}

			.placeholder {
				color: #d1d1d1;
			}
		}

		.cancle {
			color: #535353;
			font-size: 26rpx;
		}
	}

	/* 热搜榜 */
	.searchContainer {
		.trendingSearch {
			padding: 15rpx 0;
		}
	}

	.trendingSearch {
		.title {
			font-size: 32rpx;
			color: #535353;
			padding: 15rpx 0;
			border-bottom: 2rpx solid #cecece;
		}

		.trendContent {
			padding: 15rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: flex-start;

			.item {
				width: calc(50% - 30rpx);
				font-size: 26rpx;
				margin-bottom: 40rpx;
				padding-right: 20rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;

				image {
					width: 52rpx;
					height: 26rpx;
				}

				text {
					&.name {
						padding: 0 10rpx;
						max-width: calc(100% - 80rpx);
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}

	/* 搜索建议列表 */
	.searchSuggest {
		position: absolute;
		top: 100rpx;
		left: 0;
		right: 0;
		z-index: 1;
		background-color: rgba(255, 255, 255, 0.9);
		padding: 0 20rpx;

		.title {
			padding-bottom: 15rpx;
			font-size: 26rpx;
			color: #535353;
		}

		.suggestlist {
			padding: 15rpx;

			.item {
				font-size: 26rpx;
				color: #535353;
				margin-bottom: 20rpx;
				display: flex;
				align-items: center;

				text {
					&.name {
						margin-left: 15rpx;
						width: calc(100% - 100rpx);
						letter-spacing: 2rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}


	/* 历史记录样式 */
	.searchHistory {
		padding: 15rpx;

		.historytitle {
			font-size: 24rpx;
			color: #535353;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.historycontent {
			padding: 15rpx;
			display: flex;
			flex-wrap: wrap;

			.item {
				padding: 10rpx 20rpx;
				font-size: 24rpx;
				color: #535353;
				background-color: #ececec;
				border-radius: 20rpx;
				margin: 0 15rpx 15rpx 0;
			}
		}
	}
</style>