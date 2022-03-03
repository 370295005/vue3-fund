<template>
  <div class="funddeatil-c">
    <div class="content">
      <div class="detail">
        <el-table stripe :data="fundData" :cell-style="cellFilter">
          <el-table-column prop="GPJC" label="股票名称(代码)">
          </el-table-column>
          <el-table-column prop="f3" label="涨跌幅" align="right">
          </el-table-column>
          <el-table-column prop="JZBL" label="持仓占比" align="right">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { getFundDeatil, getStockData } from '@/api/funddetail.js'
import { onMounted, ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
export default {
  setup () {
    const route = useRoute()
    const fundCode = route.query.fundcode
    const fundData = ref([])
    const getData = async () => {
      let stockList, stockData
      const res = await getFundDeatil(fundCode)
      if (res) {
        stockList = res.Datas.fundStocks
          .map((e) => {
            return e.NEWTEXCH + '.' + e.GPDM
          })
          .join(',')
        const stockRes = await getStockData(stockList)
        stockData = stockRes.data.diff
        const t = []
        for (let i = 0; i < stockData.length; i++) {
          stockData[i].f3 = (+stockData[i].f3).toFixed(2) + '%'
          res.Datas.fundStocks[i].JZBL =
            (+res.Datas.fundStocks[i].JZBL).toFixed(2) + '%'
          t.push({ ...stockData[i], ...res.Datas.fundStocks[i] })
        }
        fundData.value = t
      }
    }
    const cellFilter = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex === 1 && row.f3.includes('-')) {
        return 'color:rgb(0, 190, 0);'
      } else if (columnIndex === 1 && !row.f3.includes('-')) {
        return 'color:red'
      } else {
        return 'color:#303133'
      }
    }
    onMounted(() => {
      getData()
    })
    return {
      fundData,
      getData,
      cellFilter
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/utils.scss";
.funddetail-c {
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
    font-size: px2rem(14);
  }
}
</style>
