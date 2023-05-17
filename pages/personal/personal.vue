<template>
	<view class="personalContainer">
		<view class="user-section">
			<image class="bg" :src="userInfo.backgroundUrl||'/static/image/personal/bgImg3.jpg'"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<navigator url="/pages/login/passwordlogin/passwordlogin">
						<image class="portrait" :src="userInfo.avatarUrl||'/static/image/personal/missing-face.png'"></image>
					</navigator>
				</view>
				<view class="info-box">
					<text class="username">{{userInfo.nickname||"游客"}}</text>
				</view>
			</view>

			<view class="vip-card-box">
				<image class="card-bg" src="/static/image/personal/vip-card-bg.png" mode=""></image>
				<view class="b-btn">
					立即开通
				</view>
				<view class="tit">
					<!-- 会员图标-->
					<text class="iconfont icon-huiyuan-"></text>
					黑胶VIP会员
				</view>
				<text class="e-m">Music</text>
				<text class="e-b">开通会员听歌, 撸代码</text>
			</view>
		</view>

		<view class="cover-container"
			:style="{transform: 'translateY('+coverTransform+'rpx)',transition: coverTransition+'s'}">
			<image class="arc" src="/static/image/personal/arc.png"></image>
			<!-- 个人中心导航 -->
			<view class="nav-section" @touchcancel="handlecancel" @touchmove="handlemove" @touchstart="handlestart"
				@touchend="handlecancel">
				<view class="nav-item" hover-class="common-hover" hover-stay-time="50">
					<text class="iconfont icon-xiaoxi"></text>
					<text>我的消息</text>
				</view>
				<view class="nav-item" hover-class="common-hover" hover-stay-time="50">
					<text class="iconfont icon-myRecommender"></text>
					<text>我的好友</text>
				</view>
				<view class="nav-item" hover-class="common-hover" hover-stay-time="50">
					<text class="iconfont icon-gerenzhuye"></text>
					<text>个人主页</text>
				</view>
				<view class="nav-item" hover-class="common-hover" hover-stay-time="50">
					<text class="iconfont icon-gexingzhuangban"></text>
					<text>个性装扮</text>
				</view>
			</view>

			<!-- 个人中心列表 -->
			<view class="personalContent">
				<view class="recentPlayContainer">
					<text class="title">最近播放</text>
					<!-- 最近播放记录 -->
					<view class="recordmodel">
						<text class="notrecord" v-if="!userPlayrecord.length">暂无播放记录</text>
						<scroll-view class="recordview" v-else enable-flex scroll-x enhanced :show-scrollbar="false">
							<view class="recorditem" v-for="item in userPlayrecord" :key="item.song">
								<image :src="item.song.al.picUrl" mode="" />
								<text class="songname">{{item.song.name}}</text>
							</view>
						</scroll-view>
					</view>

				</view>

				<view class="cardList">
					<view class="card-item">
						<text class="title">我的音乐</text>
						<text class="more"> > </text>
					</view>
					<view class="card-item">
						<text class="title">我的收藏</text>
						<text class="more"> > </text>
					</view>
					<view class="card-item">
						<text class="title">我的电台</text>
						<text class="more"> > </text>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import request from "../../utils/request"
	let startCoordY = 0,
		offsetCoordY = 0;
	export default {
		data() {
			return {
				coverTransform: 0,
				coverTransition: 0,
				userInfo: {},
				userPlayrecord: []
			};
		},
		methods: {
			handlestart(e) {
				startCoordY = e.touches[0].clientY;
				this.coverTransition = 0
			},
			handlemove(e) {
				let currentY = e.touches[0].clientY;
				offsetCoordY = currentY - startCoordY;
				if (offsetCoordY < 0) {
					return;
				}
				if (offsetCoordY > 80) {
					offsetCoordY = 80
				}
				this.coverTransform = offsetCoordY


			},
			handlecancel() {
				this.coverTransform = 0
				this.coverTransition = 0.6
			},
			//更新用户信息
			async updateUsercurrentInfo() {
				let res = await request("/login/status", {
					timestamp: Date.now()
				}, {}, "post");
				if (res.data.profile) {
					//更新用户数据信息
					this.userInfo = res.data.profile
					//执行数据更新相关操作
					this.getUserPlayrecord()
				}
			}, //获取最近播放信息
			async getUserPlayrecord() {
				let uid = this.userInfo.userId;
				let recordres = await request("/user/record", {
					uid,
					type: 1
				}, {}, "post");
				recordres.weekData.splice(10);
				recordres.weekData.map((item, index) => {
					item.id = index
				})
				this.userPlayrecord = recordres.weekData
			},
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			//获取指定cookie
			let cookie = uni.getStorageSync('userCookie');
			if (cookie) {
				this.updateUsercurrentInfo();
			}
		},
	}
</script>

<style lang="scss" scoped>
	/* pages/personal/personal.wxss */
	.personalContainer {
		width: 100%;
		height: 100%;

		.user-section {
			height: 520rpx;
			position: relative;
			padding: 100rpx 30rpx 0;
		}
	}

	.user-section {
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			opacity: 0.7;
			filter: blur(1px);
		}
	}


	.user-info-box {
		height: 180rpx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;

		.portrait {
			width: 130rpx;
			height: 130rpx;
			border: 5rpx solid #fff;
			border-radius: 50%;
		}

		.username {
			font-size: 24;
			color: #303133;
			margin-left: 20rpx;
		}
	}


	/* vip-box */
	.vip-card-box {
		position: relative;
		display: flex;
		flex-direction: column;
		background: linear-gradient(left, red, black);
		background: rgba(0, 0, 0, .7);
		height: 240rpx;
		color: #f7d680;
		border-radius: 16rpx 16rpx 0 0;
		padding: 20rpx 24rpx;

		.card-bg {
			position: absolute;
			top: 20rpx;
			right: 0;
			width: 380rpx;
			height: 260rpx;
		}

		.b-btn {
			position: absolute;
			right: 20rpx;
			top: 16rpx;
			width: 132rpx;
			height: 40rpx;
			text-align: center;
			line-height: 40rpx;
			font-size: 22rpx;
			color: #36343c;
			border-radius: 20px;
			/*background: linear-gradient(left, #f9e6af, #ffd465);*/
			/*渐变不生效*/
			background: #f9e6af;
			z-index: 1;
		}

		.tit {
			font-size: 22rpx;
			color: #f7d680;
			margin-bottom: 28rpx;

			.iconfont {
				color: #f6e5a3;
				margin-right: 16rpx;
			}
		}

		.e-m {
			font-size: 34rpx;
			margin-top: 10rpx;
		}

		.e-b {
			font-size: 24rpx;
			color: #d8cba9;
			margin-top: 10rpx;
		}
	}



	.cover-container {
		margin-top: -150rpx;
		padding: 0 30rpx;
		position: relative;
		background: #f5f5f5;
		padding-bottom: 20rpx;

		.arc {
			position: absolute;
			left: 0;
			top: -34rpx;
			width: 100%;
			height: 36rpx;
		}

		/* 导航部分 */
		.nav-section {
			display: flex;
			background: #fff;
			padding: 20rpx 0;
			border-radius: 15rpx;

			.nav-item {
				width: 25%;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				align-items: center;

				.iconfont {
					font-size: 50rpx;
					color: #d43c33;
					line-height: 70rpx;
				}

				text {
					&:last-child {
						font-size: 22rpx;
					}
				}
			}
		}
	}


	/* 个人中心列表 */
	.personalContent {
		background: #fff;
		margin-top: 20rpx;

		/* 最近播放 */
		.notrecord {
			font-size: 20rpx;
			color: #616161;
		}

		.recordmodel {
			padding: 0 25rpx;
		}

		.recordview {
			display: flex;
			height: 200rpx;

			image {
				width: 160rpx;
				height: 160rpx;
				border-radius: 10rpx;
			}
		}

		.recorditem {
			padding-right: 10rpx;
			width: 160rpx;
			height: 160rpx;
		}

		.recorditem {
			.songname {
				font-size: 20rpx;
				display: block;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				width: 100%;
				text-align: center;
			}
		}

		.recentPlay {
			display: flex;

			image {
				width: 100%;
				height: 100%;
				margin-left: 20rpx;
				border-radius: 20rpx;
			}
		}

	}

	.recentPlayContainer {
		.title {
			padding-left: 20rpx;
			font-size: 26rpx;
			color: #333;
			line-height: 60rpx;
		}
	}


	.cardList {
		margin-top: 20rpx;

		.card-item {
			border-top: 1rpx solid #eee;
			height: 80rpx;
			line-height: 80rpx;
			padding: 10rpx;
			font-size: 26rpx;
			color: #333;

			.more {
				float: right;
			}
		}
	}
</style>