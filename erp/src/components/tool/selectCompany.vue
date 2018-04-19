<!-- 组件 -->
<template>
    <div class="selected" v-if="dataList.keyOne.length > 0">
        <span>选择:&nbsp;&nbsp;<i class="text-success">{{userInfo.userLevelStr}}</i></span>&nbsp;&nbsp;
        <el-select v-model="selected.keyOne" placeholder="请选择...">
            <el-option v-for="item, _index in dataList.keyOne" :key="_index" :label="item.companyName" :value="item.id"> </el-option>
        </el-select>
        <el-select v-model="selected.keyTwo" placeholder="请选择..." v-if="dataList.keyTwo.length > 0">
            <el-option v-for="item, _index in dataList.keyTwo" :key="_index" :label="item.companyName" :value="item.id"> </el-option>
        </el-select>
        <el-select v-model="selected.keyThree" placeholder="请选择..." v-if="dataList.keyThree.length > 0">
            <el-option v-for="item, _index in dataList.keyThree" :key="_index" :label="item.companyName" :value="item.id"> </el-option>
        </el-select>
        <el-select v-model="selected.keyFour" placeholder="请选择..." v-if="dataList.keyFour.length > 0">
            <el-option v-for="item, _index in dataList.keyFour" :key="_index" :label="item.companyName" :value="item.id"> </el-option>
        </el-select>
    </div>
</template>
<script>
export default {
    name: '', // 结构名称
    data() {
        return {
            dataList: { keyOne: [], keyTwo: [], keyThree: [], keyFour: [] }, // 下拉数组
            selected: { keyOne: null, keyTwo: null, keyThree: null, keyFour: null } // 选择值
        }
    },
    watch: {
        'selected.keyOne': function(curVal, oldVal) {

            // 清空下一级数组
            this.dataList.keyTwo.length = 0;
            this.dataList.keyThree.length = 0;
            this.dataList.keyFour.length = 0;

            // 设置选中对象
            this.selected.keyOne = curVal;
            this.selected.keyTwo = null;
            this.selected.keyThree = null;
            this.selected.keyFour = null;

            // 不等于空, 获取下一级数组
            if (curVal != null) {
                this._getNextCompany(curVal, 'keyTwo');
            } else {
                this.selected.id = this.userInfo.id;
                this.$emit('_returnResult', this.selected);
            }
        },
        'selected.keyTwo': function(curVal, oldVal) {

            // 清空下一级数组
            this.dataList.keyThree.length = 0;
            this.dataList.keyFour.length = 0;

            // 设置选中对象
            this.selected.keyTwo = curVal;
            this.selected.keyThree = null;
            this.selected.keyFour = null;

            // 不等于空, 获取下一级数组
            if (curVal != null) {
                this._getNextCompany(curVal, 'keyThree');
            } else {
                this._getSelectedID();
            }
        },
        'selected.keyThree': function(curVal, oldVal) {

            // 清空下一级数组
            this.dataList.keyFour.length = 0;

            // 设置选中对象
            this.selected.keyThree = curVal;
            this.selected.keyFour = null;

            // 不等于空, 获取下一级数组
            if (curVal != null) {
                this._getNextCompany(curVal, 'keyFour');
            } else {
                this._getSelectedID();
            }
        },
        'selected.keyFour': function(curVal, oldVal) {

            // 设置选中对象
            this.selected.keyFour = curVal;
            this._getSelectedID();

        },
    },
    mounted() {
        this._getNextCompany(this.userInfo.id, 'keyOne');
    },
    methods: {
        // 设置选中ID, 获取下级数组
        _getNextCompany(_id, _key) {
            this.selected.id = _id;
            var _that = this;
            this.$http.post(this.baseUrl + '/erp/user/selectCompany', { parentId: _id }).then(function(res) {
                if (!res) { return }
                if (res.length > 0) {
                    _that.dataList[_key] = res; // 设置下一个数组
                    _that.dataList[_key].unshift({ companyName: '/', id: null }); // 设置 第一个值 => 全部[/]
                    _that.selected[_key] = res[0].id; // 下一数组 默认选者 =>全部
                }
                _that.$emit('_returnResult', _that.selected);
            })
        },
        // 循环获取 选中ID
        _getSelectedID() {
            var _val = this.selected;
            for (var _key in _val) {
                if (_val[_key] != null) {
                    this.selected.id = _val[_key]
                }
            }
            this.$emit('_returnResult', this.selected);
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.selected {
    display: inline-block;
}

</style>
