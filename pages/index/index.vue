<template>
	<view>
		<!-- 轮播图 -->
		<swiper class="swiperContainer" circular autoplay indicator-active-color="#da0000" indicator-dots
			indicator-color="#fff">
			<swiper-item class="swiperImg" v-for="item in bannerList.banners" :key="item.bannerId">
				<image :src="item.pic"></image>
			</swiper-item>
		</swiper>
		<!-- 导航栏控件 -->
		<view class="navContainer">
			<view class="navItem">
				<navigator url="/pages/recommendSong/recommendSong" open-type="navigate">
					<text class="iconfont icon-gedan"></text>
					<text>每日推荐</text>
				</navigator>
			</view>
			<view class="navItem">
				<text class="iconfont icon-tubiao_dianzan"></text>
				<text>歌单</text>
			</view>
			<view class="navItem" bindtap="handletest">
				<text class="iconfont icon-paihangbang"></text>
				<text>排行榜</text>
			</view>
			<view class="navItem">
				<text class="iconfont icon-diantai"></text>
				<text>电台</text>
			</view>
			<view class="navItem">
				<text class="iconfont icon-zhibobofangshexiangjitianxianxianxing"></text>
				<text>直播</text>
			</view>
		</view>
		<!-- 推荐页 -->
		<view class="recommendContainer">
			<NavHeader title="推荐歌单" content="为你精心推荐"></NavHeader>
			<scroll-view class="recommendScroll" scroll-left="1" scroll-x enable-flex enhanced show-scrollbar="{{false}}">
				<view class="iTem" v-for="item in personalList.result" :key="item.id">
					<image :src="item.picUrl"></image>
					<text>{{item.name}}</text>
				</view>
			</scroll-view>
		</view>
		<!-- 排行榜 -->
		<view class="topranking">
			<NavHeader title="排行榜" content="热歌风向标"></NavHeader>
			<swiper class="toplistcontainer" next-margin="25rpx">
				<swiper-item v-for="item in toprankList" :key="item.id">
					<view class="listitem">
						<text class="title">{{item.name}}</text>
						<view class="bangdan">
							<view class="contentbox" v-for="(item2, index2) in item.tracks" :key="item2.id">
								<image class="img" :src="item2.al.picUrl" mode="" />
								<text class="count">{{index2+1}}</text>
								<view class="wenben">
									<text class="songname">{{item2.name}}</text>
									<view class="arname">
										<text v-for="(item3, index3) in item2.ar" :key="item3.id"><text
												v-if="index3>0">/</text><text>{{item3.name}}</text></text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 排行榜 -->
	</view>
</template>

<script>
	import NavHeader from '../../components/NavHeader/NavHeader.vue';
	import request from "../../utils/request"
	export default {
		components: {
			NavHeader
		},
		data() {
			return {
				mess:456,
				bannerList: [],
				personalList: [],
				toprankList: [],
				toprankIndex: 0,
				toprankTotal: 5
			}
		},
		onLoad: async function(options) {
			let bannerData, personalData;
			try {
				[bannerData, personalData] = await Promise.all([request('/banner', {
					type: 1
				}), request('/personalized', {
					limit: 10
				})])
			} catch (error) {
				console.log(error);
			}

			this.bannerList = bannerData;
			this.personalList = personalData

			let arr;

			arr = await request('/toplist/detail')
			//取前六个数据
			arr.list.splice(6);
			arr.list.forEach(async item => {
				let res;
				res = await request("/playlist/detail", {
					id: item.id
				})
				//留前三个
				res.playlist.tracks.splice(3)
				this.toprankList.push(res.playlist);

			})



		},
		methods: {
			aclick: function() {
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	/* pages/index/index.wxss */

	/* 轮播图 */
	.swiperContainer {
		width: 100%;
		height: 400rpx;

		.swiperImg {
			image {
				width: 100%;
				height: 100%;
			}
		}
	}


	/* 导航栏 */
	.navContainer {
		display: flex;

		.navItem {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.iconfont {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			font-size: 50rpx;
			margin: 20rpx 0;
			background-color: #da0000;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		text {
			font-size: 26rpx;
		}
	}

	.recommendContainer {
		padding: 20rpx;
	}

	.recommendScroll {
		display: flex;
		align-items: flex-start;
		padding: 20rpx 0;

		.iTem {
			width: 200rpx;
			margin-right: 16rpx;

			image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}

			text {
				/* 多行文本溢出 */
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
		}
	}

	/* 排行榜 */
	.topranking {
		padding: 0 20rpx 20rpx;
	}

	.toplistcontainer {
		min-height: 600rpx;
		margin-top: 10rpx;

		.listitem {
			border-radius: 20rpx;
			background-color: rgba(206, 206, 206, 0.25);
			overflow: hidden;
			width: 94%;
		}

		.bangdan {
			padding: 20rpx;
		}

		.title {
			display: block;
			line-height: 1;
			padding: 20rpx;
			font-size: 30rpx;
			background-color: rgba(206, 206, 206, 0.1);
			color: rgb(22, 22, 22);
			margin-bottom: 15rpx;

			&::after {
				content: ">";
				display: inline-block;
				margin-left: 15rpx;
			}
		}

		.contentbox {
			display: flex;
			align-items: center;
			margin-bottom: 15rpx;

			.img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 10rpx;
			}

			.count {
				padding: 0 40rpx;
			}

			.wenben {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				max-width: 400rpx;

				.songname {
					font-size: 26rpx;
					color: #242424;
					overflow: hidden;
					width: 100%;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.arname {
					font-size: 22rpx;
					color: #636363;
				}
			}

		}
	}
</style>