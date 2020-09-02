// 页面最上面一条

<template>
  <div class="hm-header">
    <Button type="text" @click="onTopMenu"><Icon type="md-options" :size="24" /></Button>
    <span class="title">毫末智行</span>
    <span class="btns">
      <span class="name">{{username}}</span>
      <Dropdown trigger="click">
        <Button class="circle" shape="circle"><Icon type="md-person" :size="24" /></Button>
        <DropdownMenu slot="list" style="padding:0 20px 0 0">
          <DropdownItem style="padding:0">
            <Button type="text" size="small" long @click="logout">退出</Button>
          </DropdownItem>
          <DropdownItem style="padding:0">
            <Button type="text" size="small" long @click="changePassword">修改密码</Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </span>
  </div>
</template>

<script>
import Auth from '../utils/auth'

export default {
  name: 'TopBar',
  data() {
    return {}
  },
  computed: {
    username: function() {
      const r = this.$root
      const app = r.getApp()
      const info = app.userInfo
      const name = info.fullname
      return name
    }
  },
  methods: {
    onTopMenu() {
      const app = this.$root.getApp()
      if (!app) {
        console.log('can not find root app')
        return
      }
      const menu = app.$refs.topMenu
      if (!menu) {
        console.log('can not find menu')
      }
      menu.show = !menu.show
      console.log(menu)
    },
    logout() {
      const app = this.$root.getApp()
      if (app) {
        app.userInfo = {}
      }
      Auth.logout()
    },
    changePassword() {
    }
  }
}
</script>

<style lang="scss">
.hm-header {
  color: #000;
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  height: 48px;
  .ivu-btn {
    padding: 0;
  }
  .btns {
    float: right;
    .name {
      margin-left: 10px;
      margin-right: 10px;
      font-family: 楷体;
      font-weight: 200;
      font-size: 22px;
    }
  }
  .title {
    margin-left: 20px;
    margin-right: 20px;
    font-family: 黑体;
    font-weight: 400;
    font-size: 26px;
  }
  .ivu-btn.circle {
    width: 32px;
    height: 32px;
    padding: 0;
    margin-top: -10px;
  }
}
</style>
