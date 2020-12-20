<template>
	<view class="tabs">
		<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="ontabtap">
				<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
			</view>
		</scroll-view>
		<view class="line-h"></view>
		<form @submit="formSubmit">
			<swiper :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="300" @change="ontabchange">
				<swiper-item class="swiper-item" v-for="(tab,index1) in newsList" :key="index1">
					<view v-for="(item, index) in portData" :key="item.sort">
						<!-- input类型 -->
						<view class="uni-form-item uni-column" v-if="item.label == 'input'">
							<view class="title">{{item.title}}</view>
							<input class="uni-input" :name="item.name" :placeholder="item.placeholder" :maxlength="item.maxLength" />
						</view>
						<!-- select类型 -->
						<view class="uni-form-item uni-column" v-if="item.label == 'select' && item.mode == 'selector'">
							<view class="title">{{item.title}}</view>
							<picker @change="bindPickerChange" :mode="item.mode" :value="item.index" :range="item.option" :name="item.name"
							 :data-index="index">
								<view class="uni-input">{{item.option[item.index]}}</view>
							</picker>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="line-h">
				<button class="uni-button-result" form-type="submit" type="primary" @click="formSubmit">开始计算</button>
			</view>
		</form>
	</view>
</template>
<script>
	import mediaItem from './news-item.nvue';
	import lhConfigurationForm from '@/components/lh-configurationForm/lh-configurationForm.vue';
	// 缓存每页最多
	const MAX_CACHE_DATA = 100;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;


	export default {
		components: {
			mediaItem,
			gppConfigurationForm
		},
		data() {
			return {
				newsList: [],
				cacheTab: [],
				tabIndex: 0,
				res: null,
				tabBars: [{
						name: '工资计算',
						id: 'gongzi'
					}, {
						name: '税前工资反推',
						id: 'shuiqian'
					},
					{
						name: '年终奖',
						id: 'nianzhong'
					}
				],
				scrollInto: "",
				showTips: false,
				navigateFlag: false,
				pulling: false,
				portData: null,
				visible: false,
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`,
				refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg=="
			}
		},
		onLoad() {
			setTimeout(() => {
				this.tabBars.forEach((tabBar) => {
					this.newsList.push({
						data: [],
						isLoading: false,
						refreshText: "",
						loadingText: '加载更多...'
					});
				});
				//this.getList(0);
			}, 350)
			this.res = require('common/json/form.json'); // 获取表单json数据
			this.portData = this.res.data[this.tabIndex];
		},
		methods: {
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.switchTab(index);
			},
			ontabchange(e) {
				let index = e.target.current || e.detail.current;
				this.switchTab(index);
			},
			switchTab(index) {
				if (this.newsList[index].data.length === 0) {
					//this.getList(index);
					this.portData = this.res.data[this.tabIndex];
				}

				if (this.tabIndex === index) {
					return;
				}

				// 缓存 tabId
				if (this.newsList[this.tabIndex].data.length > MAX_CACHE_DATA) {
					let isExist = this.cacheTab.indexOf(this.tabIndex);
					if (isExist < 0) {
						this.cacheTab.push(this.tabIndex);
						//console.log("cache index:: " + this.tabIndex);
					}
				}

				this.tabIndex = index;
				this.scrollInto = this.tabBars[index].id;

				// 释放 tabId
				if (this.cacheTab.length > MAX_CACHE_PAGE) {
					let cacheIndex = this.cacheTab[0];
					this.clearTabData(cacheIndex);
					this.cacheTab.splice(0, 1);
					//console.log("remove cache index:: " + cacheIndex);
				}
			},
			clearTabData(e) {
				this.newsList[e].data.length = 0;
				this.newsList[e].loadingText = "加载更多...";
			},
			refreshData() {},
			onrefresh(e) {
				var tab = this.newsList[this.tabIndex];
				if (!tab.refreshFlag) {
					return;
				}
				tab.refreshing = true;
				tab.refreshText = "正在刷新...";

				setTimeout(() => {
					this.refreshData();
					this.pulling = true;
					tab.refreshing = false;
					tab.refreshFlag = false;
					tab.refreshText = "已刷新";
					setTimeout(() => { // TODO fix ios和Android 动画时间相反问题
						this.pulling = false;
					}, 500);
				}, 2000);
			},
			onpullingdown(e) {
				var tab = this.newsList[this.tabIndex];
				if (tab.refreshing || this.pulling) {
					return;
				}
				if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
					tab.refreshFlag = true;
					tab.refreshText = "释放立即刷新";
				} else {
					tab.refreshFlag = false;
					tab.refreshText = "下拉可以刷新";
				}
			},
			newGuid() {
				let s4 = function() {
					return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
				}
				return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
			},
			goResult(fdata) {
				console.log(fdata)
				if (fdata == null) {
					return
				}
				debugger
				try {
					fdata["type"] = this.tabIndex
					uni.setStorageSync('data', fdata);
				} catch (e) {
					//TODO handle the exception
				};
				uni.navigateTo({
					url: '/pages/results/results',
					success(res) {
						console.log(res);
					},
					fail(err) {
						// errMsg: "navigateTo:fail page "pages/index/pages/test/test" is not found"
						console.log(err);
					}
				});
			},
			// 普通选择器
			bindPickerChange: function(e) {
				let index = e.target.dataset.index; // 获取该类型属于portData的那一个index				
				this.portData[index].index = e.target.value; // 替换该类型的index达到选择更换
			},
			formSubmit: function(e) {
				// console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value));
				// 定义表单规则
				let rule = [];
				// this.portData.map((item, index) => {
				// 	rule.push({
				// 		name: item.name,
				// 		ruleType: item.ruleType,
				// 		checkRule: item.checkRule,
				// 		required: item.required,
				// 		ruleMessage: item.ruleMessage
				// 	})
				// });
				// 进行表单检查
				let formdata = e.detail.value;
				console.log(e)
				this.goResult(formdata);
				// let checkRes = graceChecker.check(formdata, rule);
				// if (checkRes) {
				// 	uni.showToast({title:"验证通过!", icon:"none"});
				// 	this.goResult(formdata);
				// } else {
				//     uni.showToast({ title: graceChecker.error, icon: "none" });
				// }
			}
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS */
	page {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */

	.tabs {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: #ffffff;
		/* #ifdef MP-ALIPAY || MP-BAIDU */
		height: 100vh;
		/* #endif */
	}

	.scroll-h {
		width: 750rpx;
		height: 80rpx;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		/* flex-wrap: nowrap; */
		/* border-color: #cccccc;
		border-bottom-style: solid;
		border-bottom-width: 1px; */
	}

	.line-h {
		height: 1rpx;
		background-color: #cccccc;
	}

	.uni-tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		padding-left: 34rpx;
		padding-right: 34rpx;
	}

	.uni-tab-item-title {
		color: #555;
		font-size: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-title-active {
		color: #E34451;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		flex: 1;
		flex-direction: row;
	}

	.scroll-v {
		flex: 1;
		/* #ifndef MP-ALIPAY */
		flex-direction: column;
		/* #endif */
		width: 750rpx;
	}

	.update-tips {
		position: absolute;
		left: 0;
		top: 41px;
		right: 0;
		padding-top: 5px;
		padding-bottom: 5px;
		background-color: #FDDD9B;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.update-tips-text {
		font-size: 14px;
		color: #ffffff;
	}

	.refresh {
		width: 750rpx;
		height: 64px;
		justify-content: center;
	}

	.refresh-view {
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.refresh-icon {
		width: 30px;
		height: 30px;
		transition-duration: .5s;
		transition-property: transform;
		transform: rotate(0deg);
		transform-origin: 15px 15px;
	}

	.refresh-icon-active {
		transform: rotate(180deg);
	}

	.loading-icon {
		width: 20px;
		height: 20px;
		margin-right: 5px;
		color: #999999;
	}

	.loading-text {
		margin-left: 2px;
		font-size: 16px;
		color: #999999;
	}

	.loading-more {
		align-items: center;
		justify-content: center;
		padding-top: 10px;
		padding-bottom: 10px;
		text-align: center;
	}

	.loading-more-text {
		font-size: 28rpx;
		color: #999;
	}

	.uni-button-result {
		background-color: #E34451;
		color: #fff;
		font-size: 16px;
		opacity: 1;
		font-weight: bold;
	}
</style>
