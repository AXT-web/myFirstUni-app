<template>
  <view>
    <view class="cart-container" v-if="cart.length !== 0">
      <!-- 使用自定义的 address 组件 -->

      <!-- 购物车商品列表的标题区域 -->

      <!-- 商品列表区域 -->

      <!-- 结算区域 -->
      <my-settle></my-settle>
    </view>
    <!-- 空白购物车区域 -->
    <view class="empty-cart" v-else>
      <image src="/static/cart_empty@2x.png" class="empty-img"></image>
      <text class="tip-text">空空如也~</text>
    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  // 按需导入mapState这个辅助函数
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    // 将badgeMix 混入当前页面中使用
    mixins: [badgeMix],
    data() {
      return {
        options: [{
          text: '删除', //显示的文本内容
          style: {
            backgroundColor: '#C00000' //按钮背景颜色
          }
        }]
      };
    },
    computed: {
      // 将m_cart 模块中的数组cart数组映射到当前页面中使用
      ...mapState('m_cart', ['cart']),
    },
    //商品的勾选状态发生了变化
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      radioChangeHandler(e) {
        this.updateGoodsState(e) // 输出得到的数据 -> {goods_id: 395, goods_state: false}
      },
      numberChangeHandler(e) {
        this.updateGoodsCount(e)
      },
      // 点击了滑动操作按钮
      swipeActionClickHandler(goods) {
        this.removeGoodsById(goods.goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
  
    .empty-img {
      width: 90px;
      height: 90px;
    }
  
    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
