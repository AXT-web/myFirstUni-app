import {
  mapGetters
} from 'vuex'

export default {
  computed: {
    ...mapGetters('m_cart', ['total']),
  },
  watch: {
    // 监听total值的变化
    total() {
      // 调用methods 中的setBadge方法,重新为tabBar的数字徽章赋值
      this.setBadge()
    }
  },
  onShow() {
    // 页面刚展示时,设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
      // 调用uni.setTabBarBadge()方法,为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2, //索引
        text: this.total + '' //注意：text的值必须是字符串，不能是数字。
      })
    }
  },
}
