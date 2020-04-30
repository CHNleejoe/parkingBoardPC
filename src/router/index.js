import Vue from 'vue'
import Router from 'vue-router'

const Home = () =>
    import ('../pages/home')
    // const Function = () =>
    //     import ('../pages/function.vue')
const Charge = () =>
    import ('../pages/charge.vue')
const InOut = () =>
    import ('../pages/inOut.vue')
const InParking = () =>
    import ('../pages/inParking.vue')
const User = () =>
    import ('../pages/user.vue')

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/charge', name: 'Charge', component: Charge, meta: { title: '停车收费查询' } }, // 停车收费列表
        { path: '/inOut', name: 'InOut', component: InOut, meta: { title: '车辆进出查询' } }, // 车辆进出明细
        { path: '/inParking', name: 'InParking', component: InParking, meta: { title: '在场车辆查询' } }, // 车辆进出明细
        { path: '/user', name: 'User', component: User, meta: { title: '会员车辆查询' } }, // 车辆进出明细
    ]
})