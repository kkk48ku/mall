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
                    <a href="javascript:void(0)" class="default cur">Default</a>
                    <a @click="sortGoods" href="javascript:void(0)" class="price">
                        Price
                        <svg class="icon icon-arrow-short">
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
                                            <a href="javascript:void(0)" class="btn btn--m">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag" @click="toggleFilterPop"></div>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
    // 导入样式文件只需要引入文件路径
    import '@/assets/css/base.css';
    import '@/assets/css/product.css';
    //引入头部组件 @直接引入src目录
    import NavHeader from '@/components/NavHeader.vue';
    import NavFooter from '@/components/NavFooter.vue';
    import NavBread from '@/components/NavBread.vue';
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
                        endPrice: 2000.00
                    }
                ]
            }
        },
        components: {
            NavHeader,
            NavFooter,
            NavBread,
        },
        mounted() {
            this.getGoodsList();
        },
        methods: {
            getGoodsList() {
                let params = {
                        page: this.page,
                        pageSize: this.pageSize,
                        //true取1false取-1
                        sort: this.sortFlag ? 1 : -1
                    }
                ;
                axios.get("/goods", {
                    params: params
                }).then((response) => {
                    const res = response.data;
                    if (res.status === '0') {
                        this.goodsList = res.result.list;
                    } else {
                        this.goodsList = [];
                    }
                })
            },
            sortGoods() {
                this.sortFlag = !this.sortFlag;
                this.page = 1;
                this.getGoodsList();
            },
            toggleFilterPop() {
                this.filterBy = !this.filterBy;
                this.overLayFlag = !this.overLayFlag;
            },
            setPriceFilter(index) {
                this.priceChecked = index;
                if (this.overLayFlag) return this.toggleFilterPop();
            },
            setPriceFilterAll() {
                this.priceChecked = 'all';
                if (this.overLayFlag) return this.toggleFilterPop();
            }
        }
    }
</script>
