<template>
  <div class="fundlist-c">
    <div class="content">
      <table align="center">
        <thead>
          <tr>
            <td>基金名称 ({{ fundData.length }})</td>
            <td>估算净值</td>
            <td>持仓成本</td>
            <td>持有额</td>
            <td>持有收益</td>
            <td>持有收益率</td>
            <td>涨跌幅</td>
            <td>估算收益</td>
            <td>更新时间</td>
            <td v-show="isEdit">删除</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in fundData"
            :key="item.FCODE"
            @click="toChart(item.FCODE, item.SHORTNAME)"
          >
            <td>{{ item.SHORTNAME }}</td>
            <td>{{ item.GSZ }}</td>
            <td v-if="!isEdit">{{ +item.COST || "" }}</td>
            <td v-else>
              <el-input
                v-model="item.COST"
                @input="changeCost(item, index)"
                size="mini"
              ></el-input>
            </td>
            <td v-if="!isEdit">{{ (+item.AMOUNT).toFixed(2) }}</td>
            <td v-else>
              <el-input
                v-model="item.AMOUNT"
                @input="changeAmount(item, index)"
                size="mini"
              ></el-input>
            </td>
            <td :class="+item.GSZ - +item.COST > 0 ? 'red' : 'green'">
              {{
                item.COST
                  ? ((+item.GSZ - +item.COST) * +item.AMOUNT).toFixed(2)
                  : ""
              }}
            </td>
            <td :class="item.GSZ - item.COST > 0 ? 'red' : 'green'">
              {{ item.COST ? (item.GSZ - item.COST).toFixed(2) + "%" : "" }}
            </td>
            <td :class="item.GSZZL < 0 ? 'green' : 'red'">{{ item.GSZZL }}%</td>
            <td :class="item.GSZZL < 0 ? 'green' : 'red'">
              {{ ((item.AMOUNT * item.GSZZL) / 100).toFixed(2) || "" }}
            </td>
            <td>{{ item.GZTIME.split(" ")[1] }}</td>
            <td v-show="isEdit">
              <input
                @click="del(item.FCODE)"
                class="btn red delete"
                value="✖"
                type="button"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import holiday from '@/lib/holiday'
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, watch } from '@vue/runtime-core'
import { getFundData } from '@/api/fundlist.js'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: () => false
    },
    isUpdate: {
      type: Boolean,
      default: () => false
    },
    updateData: {
      type: String,
      default: () => ''
    }
  },
  setup (props, context) {
    const router = useRouter()
    // 休市判断
    const gate = ref(true)
    let timer
    // 用户id
    let userId = ''
    // 本地数据
    let localData = ref([])
    // 默认基金列表
    const fundListDeafault = ['001618']
    // 用户手动设置的列表
    let fundListUser = ['161725', '400015', '320007', '001475']
    // 接口返回数据
    const fundData = ref([])
    watch(props, (nv) => {
      console.log(nv)
      if (nv.isUpdate) {
        timer = setInterval(() => {
          initData()
        }, 5000)
      } else {
        clearInterval(timer)
      }
      if (nv.updateData) {
        initData()
      }
    })

    // 生成userId
    const getGuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0
          var v = c === 'x' ? r : (r & 0x3) | 0x8
          return v.toString(16)
        }
      )
    }
    // 获取本地数据
    const getLocalData = () => {
      const dataList = JSON.parse(localStorage.getItem('dataList'))
      const fundList = localStorage.getItem('fundList')
      const userId = localStorage.getItem('userId')
      const obj = { dataList, fundList, userId }
      return obj
    }
    // 获取用户id
    const getUserId = () => {
      if (!localData.userId) {
        userId = getGuid()
        localStorage.setItem('userId', userId)
      } else {
        userId = localData.userId
      }
      localData.userId = userId
    }
    // 获取基金列表
    const getFundListUser = () => {
      if (!localData.fundList) {
        fundListUser = fundListDeafault
        localStorage.setItem('fundList', fundListUser)
      } else {
        fundListUser = localData.fundList.split(',')
      }
      localData.fundList = fundListUser
    }
    // 获取基金数据
    const getFundInfo = async () => {
      const str = fundListUser.join(',')
      const res = await getFundData(userId, str)
      fundData.value = res.Datas
      mergeData(res.Datas)
    }
    // 合并数据
    const mergeData = async (data) => {
      fundData.value = data.map((e, index) => {
        return { ...e, ...localData.dataList[index] }
      })
      getAllGain(fundData.value)
      getDayGain(fundData.value)
    }
    // 更新持有额
    const changeAmount = (e) => {
      for (const i of localData.dataList) {
        if (i.FCODE === e.FCODE) {
          i.AMOUNT = e.AMOUNT
        }
      }
      localStorage.setItem('dataList', JSON.stringify(localData.dataList))
    }
    // 更新持仓成本
    const changeCost = (e) => {
      for (const i of localData.dataList) {
        if (i.FCODE === e.FCODE) {
          i.COST = e.COST
        }
      }
      localStorage.setItem('dataList', JSON.stringify(localData.dataList))
    }
    // 判断是否休市
    const checkDate = async () => {
      let isHoliday
      // const { data } = await getHoliday()
      const { data: holidayList } = holiday
      // const holidayList = data;
      // 时区转换为东8区
      const zoneOffset = 8
      // 格林威治时间差 毫秒数
      const offset8 = new Date().getTimezoneOffset() * 60 * 1000
      const nowDate8 = new Date().getTime()
      // 东八区时间
      const curDate = new Date(
        nowDate8 + offset8 + zoneOffset * 60 * 60 * 1000
      )
      // 当前年份
      const curYear = curDate.getFullYear()
      // 当前月份
      const curMonth = curDate.getMonth() + 1
      // 当前天数
      const curDay = curDate.getDate()
      const date =
        curMonth < 10
          ? '0' + curMonth
          : curMonth + curDate < 10
            ? '0' + curDay
            : curDay
      for (const key in holidayList) {
        if (
          +key === +curYear &&
          Object.prototype.hasOwnProperty.call(holidayList, key)
        ) {
          const data = holidayList[key]
          for (const day in data) {
            const dayData = data[day]
            if (date === day && dayData.holiday) {
              isHoliday = true
              return false
            } else {
              isHoliday = false
            }
          }
        }
      }
      console.log('是否节假日', isHoliday)
      if ((!isHoliday && +curDate.getDay() !== 6) || +curDate.getDay() !== 0) {
        // 不是节假日或周末判断工作日开市时间
        const beginDateAM = new Date()
        const endDateAM = new Date()
        const beginDatePM = new Date()
        const endDatePM = new Date()
        beginDateAM.setHours(9, 30, 0)
        endDateAM.setHours(11, 35, 0)
        beginDatePM.setHours(13, 0, 0)
        endDatePM.setHours(15, 5, 0)
        if (curDate > beginDateAM && curDate <= endDateAM) {
          console.log('上午开市')
          return true
        } else if (curDate >= beginDatePM && curDate <= endDatePM) {
          console.log('下午开市')
          return true
        } else {
          console.log('休市')
          return false
        }
      }
    }
    // 删除自选
    const del = (code) => {
      let dataList = JSON.parse(localStorage.getItem('dataList'))
      let fundList = localStorage.getItem('fundList').split(',')
      dataList = dataList.filter((e) => {
        return +e.FCODE !== +code
      })
      fundList = fundList.filter((e) => {
        console.log(e)
        return +e !== +code
      })
      localStorage.setItem('dataList', JSON.stringify(dataList))
      localStorage.setItem('fundList', fundList)
      initData()
    }
    // 跳转折线图
    const toChart = (code, name) => {
      router.push({
        path: '/chart',
        query: {
          fundcode: code,
          fundname: name
        }
      })
    }
    // 计算持有收益
    const getAllGain = (data) => {
      let t = 0
      t = data
        .map((e) => {
          return ((+e.GSZ - +e.COST) * +e.AMOUNT).toFixed(2)
        })
        .reduce((a, b) => {
          return +a + +b
        })
      context.emit('allGain', t)
    }
    // 计算日收益
    const getDayGain = (data) => {
      let t = 0
      t = data
        .map((e) => {
          return ((e.AMOUNT * e.GSZZL) / 100).toFixed(2)
        })
        .reduce((a, b) => {
          return +a + +b
        })
      context.emit('dayGain', t)
    }
    const initData = () => {
      // localStorage.setItem('fundList', fundListUser)
      // localStorage.setItem(
      //   'dataList',
      //   JSON.stringify([
      //     { FCODE: '161725', AMOUNT: 10000, COST: 1.12 },
      //     { FCODE: '400015', AMOUNT: 10000, COST: 1.12 },
      //     { FCODE: '320007', AMOUNT: 10000, COST: 1.12 },
      //     { FCODE: '001475', AMOUNT: 10000, COST: 1.12 }
      //   ])
      // )
      localData = getLocalData()
      getUserId()
      getFundListUser()
      getFundInfo()
    }
    onMounted(async () => {
      gate.value = await checkDate()
      localStorage.setItem('gateState', gate.value)
      initData()
      console.log('本地数据', localData)

      if (gate.value) {
        timer = setInterval(() => {
          initData()
        }, 5000)
      }
    })
    onBeforeUnmount(() => {
      clearInterval(timer)
    })
    return {
      timer,
      userId,
      localData,
      fundData,
      getLocalData,
      changeAmount,
      changeCost,
      del,
      toChart
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/utils.scss";
.fundlist-c {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  ::-webkit-scrollbar {
    display: none;
  }
  .content {
    width: 100%;
    overflow: auto;
    table {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      td {
        width: px2rem(60);
        text-align: right;
        font-weight: bold;
        font-size: px2rem(12);
      }
      td:nth-child(1) {
        text-align: left;
      }
      td:nth-child(2) {
        margin-left: px2rem(100);
      }
      thead {
        td {
          display: inline-block;
          padding: px2rem(10) 0;
          margin: 0 px2rem(10);
        }
      }
      tbody {
        .green {
          color: rgb(0, 190, 0);
        }
        .red {
          color: red;
        }
        td {
          display: inline-block;
          padding: px2rem(10) 0;
          margin: 0 px2rem(10);
        }
        td:nth-child(2) {
          margin-left: px2rem(100);
        }
        .delete {
          width: px2rem(20);
          height: px2rem(20);
          border-radius: 50%;
          border: 1px solid rgba($color: #f56c6c, $alpha: 0.6);
          background-color: #ffffff;
        }
      }
      .el-input__inner {
        padding: 0 px2rem(5);
      }
    }
  }
}
</style>
