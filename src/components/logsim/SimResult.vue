<template>
  <div>
    任务名称：
    <Input v-model="params.name" placeholder="Enter something..." clearable style="width: 200px" />
    算法版本:
    <!-- 选择的触发事件 -->
    <!-- <Select v-model="app_version" @on-change="onChangeDataType" style="width:130px"> -->
    <Select v-model="params.app_version" style="width:130px">
        <Option v-for="(v,k) of params.app_versions" :value="k" :key="k">{{ v }}</Option>
    </Select>
    车辆编号:
    <Select v-model="params.carid" style="width:130px">
        <!-- <Option value="全部" key="全部">全部</Option> -->
        <Option v-for="id of params.carids" :value="id" :key="id">{{ id }}</Option>
    </Select>
    数据时间:
    <DatePicker v-model="params.dataTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选中时间段" style="width: 280px"></DatePicker>
    <!-- 不选择查询条件不让查 -->
    <!-- <Button @click="onQuery" :disabled="!carid"> -->
    <Button @click="onQuery">
        <Icon type="md-search"/>
        查询
    </Button>
    <br/>
    <Row>
      <i-Col span="9">
        任务列表：
        <Table @on-row-click="showResult" :columns="columns" :data="datas" stripe border class="table" ></Table>
        <Page ref="page"
          :total="orgTasks.length"
          :page-size-opts="pageSizeOpt"
          @on-change="onChangePage"
          @on-page-size-change="onChangePage"
          show-sizer show-elevator show-total size="small" />
      </i-Col>
      <i-Col span="11" offset="2">
        <Echarts class="echarts" v-if="simResult === true" />
      </i-Col>
    </Row>
  </div>
</template>
<script>

import Ajax from '../../utils/ajax'
import DateFormat from 'date-format'
import Echarts from '../logsim/Echarts'

export default {
  name: 'SimResult',
  components: {
    Echarts
  },
  data () {
    var now = new Date()
    now.setSeconds(0)
    now.setMilliseconds(0)
    var begin = new Date(now)
    begin.setDate(begin.getDate() - 1)
    return {
      projects: {
        'AEB_log': 'AEB LogSim'
      },
      project: 'AEB_log',
      dataTime: [],
      orgTasks: [],
      pageSizeOpt: [10, 20, 50, 100],
      params: {
        // TODO: add requset params
        name: '',
        app_version: '',
        carid: '',
        dataTime: [begin, now]
      },
      datas: [],
      columns: [],
      simResult: false
    }
  },
  created() {
    this.onQuery()
  },
  methods: {
    async onQuery() {
      const r = await Ajax.get('/server/task/list', {
        params: {
          'project': this.project
        }
      })
      if (!r) {
        // console.error('网络错误, onChangeDataType:')
        return
      }
      if (r.code !== 0) {
        console.error(r)
        console.error(`${r.msg}`)
        return
      }
      if (!r.tasks) {
        this.orgTasks = []
      } else {
        this.orgTasks = r.tasks
      }
      this.onChangePage()
    },
    onChangePage() {
      // console.log('changePage', arguments, this.$refs.page)
      const page = this.$refs.page
      let idx, size
      if (page) {
        idx = page.currentPage - 1
        size = page.currentPageSize
      } else {
        idx = 0
        size = this.orgTasks.length
      }
      const datas = []
      const columns = [{
        title: '任务名称',
        key: 'name'
      }, {
        title: '算法版本',
        key: 'app_version'
      }, {
        title: '任务状态',
        key: 'state',
        align: 'center',
        width: '150',
        render: (h, parmas) => {
          switch (parmas.row.state) {
            case 'wait':
              return h('div', [
                h('Tag', {
                  props: {
                    color: '#c5c8ce'
                  }
                }, '等待')
              ])
            case 'run':
              return h('div', [
                h('Tag', {
                  props: {
                    color: '#2d8cf0'
                  }
                }, '运行中')
              ])
            case 'stop':
              return h('div', [
                h('Tag', {
                  props: {
                    color: '#ff9900'
                  }
                }, '停止')
              ])
            case 'fail':
              return h('div', [
                h('Tag', {
                  props: {
                    color: '#ed4014'
                  }
                }, '失败')
              ])
            case 'succ':
              return h('div', [
                h('Tag', {
                  props: {
                    color: '#19be6b'
                  }
                }, '成功')
              ])
          }
        }
      }
      ]
      for (let i = idx * size; i < (idx + 1) * size && i < this.orgTasks.length; i++) {
        const d = this.orgTasks[i]
        datas.push(d)
      }
      this.columns = columns
      this.datas = datas
      console.log(datas)
    },
    showResult() {
      this.simResult = true
      console.log('展示结果', this.simResult)
    },
    // 时间转换
    formatDate(us) {
      return DateFormat('yyyy-MM-dd hh:mm:ss', new Date(us / 1000))
    }
  },
  mounted() {
    // this.taskEcharts()
  }
}
</script>
<style lang="scss">
  .table {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
  }
</style>
