// 菜单

<template>
  <Drawer placement="left" :closable="false" width="200" :scrollable="true" v-model="show">
    <Menu mode="vertical" theme="light" :accordion="true">
      <!-- <Submenu>
        <template slot="title">
          <Icon type="md-people"></Icon>
          用户管理
        </template>
        <MenuItem to="/user/manage">用户管理</MenuItem>
        <MenuItem to="/user/auth">权限管理</MenuItem>
      </Submenu> -->
      <Submenu v-for="(sub, name) in menus" :key="name" :name="name">
        <template slot="title">
          <Icon v-if="sub['icon']" :type="sub['icon']"></Icon>
          {{name}}
        </template>
        <MenuItem v-for="(path, key) in getSubItems(sub)" :key="key" :name="key" :to="path">
          {{key}}
        </MenuItem>
      </Submenu>
    </Menu>
  </Drawer>
</template>

<script>
export default {
  name: 'TopMenu',
  data() {
    return {
      show: false,
      menus: {
        '数据管理': {
          '数据列表': '/data/list',
          '数据查询': '/data/query',
          '数据管理': '/data/manage'
        },
        '车辆管理': {
          '监控': '/cars/monitor'
        },
        '任务调度': {
        },
        '采集策略管理': {
        },
        '场景管理': {
          '添加场景': '/scene/add'
        },
        '标签管理': {
        },
        '统计分析': {
        },
        'LogSim': {
          '任务列表': '/logsim/simtask',
          '仿真结果': '/logsim/simresult'
        },
        '权限管理': {
          icon: 'md-people'
        }
      }
    }
  },
  methods: {
    getSubItems(sub) {
      const r = {}
      for (const k in sub) {
        if (k === 'icon') {
          continue
        }
        r[k] = sub[k]
      }
      return r
    },
    getMenuName(routeName, menu) {
      if (!menu) {
        menu = this.menus
      }
      for (const k in menu) {
        const v = menu[k]
        if (typeof v === 'string') {
          if (v === routeName) {
            return k
          }
        } else if (typeof v === 'object') {
          const r = this.getMenuName(routeName, v)
          if (r) {
            return r
          }
        }
      }
      return null
    }
  }
}
</script>

<style lang="scss">
.ivu-drawer-mask {
  background-color: rgba(150,150,150,0.2);
}
.ivu-drawer-body {
  padding: 0;
}
</style>
