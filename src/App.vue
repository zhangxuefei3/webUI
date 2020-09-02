// 页面整体布局

<template>
  <div id="app">
    <Layout>
      <Header>
        <TopBar></TopBar>
      </Header>
      <Content>
        <router-view></router-view>
      </Content>
    </Layout>
    <TopMenu ref="topMenu"></TopMenu>
    <Login v-if="false"></Login>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import TopMenu from './components/TopMenu.vue'
import Login from './components/Login.vue'
import Auth from './utils/auth'

export default {
  name: 'App',
  components: {
    TopBar,
    TopMenu,
    Login
  },
  async beforeCreate() {
    const info = await Auth.getUserInfo()
    this.$root.getApp().userInfo = info
  },
  data() {
    return {
      userInfo: {}
    }
  },
  methods: {
    test() {
      console.log(this)
    }
  }
}
</script>

<style lang="scss">
.ivu-layout-header {
  height: 48px;
  line-height: 48px;
  padding: 0;
}
.ivu-layout-content {
  padding: 10px;
}
</style>
