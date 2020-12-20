<template>
	<view class="qiun-columns">
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<t-table @change="change">
				<t-tr>
					<t-th>类型</t-th>
					<t-th>费用详情</t-th>
					<t-th>费用占比</t-th>
				</t-tr>
				<t-tr v-for="item in tableList.series" :key="item.id">
					<t-td>{{ item.name }}</t-td>
					<t-td>￥{{ item.data }}</t-td>
					<t-td>{{ item.percent }}%</t-td>
				</t-tr>
			</t-table>
		</view>
		<view class="qiun-charts qiun-rows">
			<canvas canvas-id="canvasPie" id="canvasPie" class="charts-pie" @touchstart="touchPie"></canvas>
		</view>
		<view>

		</view>
	</view>
</template>

<script>
	import tTable from '../../compose/t-table/t-table.vue';
	import tTh from '../../compose/t-table/t-th.vue';
	import tTr from '../../compose/t-table/t-tr.vue';
	import tTd from '../../compose/t-table/t-td.vue';

	import uCharts from '../../compose/u-charts.js';
	var _self;
	var canvaPie = null;

	export default {
		components: {
			tTable,
			tTh,
			tTr,
			tTd
		},
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
				piearr: [],
				tableList: {}
			}
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			getServerData() {
				try {
					this.setPieList(uni.getStorageSync('data'))
				} catch (e) {
					//TODO handle the exception
				};

			},
			setPieList(value) {
				if (value == null) {
					return
				}
				switch (value.type) {
					case 0:
						{
							debugger
							this.setTax(18000)
							_self.showPie("canvasPie", this.tableList);
						}
					case 1:
						{}
					case 2:
						{}
				}
			},
			setShuiQianData() {
				//个人公积金系数
				//公司公积金系数
				//公积金基数
				//社保基数
			},
			showPie(canvasId, chartData) {
				canvaPie = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 11,
					legend: {
						show: true,
						position: 'right',
						float: 'center',
						itemGap: 10,
						padding: 5,
						lineHeight: 26,
						margin: 5,
						borderWidth: 1
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							labelWidth: 15
						}
					},
				});
				this.piearr = canvaPie.opts.series;
			},
			touchPie(e) {
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
			},
			setTax(income) {//设置图表内容
				var sqsr = 0 //税后收入
				var shsr = 0 //税前收入
				var grsbjf = 0 //个人社保缴费
				var gjjjf = 0 //公积金缴费
				var grsds = 0 //个人所得税
				var ylbxbl = 0.08 //养老保险比例 8%
				var yilbxbl = 0.02 //医疗保险比例 2%
				var sybxbl = 0.02 //失业保险比例 2%
				var zfgjjbl = 0.08 //住房公积金比例 8%

				//税前收入
				shsr = income
				//个人社保缴费 = 养老保险(y*8%)+医疗保险(y*2%)+失业保险(y*2%)
				grsbjf = income * ylbxbl + income * yilbxbl + income * sybxbl
				//公积金缴费(住房公积金比例 8%)可变
				gjjjf = income * 0.08
				//个人所得税
				grsds = this.sbjf(shsr)
				//税后收入=税前收入-(个人社保缴费+公积金缴费)-个人所得税
				sqsr = shsr - (grsbjf + gjjjf) - grsds

				this.tableList = {
					series: [{
							"name": "税后月薪",
							"data": sqsr,
							"percent": ((sqsr / shsr) * 100).toFixed(2)
						},
						{
							"name": '住房公积金',
							"data": gjjjf,
							"percent": ((gjjjf / shsr) * 100).toFixed(2)
						},
						{
							"name": '个人所得税',
							"data": grsds,
							"percent": ((grsds / shsr) * 100).toFixed(2)
						},
						{
							"name": '社会保险',
							"data": grsbjf,
							"percent": ((grsbjf / shsr) * 100).toFixed(2)
						}
					]
				};
			},
			sbjf(income) {//设置个人所得税
				if (income <= 5000) {
					return 0
				} else if (income > 5000 && income <= 8000) {
					return income * 0.03
				} else if (income > 5000 && income <= 8000) {
					return income * 0.03
				} else if (income > 8000 && income <= 17000) {
					return income * 0.1
				} else if (income > 17000 && income <= 30000) {
					return income * 0.2
				} else {
					return income * 0.25
				}
				// 1、工资范bai围在1-5000元之间的，包括5000元，适用个人所得税税率为0%。

				// 2、工资范围在5000-8000元之间的，包括8000元，适用个人所得税税率为3%。

				// 3、工资范围在8000-17000元之间的，包括17000元，适用个人所得税税率为10%。

				// 4、工资范围在17000-30000元之间的，包括30000元，适用个人所得税税率为20%。

				// 5、工资范围在30000-40000元之间的，包括40000元，适用个人所得税税率为25%。
			},
		}
	}
</script>

<style>
	page {
		background: #F2F2F2;
		width: 750upx;
		overflow-x: hidden;
	}

	.qiun-padding {
		padding: 2%;
		width: 96%;
	}

	.qiun-wrap {
		display: flex;
		flex-wrap: wrap;
	}

	.qiun-rows {
		display: flex;
		flex-direction: row !important;
	}

	.qiun-columns {
		display: flex;
		flex-direction: column !important;
	}

	.qiun-common-mt {
		margin-top: 10upx;
	}

	.qiun-bg-white {
		background: #FFFFFF;
	}

	.qiun-title-bar {
		width: 96%;
		padding: 10upx 2%;
		flex-wrap: nowrap;
	}

	.qiun-title-dot-light {
		border-left: 10upx solid #0ea391;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000
	}

	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts-pie {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts-right {
		display: flex;
		align-items: center;
		width: 250upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.legend-itme {
		width: 200upx;
		margin-left: 30upx;
		height: 50upx;
		align-items: center;
	}

	.legend-itme-point {
		width: 20upx;
		height: 20upx;
		margin: 15upx;
		border: 1px solid #FFFFFF;
		border-radius: 20upx;
		background-color: #000000;
	}

	.legend-itme-text {
		height: 50upx;
		line-height: 50upx;
		color: #666666;
		font-size: 26upx;
	}
</style>
