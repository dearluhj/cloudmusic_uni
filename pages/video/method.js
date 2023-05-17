import request from "../../utils/request.js";
//记录视频播放信息
let	videoMap=new Map()
// 初始化页面信息
async function getInitializeMsg() {
	let cookie = uni.getStorageSync('userCookie');
	if (cookie) {
		let tabres = await request("/video/category/list", {
			timestamp: Date.now()
		}, {}, "post");

		this.videoTablist = tabres.data
		this.navId = tabres.data[0].id

		this.getVideolist(this.navId);
	} else {
		uni.showToast({
			title: '您还未登录',
			icon: 'error',
			success() {
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login/passwordlogin/passwordlogin',
					})
				}, 1000);
			}
		}, 1000)
	}
}
//标签栏id绑定

function handleNav(e) {
	let navId = e.target.dataset.id;
	if (e.target.dataset.name == "text") {

		this.navId = navId
		this.videoList = []
		this.videoOffset = 0 //分页信息归零

		this.getVideolist(navId);
	}
}
async function getVideolist(id, offset = 0, addlist = false) {
	uni.showLoading({
		title: '正在加载',
		mask: true
	});
	let videolistres = await request("/video/group", {
		id,
		offset,
		timestamp: Date.now()
	});

	videolistres.datas.forEach(item => {
		item.id = item.data.vid || item.data.id;
	});

	let videofewlist = this.videoList;
	//当前是否为累加视频请求
	(offset && addlist) ? videofewlist.push(...videolistres.datas): videofewlist = videolistres.datas;
	//获取视频地址
	for (let i = 0; i < videofewlist.length; i++) {
		let videoUrl;
		//mv视频的url获取地址与其他的不同,MV的id为1000
		if (id === 1000) {
			videoUrl = await request("/mv/url", {
				id: videofewlist[i].data.id
			})
			videofewlist[i].urls = videoUrl.data;
		} else {
			videoUrl = await request("/video/url", {
				id: videofewlist[i].data.vid
			})
			videofewlist[i].urls = videoUrl.urls[0];
		}
	}

	this.videoList = videofewlist
	this.isTriggered = false //下拉刷新已完成

	uni.hideLoading();
}
//点击视频或图片时更改当前data内播放视频id
function changeVideostatus(e) {
	this.videoPlayid = e.currentTarget.dataset.id
}
//记录视频播放时间信息
function videoTimerecord(e) {
	videoMap.set(e.currentTarget.dataset.id, e.detail.currentTime);
	this.videoTimerecordlist = videoMap
}

function handleVideopalytime(e) {
	let playtime = this.videoTimerecordlist ? this.videoTimerecordlist.get(e.currentTarget.dataset.id) : 0;
	if (!playtime) playtime = 0;
	let videoObj = uni.createVideoContext(e.currentTarget.dataset.id);
	videoObj.seek(playtime);
}
//视频列表下拉刷新
function updateScrollview() {
	this.getVideolist(this.navId);
}
//下拉加载更多视频
function addScrollviewvideo() {
	this.videoOffset = this.videoOffset + 1
	this.getVideolist(this.navId, this.videoOffset, true);
}
export default {
	addScrollviewvideo,
	updateScrollview,
	handleVideopalytime,
	videoTimerecord,
	changeVideostatus,
	getVideolist,
	handleNav,
	getInitializeMsg,
	videoMap
}