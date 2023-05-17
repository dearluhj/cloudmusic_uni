<template>
	<!--pages/recommendSong/recommendSong.wxml-->
	<view class="recommendSongcontainer">
		<view class="recommendHeader">
			<image src="/static/image/recommendSong/recommendSong.jpg" mode="aspectFill" />
			<view class="datetime">
				<text>{{today}}</text>
			</view>
		</view>
		<view class="recommendList">
			<view class="header">
				<view class="">
					<navigator open-type="reLaunch" url="/pages/index/index">
						<text>播放全部</text>
					</navigator>
				</view>
				<view class="">
					<text>添加全部</text>
				</view>
			</view>
			<view class="Listview">
				<scroll-view scroll-y enhanced :show-scrollbar="false" class="scrollview">
					<view class="listitem" v-for="(item,index) in recommendSonglist.dailySongs" :key="item.id">
						<view class="cover" :data-id="item.id" :data-index="index" @tap="handletosongPlaydetail">
							<image :src="item.al.picUrl" mode="" />
						</view>
						<view class="song" :data-id="item.id" :data-index="index" @tap="handletosongPlaydetail">
							<view class="songname">
								{{item.name}}
							</view>
							<view class="arname">
								{{item.ar[0].name}}
							</view>
						</view>
						<view class="more">
							<text class="iconfont icon-gengduo"></text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "../../utils/request"
	export default {
		data() {
			return {
				today: new Date().getDate(),
				recommendSonglist: [],
				musicIndex: 0
			};
		},
		methods: {
			async getrecommendSonglist() {
				let songList = await request("/recommend/songs", {}, {}, "post");
				this.recommendSonglist = songList.data
			},
			//跳转到音乐播放页面
			handletosongPlaydetail(e) {
				let {
					id,
					index
				} = e.currentTarget.dataset;
				//写入id信息到$map对象中
				uni.$map.set("currentPlayid", id);
				//将当前播放音乐列表的索引值存入data

				this.musicIndex = index

				uni.navigateTo({
					url: '/pages/songPlaydetail/songPlaydetail',
				})
			},
		},
		onLoad(options) {
			//判断是否已登录
			let cookie = uni.getStorageSync('userCookie');
			if (!cookie) {
				uni.showToast({
					title: '请先登录',
					icon: 'error',
					success() {
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/login/passwordlogin/login',
							})
						}, 1000);
					}
				}, 1000)
			} else {
				this.getrecommendSonglist();
				//消息订阅，接收来自播放页面切换歌曲的信息
				uni.$on("musicSwitchtype", (type) => {
					let {
						musicIndex,
						recommendSonglist
					} = this;
					//判断切换操作
					if (type === "next") {
						(musicIndex === recommendSonglist.dailySongs.length - 1) && (musicIndex = -1);
						musicIndex++;
					} else {
						(musicIndex === 0) && (musicIndex = recommendSonglist.dailySongs.length);
						musicIndex--;
					}
					//更新index

					this.musicIndex = musicIndex

					//页面发送消息
					uni.$emit("getMusicid", {
						id: recommendSonglist.dailySongs[musicIndex].id,
						index: musicIndex
					});
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	/* pages/recommendSong/recommendSong.wxss */
	.recommendSongcontainer {
		.recommendHeader {
			position: relative;

			image {
				width: 100%;
				height: 400rpx;
			}

			.datetime {
				position: absolute;
				top: 20%;
				left: 50%;
				transform: translateX(-50%);
				padding: 15rpx 50rpx;
				border-radius: 10rpx;
				border: 5rpx solid #fff;
				font-size: 50rpx;
				font-weight: 600;
				color: #fff;
			}
		}

		.recommendList {
			position: relative;
			z-index: 1;
			top: -40rpx;

			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-radius: 80rpx;
				background-color: #fff;
				padding: 20rpx 15rpx;
				font-size: 30rpx;
				color: rgb(83, 83, 83);
			}
		}
	}

	.recommendList {
		.Listview {
			padding: 0 25rpx;

			.scrollview {
				height: calc(100vh - 490rpx);
			}
		}

		.listitem {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 15rpx;

			.cover {
				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 10rpx;
				}
			}

			.song {
				flex-grow: 1;
				padding: 20rpx;

				.songname,
				.arname {
					overflow: hidden;
					max-width: 500rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					padding-bottom: 10rpx;
				}

				.songname {
					font-size: 28rpx;
					color: #414141;
				}

				.arname {
					font-size: 22rpx;
					color: #797979;
				}
			}
		}
	}
</style>