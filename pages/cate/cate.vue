<template>
  <view>
      <view class="scroll-view-container">
        <!-- 左侧的滚动视图区域 -->
        <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
          <!-- 在这里有个一个小细节，在v-for中，key值必须设唯一，但是如果使用索引为key值，进行添加删除第一个的时候，他并不是删除第一个节点，而是删除相同值的最后面的节点，所以当有添加删除固定位置的节点时，不推荐使用index作为key值，其他情况无所谓。 -->
          <block v-for="(items , index) in cateList" :key="index">
            <view :class="['left-scroll-view-item', index === active ? 'active' : '']" @click="activeChanged(index)">{{items.cat_name}}</view>
          </block>
        </scroll-view>
        <!-- 右侧的滚动视图区域 -->
        <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
          <view class="cate-lv2-title" v-for="(items2,index2) in cateList2" :key="index2">
            <view class="left-scroll-view-item" >{{items2.cat_name}}</view>
            <!-- 动态渲染三级分类的列表数据 -->
            <view class="cate-lv3-list">
              <!-- 三级分类 Item 项 -->
              <view class="cate-lv3-item" v-for="(items3, index3) in items2.children" :key="index3" @click="gotoGoodsList(items3)">
                <image :src="items3.cat_icon"></image>
                <text>{{items3.cat_name}}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
			  wh: 0,
        // 分类数据列表
        cateList: [],
        // 当前选中项的索引,默认选中第一个
        active : 0,
        // 二级分类数据列表
        cateList2:[],
        // 滚动条距离顶部的距离
        scrollTop : 0,
      };
    },
    onLoad() {
      // 异步获取系统的信息
      this.getCateList();
      const sysInfo = uni.getSystemInfoSync()
      // 为wh窗口可用高度动态赋值
      this.wh = sysInfo.windowHeight
    },
    methods : {
      // 获取一级分页的数据
      async getCateList(){
        const { data: res } = await uni.$http.get('/api/public/v1/categories')
        if(res.meta.status !==200){
          uni.$showMsg()
        }
        // 获取一级分页的数据
        this.cateList = res.message
        // 获取二级分页的数据
        this.cateList2 = res.message[0].children

      },
      activeChanged(index){
        this.active = index;
        this.cateList2 = this.cateList[index].children
        
        // 让scrollTop 的值在0和1之间切换
        this.scrollTop=this.scrollTop === 0 ? 1 : 0
        
        // 可以简化为以下代码
        // this.scrollTop =this.scrollTop ? 0 : 1
      },
      // 点击三级分类项跳转到商品列表页面
      gotoGoodsList(item3) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      }
    },
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;
  
    .left-scroll-view {
      width: 120px;
  
      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;
  
        // 激活项的样式
        &.active {
          background-color: #ffffff;
          position: relative;
  
          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;
  
    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
  
      image {
        width: 60px;
        height: 60px;
      }
  
      text {
        font-size: 12px;
      }
    }
  }
</style>
