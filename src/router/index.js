import Vue from 'vue'
import Router from 'vue-router'

const Home = () =>
    import ('../pages/home')
    // const Function = () =>
    //     import ('../pages/function.vue')
    // const Charge = () =>
    //     import ('../pages/charge.vue')
    // const InOut = () =>
    //     import ('../pages/inOut.vue')
    // const InParking = () =>
    //     import ('../pages/inParking.vue')
    // const User = () =>
    //     import ('../pages/user.vue')

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', name: 'Home', component: Home, meta: { keepAlive: true } },
        // { path: '/function', name: 'Function', component: Function, meta: { keepAlive: true } }, //人力资源总表
        // { path: '/charge', name: 'Charge', component: Charge, meta: { keepAlive: false } }, // 停车收费列表
        // { path: '/inOut', name: 'InOut', component: InOut, meta: { keepAlive: false } }, // 车辆进出明细
        // { path: '/inParking', name: 'InParking', component: InParking, meta: { keepAlive: false } }, // 车辆进出明细
        // { path: '/user', name: 'User', component: User, meta: { keepAlive: false } }, // 车辆进出明细
    ]
})