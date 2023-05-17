<template>
	<view class="videoContainer">
		<view class="topNav">
			<view class="leftitem imgitem">
				<image src="/static/image/video/video.jpg" mode="" />
			</view>
			<view class="centeritem">
				<navigator hover-class="none" open-type="navigate" url="/pages/search/search">
					<text>搜索</text>
				</navigator>
			</view>
			<view class="rightitem imgitem">
				<image src="/static/image/video/logo.png" mode="" />
			</view>
		</view>
		<view class="tab" @tap="handleNav">
			<scroll-view class="tabscrollView" enhanced :show-scrollbar="false" scroll-with-animation
				:scroll-into-view="'nav'+navId" enable-flex scroll-x>
				<view class="tabItem" v-for="item in videoTablist" :key="item.id">
					<text :class="[item.id===navId?'active':'']" data-name="text" :id="'nav'+item.id"
						:data-id="item.id">{{item.name}}</text>
				</view>
			</scroll-view>
		</view>
		<view class="videoListcontainer">
			<scroll-view scroll-y enhanced refresher-enabled @refresherrefresh="updateScrollview"
				@scrolltolower="addScrollviewvideo" :refresher-triggered="isTriggered" :show-scrollbar="false"
				class="scrollview">
				<view class="videoItem" v-for="item in videoList" :key="item.id">
					<view class="topmsg">
						<view class="alname">
							<image :src="item.data.creator.avatarUrl||item.data.imgurl16v9" mode="" />
							<text>{{item.data.creator.nickname||''}}</text>
						</view>
						<view class="rightcomment">
							<view class="item">
								<text class="iconfont icon-dianzan"></text>
								<text class="count">{{item.data.praisedCount||item.data.likeCount}}</text>
							</view>
							<view class="item">
								<text class="iconfont icon-pinglun"></text>
								<text class="count">{{item.data.commentCount}}</text>
							</view>
							<view class="item">
								<button open-type="share">
									<text class="iconfont icon-gengduo"></text>
								</button>
							</view>
						</view>
					</view>
					<view @tap="changeVideostatus" :data-id="item.data.vid||'v'+item.data.id">
						<video @play="handleVideopalytime" :id="item.data.vid||'v'+item.data.id"
							:data-id="item.data.vid||'v'+item.data.id" @timeupdate="videoTimerecord"
							v-if="videoPlayid===(item.data.vid||'v'+item.data.id)" :src="item.urls.url" danmu-btn enable-danmu
							autoplay />
						<image @tap="handleVideopalytime" :data-id="item.data.vid||'v'+item.data.id" v-else
							:src="item.data.coverUrl" mode="" />
					</view>
					<view class="title">
						{{item.data.title||item.data.name}}
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import method from './method.js'
	export default {
		data() {
			return {
				videoTablist: [],
				navId: 0,
				videoList: [], //视频总数据
				videoOffset: 0, //视频页数
				videoPlayid: '',
				videoTimerecordlist: '',
				isTriggered: false //当前下拉刷新是否已完成
			};
		},
		methods: {
			...method
		},
		onLoad() {
			this.getInitializeMsg();
		},
		onShareAppMessage() {
			return {
				title: "网易云音乐",
				path: "/pages/video/video",
				imageUrl: "/static/image/video/logo.png"
			}
		}
	}
</script>

<style lang="scss" >
	/* pages/video/video.wxss */
	.videoContainer {
		padding: 15rpx 15rpx 0;

		.topNav {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}


	.topNav {
		.centeritem {
			flex-grow: 1;
			height: 50rpx;
			margin: 0 15rpx;
			color: #da6666;
			border-radius: 10rpx;
			border: 2rpx solid #da000034;
			text-align: center;

			text {
				line-height: 50rpx;
			}
		}

		.imgitem {
			width: 60rpx;
			height: 60rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.tab {
		padding: 0 10rpx;

		.tabscrollView {
			display: flex;
			height: 60rpx;

			.tabItem {
				margin: 0 80rpx 0 0;
				white-space: nowrap;

				text {
					display: block;
					line-height: 56rpx;
					font-size: 26rpx;
					color: #535353;
					box-sizing: border-box;

					&.active {
						border-bottom: 4rpx solid #da6666;
					}
				}
			}
		}
	}


	.videoListcontainer {
		padding: 15rpx;
		height: calc(100vh - 139rpx);
		box-sizing: border-box;

		.scrollview {
			width: 100%;
			height: 100%;
		}

	}

	.videoItem {
		margin-bottom: 25rpx;

		video,
		image {
			width: 100%;
			border-radius: 10rpx;
		}

		.topmsg {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10rpx;

			.alname {
				display: flex;
				align-items: center;
				color: #535353;
				font-size: 26rpx;

				image {
					width: 60rpx;
					height: 60rpx;
					border-radius: 60rpx;
					margin-right: 15rpx;
				}
			}

			.rightcomment {
				display: flex;
				justify-content: flex-start;
				align-items: flex-end;

				.item {
					display: flex;
					align-items: flex-start;
					margin-right: 10rpx;

					button {
						width: auto;
						height: auto;
						padding: 0;
						background-color: transparent;
						line-height: 1.2;
						outline: none;
						border: none;
					}

					text {
						&.iconfont {
							font-size: 44rpx;
						}

						&.count {
							font-size: 20rpx;
							line-height: 1;
							display: inline-block;
						}
					}

				}
			}
		}

		.title {
			border-radius: 10rpx;
			box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.1);
			padding: 10rpx 5rpx;
			color: #535353;
			font-size: 26rpx;
		}
	}
</style>