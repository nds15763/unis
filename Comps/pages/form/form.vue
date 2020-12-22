<template>
	<view class="form-container-box">
		<!-- 待用活动表单 -->
		<active-form :formDate="formDate" @choose-image-btn="chooseImage" @delete-img-btn="deleteImg" @sure-btn="sure"
		 @input-val="inputVal">
		</active-form>
		<!-- (对必填项input框为空是提示的和错误两种不同提示) -->
		<view class="buttonBox" @click="submit1"> 提交 </view>
		<!-- (对必填项input框为为空和错误是一种提示) -->
		<!-- <view class="buttonBox" @click="submit2">
			提交2
		</view> -->
		<cover-view class="submit-data">
			{{ submitData }}
		</cover-view>
	</view>
</template>

<script>
	import activeForm from './../../components/active_form.vue';
	export default {
		data() {
			return {
				submitData: "",
				formDate: [{
						placeholder: "请选择",
						label: "所在城市",
						type: "radio",
						selectVal: ["北京", "上海", "广州", "深圳"],
						rules: {
							name: "city",
							value: "",
							verify: "req",
							errMess: "请选择所在城市"
						}
					},
					{
						placeholder: "税前月薪",
						label: "税前月薪",
						type: "text",
						rules: {
							name: "income",
							value: "",
							verify: "req|income",
							errMess: "税前月薪填写不正确"
						}
					},
					{
						placeholder: "公积金比率,无需输入百分号",
						label: "公积金比率",
						type: "text",
						rules: {
							name: "percent",
							value: "",
							verify: "percent",
							errMess: "公积金比率填写不正确"
						}
					}
				]
			}
		},
		components: {
			activeForm
		},
		methods: {
			submit1: function() {
				// 表单验证 可选项 otherPra:otherPra	 
				var otherPra = {
					reqEmptyVal: true,
				}
				if (this.$vervify({
						formDate: this.formDate,
						otherPra: otherPra
					})) {
					// 表单序列化
					uni.setStorageSync('data', this.$submitForm(this.formDate));
					uni.navigateTo({
						url: '../results/results',
						success(res) {
							console.log(res);
						},
						fail(err) {
							console.log(err);
						}
					});
				}
			},
			// submit2: function() {
			// 	// 表单验证 非必传otherPra:otherPra	 			
			// 	if (this.$vervify({
			// 			formDate: this.formDate
			// 		})) {
			// 		uni.showToast({
			// 			title: "验证通过",
			// 			duration: 2000,
			// 			icon: "none"
			// 		});
			// 		// 表单序列化
			// 		this.submitData = "序列化数组：" + JSON.stringify(this.$submitForm(this.formDate))
			// 		console.log(this.$submitForm(this.formDate))
			// 	}
			// },
			// 确定
			sure: function(data) {
				var data = JSON.parse(data);
				if (String(data.currentSelectIndex) != "" && String(data.currentSelectValue) != "") {
					this.formDate[data.currentSelectIndex].rules.value = data.currentSelectValue;
				}

			},
			// inputVal
			inputVal: function(data) {
				var data = JSON.parse(data);
				if (String(data.val) != "" && String(data.index) != "") {
					this.formDate[data.index].rules.value = data.val;
				}
			},
			goResult(fdata) {
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
		}
	}
</script>

<style lang="scss">
	.form-container-box {
		width: 100vw;
		font-size: 28upx;
		min-height: 100vh;
		position: relative;
		padding-bottom: 100upx;
	}

	.bgfff {}

	.buttonBox {
		width: 100%;
		height: 84upx;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #E34451;
		position: fixed;
		margin-top: 3em;
		left: 0;
		right: 0;
		z-index: 999;
	}

	.submit-data {
		padding: 20upx;
		margin-top: 20upx;
		word-break: break-word;
	}
</style>
