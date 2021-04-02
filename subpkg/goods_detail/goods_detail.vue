<template>
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(items , index) in goods_info.pics" :key="index">
        <image :src="items.pics_big"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费 -- {{cart.length}}</view>
    </view>
    <!-- 商品详情信息 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>
  </view>

</template>

<script>
  import {
    mapState
  } from 'vuex'

  import {
    mapMutations
  } from 'vuex'

  import {
    mapGetters
  } from 'vuex'
  export default {
    data() {
      return {
        // 商品详情对象
        goods_info: {},
        // 商品详情对象
        goods_info: {},
        // 左侧按钮组的配置对象
        options: [{
          icon: 'shop',
          text: '店铺'
        }, {
          icon: 'cart',
          text: '购物车',
          info: 2
        }],
        // 右侧按钮组的配置对象
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ],
      };
    },
    onLoad(options) {
      // 获取商品id
      const goods_id = options.goods_id
      // 调用请求商品详情数据的方法
      this.getGoodsDetail(goods_id)

    },
    methods: {
      // 因为是异步请求,所以要记得用async await 或者promise包起来,别每次都忘了
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ')
        this.goods_info = res.message
      },
      // 实现轮播图的预览效果
      preview(i) {
        // 调用 uni.previewImage() 方法预览图片
        uni.previewImage({
          // 预览时，默认显示图片的索引
          current: i,
          // 所有图片 url 地址的数组
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      onClick(e) {
        // 店铺 ,购物车
        if (e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        } else {

        }
      },
      buttonClick(e) {
        // 加入购物车 , 立即购买
        if (e.content.text === '加入购物车') {
          // 组织商品的信息对象
          // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
          const goods = {
            goods_id: this.goods_info.goods_id,
            goods_name: this.goods_info.goods_name,
            goods_price: this.goods_info.goods_price,
            goods_count: 1,
            goods_small_logo: this.goods_info.goods_small_logo,
            goods_state: true
          }
          // 调用 addToCart 方法
          this.addToCart(goods)
        } else {

        }
      },
      setBadge(){
        // 调用uni.setTabBarBadge()方法,为购物车设置右上角的徽标
        uni.setTabBarBadge({
          index:2,//索引
          text:this.total+''//注意：text的值必须是字符串，不能是数字。
        })
      }
    },
    computed: {
      // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
      // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
      ...mapState('m_cart', ['cart']),
      ...mapState('m_cart', ['addToCart'])
      ...mapState('m_cart', ['total'])
    },
    watch: {
      // 1.监听total值的变化,通过第一个形参得到变化后的新值
      total(newVal) {
        handler(newVal) {
          const findResult = this.potions.find((x) => x.text === '购物车')

          if (findResult) {
            findResult.info = newVal
          }
        },
        // imediate属性用来声明此监听器,是否在页面初次加载后立即调用
        immediate:true;
      },
    },
    onShow() {
      // 在页面刚展示的时候,设置数据徽标
      this.setBadge()
    }

  }
</script>

<style lang="scss">
  swiper {
    // 这个是rpx是以宽为单位,不是以高为单位，所以这个是的意思是一个屏幕高，750rpx是屏幕宽，和屏幕高没关系，别搞混了。
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  // 商品信息区域的样式
  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    .price {
      color: #c00000;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        padding-right: 10px;
      }

      // 收藏区域
      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }

    // 运费
    .yf {
      margin: 10px 0;
      font-size: 12px;
      color: gray;
    }
  }

  .goods_nav {
    // 为商品导航组件添加固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .goods-detail-container {
    // 给页面外层的容器，添加 50px 的内padding，
    // 防止页面内容被底部的商品导航组件遮盖
    padding-bottom: 50px;
  }
</style>
