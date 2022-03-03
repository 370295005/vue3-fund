<template>
  <div class="chart">
    <div class="content">
      <div class="title">{{ fundName }}-{{ fundCode }}</div>
      <el-tabs type="border-card" :stretch="true">
        <el-tab-pane label="净值估算">
          <fund-charts></fund-charts>
        </el-tab-pane>
        <el-tab-pane label="持仓明细">
          <fund-detail></fund-detail>
        </el-tab-pane>
        <el-tab-pane label="基金概况"> <fund-info></fund-info>> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import FundCharts from '@/components/FundCharts'
import FundDetail from '@/components/FundDetail'
import FundInfo from '@/components/FundInfo.vue'
import { onMounted, ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
export default {
  components: {
    FundCharts,
    FundDetail,
    FundInfo
  },
  setup () {
    const fundCode = ref(0)
    const fundName = ref('')
    const route = useRoute()
    onMounted(() => {
      fundCode.value = route.query.fundcode
      fundName.value = route.query.fundname
    })
    return {
      fundCode,
      fundName,
      route
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/style/utils.scss";
.chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .content {
    width: 100%;
    height: 100%;
    .title {
      padding: px2rem(5);
      margin: px2rem(10) 0;
      text-align: center;
      font-size: px2rem(16);
      font-weight: 600;
    }
    .el-tabs__content {
      height: 100vh;
      padding: px2rem(10) 0 0;
      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>
