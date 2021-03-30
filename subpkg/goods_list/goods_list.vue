<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
  methods : {
    // 获取楼层列表数据
    async getFloorList() {
      const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
      if (res.meta.status !== 200) return uni.$showMsg()
    
      // 通过双层 forEach 循环，处理 URL 地址
      res.message.forEach(floor => {
        floor.product_list.forEach(prod => {
          prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
        })
      })
    
      this.floorList = res.message
    }
  }
</script>

<style lang="scss">

</style>
