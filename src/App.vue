<template>
  <div id="app">
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <!-- <van-tabbar route v-show="hasFooter" v-model="active" active-color='#7687FF' inactive-color='#999999'>
      <van-tabbar-item replace to="/">
        <span>看板</span>
        <template #icon="props">
          <img :src="props.active ? iconBoard.active : iconBoard.inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/function">
        <span>功能</span>
        <template #icon="props">
          <img :src="props.active ? iconFunction.active : iconFunction.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      active: 0,
      iconBoard: {
        active: './static/imgs/board-active.png',
        inactive: './static/imgs/board.png',
      },
      iconFunction: {
        active: './static/imgs/function-active.png',
        inactive: './static/imgs/function.png',
      },
      hasFooter: true
    };
  },
  watch: {
    $route(to,from){
      if(to.path == '/' || to.path == '/function') this.hasFooter = true
      else this.hasFooter = false
    }
  }
}
</script>

<style lang='scss' scoped>
  /deep/ .van-tabbar{
    background-color: #131929;
    z-index: 9999999;
    &::after{
      border-width: 0;
    }
  }
  /deep/ .el-table__empty-text {
    width: 100%;
  }
  #app{
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
</style>
