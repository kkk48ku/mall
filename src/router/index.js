import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../views/goodsList'
import Cart from './../views/Cart'
import VueLazyLoad from 'vue-lazyload'

Vue.use(Router);
Vue.use(VueLazyLoad, {
    loading: '/static/loading-svg/loading-bars.svg'
});

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'GoodsList',
            component: GoodsList
        },
        {
            path: '/cart',
            name: 'Cart',
            component: Cart
        }
    ]
})
