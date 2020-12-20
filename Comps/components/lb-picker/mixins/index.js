import { getColumns } from '../utils'
export const commonMixin = {
  data () {
    return {
      indicatorStyle: `height: 34px`
    }
  },
  created () {
    this.init('init')
  },
  methods: {
    init (changeType) {
		// console.log(changeType)
		this._level = this._level||this.getMaxFloor(this.list)
		
      if (this.list && this.list.length) {
        const column = getColumns({
          value: this.value,
          list: this.list,
          mode: this.mode,
          props: this.props,
          level: this._level
        })
        const { columns, value, item, index } = column
        this.selectValue = value
        this.selectItem = item
        this.pickerColumns = columns
        this.pickerValue = index
        this.$emit('change', {
          value: this.selectValue,
          item: this.selectItem,
          index: this.pickerValue,
          change: changeType
        })
      }
    },
	
	//计算菜单层级
	getMaxFloor(treeData) {
		let floor = 0;
		let max = 0;
		function each(data, floor) {
			data.forEach(e => {
				max = floor > max ? floor : max;
				if (e.hasOwnProperty('children') && e.children.length > 0) {
					each(e.children, floor + 1);
				}
			});
		}
		each(treeData, 1);
		return max;
	},
  },
  watch: {
    value () {
      if (!this.isConfirmChange) {
        this.init('value')
      }
    },
    list () {
		console.log('DAAS')
      this.init('list')
    }
  }
}
