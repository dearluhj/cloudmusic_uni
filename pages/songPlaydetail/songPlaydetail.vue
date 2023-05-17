<template>
	<!--pages/songPlaydetail/songPlaydetail.wxml-->
	<view class="songPlaycontainer">
		<view class="song">
			<view class="songname">
				{{musicDetail.songs[0].name}}
			</view>
			<view class="arname">
				<text v-for="(item,index) in musicDetail.songs[0].ar" :key="item.id">{{(index?'/':'')+item.name}}</text>
			</view>
		</view>
		<view class="discCircle">
			<view :class="['needle',isPlay?'active':'']">
				<image src="/static/image/song/needle.png" mode="" />
			</view>
			<view :class="['discCover', isPlay?'active':'paused']">
				<image class="disc" src="/static/image/song/disc.png" mode="" />
				<image class="cover" :src="musicDetail.songs[0].al.picUrl||'/static/image/personal/missing-face.png'" mode="" />
			</view>
		</view>
		<view class="musicProgressbar">
			<view class="startTime">
				{{currentPlaytime}}
			</view>
			<view class="controlBar">
				<view @touchcancel="handleProgressout" @touchend="handleProgressout" @touchstart="handleProgressin"
					@touchmove="handleProgressmove" class="currentProgress" :style="{'width':progressBarlength+'rpx'}">
					<view class="controlCircle">
					</view>
				</view>
			</view>
			<view class="endTime">
				{{musicTotaltime}}
			</view>
		</view>
		<view class="musicControl">
			<text class="iconfont icon-iconsMusicyemianbofangmoshiShuffle"></text>
			<text class="iconfont icon-shangyishou" data-name="pre" data-id="" @tap="handleSwitchmusic"></text>
			<text :class="['iconfont','big', !isPlay?'icon-bofang': 'icon-pause']" @tap="handleMusicPlay"></text>
			<text class="iconfont icon-next" data-name="next" @tap="handleSwitchmusic"></text>
			<text class="iconfont icon-iconsMusicyemianbofangmoshiPlayList"></text>
		</view>
		<!-- 背景图 -->
		<view class="backCover">
			<image :src="musicDetail.songs[0].al.picUrl" mode="aspectFill" />
		</view>
	</view>
</template>

<script>
	import request from "../../utils/request"
	import dayjs from "dayjs"
	export default {
		data() {
			return {
				isPlay: false, //音乐是否播放中
				musicId: 0,
				musicDetail: {},
				musicUrl: [],
				currentMusicindex: 0, //当前播放列表索引值
				currentPlaytime: "", //当前播放时长、
				musicTotaltime: "", //音乐总时长
				progressBarlength: 0, //进度条长度
				progressIsmove: false //进度条拖动中
			};
		},
		methods: {
			//获取音乐详细信息
			async getMusicdetail() {
				uni.showLoading({
					title: '正在加载',
					mask: true
				})
				let musicDetail = await request("/song/detail", {
					ids: this.musicId
				});

				this.musicDetail = musicDetail
				this.currentPlaytime = dayjs(0).format("mm:ss")
				this.musicTotaltime = dayjs(musicDetail.songs[0].dt).format("mm:ss")
				this.progressBarlength = 0

				this.getMusicurl();
			},
			//初始化音乐实例
			initMusicmanager() {
				//创建音乐播放实例
				this.musicManager = uni.getBackgroundAudioManager();
				//挂在监听器
				this.musicManager.onPlay(() => {
					this.isPlay = true
				})
				this.musicManager.onPause(() => {
					this.isPlay = false
				})
				this.musicManager.onStop(() => {
					this.isPlay = false
				})
				this.musicManager.onEnded(() => {
					this.handleSwitchmusic();
				})
				this.musicManager.onTimeUpdate(() => {
					//更改进度条长度
					let progressBarlength;
					progressBarlength = (this.musicManager.currentTime / this.musicManager.duration * 420).toFixed(2);

					this.currentPlaytime = dayjs(this.musicManager.currentTime * 1000).format("mm:ss")

					if (!this.progressIsmove) {

						this.progressBarlength = progressBarlength

					}
				})
			},
			//获取音乐播放地址
			async getMusicurl() {
				let musicUrl = await request("/song/url", {
					id: this.musicId
				})
				this.musicUrl = musicUrl.data
				//播放音乐
				this.musicManager.src = this.musicUrl[0].url;
				this.musicManager.title = this.musicDetail.songs[0].name;
				//修改isplay状态

				this.isPlay = true

				uni.hideLoading()
			},
			//切换歌曲/上一首或下一首
			handleSwitchmusic(e = "next") {
				uni.$emit("musicSwitchtype", e.currentTarget ? e.currentTarget.dataset.name : e);
				uni.$on("getMusicid", (data) => {
					//修改当前播放音乐id
					uni.$map.set("currentPlayid", data.id)
					this.musicId = data.id

					//获取音乐信息
					this.getMusicdetail();
					//删除订阅
					uni.$off("getMusicid");
				})
			},
			// 更改音乐播放状态
			handleMusicPlay() {

				this.isPlay = !this.isPlay

				if (this.isPlay) {
					this.musicManager.play();
				} else {
					this.musicManager.pause();
				}
			},
			//进度条滑动
			handleProgressin(e) {
				this.barX = (e.currentTarget.offsetLeft) * 2;

				this.progressIsmove = true

			},
			handleProgressmove(e) {
				let currentX = (e.touches[0].clientX) * 2;
				let barWidth = currentX - this.barX;

				(barWidth > 420) && (barWidth = 420);
				(barWidth < 0) && (barWidth = 0);

				this.progressBarlength = barWidth

			},
			handleProgressout(e) {
				let seektime = parseInt((this.progressBarlength / 420) * this.musicManager.duration);
				this.musicManager.seek(seektime);

				this.progressIsmove = false

			},
		},
		created() {
			this.musicId = uni.$map.get("currentPlayid")
			this.getMusicdetail();
			this.initMusicmanager();
		},
		onLoad() {
			
		},
	}
</script>

<style lang="scss" scoped>
	/* pages/songPlaydetail/songPlaydetail.wxss */
	.songPlaycontainer {
		height: 100%;
		position: relative;

		&::after {
			content: "";
			position: absolute;
			z-index: -1;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);

		}

		.backCover {
			width: 100%;
			height: 100%;
			position: fixed;
			z-index: -1;
			top: 0;
			left: 0;

			image {
				width: 100%;
				height: 100%;
				filter: blur(20px);
			}
		}

		.song {
			padding-top: 20rpx;
			text-align: center;
			color: #fff;

			.songname {
				font-size: 34rpx;
				padding-bottom: 10rpx;
			}

			.arname {
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.6);
			}
		}
	}

	.discCircle {
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 1;
		transform: translate(-50%, -50%);

		.needle {
			position: absolute;
			z-index: 1;
			top: -180rpx;
			left: 260rpx;
			transform-origin: 40rpx 40rpx;
			transform: rotate(-20deg);
			transition: .8s;

			&.active {
				transform: rotate(0);
			}

			image {
				width: 200rpx;
				height: 330rpx;
			}
		}

		.discCover {
			width: 600rpx;
			height: 600rpx;
			animation-timing-function: linear;
			animation-iteration-count: infinite;
			animation-duration: 15s;
			animation-name: discrotate;

			&.paused {
				animation-play-state: paused;
			}

			&.active {
				animation-play-state: running;
			}

			.disc {
				width: 100%;
				height: 100%;
			}

			.cover {
				position: absolute;
				top: 50%;
				left: 50%;
				z-index: -1;
				transform: translate(-50%, -50%);
				width: 70%;
				height: 70%;
				border-radius: 50%;
			}
		}
	}


	@keyframes discrotate {
		from {}

		to {
			transform: rotate(360deg);
		}
	}

	/* 底部控制栏 */
	.musicControl {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 180rpx;
		padding: 20rpx 30rpx 50rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		text {
			font-size: 50rpx;
			color: #fff;

			&.big {
				font-size: 100rpx;
			}
		}
	}


	/* 进度条样式 */
	.musicProgressbar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 200rpx;
		color: #f0f0f0;
		font-size: 28rpx;
		padding: 50rpx 60rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.controlBar {
			width: 420rpx;
			margin: 0 30rpx;
			height: 5rpx;
			background-color: rgba(255, 255, 255, 0.6);
		}

		.currentProgress {
			width: 0;
			height: 5rpx;
			background-color: #fff;
			position: relative;
		}

		.controlCircle {
			position: absolute;
			width: 16rpx;
			height: 16rpx;
			top: 50%;
			right: -8rpx;
			transform: translateY(-50%);
			background-color: #fff;
			border: 6rpx solid rgba(0, 0, 0, 0.2);
			border-radius: 50%;
		}
	}
</style>