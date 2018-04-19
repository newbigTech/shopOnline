<template>
    <div class="userList">
        <v-breadcrumb firstMenu="报表" secondMenu="用户总表"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">用户总表</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate" style="text-indent: 2em;font-size: 18px;font-weight: bold;">
                            累计注册人数<span style="text-indent: 2em;font-size: 20px;color: #F56C6C;margin-left: 20px;">{{totalPerson}}</span>
                        </div>
                        <div class="operate" style="margin-top: 40px;">
                            <span class="demonstration">选择时间：</span>
                            <el-date-picker v-model="timeVal" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
                            <el-button type="primary" style="margin-left: 50px;" @click="getRegister">查询</el-button>
                        </div>
                        <div id='myChart' style='height:300px'></div>
                        <div class="table-scrollable">
                            <el-table :data="tableData" border>
                                <el-table-column prop="registerDate" label="时间"> </el-table-column>
                                <el-table-column prop="num" label="新增注册人数"> </el-table-column>
                                <el-table-column prop="total" label="累计注册人数"> </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑
import echarts from 'echarts' //图表

export default {
    name: 'userList',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
            timeVal: '', //time对象
            tableData: [], //列表
            totalPerson: null, //总人数
            chartX: [], //图表X轴
            chartY: [], //图表Y轴
            startTime: null, //商品添加时间
            endTime: null, //商品结束时间
        }
    },
    mounted() {
        this.$nextTick(function() {
            this.getRegister();
        });
    },
    methods: {
        //查询按钮
        getRegister() {
            this.chartX = [];
            this.chartY = [];            
            var params = {
                token: this.token,
                //参数(必填)
            }
            //查询时间条件
            if (this.timeVal) {
                this.startTime = this.timeVal[0];
                this.endTime = this.timeVal[1];
                var aaa = JSON.stringify(this.startTime);
                aaa = aaa.replace(/-/g, ",");
                aaa = new Date(aaa);
                aaa = aaa.getTime();
                var bbb = JSON.stringify(this.endTime);
                bbb = bbb.replace(/-/g, ",");
                bbb = new Date(bbb);
                bbb = bbb.getTime();
                if (bbb - aaa > 1000 * 60 * 60 * 24 * 30) {
                    this.$message({
                        message: '查询相隔日期最多为一个月！',
                        type: 'warning'
                    })
                    return;
                }
            } else {
                this.startTime = null;
                this.endTime = null;
            }

            if (this.startTime && this.endTime) {
                params.startTime = this.startTime;
                params.endTime = this.endTime;
            }
            var that = this;
            var reqUrl = this.baseUrl + '/report/Customer/getRegisterCount';
            this.$http.get(reqUrl, { params: params }).then((res) => {
                if (!res) {
                    return;
                }
                that.totalPerson = res.allRegisterCount;
                var arr = [];
                arr = res.registerCountList;
                for (var i = 0; i < arr.length; i++) {
                    arr[i].total = res.registerCountByDateList[i].num;
                    that.chartX[i] = res.registerCountList[i].registerDate;
                    that.chartY[i] = res.registerCountList[i].num;
                }
                that.tableData = arr;
                that.drawLine();

            })
        },
        //画图
        drawLine() {
            var myChart = echarts.init(document.getElementById('myChart'));
            // 指定图表的配置项和数据
            var option = {
                xAxis: {
                    type: 'category',
                    data: this.chartX
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: this.chartY,
                    type: 'line',
                    smooth: true
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    }
}

</script>
<style scoped>
.el-table .success-row {
    background: #f0f9eb;
}

</style>
