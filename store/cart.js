export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  // 模块的 mutations 方法
  mutations: {
    addToCart(state, goods) {
      // 根据提交的商品的Id,查询购物车中是否存在这件商品
      // 如果不存在,则 findResult 为 undefined ;否则为找到的商品信息对象
      // state:本地的state数据 ，goods:传递的商品信息。
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)

      if (!findResult) {
        // 如果购物车没有这件商品,则直接push
        state.cart.psh(goods)
      } else {
        // 如果购物车有这件商品,则直接自加
        findResult.goods_count += 1
      }
      // 通过commit方法,调用m_cart 命名空间下的saveToStorage方法
      this.commit('m_cart/saveToStorege')
    },
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      // 有对应的商品信息对象
      if (findResult) {
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      // 有对应的商品信息对象
      if (findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    // 根据 Id 从购物车中删除对应的商品信息
    removeGoodsById(state, goods_id) {
      // 调用数组的 filter 方法进行过滤
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    }
  }
  // 模块的 getters 属性
  getters: {
    // 统计购物车中的商品的总数量
    total(state) {
      let c = 0;
      //循环统计商品的数量，累加到变量c中
      state.cart.forEach(goods => c += goods.goods_count)
      return c
    }
  },
}
