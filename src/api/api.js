import {
    get,
    post,
    postByJSON
} from './fetch'
import axios from "axios"
import { getPorts } from 'portfinder';


// axios.defaults.baseURL = 'http://139.9.1.59:8080/'; //59服务器
axios.defaults.baseURL = 'http://192.168.3.171:8680/'; //测试服务器
// axios.defaults.baseURL = 'http://192.168.3.194:8080/'; //本地

// axios.defaults.withCredentials = true
// axios.interceptors.request.use(
//     config => {
//         //   if (localStorage.JWT_TOKEN) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
//         //   }
//         config.headers.Cookie = `session_id=2abd5c587ae7c06b4b16c0d6420b33aefb590b36`;
//         return config;
//     },
//     err => {
//         return Promise.reject(err);
//     });

const article = {
    getBoard(param) { //获取看板数据
        return get('/parkapi/v1/park/getBoard', param)
    },
    getUserTypeList(param) { //车辆进出用户类型统计
        return get('/parkapi/v1/park/getUserTypeList', param)
    },
    getUserPriceList(param) { //收费用户类型统计
        return get('/parkapi/v1/park/getUserPriceList', param)
    },
    getCarFlow(param) { //车流量统计
        return get('/parkapi/v1/park/getCarFlow', param)
    },
    getPriceFlow(param) { //收费统计
        return get('/parkapi/v1/park/getPriceFlow', param)
    },
    getPriceDetails(param) { //停车收费明细
        return get('/parkapi/v1/park/info/getPriceDetails', param)
    },
    getParkingDetails(param) { //车辆进出明细
        return get('/parkapi/v1/park/info/getParkingDetails', param)
    },
    getParkingInDetails(param) { //车辆进出明细
        return get('/parkapi/v1/park/info/getParkingInDetails', param)
    },
    getUserList(param) { //车辆进出明细
        return get('/parkapi/v1/user/info/getUserList', param)
    }
}


export default article