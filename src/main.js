// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './until/currency';

Vue.config.productionTip = false;
Vue.use(infiniteScroll);
// 使用全局金额过滤器
Vue.filter("currency",currency);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
