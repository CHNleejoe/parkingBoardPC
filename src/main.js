// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import api from './api/api'
// import './assets/js/rem'
import Service from './assets/js/Service'
Vue.prototype.Service = Service;

// 引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import './api/fetch'
Vue.prototype.$axios = axios;
Vue.prototype.$api = api;

// axios.defaults.baseURL = '/parkapi'
import './assets/css/reset.css'
import './assets/css/pulic.css'

// import 'vant/lib/index.css';
// import { Collapse, CollapseItem, Popup, Tabbar, TabbarItem, RadioGroup, Radio, Picker, Progress, Search, ActionSheet, Tab, Tabs, Dialog, Field, PullRefresh, List, Loading, Toast, Step, Steps, Cell, CellGroup, DatetimePicker, Checkbox, CheckboxGroup, Divider, Icon, Uploader, Overlay, Swipe, SwipeItem, NavBar, Grid, GridItem } from 'vant';
// Vue.use(Collapse).use(CollapseItem).use(Tabbar).use(TabbarItem).use(Popup).use(RadioGroup).use(Radio).use(Picker).use(Progress).use(Search).use(ActionSheet).use(Tab).use(Tabs).use(Dialog).use(Field).use(PullRefresh).use(List).use(Loading).use(Grid).use(GridItem)
// .use(Toast).use(Step).use(Steps).use(Cell).use(CellGroup).use(DatetimePicker).use(Checkbox).use(CheckboxGroup).use(Divider).use(Icon).use(Uploader).use(Overlay).use(Swipe).use(SwipeItem).use(NavBar);
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
        /* 路由发生变化修改页面title */
        if (to.meta.title) {
            document.title = to.meta.title
        }
        next()
    })
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})