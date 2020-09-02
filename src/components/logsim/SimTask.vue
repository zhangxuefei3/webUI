<template>
  <div id="task_list">
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
    <Row :gutter="10">
      <i-Col span="3">
        <div>
          <Button @click="onAddTask">新增任务</Button>
          <Modal
            title="新增任务"
            v-model="addTaskModal"
            class-name="vertical-center-modal"
            :mask-closable="false">
            <Form ref="taskForm" :model="taskForm" :label-width="88">
              <FormItem label="任务名称" prop="name">
                <Input v-model="taskForm.name" placeholder="Enter taskName"/>
              </FormItem>
              <FormItem label="算法版本" prop="app_version">
                <Select v-model="taskForm.app_version" placeholder="Select your version">
                    <Option
                      v-for="(v,k) in app_versions"
                      :value="v"
                      :key="k"
                    >{{ v }}</Option>
                </Select>
              </FormItem>
              <FormItem label="数据段选择" prop="dataTime">
                <DatePicker
                  v-model="dataTime"
                  type="datetimerange" format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选中时间段"
                  style="width: 350px"
                  @on-change="dateChange(dataTime)"></DatePicker>
              </FormItem>
              <FormItem label="车辆ID" prop="carid">
                <Select v-model="taskForm.carid" placeholder="Select your version">
                    <Option
                      v-for="(v,k) in carids"
                      :value="v"
                      :key="k"
                    >{{ v }}</Option>
                </Select>
              </FormItem>
              <FormItem label="CPU数量" prop="cpu_num">
                <Input v-model.number="taskForm.cpu_num" placeholder="Enter cpu_num"/>
              </FormItem>
              <FormItem label="Desc" prop="description">
                <Input v-model="taskForm.description" type="textarea" :autosize="{minRows: 1,maxRows: 5}" placeholder="描述信息"/>
              </FormItem>
              <FormItem>
                <Button @click="cancel('taskForm')" style="margin-left: 8px">取消</Button>
                <Button type="primary" @click="submitForm('taskForm')">确定</Button>
              </FormItem>
            </Form>
            <div slot="footer"></div>
          </Modal>
        </div>
      </i-Col>
      <i-Col span="3">
        <div>
          <Button @click="onAddAppVersion">新增算法</Button>
          <Modal
            v-model="addAppVersionModal"
            title="添加算法"
            class-name="vertical-center-modal"
            :mask-closable="false">
            <Form ref="appVersionForm" :model="appVersionForm" :label-width="88">
              <FormItem label="version" prop="version">
                <Input v-model="appVersionForm.version" placeholder="Enter version"/>
              </FormItem>
              <FormItem label="选择文件" prop="uploadFile">
                <Upload
                  ref="upload"
                  action="//jsonplaceholder.typicode.com/posts/"
                  multiple
                  type="select"
                  :before-upload="handleUpload">
                  <Button icon="ios-cloud-upload-outline">上传文件</Button>
                </Upload>
                <div>
                  <ul class="file-list" v-for="(list,index) in appVersionForm.uploadFile" :key="index">
                    <li>
                      <span style="font-size:10px">文件名: {{ list.name }}</span>
                      <Icon type="ios-close" size="25" color="red" @click="delFileList(index)"></Icon>
                    </li>
                  </ul>
                  </div>
              </FormItem>
              <FormItem>
                <Button @click="cancel('appVersionForm')">取消</Button>
                <Button
                  type="primary"
                  @click="upload('appVersionForm')"
                  :loading="loadingStatus"
                  >{{ loadingStatus ? '上传中...' : '上传' }}</Button>
              </FormItem>
            </Form>
            <div slot="footer"></div>
          </Modal>
        </div>
      </i-Col>
    </Row>
    <Table :columns="columns" :data="datas"
      stripe border >
      <!-- <template  slot="state">
         <Tag type="dot" v-model="row.state" color="primary">{{ row.state }}</Tag>
      </template> -->
      <template slot-scope="{ row, index }" slot="action">
        <Button ghost type="primary" size="small" @click="onDetail(row, index)">
          详情
        </Button>
        <Button ghost type="primary" size="small" v-if="row.state=='stop'||row.state=='fail'" @click="onStartTask(row, index)">
          启动
        </Button>
        <Button ghost type="primary" size="small" v-if="row.state=='run'||row.state=='wait'" @click="onStopTask(row, index)">
          停止
        </Button>
        <Button ghost type="primary" size="small" v-if="!(row.state=='run'||row.state=='wait')" @click="onDelete(row, index)">
          删除
        </Button>
      </template>
    </Table>
    <Page ref="page"
      :total="orgTasks.length"
      :page-size-opts="pageSizeOpt"
      @on-change="onChangePage"
      @on-page-size-change="onChangePage"
      show-sizer show-elevator show-total size="small" />
    <Modal class="data-list-detail-content" v-model="showDetail" :closable="true" :mask-closable="true" :width="520" :title="detailRow.name" >
      <p>创建时间：{{ formatDate(detailRow.create_time) }}</p>
      <pre class="detail-content" >{{JSON.stringify(detailRow, null, 4)}}</pre>
    </Modal>
  </div>
</template>

<script>

import Ajax from '../../utils/ajax'
import DateFormat from 'date-format'

export default {
  name: 'Empty',
  components: {},
  data() {
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
      // 表单参数
      taskForm: {
        name: '',
        carid: '',
        app_version: '',
        cpu_num: '',
        data_begin: '',
        data_end: '',
        description: ''
      },
      appVersionForm: {
        filename: '',
        version: '',
        uploadFile: []
      },
      app_versions: [],
      carids: [],
      state: '',
      columns: [],
      datas: [],
      pageSizeOpt: [10, 20, 50, 100],
      orgTasks: [],
      orgIds: [],
      addTaskModal: false,
      addAppVersionModal: false,
      showDetail: false,
      loadingStatus: false,
      detailIndex: 0,
      detailRow: {},
      dataTime: [begin, now],
      // 查询的请求参数
      params: {
        name: '',
        app_version: '',
        carid: ''
      }
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
    async getCarId() {
      const r = await Ajax.get('/server/data/carid_list', {
        params: {
          'project': this.project,
          'data_type': 'data'
        }
      })
      if (!r) {
        return
      }
      if (r.code !== 0) {
        console.error(r)
        console.error(`${r.msg}`)
        return
      }
      if (!r.ids) {
        this.carids = []
      } else {
        this.carids = r.ids
      }
      // console.log('r.ids', r.ids)
      // console.log('carids', this.carids)
    },
    async getAppVersion() {
      const r = await Ajax.get('/server/task/app_list', {
        params: {
          'project': this.project
        }
      })
      if (!r) {
        return
      }
      if (r.code !== 0) {
        console.error(r)
        console.error(`${r.msg}`)
        return
      }
      if (!r.tasks) {
        this.app_versions = []
      } else {
        this.app_versions = r.tasks.map(obj => { return obj.version })
      }
    },
    async addAppVersion(data) {
      const r = await Ajax.post('/server/task/app_upload?project=AEB_log', data)
      if (!r) {
        return
      }
      if (r.code !== 0) {
        console.error(r)
        // console.error(`${r}`)
        return
      }
      this.loadingStatus = false
      this.$Message.info('上传成功')
      // if (r.code === 1) {
      //   this.$Message.info(`${r.msg}`)
      // } else if (r.code === 0) {
      //   this.$Message.info(`${r.msg}`)
      // }
    },
    async addTask(data) {
      // console.log(typeof data)
      const r = await Ajax.post('/server/task/create?project=AEB_log', data)
      if (!r) {
        return
      }
      if (r.code !== 0) {
        console.error(r)
        console.error(`${r.msg}`)
        return
      }
      this.$Message.info('创建任务成功')
    },
    async deleteTask(row) {
      console.log('删除的row', row)
      console.log('删除的row.id', row._id)
      const r = await Ajax.get('/server/task/delete', {
        params: {
          'project': this.project,
          'id': row._id
        }
      })
      if (!r) {
        return
      }
      if (r.code !== 0) {
        console.error(r)
        console.error(`${r.msg}`)
        return
      }
      this.$Message.info('删除任务成功')
    },
    async startTask(row) {
      const r = await Ajax.get('/server/task/start', {
        params: {
          'project': this.project,
          'id': row._id
        }
      })
      if (!r) {
        return
      }
      if (r.code !== 0) {
        console.error(r)
        console.error(`${r.msg}`)
        return
      }
      this.$Message.info('启动任务成功')
    },
    async stopTask(row) {
      const r = await Ajax.get('/server/task/stop', {
        params: {
          'project': this.project,
          'id': row._id
        }
      })
      if (!r) {
        return
      }
      if (r.code !== 0) {
        console.error(r)
        console.error(`${r.msg}`)
        return
      }
      this.$Message.info('暂停任务成功')
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
        title: '车辆id',
        key: 'carid'
      }, {
        title: 'CPU数量',
        key: 'cpu_num'
      }, {
        title: '任务状态',
        key: 'state',
        align: 'center',
        width: '250',
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
      columns.push({
        title: '操作',
        slot: 'action'
      })
      this.columns = columns
      this.datas = datas
      // console.log(datas)
    },
    // 新增任务按钮
    onAddTask() {
      // TODO 获取选择项getAPI
      this.getCarId()
      this.getAppVersion()
      this.addTaskModal = true
    },
    // 取消新增任务和算法按钮
    cancel(name) {
      // console.log('name', name)
      this.addTaskModal = false
      this.addAppVersionModal = false
      this.reset(name)
    },
    // 提交新增任务表单
    submitForm(name) {
      // TODO post请求
      this.addTask(this.taskForm)
      this.addTaskModal = false
      this.onQuery()
      this.reset(name)
    },
    // 添加算法按钮
    onAddAppVersion() {
      // this.reset()
      this.addAppVersionModal = true
    },
    delFileList(index) {
      this.appVersionForm.uploadFile.splice(index, 1)
    },
    // 上传前的Hook
    handleUpload(file) {
      this.appVersionForm.uploadFile.push(file)
      return false
    },
    // 上传按钮
    upload(name) {
      this.loadingStatus = true
      const formData = new FormData()
      if (this.appVersionForm.uploadFile.length > 0) {
        // for (var i = 0; i < this.appVersionForm.uploadFile.length; i++) {
        //   formData.append('uploadFile', this.appVersionForm.uploadFile[i])
        // }
        formData.append('filename', this.appVersionForm.uploadFile[0].name)
        formData.append('version', this.appVersionForm.version)
        formData.append('content', this.appVersionForm.uploadFile[0])
        // console.log(typeof formData)
        // console.log('formData', formData.get('filename'))
        // console.log('formData', formData.get('version'))
        // console.log('formData', formData.get('content'))
        this.addAppVersion(formData)
      } else {
        this.loadingStatus = false
        this.$Message.error('请至少选择一个文件')
      }
      this.reset(name)
    },
    // 任务详情
    onDetail(row, index) {
      // console.log('detail:', row, index)
      this.detailIndex = index
      this.detailRow = row
      this.showDetail = true
    },
    // 启动任务
    onStartTask(row, index) {
      console.log('执行了启动任务')
      this.startTask(row)
      // 修改状态后刷新table
      this.onQuery()
    },
    // 停止任务
    onStopTask(row, index) {
      console.log('执行停止任务')
      this.stopTask(row)
      // 修改状态后刷新table
      this.onQuery()
    },
    // 删除任务
    onDelete(row, index) {
      this.deleteTask(row)
      this.datas.splice(index, 1)
    },
    // 表单重置
    reset(name) {
      if (this.$refs[name] !== undefined) {
        this.$nextTick(() => {
          this.$refs[name].resetFields()
          // console.log('refs', this.$refs)
          // console.log('refs[name]', this.$refs[name])
        })
      }
    },
    // 时间转换
    formatDate(us) {
      return DateFormat('yyyy-MM-dd hh:mm:ss', new Date(us / 1000))
    },
    dateChange(date) {
      this.taskForm.data_begin = date[0].getTime()
      this.taskForm.data_end = date[1].getTime()
      // console.log('时间范围：', date[0])
      // console.log('date[1]', date[1])
      // console.log('data_begin', this.taskForm.data_begin)
    }
  }
}
</script>

<style lang="scss">
#task_list {
  .ivu-btn {
    margin: 0 20px;
  }
  .ivu-select {
    margin-right: 20px;
  }
  .ivu-table-wrapper {
    margin-top: 10px;
  }
  .detail-content {
    width: 480px;
    height: 300px;
    overflow: scroll;
  }
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ivu-modal {
    top: 0;
  }
}
</style>
