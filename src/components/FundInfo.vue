<template>
  <div class="fundinfo-c">
    <div class="content">
      <div class="header">
        <div class="rank" v-if="fundInfo.SYL_Y">
          <div class="rank-time">近1月(排名)</div>
          <div
            class="rank-value"
            :class="!fundInfo.SYL_Y.includes('-') ? 'red' : 'green'"
          >
            {{ fundInfo.SYL_Y }}% ({{ fundInfo.RANKM }})
          </div>
        </div>
        <div class="rank" v-if="fundInfo.SYL_3Y">
          <div class="rank-time">近3月(排名)</div>
          <div
            class="rank-value"
            :class="!fundInfo.SYL_3Y.includes('-') ? 'red' : 'green'"
          >
            {{ fundInfo.SYL_3Y }}% ({{ fundInfo.RANKQ }})
          </div>
        </div>
        <div class="rank" v-if="fundInfo.SYL_6Y">
          <div class="rank-time">近6月(排名)</div>
          <div
            class="rank-value"
            :class="!fundInfo.SYL_6Y.includes('-') ? 'red' : 'green'"
          >
            {{ fundInfo.SYL_6Y }}% ({{ fundInfo.RANKHY }})
          </div>
        </div>
        <div class="rank" v-if="fundInfo.SYL_1N">
          <div class="rank-time">近1年(排名)</div>
          <div
            class="rank-value"
            :class="!fundInfo.SYL_1N.includes('-') ? 'red' : 'green'"
          >
            {{ fundInfo.SYL_1N }}% ({{ fundInfo.RANKY }})
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="table">
        <div>单位净值：{{ fundInfo.DWJZ }} ({{ fundInfo.FSRQ }})</div>
        <div>累计净值：{{ fundInfo.LJJZ }}</div>
        <div>基金类型：{{ fundInfo.FTYPE }}</div>
        <div>基金公司：{{ fundInfo.JJGS }}</div>
        <div>基金经理：{{ fundInfo.JJJL }}</div>
        <div>交易状态：{{ fundInfo.SGZT }}</div>
        <div>基金规模：{{ formatNumber(fundInfo.ENDNAV) || "" }}</div>
        <div v-if="fundInfo.FUNDBONUS">
          分红状态：{{ fundInfo.FUNDBONUS.PDATE }}日，每份基金份额折算{{
            fundInfo.FUNDBONUS.CHGRATIO
          }}份
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useRoute } from 'vue-router'
import { getFundInfo } from '@/api/fundinfo'
import { onMounted, ref } from '@vue/runtime-core'
export default {
  setup () {
    const route = useRoute()
    const fundCode = route.query.fundcode
    const fundInfo = ref([])
    const formatNumber = (e) => {
      if (e) {
        e = Number(e)
        const list = { 0: '', 4: '万', 8: '亿', 12: '万亿' }
        const a = Object.keys(list)
        console.log(10 ** (+a[1]))
        return e
      }
    }
    const getData = async () => {
      const res = await getFundInfo(fundCode)
      console.log(res)
      fundInfo.value = res.Datas
    }
    onMounted(() => {
      getData()
    })
    return {
      fundInfo,
      formatNumber
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/style/utils.scss";
.fundinfo-c {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .content {
    width: 100%;
    .header {
      @include flex-box(center, space-around);
      padding-top: px2rem(5);
      padding-bottom: px2rem(15);
      .rank {
        @include flex-box(center, center, column);
        .rank-time {
          font-size: px2rem(12);
          font-weight: 600;
          margin-bottom: px2rem(5);
        }
        .red {
          color: red;
        }
        .green {
          color: rgb(0, 190, 0);
        }
      }
    }
    .line {
      width: 100%;
      height: px2rem(1);
      background-color: #ebeef5;
    }
    .table {
      div {
        padding: px2rem(10);
        font-size: px2rem(13);
      }
      div:nth-child(even) {
        background-color: #f1f1f1;
      }
    }
  }
}
</style>
