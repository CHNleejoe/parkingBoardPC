<template>
    <div class="content-box">
        <div class="search">
            <div class="selects">
                <el-select class="type" v-model="dateTypeIndex" placeholder="请选择时间类型">
                    <el-option
                    v-for="item in dateTypeColumns"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                class="datepicker"
                v-model="startDate"
                type="date"
                @change="setStartDate"
                placeholder="选择开始日期">
                </el-date-picker>
                <div class="double-line"></div>
                <el-date-picker
                class="datepicker"
                v-model="endDate"
                type="date"
                @change="setEndDate"
                placeholder="选择结束日期">
                </el-date-picker>
            </div>
            <div class="btns">
                <el-button class="search-btn" type="primary" @click="searchAllData">查询</el-button>
            </div>
        </div>
        <div class="datas">
            <div
                :class="{'data-item': true, point: item.point, nomar: (hasParkingData && index == 4) || !hasParkingData && index == 5}"
                v-for="(item, index) in dataList"
                :key="index"
                v-show="item.display == 'hasParkingData'?hasParkingData:true"
                @click="turnPage(item)"
            >
                <div class="img">
                    <img :src="item.icon" alt="">
                </div>
                <div class="detail">
                    <div class="label">{{item.label}}</div>
                    <div class="num">{{boardData[item.labelStr]}}{{item.unit}}</div>
                </div>
            </div>
        </div>
        <div class="charts">
            <div class="user-type chart-item">
                <div id="userTypeChart"></div>
            </div>
            <div class="car-type chart-item">
                <div id="carTypeChart"></div>
            </div>
            <div class="traffic-flow chart-item">
                <div id="trafficFlowChart"></div>
            </div>
            <div class="charge chart-item">
                <div id="chargeChart"></div>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
    data(){
        return {
            // 看板items渲染数据以及获取数据
            dataList:[
                {label: '进出车辆总量', labelStr: 'total', icon:'./static/imgs/car.png', unit: '辆', herf:'inOut', expend: {inOut: 0}, display: true,point: true},
                {label: '进场车辆总量', labelStr: 'enter', icon:'./static/imgs/out.png', unit: '辆', herf:'inOut', expend: {inOut: 1}, display: true,point: true},
                {label: '出场车辆总量', labelStr: 'out', icon:'./static/imgs/out-yellow.png', unit: '辆', herf:'inOut', expend: {inOut: 2}, display: true,point: true},
                {label: '在场车辆总数', labelStr: 'curr', icon:'./static/imgs/parking-red.png', unit: '辆', herf:'inParking', display: 'hasParkingData',point: true},
                {label: '停车场总车位数', labelStr: 'parkPlaceNum', icon:'./static/imgs/parking.png', unit: '个', herf:'', display: true,point: false},
                {label: '剩余车位数', labelStr: 'leftPlaceNum', icon:'./static/imgs/parking-green.png', unit: '个', herf:'', display: true,point: false},
                {label: '收到停车费', labelStr: 'price', icon:'./static/imgs/money.png', unit: '元', herf:'charge', display: true,point: true},
            ],
            boardData: { 
                total: 0,
                price: 0,
                enter: 0,
                curr: 0,
                out: 0,
                parkPlaceNum: 0,
                leftPlaceNum: 0
            },

            // 时间类型控制器数据
            dateTypePopupCtl: false,
            dateTypeColumns:[{label:'今日',value:0},{label:'本月',value:1},{label:'本年',value:2},{label:'自定义',value:3}],
            dateTypeIndex: 0,
            
            // 时间选择器控制器数据
            displayStartDate: new Date(),
            startDate: dayjs(new Date()),

            displayEndDate: new Date(),
            endDate: dayjs(new Date()),

            startDatePopupCtl: false,
            endDatePopupCtl: false,
            // 用户类型图表数据  车辆进出用户类型统计
            carTypeData: {},
            // 收费用户类型图表数据  车辆进出收费用户类型统计
            carTypeData: {},
            // 车流量图表数据  车流实时趋势
            trafficFlowData: {},
            // 收费统计图表数据  停车场收费趋势
            chargeData: {},

            hasParkingData: true,
            
            timer: 0
        }
    },
    watch: {
        dateTypeIndex(val) {
            const self = this;
            switch (val) {
                case 0:
                    self.startDate = new Date()
                    self.endDate = new Date()
                    break;
                case 1:
                    self.startDate = dayjs(new Date()).startOf('month')
                    self.endDate = dayjs(new Date()).endOf('month')
                    break;
                case 2:
                    self.startDate = dayjs(new Date()).startOf('year')
                    self.endDate = dayjs(new Date()).endOf('year')
                    break;
            }
            
        }
    },
    components: {
       
    },
    mounted() {
        console.log('board mounted ----')
        const self = this;
        self.searchAllData()    
    },
    methods:{
        goBack() {
            window.location.href = "epipe://?&mark=history_back";
            localStorage.clear();
        },
        formatter(type, val) {
            if (type === 'year') {
                return `${val}年`;
            } else if (type === 'month') {
                return `${val}月`
            }
            return val;
        },
        setStartDate(value) {
            const self = this;
            // if(value > dayjs(self.endDate)) {
            //     // self.$message('开始时间不能大于结束时间')
            //     self.startDate  = dayjs(self.endDate);
            //     return
            // }
            self.startDate  = value
            self.dateTypeIndex = 3
        },
        setEndDate(value) {
            const self = this;
            // if(value < dayjs(self.startDate)) {
            //     // self.$message('结束时间不能小于开始时间')
            //     self.endDate  = dayjs(self.startDate);
            //     return
            // }
            self.endDate = value
            self.dateTypeIndex = 3

        },
        confirmDateType(value, index) {
            const self = this;
            if(index != 3 && index == self.dateTypeIndex) {
                self.dateTypePopupCtl = false
                return
            }
            self.dateTypeIndex = index;
            switch(index) {
                case 0: 
                case 4:
                    self.startDate = dayjs(new Date()).format('YYYY-MM-DD')
                    self.endDate = dayjs(new Date()).format('YYYY-MM-DD')
                    break;
                case 1:
                    self.startDate = dayjs(new Date()).format('YYYY/MM')
                    self.endDate = dayjs(new Date()).format('YYYY/MM')
                    break;
                case 2:
                    self.startDate = dayjs(new Date()).format('YYYY')
                    self.endDate = dayjs(new Date()).format('YYYY')
                    break;
            }
            self.searchAllData()
            self.dateTypePopupCtl = false
        },
        day(t) {
            // console.log(new Date(t))
            return new Date(t)
        },
        turnPage(item){
            const self = this;
            if(item.herf == '') return
            let startDate = dayjs(self.startDate).format('YYYY-MM-DD'),
                endDate = dayjs(self.endDate).format('YYYY-MM-DD');
            if(self.dateTypeIndex == 1) {
                startDate = dayjs(startDate).format('YYYY-MM-DD')
                endDate = dayjs(endDate).endOf('month').format('YYYY-MM-DD')
            }else if(self.dateTypeIndex == 2) {
                // item.herf=='/inParking'?'':self.$message('由于数据量过大，查询范围只能为30天');
                startDate = dayjs().startOf('month').format('YYYY-MM-DD')
                endDate = dayjs().endOf('month').format('YYYY-MM-DD')
            }else if(self.dateTypeIndex == 3 && Math.abs(dayjs(startDate).diff(dayjs(endDate),'day'))>30){
                startDate = dayjs(endDate).subtract(1,'month').format('YYYY-MM-DD')
                // endDate = dayjs().endOf('month').format('YYYY-MM-DD')
            }
            window.open(this.Service.baseUrl+item.herf+'?startDate='+startDate+'&endDate='+endDate+'&expend='+JSON.stringify(item.expend), "_blank");
        },
        searchAllData() {
            // console.warn('searchAllData')
            const self = this;
            self.requestGetBoard()
            self.requestGetUserTypeList()
            self.requestGetUserPriceList()
            self.requestGetCarFlowList()
            self.requestGetPriceFlowList()
        },
        formatDateParams() {
            let params = {}
            const self = this;
            if(dayjs(dayjs(self.startDate).format('YYYY-MM-DD'))>dayjs(dayjs(self.endDate).format('YYYY-MM-DD'))) {
                clearTimeout(self.timer)
                self.timer = setTimeout(()=> {
                    // self.$message('开始时间不能大于结束时间');
                    this.$message({
                        message: '开始时间不能大于结束时间',
                        type: 'warning'
                    });
                    self.startDate = self.endDate
                }, 100)

                return false
            }
            switch(self.dateTypeIndex) {
                case 0: 
                    params.startTime = dayjs(self.startDate).format('YYYY-MM-DD')
                    params.endTime = dayjs(self.endDate).format('YYYY-MM-DD')
                    break;
                case 1:
                    params.startTime = dayjs(self.startDate).format('YYYY-MM')
                    params.endTime = dayjs(self.endDate).format('YYYY-MM')
                    break;
                case 2:
                    params.startTime = dayjs(self.startDate).format('YYYY')
                    params.endTime = dayjs(self.endDate).format('YYYY')
                    break;
                case 3:
                    params.startTime = dayjs(self.startDate).format('YYYY-MM-DD')
                    params.endTime = dayjs(self.endDate).format('YYYY-MM-DD')
                    break;
            }
            return params
        }, 
        // 获取看板数据
        requestGetBoard() {
            const self = this;
            let params = self.formatDateParams()
            if(!params) {
                return
            }

            self.$api.getBoard(params).then(res => {
                console.log('getBoard:',res)
                if(res.h.code != 200) {
                    self.$message.error(res.h.msg)
                    return
                }
                self.boardData = res.b
                self.hasParkingData = (dayjs(self.startDate).format('YYYY-MM-DD')==dayjs(self.endDate).format('YYYY-MM-DD') && dayjs(self.startDate).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD'))
            })
        },
        // 车辆进出用户类型统计
        requestGetUserTypeList() {
            const self = this;
            let params = self.formatDateParams()
            if(!params) {
                return
            }
            self.$api.getUserTypeList(params).then(res => {
                console.log('getUserTypeList:',res)
                if(res.h.code != 200) {
                    self.$message.error(res.h.msg)
                    return
                }
                self.userTypeData = res.b

                self.renderUserTypeChart()
            })
        },
        renderUserTypeChart() {
            const self = this;

            var userTypeChart= echarts.init(document.getElementById('userTypeChart'));
            let xData = [], yData = []
            self.userTypeData.map(item => {
                xData.push({value: item.total, name: item.userType})
                yData.push(item.userType)
            })
            var option = {
                title: {
                    text: '车辆进出用户类型统计',
                    left: 'center',
                    textStyle: {
                        color: 'white',
                        lineHeight: 58
                    }
                },
                color: ['#767EFF', '#FEC400', '#F65B62', '#43E97D', '#B620E0'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'horizontal',
                    itemGap: 0,
                    left: 'center',
                    top: 58,
                    data: yData,
                    icon:'circle',
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: [
                    {
                        name: '进出用户',
                        type: 'pie',
                        radius: [0, '65%'],
                        left: 'center',
                        top: '20%',
                        height:'360',
                        width: '360',
                        label: {
                            formatter: '{b}\n({d}%)',
                            fontSize: 10
                        },
                        labelLine: {
                            show: true
                        },
                        data: xData
                    }
                ]
            }
            userTypeChart.setOption(option);
        },
        // 收费用户类型统计
        requestGetUserPriceList() {
            const self = this;
            let params = self.formatDateParams()
            if(!params) {
                return
            }
            self.$api.getUserPriceList(params).then(res => {
                console.log('getUserTypeList:',res)
                if(res.h.code != 200) {
                    self.$message.error(res.h.msg)
                    return
                }
                self.carTypeData = res.b

                self.renderCarTypeChart()
            })
        },
        renderCarTypeChart() {
            const self = this;

            var carTypeChart= echarts.init(document.getElementById('carTypeChart'));
            let xData = [], yData = []
            self.carTypeData.map(item => {
                xData.push({value: item.price, name: item.userType})
                yData.push(item.userType)
            })
            var option = {
                color: ['#767EFF', '#FEC400', '#F65B62', '#43E97D', '#B620E0'],
                title: {
                    text: '车辆收费用户类型统计',
                    left: 'center',
                    textStyle: {
                        color: 'white',
                        lineHeight: 58
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'horizontal',
                    itemGap: 0,
                    left: 'center',
                    top: 58,
                    data: yData,
                    icon:'circle',
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: [
                    {
                        name: '收费用户',
                        type: 'pie',
                        radius: [0, '65%'],
                        // top: '60',
                        left: 'center',
                        top: '20%',
                        height:'360',
                        width: '360',
                        label: {
                            formatter: '{b}\n({d}%)',
                            fontSize: 10
                        },
                        labelLine: {
                            show: true
                        },
                        data: xData
                    }
                ]
            }
            carTypeChart.setOption(option);
        },
        // 车流量统计
        requestGetCarFlowList() {
            const self = this;
            let params = self.formatDateParams()
            console.error(params)
            if(!params) {
                return
            }
            self.$api.getCarFlow(params).then(res => {
                console.log('getCarFlow:',res)
                if(res.h.code != 200) {
                    self.$message.error(res.h.msg)
                    return
                }
                self.trafficFlowData = res.b
                // self.trafficFlowData.map(item => {
                //     console.log(dayjs(item).hour())
                // })
                self.renderTrafficFlowChart()
            })
        },
        renderTrafficFlowChart() {
            const self = this;

            var trafficFlowChart= echarts.init(document.getElementById('trafficFlowChart'));
            let xData = [],
                yData = [{
                        name: '进出场车辆总数',
                        type: 'line',
                        areaStyle: {},
                        data: []
                    },
                    {
                        name: '进场车辆数',
                        type: 'line',
                        areaStyle: {},
                        data: []
                    },
                    {
                        name: '出场车辆数',
                        type: 'line',
                        areaStyle: {},
                        data: []
                    }]
                    console.warn(self.dateTypeIndex)
            self.trafficFlowData.map(item => {
                if(self.dateTypeIndex == 0 || (self.dateTypeIndex == 3 && dayjs(self.startDate).format('YYYY-MM-DD')==dayjs(self.endDate).format('YYYY-MM-DD'))) {
                    xData.push(dayjs(item.time).hour()+'点')
                } else if(self.dateTypeIndex == 1 || self.dateTypeIndex == 3){
                    xData.push(dayjs(item.time).format('D')+'号')
                } else {
                    xData.push(dayjs(item.time).format('M')+'月')
                }
                yData[0].data.push(item.totalCount)
                yData[1].data.push(item.enterCount)
                yData[2].data.push(item.outCount)
            })
            var option = {
                color: ['#767EFF', '#FEC400', '#F65B62', '#43E97D', '#B620E0'],
                title: {
                    text: '车流实时趋势',
                    left: 'center',
                    textStyle: {
                        color: 'white',
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    orient: 'horizontal',
                    itemGap: 5,
                    left: 'center',
                    top: 30,
                    itemWidth:40,
                    itemHeight: 6,
                    data: ['进出场车辆总数', '进场车辆数', '出场车辆数'],
                    icon:'roundRect',
                    textStyle: {
                        color: '#fff'
                    }
                },
                grid: {
                    top: '80',
                    left: '0%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        color: '#fff',
                        data: xData,
                        axisLabel:{
                            color: '#fff',
                            interval: 3,
                            showMaxLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel:{
                            color: '#fff',
                            formatter:'{value} 个'
                        }
                    }
                ],
                series: yData
            };

            trafficFlowChart.setOption(option);
        },
        // 收费统计
        requestGetPriceFlowList() {
            const self = this;
            let params = self.formatDateParams()
            if(!params) {
                return
            }
            self.$api.getPriceFlow(params).then(res => {
                console.log('getPriceFlow:',res)
                if(res.h.code != 200) {
                    self.$message.error(res.h.msg)
                    return
                }
                self.chargeData = res.b
                
                self.renderChargeChart()
            })
        },
        renderChargeChart() {
            const self = this;

            var chargeChart= echarts.init(document.getElementById('chargeChart'));
            let xData = [],
                yData = [{
                        name: '总收费',
                        type: 'line',
                        areaStyle: {},
                        data: []
                    },
                    {
                        name: '月卡收费',
                        type: 'line',
                        areaStyle: {},
                        data: []
                    },
                    {
                        name: '临时车收费',
                        type: 'line',
                        areaStyle: {},
                        data: []
                    }]
            self.chargeData.map(item => {
                if(self.dateTypeIndex == 0 || (self.dateTypeIndex == 3 && dayjs(self.startDate).format('YYYY-MM-DD')==dayjs(self.endDate).format('YYYY-MM-DD'))) {
                    xData.push(dayjs(item.time).hour()+'点')
                } else if(self.dateTypeIndex == 1 || self.dateTypeIndex == 3){
                    xData.push(dayjs(item.time).format('D')+'号')
                } else {
                    xData.push(dayjs(item.time).format('M')+'月')
                }
                yData[0].data.push(item.totalPrice)
                yData[1].data.push(item.vipPrice)
                yData[2].data.push(item.tempPrice)
            })
            var option = {
                color: ['#767EFF', '#FEC400', '#F65B62', '#43E97D', '#B620E0'],
                title: {
                    text: '停车场收费趋势',
                    left: 'center',
                    textStyle: {
                        color: 'white',
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    orient: 'horizontal',
                    itemGap: 10,
                    left: 'center',
                    top: 30,
                    itemWidth:40,
                    itemHeight: 6,
                    data: ['总收费', '月卡收费', '临时车收费'],
                    icon:'roundRect',
                    textStyle: {
                        color: '#fff'
                    }
                },
                grid: {
                    left: '5%',
                    right: '3%',
                    bottom: '3%',
                    top: '80',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        color: '#fff',
                        data: xData,
                        axisLabel:{
                            color: '#fff',
                            interval: 'auto',
                            interval: 3,
                            showMaxLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel:{
                            color: '#fff',
                            formatter:'{value} 元'
                        }
                    }
                ],
                series: yData
            };

            chargeChart.setOption(option);
        },
    }
}
</script>

<style lang="scss" scoped>
    .content-box{
        font-size: 14px;
        width:1080px;
        background:rgba(52,38,96,1);
        padding: 20px 39px 0 41px;
        box-sizing: border-box;
        .search{
            height:58px;
            background:rgba(29,35,50,1);
            border-radius:8px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 60px;
            .selects{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .type{
                    height: 31px;
                    width: 105px;
                    margin-right: 14px;
                }
                /deep/ .el-input__suffix{
                    top: 50%;
                    transform: translateY(-50%);
                    height: auto;
                }
                /deep/ .el-input__inner{
                    background: #131929;
                    color: #E6E7E9;
                    height: 31px;
                }
                .datepicker{
                    width: 150px;
                    margin-right: 14px;
                    /deep/ .el-input__icon{
                        line-height: 31px;
                    }
                }
                .double-line{
                    width: 18px;
                    height: 31px;
                    margin-right: 14px;
                    background: url(../assets/imgs/arrows.png) no-repeat center center;
                    background-size: 18px 15px;
                }
            }
            .btns{
                .search-btn{
                    background:linear-gradient(360deg,rgba(118,118,255,1) 0%,rgba(119,167,255,1) 100%);
                    padding: 7px 25px;
                }
            }
        }
        .datas{
            padding: 30px 0 10px 0;
            // box-sizing: border-box;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            .data-item{
                width:165px;
                height:68px;
                background:rgba(19,25,41,1);
                border-radius:8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                margin-right: 43px;
                box-sizing: border-box;
                padding-left: 12px;
                &.point{
                    cursor: pointer;
                }
                &:hover{
                    box-shadow: rgba(0,0,0,.4) 0 2px 10px 0px;
                    position: relative;
                    transition: all .3s;
                    top: -1px;
                }
                &.nomar{
                    margin-right: 0;
                    width: 164px;
                }
                .img{
                    width: 38px;
                    height: 38px;
                    >img{
                        height: 100%;
                        width: 100%;
                    }
                }
                .detail{
                    color: #A0A3A9;
                    flex: 1;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    padding-left: 10px;
                    .label{
                        height: 18px;
                        font-size:13px;
                        font-family:PingFangSC-Regular,PingFang SC;
                        font-weight:400;
                        line-height: 18px;
                    }
                    .num{
                        height:22px;
                        font-size:16px;
                        font-family:PingFang-SC-Bold,PingFang-SC;
                        font-weight:bold;
                        color:rgba(255,255,255,1);
                        line-height:22px;
                    }
                }
                
            }
        }
        .charts{
            box-sizing: border-box;
            padding: 0 50px;
            background:rgba(19,25,41,1);
            margin-bottom: 116px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .chart-item{
                width:calc(50%);
                overflow: hidden;
                margin: 0 0px 50px 0px;
                box-sizing: border-box;
             
                #userTypeChart{
                    width: 100%;
                    height: 411px;
                }
                #carTypeChart{
                    width: 100%;
                    height: 411px;
                }
                #trafficFlowChart{
                    width: 100%;
                    height: 364px;
                }
                #chargeChart{
                    width: 100%;
                    height: 364px;
                }
            }
        }
    }


</style>
