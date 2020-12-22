### 在main.js引入插件
import verification from './static/js/verification' //自定义表单验证
Vue.use(verification)
### 新增验证方式
    verification.js中新增验证方式
  ![](form_files/2.jpg)
  
### 
2.页面调用方式
![](form_files/1.jpg)
	```
	页面使用组件
	<view class="form-container-box">
			<!-- 待用活动表单 -->
			<active-form :formDate="formDate" @choose-image-btn="chooseImage" @delete-img-btn="deleteImg"  @sure-btn="sure">								
			</active-form>
			<view class="bgfff">
				<!-- (对必填项input框为空是提示的和错误两种不同提示) -->
				<view class="buttonBox" @click="submit">
					提交
				</view>		
			</view>
			<view class="submit-data">
				{{submitData}}
			</view>
			
		</view>
```
   ``` 
   import activeForm from './../../components/active_form.vue';
   export default {	
	   data() {
	   	return {
	   		submitData: "",								
	   		formDate: [{
	   				placeholder: "姓名，2-20个汉字，中间允许包含一个“.”",
	   				label: "姓名",
	   				type: "text",
	   				rules: {
	   					name: "realName",
	   					value: "",
	   					verify: "req|realName",
	   					errMess: "姓名填写不正确",	   
	   				}	   
	   			},
	   			{
	   				placeholder: "请选择",
	   				label: "兴趣爱好",
	   				type: "radio",
	   				selectVal: ["吃鸡", "吃鸭", "吃鹅", "吃兔", "吃鸟", "吃素"],
	   				rules: {
	   					name: "interest",
	   					value: "",
	   					verify: "req",
	   					errMess: "请选择兴趣爱好"
	   				}
	   			},	   			
	   			{
	   				label: "身份证正面",
	   				type: "image",
	   				updateImg:false,//默认只显示上传按钮
	   				rules: {
	   					name: "idBefore",
	   					value: "",
	   					verify: "req",
	   					errMess: "请上传身份证正面"
	   				}
	   			}]
				},
			methods: {
				submit: function() {
					var otherPra={
						reqEmptyVal:true, 				
					}
					/*otherPra.reqEmptyVal=true 必填项为空是先提示请输入**** ,默认false 直接判断是否符合规则，
					不符合规则直接弹用户指定的错误，
					*/
					// 表单验证 可选项传otherPra:otherPra，如果必填项未填写会提示 				
					if(this.$vervify({formDate:this.formDate,otherPra:otherPra})){
						uni.showToast({
						    title: "验证通过",
						    duration: 2000,
							icon:"none"
						});
						// 表单序列化
						this.submitData="序列化数组："+JSON.stringify(this.$submitForm(this.formDate))
						console.log(this.$submitForm(this.formDate))
					}
				},		
				// 上传图片
				chooseImage: function(data) {		
					var data=JSON.parse(data)					
					this.formDate[data.index].rules.value=data.value;
					this.formDate[data.index].updateImg=true;
				},
				// 删除图片
				deleteImg:function(index){
					this.formDate[index].rules.value="";
					this.formDate[index].updateImg=false;
				},
				// 确定
				sure: function(data) {	
					var data=JSON.parse(data)
					if (data.currentSelectIndex != "" && data.currentSelectValue != "") {
						this.formDate[data.currentSelectIndex].rules.value = data.currentSelectValue
					}
				}								
			}	   
   } 
 ```