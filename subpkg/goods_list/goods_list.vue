<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,index) in goodsList" :key="index" @click="gotoDetail(goods)">
        <my_goods :goods="goods"></my_goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数数据
        queryObj: {
          // 查询关键字
          query: '',
          // 商品分裂ID
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10,
        },
        // 商品列表的数据
        goodsList: [],
        // 总数量,用来实现分页
        total: 0,
        // 是否正在请求数据
        isloading: false
      };
    },
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    methods: {
      async getGoodsList(cb) {
        // ** 打开节流阀
        this.isloading = true
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj);
        // ** 关闭节流阀
        this.isloading = false
          // 只要数据请求完毕，就立即按需调用 cb 回调函数
          cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg();

        // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      // 前往商品详情页
      gotoDetail(){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    // 上拉加载数据
    onReachBottom() {
      // 判断是否还有下一页数据
        if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
        
      // 判断是否正在请求其它数据，如果是，则不发起额外的请求
      if (this.isloading) return
      
      this.queryObj.pagenum += 1;
      this.getGoodsList()
    },
    // 下拉刷新
    onPullDownRefresh() {
      // 1. 重置关键数据
        this.queryObj.pagenum = 1
        this.total = 0
        this.isloading = false
        this.goodsList = []
      
        // 2. 重新发起请求
        this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">

</style>
