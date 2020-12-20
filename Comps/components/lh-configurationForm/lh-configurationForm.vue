<template>
	<view class="gpp-cf">
		<view class="gpp-cf-form" :class="{'bottomShadow':isCard}" v-for="(item, index) in formTemplate" :key="index">
			<view class="gpp-cf-title" @click="showItemClick(item)"><text :class="showItemIds.indexOf(item.id)>-1 ? 'titleBeforeOpen':'titleBeforeClose'"
				 :style="'backgroundColor:'+themeColor"></text>{{item.formTitle}}</view>
			<view class="gpp-cf-content" :class="{'hidden':showItemIds.indexOf(item.id)==-1}">
				<view v-for="(detailItem, detailIndex) in item.object" :key="detailIndex">
					<view class="cu-form-group " v-if="detailItem.controlType == 'avatar'">
						<view class="title">头像</view>
						<view class="cu-avatar radius bg-gray"></view>
					</view>
					<!-- text -->
					<view class="gpp-cf-content-item" v-if="detailItem.controlType == 'input'">
						<view class="item-name"><text class="red" v-if="detailItem.isMustfill">*</text><text class="item-name-text">{{detailItem.title}}</text></view>
						<view class="item-content">
							<input class="item-input border_box" v-bind="detailItem.props" :disabled="disabled" v-model="itemValue[detailItem.textName]" />
							
							<text class="item-ct-unit" @tap="setCode(detailItem.getfield,detailItem.textName)" v-if="detailItem.vercode">{{getVerCodeSecond}}</text>
							<text class="item-ct-unit" v-else-if="detailItem.unit">{{detailItem.unit}}</text>
						</view>
					</view>
					<!-- Rate -->
					<view class="gpp-cf-content-item" v-if="detailItem.controlType == 'rate'">
						<view class="item-name"><text class="red" v-if="detailItem.isMustfill">*</text><text class="item-name-text">{{detailItem.title}}</text></view>
						<view class="item-content rate-body">
							<uni-rate class="" @change="onRateChange($event,detailItem.textName)" :disabled="disabled" v-bind="detailItem.props"
							 v-model="itemValue[detailItem.textName]" />
						</view>
					</view>
					<!-- textarea -->
					<view class="gpp-cf-content-item" v-if="detailItem.controlType == 'textarea'">
						<view class="item-name"><text class="red" v-if="detailItem.isMustfill">*</text><text class="item-name-text">{{detailItem.title}}</text></view>
						<view class="item-content">
							<textarea class="item-textarea border_box" :disabled="disabled" v-model="itemValue[detailItem.textName]" v-bind="detailItem.props" />
							</view>
					</view>
					<!-- html -->
					<view class="gpp-cf-content-item" v-if="detailItem.controlType == 'html'">
						<view class="item-name"><text class="red" v-if="detailItem.isMustfill">*</text><text class="item-name-text">{{detailItem.title}}</text></view>
						<view class="item-content">
							<rich-text :nodes="itemValue[detailItem.textName]"></rich-text>
						</view>
					</view>
					<!-- <view class="gpp-cf-content-item" v-if="detailItem.controlType == 'html'">
						<view class="item-content" :style="'color:'+detailItem.fontColor+';font-size:'+detailItem.fontSize">
							{{detailItem.content}}
						</view>
					</view> -->
					<!-- radio -->
					<view class="gpp-cf-content-item" v-if="detailItem.controlType == 'radio'">
						<view class="item-name"><text class="red" v-if="detailItem.isMustfill">*</text><text class="item-name-text">{{detailItem.title}}</text></view>
						<view class="item-content">
							<radio-group  class="checkRadiogroup">
								<label class="item-radio" v-for="(value, index) in detailItem.values" :key="index" 
								@click="itemValue[detailItem.textName] = value[pickerProps.value]">
									<radio :disabled="disabled" :value="value[pickerProps.value]" 
									:checked="itemValue[detailItem.textName] == value[pickerProps.value]"/>
									<text class="item-select">{{value[pickerProps.label]}}</text>
								</label>
							</radio-group>
						</view>
					</view>
					<!-- checkbox -->
					<view class="gpp-cf-content-item" v-if="detailItem.controlType == 'checkbox'">
						<view class="item-name"><text class="red" v-if="detailItem.isMustfill">*</text><text class="item-name-text">{{detailItem.title}}</text></view>
						<view class="item-content">
							<checkbox-group class="checkRadiogroup" @change="checkboxChange($event, detailItem.textName)">
								<label class="item-checkbox" v-for="(value, index) in detailItem.values" :key="index">
									<checkbox :disabled="disabled" :value="value[pickerProps.value]" :checked="itemValue[detailItem.textName].indexOf(value[pickerProps.value]) > -1"/>
									<text class="item-select">{{value[pickerProps.label]}}</text>
								</label>
							</checkbox-group>
						</view>
					</view>
					
					<!-- image -->
					<view class="gpp-cf-content-item" v-if="detailItem.controlType == 'image'">
						<view class="item-name">
							<text class="red" v-if="detailItem.isMustfill">*</text><text class="item-name-text">{{detailItem.title}}</text>
						</view>
						<view class="item-content" >
							<view class="uni-uploader__files">
								<block v-for="(image,index) in itemValue[detailItem.textName]" :key="index">
									<view class="uni-uploader__file" style="position: relative;" 
										:url="image" :name="detailItem.textName"
										@click.stop="ViewImage(index,detailItem.textName)">
										<image mode="aspectFill" class="uni-uploader__img" :src="image"></image>
										<view class="close-view" @click.stop="DelImg(index,detailItem.textName)">x</view>
									</view>
								</block>
								<view class="uni-uploader__input-box" v-show=" itemValue[detailItem.textName].length < detailItem.count">
									<view class="uni-uploader__input" @tap="ChooseImage(detailItem.count,detailItem.textName)"></view>
								</view>
							</view>
						</view>
					</view>
					<!-- date -->
					<view class="gpp-cf-content-item" v-if="detailItem.controlType == 'date'">
						<view class="item-name"><text class="red" v-if="detailItem.isMustfill">*</text><text class="item-name-text">{{detailItem.title}}</text></view>
						<view class="item-content">
							<view v-if="!disabled">
								<picker mode="date" @change="datePickerChange($event, detailItem.textName)">
									<text class="item-select border_box">{{itemValue[detailItem.textName]}}</text>
									<uni-icons class="item-ct-unit" :type="itemValue[detailItem.textName]==''? 'arrowdown': 'closeempty'" 
									@click="onClickClose(detailItem.textName)"></uni-icons>
								</picker>
							</view>
							<view v-else>
								<text class="item-select border_box">{{itemValue[detailItem.textName]}}</text>
							</view>
						</view>
					</view>
					<!-- select -->
					<view class="gpp-cf-content-item" @tap="handleTap(detailItem)" v-if="detailItem.controlType == 'selector'||detailItem.controlType == 'multiSelector'||detailItem.controlType ==  'unlinkedSelector'">
						<view class="item-name"><text class="red" v-if="detailItem.isMustfill">*</text><text class="item-name-text">{{detailItem.title}}</text></view>
						<view class="item-content">
							<view v-if="!disabled">
								<text class="item-select border_box">{{handleChangeValue[detailItem.textName]|selectPickerItemShow}}</text>
								
								<uni-icons class="item-ct-unit" :type="itemValue[detailItem.textName]==''? 'arrowdown': 'closeempty'" 
								@click="onClickClose(detailItem.textName)"></uni-icons>
								
							</view>
							<view v-else>
								<text class="item-select border_box">{{handleChangeValue[detailItem.textName]|selectPickerItemShow}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<lb-picker ref="picker"
		:name="picker.name"
		  :mode="picker.mode"
		  v-model="picker.value"
		  :list="picker.list"
		  :props="pickerProps"
		  @change="handleChange"
		  @confirm="handleConfirm"
		  @cancel="handleCancel">
		</lb-picker>
	</view>
</template>

<script>
	let countDown;
	const defaultProps = {
	  label: 'label',
	  value: 'value',
	  children: 'children'
	}
	var that;
import lbPicker from '@/components/lb-picker/index.vue'
import uniGrid from '@/components/uni-ui/uni-grid/uni-grid.vue'
import uniGridItem from '@/components/uni-ui/uni-grid-item/uni-grid-item.vue'
import uniIcons from '@/components/uni-ui/uni-icons/uni-icons.vue'
import uniRate from '@/components/uni-ui/uni-rate/uni-rate.vue'
// import imgUpload from '@/components/poiuy-uImgUpload/ImgUpload.vue';
	export default {
		components: {
			lbPicker,
			uniGrid,
			uniGridItem,
			uniIcons,
			uniRate
		},
		computed:{
			
			_setTime() {
				//处理值
				const setTime = Number(this.setTime)
				return setTime>0 ? setTime : 60
			},
			getVerCodeSecond(){
				//验证码倒计时计算
				if(this.second<=0){
					return '获取验证码';
				}else{
					if(this.second<10){
						return '0'+this.second+'s';
					}else{
						return this.second+'s';
					}
				}
				
			}
		},
		props:{
			setTime:{
				//倒计时时间设置
				type: [Number,String],
				default: 60,
			},
			themeColor:{
				type: String,
				default(){
					return "#6BA1FF"
				}
			},
			isCard:{
				type: Boolean,
				default(){
					return false
				}
			},
			formTemplate:{
				type: Array,
				default(){
					return []
				}
			},
			formValue:{
				type: Object,
				default(){
					return {}
				}
			},
			disabled:{
				type:Boolean,
				default:false
			},
			////////////................
			
			props: {
			  type: Object
			},
		},
		data() {
			return {
				second: 0, //倒计时
				picker:{
					name:'',
					value:[],
					list:[]
				},
				initTypeValue:['image','multiSelector', 'unlinkedSelector'],
				pickerProps: Object.assign({}, defaultProps, this.props),
				handleChangeValue:{},
				showItemIds: [],
				itemValue: {}
			}
		},
		watch:{
			formTemplate:function(){
				this.init();
			}
		},
		created() {
			this.init();
		},
		beforeCreate: function () {
		     that = this;
		 },
		filters:{
			selectPickerItemShow:function(value,lists){
				
				let arr = []
				//itemValue[detailItem.textName]|selectPickerItemShow(detailItem.values )
				/* if(typeof(value) === 'string'){
					value = [value]
				}
				
				value.forEach(val=>{
					// console.log(val,lists)
					for(let i = 0; i<lists.length;i++){
				console.log(val,lists[i][that.pickerProps.value])
						if(val == lists[i][that.pickerProps.value]){
							arr.push(lists[i][that.pickerProps.label])
							break
						}
					}
				}) */
				
				///handleChangeValue[detailItem.textName]|selectPickerItemShow
				// console.log(value)
				if(value){
					if( Array.isArray(value)){
						value.forEach(item=>{
							arr.push(item[that.pickerProps.label])
						});
					}else{
						arr.push(value[that.pickerProps.label])
					}
				}
				return arr.join('-')
			}
		},
		methods: {
			/**
			 * 处理ios键盘收回 界面不返回问题
			 * @param {Object} e
			 */
			onInputBlur(e) {
				if (isIOS) {
					var currentPosition, timer;
					var speed = 1;
					timer = setInterval(function() {
						currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
						currentPosition -= speed;
						window.scrollTo(0, currentPosition); //页面向上滚动
						currentPosition += speed;
						window.scrollTo(0, currentPosition); //页面向下滚动
						clearInterval(timer);
					}, 100);
				}
			},
			
			/**
			 * 初始化数据
			 */
			init(){
				this.formTemplate.forEach(el => {
					this.showItemIds.push(el.id);
					el.object.forEach(el => {
						if(el.textName){
							
							this.$set(this.itemValue, el.textName,this.initTypeValue.indexOf(el.controlType) ==-1?"":[]);
						}
					});
				});
				// 如果传了初始值进行赋值
				if(this.formValue != {}){
					Object.assign(this.itemValue, this.formValue);
				}
			},
			/**
			 * 卡片显示影藏控制
			 * @param {Object} item
			 */
			showItemClick(item){
				if(this.showItemIds.indexOf(item.id) > -1){
					this.showItemIds.splice(this.showItemIds.indexOf(item.id), 1);
				}else{
					this.showItemIds.push(item.id);
				}
			},
			/**
			 * 日期选择器修改
			 * @param {Object} e
			 * @param {Object} textName
			 */
			datePickerChange(e, textName){
				this.itemValue[textName] = e.detail.value;
			},
			/**
			 * checkbox修改
			 * @param {Object} e
			 * @param {Object} textName
			 */
			checkboxChange(e, textName){
				console.log(e.detail.value)
				this.itemValue[textName] = e.target.value;
			},
			/**
			 * 单级select显示
			 * @param {Object} objects
			 * @param {Object} value
			 */
			selectPickerItemShow(objects, value){
				let name = '';
				objects.forEach(el => {
					if(el.valueCode == value){
						name = el.valueName;
					}
				});
				return name;
			},
			onClickClose(textName){
				if(this.itemValue[textName] != ''){
					this.itemValue[textName] = ''
				}
			},
			/**
			 * 输入校验
			 */
			inputValidation(){
				let checkFlag = true;
				let message = "校验成功";
				let value = {};
				
				this.formTemplate.forEach(el => {
					if(! checkFlag){
						return false;
					}
					el.object.forEach(el => {
						if(! checkFlag){
							return false;
						}
						if(el.isMustfill && this.itemValue[el.textName] == ""){ //必填
							message = "请输入"+el.title;
							checkFlag = false;
							return false;
						}
						if(el.checkRegular){ //正则
							let reg = new RegExp(el.checkRegular);
							if(! reg.test(this.itemValue[el.textName])){
								message = el.title+"输入不合法";
								checkFlag = false;
								return false;
							}
						}
					});
				});
				
				if(checkFlag){ value = this.itemValue; }
				return {checkFlag: checkFlag, message: message, value: value};
			},
			/**
			 * 暴露的提交方法
			 */
			submit(){
				return this.inputValidation();
			},
			///////////////////picker////////////////////////////////////
			
			handleTap (picker) {
				// this.picker.name = picker.textName
				// this.picker.mode = picker.controlType
				// this.picker.list = picker.values
				// console.log(this.picker)
				// this.picker.value = this.itemValue[picker.textName]
				
				
				this.$set(this.picker,'name', picker.textName)
				this.$set(this.picker,'mode', picker.controlType)
				this.$set(this.picker,'list', picker.values)
				this.$set(this.picker,'value', this.itemValue[picker.textName])
				
				
					// console.log(this.picker)
				// :data-name="picker.name"
				//   v-model="picker.value"
				//   :mode="picker.mode"
				//   :list="picker.list"
				this.$refs.picker.show()
			},
			handleChange (item) {
				// console.log('change::', item)
			},
			handleConfirm (item) {
				this.$set(this.itemValue,item.name,item.value)
				
				this.$set(this.handleChangeValue,item.name,item.item)
				// console.log('confirm::', )
			},
			handleCancel (item) {
				// console.log('cancel::', item)
			},
			///////////////////////////////////////////////////
			onRateChange(e,textName){
				this.itemValue[textName]= e.value
			},
			ChooseImage(count,textName) {
				
					uni.chooseImage({
						count: count-this.itemValue[textName].length, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], //从相册选择
						success: (res) => {
							res.tempFilePaths.forEach(tempfile=>{
								let issome= this.itemValue[textName].some(value=>{
									return tempfile == value
								})
								if(!issome){
									 this.itemValue[textName].push(tempfile)
								}
							})
							/* if (this.itemValue[textName].length != 0) {
								this.itemValue[textName] = this.itemValue[textName].concat(res.tempFilePaths)
							} else {
								this.itemValue[textName] = res.tempFilePaths
							} */
						}
					});
			},
			ViewImage(index,name) {
				
					uni.previewImage({
						urls: this.itemValue[name],
						current: this.itemValue[name][index]
					});
			},
			DelImg(index,textName) {
				this.itemValue[textName].splice(index, 1)
				/* console.log('jghhtyt')
				uni.showModal({
					content: '是否删除改图片',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							
						}
					}
				}) */
			},
			///////////////////////////////////////////
			setCode(getfield,textName){
				
				//设置获取验证码的事件
				if(this.isRunCode){
					//判断是否开始倒计时，避免重复点击
					return false;
				}
				//准备触发
				this.$once('runCode',(val)=>{
				    this.runCode(val);
				});
				this.$emit('setCode',this.itemValue[getfield]);
				// this.runCode();
			},
			runCode(val){
				//开始倒计时
				if(String(val)=="0"){
					
					//判断是否需要终止循环
					this.second = 0; //初始倒计时
					clearInterval(countDown);//清理循环
					this.isRunCode= false; //关闭循环状态
					return false;
				}
				if(this.isRunCode){
					//判断是否开始倒计时，避免重复点击
					return false;
				}
				this.isRunCode= true
				this.second = this._setTime //倒数秒数
				
				let _this=this;
				countDown = setInterval(function(){
					_this.second--
					if(_this.second==0){
						_this.isRunCode= false
						clearInterval(countDown)
					}
				},1000)
			}
		}
	}
</script>

<style lang="scss">
	.gpp-cf{
		background-color: #F1F1F1;
		
		
	}
	.gpp-cf-form{
		padding-bottom: 10px;
		background-color: #FFFFFF;
		margin-bottom: 10px;
		
	}
	.gpp-cf-title{
		position: relative;
		padding: 10px 10px 10px 30px;
		font-size: 16px;
		
	}
	.titleBeforeOpen{
		// transition: all 0.3s ease;
		position: absolute;
		left: 15px;
		top: 13px;
		width: 4px;
		height: 16px;
		border-radius: 2px;
	}
	.titleBeforeClose{
		// transition: all 0.3s ease;
		position: absolute;
		left: 8px;
		top: 19px;
		width: 16px;
		height: 4px;
		border-radius: 2px;
	}
	.gpp-cf-title:active{
		background-color: #f8f8f8;
	}
	.gpp-cf-content{
		margin: 10px;
		
		font-size: 14px;
		color: #383838;
		
	}
	.gpp-cf-content-item{
		margin-bottom: 16px;
		
	}
	.item-name{
		margin-bottom: 3px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	.item-name-text{
		font-size: 24rpx;
	}
	.item-content{
		position: relative;
		
	}
	.item-ct-unit{
		position: absolute;
		top: 8px;
		right: 10px;
		font-size: 14px;
		color: #383838;
	}
	.hidden{
		/* #ifndef APP-NVUE */
		display: none;
		/* #endif */
	}
	.gpp-cf-form:last-child{
		margin-bottom: 0;
	}
	
	.red{
		color: #f55347;
	}
	.bottomShadow{
		box-shadow: 0 2px 4px #d0cfcf;
	}
	.item-input,.item-select{
		
		
		height: 36px;
		line-height: 34px;
		font-size: 14px;
		padding: 0 40px 0 8px;
		
	}
	.checkRadiogroup{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
	}
	.border_box {
		
		border-width: 1px;
		border-color: #e8e5e6;
		border-style: solid;
		border-radius: 8px;
	}
	.item-textarea{
		/* #ifndef APP-NVUE */
		min-height: 90px;
		/* #endif */
		
		font-size: 14px;
		padding: 8px;
	}
	.input-placeholder, .textarea-placeholder{
		color: #d5d5d5;
	}
	radio-group, checkbox-group{
		margin-top: 8px;
	}
	.item-radio, .item-checkbox{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-right: 10px;
		justify-content: center;
		align-items: center;
	}
/////////////////////////////////////////////////////////////////////
/* 头条小程序组件内不能引入字体 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url('~@/static/uni.ttf') format('truetype');
	}

	/* #endif */

	/* #ifndef APP-NVUE */

	.rate-body {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14rpx;
		background-color: #ffffff;
	}

	/* #endif */

	.rate-body {
		flex-direction: column;
		padding: 30rpx;
		background-color: #ffffff;
	}
//////////////////////////////////////////

	.uni-uploader-body {
		padding-bottom: 20upx;
	}
	
	.uni-uploader__files {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
	}
	
	.uni-uploader__file {
		margin: 8upx;
		width: 120px;
		height: 120px;
	}
	
	.uni-uploader__img {
		
		width: 120px;
		height: 120px;
	}
	
	.uni-uploader__input-box {
		position: relative;
		margin: 8upx;
		width: 118upx;
		height: 118upx;
		border-width: 2upx;
		border-color: #CCCCCC;
		border-style: dashed;
	}
	
	.uni-uploader__input-box:before,
	.uni-uploader__input-box:after {
		position: absolute;
		top: 50%;
		left: 50%;
		/* #ifndef APP-NVUE */
		-webkit-transform: translate(-50%, -50%);
		/* #endif */
		transform: translate(-50%, -50%);
		background-color: #D9D9D9;
	}
	
	.uni-uploader__input-box:before {
		width: 2upx;
		height: 42upx;
	}
	
	.uni-uploader__input-box:after {
		width: 42upx;
		height: 2upx;
	}
	
	.uni-uploader__input-box:active {
		border-color: #999999;
	}
	
	.uni-uploader__input-box:active:before,
	.uni-uploader__input-box:active:after {
		background-color: #999999;
	}
	
	.uni-uploader__input {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
	
	.close-view {
		text-align: center;
		line-height: 28upx;
		height: 18px;
		width: 18px;
		border-radius: 50%;
		background-color: #FF5053;
		color: #FFFFFF;
		position: absolute;
		top: -12upx;
		right: -8upx;
		font-size: 24upx;
	}

</style>
