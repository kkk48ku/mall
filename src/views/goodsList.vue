<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span slot="goods">Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)"
                       class="default"
                       :class="{'cur':defaultActive}"
                       @click="sortDefault()">
                        Default
                    </a>
                    <a @click="sortGoods" href="javascript:void(0)" class="price" :class="{'cur':active}">
                        Price
                        <svg class="icon icon-arrow-short" :class="{'sort-up':!sortFlag}">
                            <use xlink:href="#icon-arrow-short"></use>
                        </svg>
                    </a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click="toggleFilterPop">
                        Filter by
                    </a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd>
                                <a href="javascript:void(0)" :class="{'cur': priceChecked === 'all'}"
                                   @click="setPriceFilterAll()">
                                    All
                                </a>
                            </dd>
                            <dd v-for="(price, index) in priceFilter">
                                <a href="javascript:void(0)" @click="setPriceFilter(index)"
                                   :class="{'cur': priceChecked === index}">
                                    {{price.startPrice}} - {{price.endPrice}}
                                </a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="goods in goodsList">
                                    <div class="pic">
                                        <a href="javascript:void(0)">
                                            <img v-lazy="'/static/' + goods.productImage"
                                                 :key="'/static/' + goods.productImage">
                                        </a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{goods.productName}}</div>
                                        <div class="price">¥：{{goods.salePrice}}元</div>
                                        <div class="btn-area">
                                            <a href="javascript:void(0)"
                                               class="btn btn--m"
                                               @click="addCart(goods.productId)">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <!--分页功能-->
                            <div class="load-more"
                                 v-infinite-scroll="loadMore"
                                 infinite-scroll-disabled="busy"
                                 infinite-scroll-distance="30">
                                <img v-show="loading" src="./../assets/loading-spinning-bubbles.svg">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag" @click="toggleFilterPop"></div>
        <nav-footer></nav-footer>
        <modal v-bind:mdShow="mdShow" @close="closeModal()">
            <p slot="message">
                请先登录，否则无法加入到购物车中!
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShow = false">关闭</a>
            </div>
        </modal>
        <modal v-bind:mdShow="mdShowCart" @close="closeModal()">
            <p slot="message">
                <svg class="icon-status-ok">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                <span>加入购物车成功！</span>
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShowCart = false">继续购物</a>
                <router-link href="javascript:;" class="btn btn--m" to="/cart">查看购物车</router-link>
            </div>
        </modal>

    </div>
</template>

<style scoped>
    .load-more {
        height: 100px;
        line-height: 100px;
        text-align: center;
        color: #000;
    }

    .price:hover .icon-arrow-short {
        background: url("../../static/active-down.svg");
        position: absolute;
        width: 20px;
        height: 20px;
        background-size: cover;
        line-height: 55px;
        transition: all .3s ease-out;
        left: 34px;
    }

    .sort-up {
        transform: rotate(180deg);
        transition: all .3s ease-out;
    }

    .cur .icon-arrow-short {
        background: url("../../static/active-down.svg");
        position: absolute;
        width: 20px;
        height: 20px;
        background-size: cover;
        line-height: 55px;
        transition: all .3s ease-out;
        left: 34px;
    }

    @media screen and (max-width: 767px) {
        .icon-arrow-short {
            position: absolute;
            left: 35px;
            top: 16px;
        }
    }

</style>
<script>
    // 导入样式文件只需要引入文件路径
    import '@/assets/css/base.css';
    import '@/assets/css/product.css';
    //引入头部组件 @直接引入src目录
    import NavHeader from '@/components/NavHeader.vue';
    import NavFooter from '@/components/NavFooter.vue';
    import NavBread from '@/components/NavBread.vue';
    import Modal from '@/components/Modal.vue';
    import axios from 'axios';

    export default {
        name: "goodsList",
        data() {
            return {
                goodsList: [],
                priceChecked: 'all',
                filterBy: false,
                overLayFlag: false,
                sortFlag: true,
                page: 1,
                pageSize: 8,
                busy: true,
                loading: false,
                defaultActive: true,
                active: false,
                mdShow: false,
                mdShowCart:false,
                priceFilter: [
                    {
                        startPrice: 0.00,
                        endPrice: 500.00
                    },
                    {
                        startPrice: 500.00,
                        endPrice: 1000.00
                    },
                    {
                        startPrice: 1000.00,
                        endPrice: 1500.00
                    },
                    {
                        startPrice: 1500.00,
                        endPrice: 5000.00
                    }
                ]
            }
        },
        components: {
            NavHeader,
            NavFooter,
            NavBread,
            Modal
        },
        mounted() {
            this.getGoodsList();
        },
        methods: {
            getGoodsList(flag) {
                //传参到后台
                let params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    //true取1false取-1
                    sort: this.sortFlag ? 1 : -1,
                    priceLevel: this.priceChecked,
                };
                this.loading = true;
                axios.get("/goods", {
                    params: params
                }).then((response) => {
                    const res = response.data;
                    this.loading = true;
                    if (res.status === '0') {
                        if (flag) {
                            this.goodsList = this.goodsList.concat(res.result.list);
                            this.busy = res.result.count === 0;
                            if (this.goodsList.length < (this.page * this.pageSize)) {
                                this.busy = true;
                                this.loading = false;
                            }
                        } else {
                            this.goodsList = res.result.list;
                            this.busy = false;
                        }
                    } else {
                        this.goodsList = [];
                    }
                })
            },
            sortDefault() {
                this.defaultActive = true;
                this.page = 1;
                this.sortFlag = true;
                this.active = false;
                this.getGoodsList();
            },
            sortGoods() {
                this.sortFlag = !this.sortFlag;
                this.page = 1;
                this.getGoodsList();
                this.active = true;
                this.defaultActive = false;
            },
            toggleFilterPop() {
                this.filterBy = !this.filterBy;
                this.overLayFlag = !this.overLayFlag;
            },
            setPriceFilter(index) {
                this.priceChecked = index;
                this.merge();
            },
            setPriceFilterAll() {
                this.priceChecked = 'all';
                this.merge();
            },
            merge() {
                if (this.overLayFlag) return this.toggleFilterPop();
                this.page = 1;
                this.getGoodsList();
            },
            loadMore() {
                this.busy = true;
                setTimeout(() => {
                    for (let i = 0, j = 1; i < j; i++) {
                        this.page++;
                        this.getGoodsList(true);
                    }
                }, 500);
            },
            addCart(productId) {
                axios.post("/goods/addCart", {
                    productId: productId
                }).then((response) => {
                    let res = response.data;
                    if (res.status === "0") {
                        this.mdShowCart = true;
                    } else {
                        this.mdShow = true;
                    }
                })
            },
            closeModal() {
                this.mdShow = false;
                this.mdShowCart = false;
            }
        }
    }
</script>
