<template>
    <div>
        <div class="content-box">
            <div class="search">
                <div class="selects">
                    <el-input class="search-input" v-model="key" placeholder="请输入车牌号或公司名称" @focus="addSearch" @blur="removeSearch">
                        <div class="search-icon" slot="suffix" @click="onRefresh(1)"></div>
                    </el-input>
                </div>
                <div class="btns">
                    <el-button class="search-btn" type="primary" @click="onRefresh(1)">查询</el-button>
                    <el-button class="pull-btn" type="primary" @click="exportExcel">导出</el-button>
                </div>
            </div>
            <div class="datas">
                <div class="title">在场车辆查询</div>
                <div class="table-box">
                     <el-table
                        :data="listData"
                        style="width: 100%">
                        <div class="no-data" slot="empty">
                            <img src="../assets/imgs/Artwork@2x.png" alt="">
                        </div>
                        <el-table-column
                            prop="carNo"
                            label="车牌号"
                            >
                            <template slot-scope="{row}">
                                {{ row.carNo || '/' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="userType"
                            label="用户类型"
                            >
                            <template slot-scope="{row}">
                                {{ row.userType || '/' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="userName"
                            label="用户名称">
                            <template slot-scope="{row}">
                                {{ row.userName || '/' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="telephoneNum"
                            label="联系电话">
                            <template slot-scope="{row}">
                                {{ row.telephoneNum || '/' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="companyName"
                            label="公司名称">
                            <template slot-scope="{row}">
                                {{ row.companyName || '/' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="enterTime"
                            label="进场时间">
                            <template slot-scope="{row}">
                                {{ row.enterTime || '/' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="outTime"
                            label="出场时间">
                            <template slot-scope="{row}">
                                {{ row.outTime || '/'}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination" v-show="totalItems != 0">
                        <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change='onRefresh'
                        :current-page='pageNo'
                        :total="totalItems">
                        </el-pagination>
                    </div>
                </div>
            </div>

        </div>
        
    </div>
</template>

<script>
import dayjs from 'dayjs';
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
    data(){
        return {
            name: 'charge',
            // 车子类型选择器
            carTypePopupCtl: false,
            carTypeColumns:[{label:'全部车',value:''},{label:'月卡车',value:1},{label:'临时车',value:2}],
            
            carTypeIndex: '',

            // 时间选择器控制器数据
            displayStartDate: new Date(),
            startDate: dayjs(new Date()).format('YYYY-MM-DD'),

            displayEndDate: new Date(),
            endDate: dayjs(new Date()).format('YYYY-MM-DD'),

            startDatePopupCtl: false,
            endDatePopupCtl: false,

            // 分页数据
            pageNo: 1,
            pageSize: 10,

            // keyword
            key: '',

            // list
            listData: [],
            totalItems: 100,

            // 自动加载及刷新数据
            loading: false,
            finished: false,
            refreshing: false,

        }
    },
    watch: {
        
    },
    components: {
        
    },
    mounted() {
        const self = this;
        // console.log(self.$route.query)
        // if(self.$route.query) {
        //     self.startDate = self.$route.query.startDate,
        //     self.endDate = self.$route.query.endDate,
        //     // self.carTypeIndex = JSON.parse(self.$route.query.expend).inOut
        //     // console.log(dayjs(self.startDate,self.endDate))
        //     Math.abs(dayjs(self.startDate).diff(dayjs(self.endDate),'day'))>=30?self.$message('由于数据量过大，查询范围只能为30天'):''
        // }
        self.onRefresh(1)
    },
    methods:{
        addSearch() {
            const self = this
            document.body.addEventListener('keydown', self.keydown, false)
        },
        removeSearch() {
            const self = this
            document.body.removeEventListener('keydown', self.keydown, false)
        },
        keydown(e) {
            const self = this
            var ev = document.all ? window.event : e;
            if(ev.keyCode==13) {
                self.onRefresh(1)
                return false;
            }
        },
        day(t) {
            // console.log(new Date(t))
            return new Date(t)
        },
        // 导出表格
        exportExcel () {
            var filename = "在场车辆信息.xlsx";
            // 数据格式
            var data = []
            const self = this;

            let params = {
                pageNo: 1,
                pageSize: 0,
                key: self.key,
            }

            self.$api.getParkingInDetails(params).then(res => {
                
                if(res.h.code != 200) {
                    self.$message.error(res.h.msg)
                    return
                }
                if(!res.b.listData) {
                    self.$message.error('该搜索条件下无数据，无法导出')
                    return
                }
                let listData = res.b.dataList

                // 数据格式处理
                data = [['车牌号', '用户类型', '用户名称', '联系电话', '公司名称', '进场时间', '出场时间']]
                let dataItem = []
                listData.map(item => {
                    dataItem = [item.carNo, item.userType, item.userName, item.telephoneNum, item.companyName, item.enterTime, item.outTime]
                    data.push(dataItem)
                })

                // 创建工作簿和工作表
                var wb = XLSX.utils.book_new(), // 工作簿，即一个Excel文件
                    ws = XLSX.utils.aoa_to_sheet(data); // 工作表，即Excel内部的工作表
                
                // "SheetJS" 为工作表名称，即Excel文件中工作表
                // XLSX.utils.book_append_sheet(wb, ws, "在场车辆信息");
                XLSX.utils.book_append_sheet(wb, ws, "搜索条件为" + self.key);

            
                // 写出Excel工作簿
                XLSX.writeFile(wb, filename);

            })
        },
        turnPage(url){
            const self = this;
            if(url == '') return
            self.$router.push({ path: url, query: { startDate: self.startDate, endDate: self.endDate } });
        },
        confirmCarType(value, index) {
            const self = this;
            
            self.carTypeIndex = index;
            self.onRefresh()
            self.carTypePopupCtl = false
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
        requestData() {
            const self = this;

            let params = {
                pageNo: self.pageNo,
                pageSize: self.pageSize,
                key: self.key,
                // userType: self.carTypeIndex,
                // startTime: dayjs(self.startDate).format('YYYY-MM-DD'),
                // endTime: dayjs(self.endDate).format('YYYY-MM-DD'),
            }

            self.$api.getParkingInDetails(params).then(res => {
                
                if(res.h.code != 200) {
                    self.$message.error(res.h.msg)
                    return
                }

                self.totalItems = res.b.totalItems
                self.listData = res.b.dataList

                // if (self.pageNo >= res.b.totalItems) {
                //     self.finished = true;
                // }
            })
        },
        onRefresh(val) {
            const self = this;

            self.pageNo = val
            console.log(self.pageNo)

            this.requestData();
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
            background:#131929;
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
                .search-input{
                    width: 337px;
                    margin-right: 14px;
                    .search-icon{
                        width:39px;
                        height:31px;
                        border-top-right-radius: 3px;
                        border-bottom-right-radius: 3px;
                        position: absolute;
                        right: -5px;
                        top: -15px;
                        box-sizing: border-box;
                        border: 1px solid;
                        border-left: 0;
                        background:linear-gradient(360deg,rgba(118,118,255,1) 0%,rgba(119,167,255,1) 100%);
                        cursor: pointer;
                        transition: all .2s;
                        &:hover{
                            opacity: .9;
                        }
                        &::after{
                            content: '';
                            position: absolute;
                            height: 100%;
                            width: 100%;
                            top: 0;
                            left: 0;
                            background: url(../assets/imgs/search.png) no-repeat center center;

                        }
                    }
                }
                .type{
                    height: 31px;
                    width: 90px;
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
                    width: 140px;
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
                .pull-btn{
                    padding: 7px 25px;
                    background:linear-gradient(270deg,rgba(83,231,200,1) 0%,rgba(41,203,151,1) 100%);
                }
            }
        }
        .datas{
            margin-top: 10px;
            width: 100%;
            overflow: hidden;
            .title{
                height:28px;
                font-size:20px;
                font-family:PingFangSC-Medium,PingFang SC;
                font-weight:500;
                color:rgba(255,255,255,1);
                line-height:28px;
                margin: 10px 0;
                box-sizing: border-box;
                padding-left: 10px;
                position: relative;
                &::after{
                    content: '';
                    background: url(../assets/imgs/line.png) no-repeat center center;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    position: absolute;
                    width: 4px;
                    height:23px;
                }
            }
            .table-box{
                background: #131929;
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 40px;
                padding: 0 20px;
                position: relative;
                &::before{
                    content: '';
                    height: 61px;
                    width: 100%;
                    background:linear-gradient(360deg,rgba(118,118,255,1) 0%,rgba(119,167,255,1) 100%);
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-bottom: 1px solid #EBEEF5;
                }
                /deep/ .el-table{
                    &::before{
                        height: 0;
                    }
                }
                /deep/ .el-table th {
                    padding: 19px 0;
                }
                /deep/ .el-table__header{
                    thead th{
                        color: #FFFFFF;
                        background:linear-gradient(360deg,rgba(118,118,255,1) 0%,rgba(119,167,255,1) 100%);
                    }
                }
                /deep/ .el-table__empty-block{
                    background: #131929;

                }
                /deep/ .el-table th.is-leaf {
                    border-bottom: 0;
                }
                /deep/ .el-table__row{
                    td{
                        color: #C6C7CB;
                        background: #131929;
                        border-bottom-style: dashed;
                        border-color: #aaa;
                        border-width: 1px;
                        font-size:13px;
                        font-family:SourceHanSansCN-Regular,SourceHanSansCN;
                        font-weight:400;
                    }
                }
                /deep/ .el-table__header-wrapper{
                    box-sizing: border-box;
                    background:linear-gradient(360deg,rgba(118,118,255,1) 0%,rgba(119,167,255,1) 100%);
                    border-bottom: 1px solid #EBEEF5;
                }
            }
        }
        .pagination{
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 30px 0 18px 0;
        }
    }
</style>
