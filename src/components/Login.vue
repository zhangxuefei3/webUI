// 空页面

<template>
    <Modal :value="!userInfo || !userInfo.fullname" :closable="false" :mask-closable="false" :width="360" :loading="true" >
      <Tabs v-model="type">
        <TabPane label="登录" name="login">
          <Row class="login-first-row">
              <i-col span="7" class="label">用户名</i-col>
              <i-col span="16"><Input type="text" v-model="username" placeholder="请输入用户名" /></i-col>
          </Row>
          <Row>
              <i-col span="7" class="label">密码</i-col>
              <i-col span="16"><Input type="password" v-model="password" placeholder="请输入登录密码" /></i-col>
          </Row>
        </TabPane>
        <TabPane label="注册" name="register">
          <Row>
              <i-col span="7" class="label">用户名</i-col>
              <i-col span="16"><Input type="text" v-model="username" placeholder="请输入用户名" /></i-col>
          </Row>
          <Row>
              <i-col span="7" class="label">密码</i-col>
              <i-col span="16"><Input type="password" v-model="password" placeholder="请输入登录密码" /></i-col>
          </Row>
          <Row>
              <i-col span="7" class="label">确认密码</i-col>
              <i-col span="16"><Input type="password" v-model="repassword" placeholder="请输入登录密码" /></i-col>
          </Row>
        </TabPane>
      </Tabs>
      <template slot="footer">
          <Button v-if="type=='login'" type="primary" size="large" long @click="login">登录</Button>
          <Button v-if="type=='register'" type="primary" size="large" long @click="register">注册</Button>
      </template>
    </Modal>
</template>

<script>
import Auth from '../utils/auth'

export default {
  name: 'Login',
  data() {
    return {
      type: 'login',
      username: '',
      password: '',
      repassword: ''
    }
  },
  methods: {
    async login() {
      if (!this.username) {
        this.$Message.error('用户名不能为空')
        return
      }
      console.log('btn login')
      const info = await Auth.login(this.username, this.password)
      console.log('login ret:', info)
      if (!info) {
        this.$Message.error('登录失败')
      } else if (typeof info === 'string') {
        this.$Message.error(info)
      } else {
        this.$root.getApp().userInfo = info
      }
    },
    async register() {
      console.log('btn register')
      if (!this.username) {
        this.$Message.error('用户名不能为空')
        return
      }
      if (!this.password) {
        this.$Message.error('密码不能为空')
        return
      }
      if (this.password !== this.repassword) {
        this.$Message.error('两次输入的密码不一致')
        return
      }
      const info = await Auth.register(this.username, this.password)
      if (!info) {
        this.$Message.error('登录失败')
      } else if (typeof info === 'string') {
        this.$Message.error(info)
      } else {
        this.$root.getApp().userInfo = info
      }
    }
  },
  computed: {
    userInfo: function() {
      return this.$root.getApp().userInfo
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
.label {
  text-align: right;
  vertical-align: middle;
  line-height: 30px;
  padding-right: 20px;
}
.ivu-row {
  margin: 20px;
}
.ivu-tabs-tab {
  font-weight: 500;
}
.login-first-row {
  margin-top: 50px;
}
</style>
