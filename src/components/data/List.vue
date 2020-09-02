// 数据列表

<template>
  <div id="data_list">
    业务类型:
    <Select v-model="project" @on-change="onChangeDataType" style="width:130px">
        <Option v-for="(v,k) of projects" :value="k" :key="k">{{ v }}</Option>
    </Select>
    数据类型:
    <Select v-model="dataType" @on-change="onChangeDataType" style="width:100px">
        <Option v-for="(v,k) of dataTypes" :value="k" :key="k">{{ v }}</Option>
    </Select>
    车辆编号:
    <Select v-model="carid" style="width:130px">
        <!-- <Option value="全部" key="全部">全部</Option> -->
        <Option v-for="id of carids" :value="id" :key="id">{{ id }}</Option>
    </Select>
    数据时间:
    <DatePicker v-model="dataTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选中时间段" style="width: 280px"></DatePicker>
    <Tooltip content="请先选择数类型和车辆编号" :disabled="!!(dataType && carid)">
      <Button @click="onQuery" :disabled="!dataType || !carid">
          <Icon type="md-search"/>
          查询
      </Button>
    </Tooltip>
    <Table :columns="columns" :data="datas"
      stripe border >
      <template slot-scope="{ row, index }" slot="detail">
        <Button ghost type="primary" size="small" @click="onDetail(row, index)">
          详情
        </Button>
      </template>
    </Table>
    <Page ref="page"
      :total="total"
      :current="currentPage"
      :page-size-opts="pageSizeOpt"
      @on-change="onChangePage"
      @on-page-size-change="onChangePage"
      show-sizer show-elevator show-total size="small" />
    <Modal class="data-list-detail-content" v-model="showDetail" :closable="true" :mask-closable="true" :width="520" :title="detailRow.name" >
      <p>{{ formatDate(detailRow.time) }}</p>
      <pre class="detail-content" >{{JSON.stringify(detailRow.data, null, 4)}}</pre>
    </Modal>
    <Modal class="data-list-detail-content" v-model="showVideoDetail" :closable="true" :mask-closable="true" :width="520" :title="detailRow.name" >
      <p>{{ formatDate(detailRow.time) }}</p>
      <VVideo class="vjs-big-play-centered" :options="playOpts" :source="videoSource" :seek="videoSeek"></VVideo>
    </Modal>
  </div>
</template>

<script>

import Ajax from '../../utils/ajax'
import DateFormat from 'date-format'
import VVideo from '../common/VVideo'

export default {
  name: 'Empty',
  components: {
    VVideo
  },
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
      dataTypes: {
        'data': '原始数据',
        'sim': '仿真结果',
        'video': '视频图像'
      },
      dataType: '',
      caridsOfType: {},
      carids: [],
      carid: '',
      dataTime: [begin, now],
      columns: [],
      datas: [],
      pageSizeOpt: [10, 20, 50, 100],
      currentPage: 1,
      total: 0,
      // orgDatas: [],
      showDetail: false,
      showVideoDetail: false,
      detailIndex: 0,
      detailRow: {},
      playOpts: {
        controls: true,
        autoplay: 'play'
      },
      videoSource: {},
      videoSeek: 0
    }
  },
  methods: {
    async query() {
      const page = this.$refs.page
      const r = await Ajax.get('/server/data/data_list', {
        params: {
          'project': this.project,
          'carid': this.carid,
          'data_type': this.dataType,
          'begin_time': this.dataTime[0] * 1000,
          'end_time': this.dataTime[1] * 1000,
          'limit': page.currentPageSize,
          'offset': (page.currentPage - 1) * page.currentPageSize
        }
      })
      if (!r) {
        console.error('网络错误, onChangeDataType:')
        return
      }
      if (r.code !== 0) {
        console.error(r)
        console.error(`${r.msg}`)
        return
      }
      // console.log(r)
      const self = this
      this.columns = [{
        title: '名称',
        key: 'name'
      }, {
        title: '时间',
        key: 'time',
        render(h, params) {
          // console.log('onChangePage:', params)
          return h('span', self.formatDate(params.row.time))
        }
      }, {
        title: '上传时间',
        render(h, params) {
          // console.log('id: ', params.row.id)
          const ctime = parseInt(params.row.id.substr(0, 8), 16)
          return h('span', self.formatDate(ctime * 1000 * 1000))
        }
      }, {
        title: '详情',
        slot: 'detail'
      }]
      this.total = r.total
      if (!r.datas) {
        this.datas = []
      } else {
        this.datas = r.datas
      }
      // console.log(this)
    },
    onQuery() {
      this.currentPage = 1
      this.query()
    },
    async onChangeDataType() {
      console.log('onChangeDataType: ', this.dataType)
      const r = await Ajax.get('/server/data/carid_list', {
        params: {
          'project': this.project,
          'data_type': this.dataType
        }
      })
      if (!r) {
        console.error('网络错误, onChangeDataType:')
        return
      }
      if (r.code !== 0) {
        console.error(`${r.msg}`)
        return
      }
      // console.log(r)
      this.caridsOfType[this.dataType + '_' + this.project] = r.ids
      // console.log(this.caridsOfType)
      let carids = this.caridsOfType[this.dataType + '_' + this.project]
      if (!carids) {
        carids = []
      }
      this.carids = carids
    },
    onChangePage() {
      this.query()
    },
    onDetail(row, index) {
      console.log('detail:', row, index)
      this.detailIndex = index
      this.detailRow = row
      if (this.dataType === 'video') {
        this.videoSource = {
          // src: `data:video/mp4;base64, ${row.data.Data}`,
          src: row.url,
          type: 'video/mp4' // 可选：video/mp4, video/webm, video/ogg
        }
        this.videoSeek = 0
        setTimeout(() => {
          this.videoSeek = 20
        }, 1)
        // this.videoSource = {
        //   src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
        //   type: 'video/mp4'
        // }
        this.showVideoDetail = true
      } else {
        this.showDetail = true
      }
    },
    formatDate(us) {
      return DateFormat('yyyy-MM-dd hh:mm:ss', new Date(us / 1000))
    }
  }
}
</script>

<style lang="scss">
#data_list {
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
  .video-js {
    width: 480px;
    height: 300px;
  }
}
</style>
