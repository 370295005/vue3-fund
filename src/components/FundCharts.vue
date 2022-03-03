<template>
  <div class="fundcharts-c">
    <div class="content">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import 'echarts/lib/chart/line'
import { ElLoading } from 'element-plus'
import { getFundDetail } from '@/api/fundcharts'
import { useRoute } from 'vue-router'
import { reactive, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { getCurrentInstance, nextTick } from 'vue'
export default {
  setup (props, context) {
    const route = useRoute()
    let fundCode = 0
    let fundName = ''
    let averageNAV = ref(0)
    let dataPoint = []
    let chartOption = reactive({})
    let charts = ref(null)
    const timeData = [
      '09:30',
      '09:31',
      '09:32',
      '09:33',
      '09:34',
      '09:35',
      '09:36',
      '09:37',
      '09:38',
      '09:39',
      '09:40',
      '09:41',
      '09:42',
      '09:43',
      '09:44',
      '09:45',
      '09:46',
      '09:47',
      '09:48',
      '09:49',
      '09:50',
      '09:51',
      '09:52',
      '09:53',
      '09:54',
      '09:55',
      '09:56',
      '09:57',
      '09:58',
      '09:59',
      '10:00',
      '10:01',
      '10:02',
      '10:03',
      '10:04',
      '10:05',
      '10:06',
      '10:07',
      '10:08',
      '10:09',
      '10:10',
      '10:11',
      '10:12',
      '10:13',
      '10:14',
      '10:15',
      '10:16',
      '10:17',
      '10:18',
      '10:19',
      '10:20',
      '10:21',
      '10:22',
      '10:23',
      '10:24',
      '10:25',
      '10:26',
      '10:27',
      '10:28',
      '10:29',
      '10:30',
      '10:31',
      '10:32',
      '10:33',
      '10:34',
      '10:35',
      '10:36',
      '10:37',
      '10:38',
      '10:39',
      '10:40',
      '10:41',
      '10:42',
      '10:43',
      '10:44',
      '10:45',
      '10:46',
      '10:47',
      '10:48',
      '10:49',
      '10:50',
      '10:51',
      '10:52',
      '10:53',
      '10:54',
      '10:55',
      '10:56',
      '10:57',
      '10:58',
      '10:59',
      '11:00',
      '11:01',
      '11:02',
      '11:03',
      '11:04',
      '11:05',
      '11:06',
      '11:07',
      '11:08',
      '11:09',
      '11:10',
      '11:11',
      '11:12',
      '11:13',
      '11:14',
      '11:15',
      '11:16',
      '11:17',
      '11:18',
      '11:19',
      '11:20',
      '11:21',
      '11:22',
      '11:23',
      '11:24',
      '11:25',
      '11:26',
      '11:27',
      '11:28',
      '11:29',
      '11:30',
      '13:00',
      '13:01',
      '13:02',
      '13:03',
      '13:04',
      '13:05',
      '13:06',
      '13:07',
      '13:08',
      '13:09',
      '13:10',
      '13:11',
      '13:12',
      '13:13',
      '13:14',
      '13:15',
      '13:16',
      '13:17',
      '13:18',
      '13:19',
      '13:20',
      '13:21',
      '13:22',
      '13:23',
      '13:24',
      '13:25',
      '13:26',
      '13:27',
      '13:28',
      '13:29',
      '13:30',
      '13:31',
      '13:32',
      '13:33',
      '13:34',
      '13:35',
      '13:36',
      '13:37',
      '13:38',
      '13:39',
      '13:40',
      '13:41',
      '13:42',
      '13:43',
      '13:44',
      '13:45',
      '13:46',
      '13:47',
      '13:48',
      '13:49',
      '13:50',
      '13:51',
      '13:52',
      '13:53',
      '13:54',
      '13:55',
      '13:56',
      '13:57',
      '13:58',
      '13:59',
      '14:00',
      '14:01',
      '14:02',
      '14:03',
      '14:04',
      '14:05',
      '14:06',
      '14:07',
      '14:08',
      '14:09',
      '14:10',
      '14:11',
      '14:12',
      '14:13',
      '14:14',
      '14:15',
      '14:16',
      '14:17',
      '14:18',
      '14:19',
      '14:20',
      '14:21',
      '14:22',
      '14:23',
      '14:24',
      '14:25',
      '14:26',
      '14:27',
      '14:28',
      '14:29',
      '14:30',
      '14:31',
      '14:32',
      '14:33',
      '14:34',
      '14:35',
      '14:36',
      '14:37',
      '14:38',
      '14:39',
      '14:40',
      '14:41',
      '14:42',
      '14:43',
      '14:44',
      '14:45',
      '14:46',
      '14:47',
      '14:48',
      '14:49',
      '14:50',
      '14:51',
      '14:52',
      '14:53',
      '14:54',
      '14:55',
      '14:56',
      '14:57',
      '14:58',
      '14:59',
      '15:00'
    ]
    const dom = getCurrentInstance()
    const formatX = (val, ind) => {
      if (val === '13:00') {
        return '11:30/13:00'
      } else {
        return val
      }
    }
    const formatValue = (ind, val) => {
      const arr = ['09:30', '10:30', '13:00', '14:00', '15:00']
      if (arr.indexOf(val) !== -1) {
        return true
      } else {
        return false
      }
    }
    // 获取数组中极值
    const getExtremum = (data) => {
      console.log(data)
      const max = Math.abs(Math.max.apply(null, data)).toFixed(2)
      const min = Math.abs(Math.min.apply(null, data)).toFixed(2)
      return max > min ? max : min
    }
    const initChart = () => {
      charts = echarts.init(dom.refs.charts)
      chartOption = {
        color: ['#6aaaff'],
        tooltip: {
          trigger: 'axis',
          formatter: (e) => {
            return `时间：${e[0].name}<br />估算涨跌幅：${
              e[0].value
            }%<br />估算净值：${(averageNAV * (1 + 0.01 * e[0].value)).toFixed(
              4
            )}元`
          }
        },
        grid: {
          top: 40,
          width: '85%'
        },
        xAxis: {
          type: 'category',
          data: timeData,
          position: 'bottom',
          axisLabel: {
            formatter: formatX,
            interval: formatValue
          },
          axisLine: {
            onZero: false
          }
        },
        yAxis: {
          type: 'value',
          offset: -5,
          axisLabel: {
            color: yAxisColor,
            formatter: (val) => {
              return val.toFixed(2) + '%'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ccc'
            }
          },
          data: []
        },
        // {
        //   type: 'value',
        //   offset: -10,
        //   axisLabel: {
        //     color: yAxisColor,
        //     formatter: (val) => {
        //       return (averageNAV * (1 + 0.01 * val)).toFixed(4)
        //     }
        //   },
        //   splitLine: {
        //     show: true,
        //     lineStyle: {
        //       type: 'dashed',
        //       color: '#ccc'
        //     }
        //   },
        //   data: []
        // }
        series: [
          {
            type: 'line',
            name: '估算涨跌幅',
            data: [],
            markLine: {
              silent: true,
              symbol: 'none',
              animation: false,
              label: {
                show: false
              },
              lineStyle: {
                type: 'solid',
                color: '#000000'
              },
              data: [
                {
                  yAxis: 0
                }
              ]
            }
          }
          // {
          //   name: '估算净值',
          //   type: 'line',
          //   symbol: 'none',
          //   data: dataPoint.map((e) => {
          //     (+e[2]).toFixed(2)
          //   }),
          //   yAxisIndex: 1
          // }
        ]
      }
    }
    const yAxisColor = (val) => {
      return val > 0 ? '#f56c6c' : '#4eb61b'
    }
    const getFundData = async () => {
      const res = await getFundDetail(fundCode)
      dataPoint = res.Datas.map((e) => e.split(','))
      console.log(res.Expansion)
      const extremum = getExtremum(
        dataPoint.map((e) => {
          return (+e[2]).toFixed(2)
        })
      )
      averageNAV = res.Expansion.DWJZ
      chartOption.series[0].data = dataPoint.map((e) => {
        return (+e[2]).toFixed(2)
      })
      // chartOption.title.text = res.Expansion.SHORTNAME
      // chartOption.series[1].data = dataPoint.map((e) => {
      //   return (+e[2]).toFixed(2)
      // })
      // chartOption.yAxis[0].min = -extremum
      // chartOption.yAxis[0].max = extremum
      // chartOption.yAxis[0].interval = extremum / 4
      chartOption.yAxis.min = -extremum
      chartOption.yAxis.max = extremum
      chartOption.yAxis.interval = extremum / 4
      // chartOption.yAxis[1].min = -extremum
      // chartOption.yAxis[1].max = extremum
      // chartOption.yAxis[1].interval = extremum / 4
      console.log(chartOption)
      charts.setOption(chartOption)
    }
    onMounted(async () => {
      ElLoading.service({ fullscreen: true })
      fundCode = route.query.fundcode || 0
      fundName = route.query.fundname || ''
      nextTick(() => {
        getFundData()
        initChart()
        setTimeout(() => {
          ElLoading.service().close()
        }, 500)
      })
    })
    return {
      dom,
      charts,
      fundCode,
      fundName,
      dataPoint,
      initChart,
      getFundData
    }
  }
}
</script>

<style lang="scss">
.fundcharts-c {
  width: 100%;
  height: 100%;
  // overflow: hidden;
  .content {
    width: 100%;
    height: 100%;
    .charts {
      width: 100%;
      height: 40%;
    }
  }
}
</style>
