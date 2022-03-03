<template>
  <div class="quotation-c">
    <div class="content">
      <div class="quotation" v-for="item in dataList" :key="item.f12">
        <div class="name">{{ item.f14 }}</div>
        <div class="value" :class="item.f4 < 0 ? 'green' : 'red'">
          {{ item.f2 }}
        </div>
        <div class="detail">
          <span class="value" :class="item.f4 < 0 ? 'green' : 'red'">{{
            item.f4
          }}</span
          ><span class="rate" :class="item.f4 < 0 ? 'green' : 'red'">
            {{ item.f3 + "%" }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getIndFundInfo } from '@/api/quotation'
import { onMounted, onUnmounted, watch } from '@vue/runtime-core'
import { ref } from 'vue'
export default {
  props: {
    isUpdate: {
      type: Boolean,
      default: () => true
    }
  },
  setup (props) {
    let timer
    const seciList = ['1.000001', '1.000300', '0.399001', '0.399006']
    const dataList = ref([])
    const getIndFundData = async function (params) {
      const res = await getIndFundInfo(params)
      dataList.value = res.data.diff
    }
    watch(props, (nv) => {
      console.log('123')
      if (nv.isUpdate) {
        timer = setInterval(async () => {
          const seciListStr = seciList.join(',')
          await getIndFundData(seciListStr)
        }, 5000)
      } else {
        clearInterval(timer)
      }
    })
    onMounted(async () => {
      const gate = localStorage.getItem('gateState')
      const seciListStr = seciList.join(',')
      await getIndFundData(seciListStr)
      if (gate === 'true') {
        timer = setInterval(async () => {
          const seciListStr = seciList.join(',')
          await getIndFundData(seciListStr)
        }, 5000)
      }
    })
    onUnmounted(() => {
      clearInterval(timer)
    })
    return {
      getIndFundData,
      dataList,
      timer
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/style/utils.scss";
.quotation-c {
  width: 100%;
  overflow: hidden;
  .content {
    @include flex-box(center, space-between);
    width: 100%;
    .green {
      color: rgb(0, 190, 0);
    }
    .red {
      color: red;
    }
    .quotation {
      @include flex-box(center, center, column);
      width: 25%;
      padding: px2rem(5);
      line-height: 1.5;
      .name {
        font-size: px2rem(14);
        font-weight: bold;
        color: #000000;
      }
      .value {
        font-size: px2rem(12);
      }
      .detail {
        @include flex-box(center, space-evenly);
        width: 100%;
        font-size: px2rem(12);
      }
    }
  }
}
</style>
