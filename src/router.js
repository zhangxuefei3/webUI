// 页面路由

// auth 权限管理
// cars 车辆管理
import CarMonitor from './components/cars/Monitor.vue'
// collection 采集策略管理
// data 数据管理
import DataList from './components/data/List.vue'
// label 标签管理
// scene 场景管理
// schedule 调度
// statistics 统计分析
// viewer 可视化工具
// 其它
import NotFound from './components/NotFound.vue'
import Empty from './components/Empty.vue'
import SimTask from './components/logsim/SimTask.vue'
import SimResult from './components/logsim/SimResult.vue'

export default [
  { path: '*', component: NotFound },
  { path: '/', component: Empty },
  { path: '/cars/monitor', component: CarMonitor },
  { path: '/data/list', component: DataList },
  {
    path: '/logsim/simtask',
    component: SimTask
  },
  {
    path: '/logsim/simresult',
    component: SimResult
  }
]
