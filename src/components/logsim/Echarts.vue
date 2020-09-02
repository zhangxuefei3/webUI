<template>
  <div class="Echarts">
    <!-- <div id="myChart" style="width:700px;height:300px"></div> -->
    <div id="myChart"></div>
  </div>
</template>

<script>
export default {
  name: 'Echarts',
  computed: {
    Option () {
      return {
        // 指定配置项和数据
        title: {
          text: '仿真结果'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['latentWarningFunclmpArb', 'preWarningFunclmpArb', 'acuteWarningFunclmpArb']
        },
        grid: {
          x: 80,
          y: 60,
          x2: 80,
          y2: 60,
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 1,
          borderColor: '#ccc'
        },
        xAxis: {
          // type: 'value',
          // data: [1, 2, 3, 4, 5, 6, 7]
          type: 'category',
          // maxInterval: 0.02,
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          boundaryGap: false,
          axisLabel: {
            // interval: 0,
            rotate: -30,
            formatter: function (value, index) {
              // alert("xxx")
              // 格式化成分秒，只在第一个刻度显示年份
              const date = new Date(value)
              // var texts = [date.getMinutes(),date.getSeconds(),date.getMilliseconds()];
              const texts = [date.getMinutes(), date.getSeconds(), date.getMilliseconds()]
              if (index === 0) {
                texts.unshift(date.getHours())
              }
              return texts.join(':')
            }
          }
        },
        yAxis: {
          // type = 'value',
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            name: 'latentWarningFunclmpArb',
            type: 'line',
            step: 'end',
            data: this.latentWarningFunclmpArb
            // data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'preWarningFunclmpArb',
            type: 'line',
            step: 'end',
            data: this.preWarningFunclmpArb
            // data: [450, 432, 401, 454, 590, 530, 510]
          },
          {
            name: 'acuteWarningFunclmpArb',
            type: 'line',
            step: 'end',
            data: this.acuteWarningFunclmpArb
            // data: [450, 432, 401, 454, 590, 530, 510]
          }
        ]
      }
    }
  },
  data() {
    return {
      myChart: null,
      latentWarningFunclmpArb: [
        { value: ['2020-4-11 08:30:21.00', 1] },
        { value: ['2020-4-11 08:30:21.02', 1] },
        { value: ['2020-4-11 08:30:21.04', 2] },
        { value: ['2020-4-11 08:30:21.06', 2] },
        { value: ['2020-4-11 08:30:21.08', 2] },
        { value: ['2020-4-11 08:30:21.10', 1] },
        { value: ['2020-4-11 08:30:21.12', 1] }
      ],
      preWarningFunclmpArb: [
        { value: ['2020-4-11 08:30:21.0', 1] },
        { value: ['2020-4-11 08:30:21.02', 1] },
        { value: ['2020-4-11 08:30:21.04', 1] },
        { value: ['2020-4-11 08:30:21.06', 1] },
        { value: ['2020-4-11 08:30:21.08', 1] },
        { value: ['2020-4-11 08:30:21.10', 1] },
        { value: ['2020-4-11 08:30:21.12', 1] }
      ],
      acuteWarningFunclmpArb: [
        { value: ['2020-4-11 08:30:21.00', 1] },
        { value: ['2020-4-11 08:30:21.02', 1] },
        { value: ['2020-4-11 08:30:21.04', 1] },
        { value: ['2020-4-11 08:30:21.06', 2] },
        { value: ['2020-4-11 08:30:21.08', 2] },
        { value: ['2020-4-11 08:30:21.10', 1] },
        { value: ['2020-4-11 08:30:21.12', 1] }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.myEcharts()
    })
  },

  methods: {
    myEcharts() {
      // 初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.setOption(this.Option)
      window.addEventListener('resize', function() {
        if (myChart) {
          myChart.resize()
        }
        // myChart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #myChart
  {
    width: 85%;
    height: 320px;
  }
</style>
