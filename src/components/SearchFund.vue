<template>
  <div class="searchfund-c">
    <div class="content">
      <label for="fund">添加新基金:</label>
      <el-select
        v-model="input"
        filterable
        placeholder="请输入基金代码"
        size="mini"
        remote
        :remote-method="search"
        :loading="loading"
        loading-text="加载中..."
      >
        <el-option v-for="item in fundOption" :key="item" :value="item.CODE">
          <span style="float: left">{{ item.NAME }}</span>
          <span
            style="
              float: right;
              color: var(--el-text-color-secondary);
              font-size: 13px;
            "
            >{{ item.CODE }}</span
          >
        </el-option>
      </el-select>
      <el-button size="mini" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { searchFund } from '@/api/searchfund.js'
export default {
  setup (props, context) {
    const input = ref('')
    let loading = ref(false)
    const fundOption = ref([])
    const search = async (query) => {
      if (query !== '') {
        loading = true
        const res = await searchFund(query)
        fundOption.value = res.Datas
        loading = false
      }
    }
    const confirm = (e) => {
      if (input.value) {
        const fundList = localStorage.getItem('fundList').split(',')
        fundList.push(input.value)
        const dataList = JSON.parse(localStorage.getItem('dataList'))
        const obj = {
          FCODE: input.value,
          AMOUNT: '',
          COST: ''
        }
        dataList.push(obj)
        localStorage.setItem('dataList', JSON.stringify(dataList))
        localStorage.setItem('fundList', fundList)
        context.emit('updateData', input.value)
        input.value = ''
      }
    }
    onMounted(() => {})
    return {
      input,
      loading,
      fundOption,
      searchFund,
      search,
      confirm
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/utils.scss";
.searchfund-c {
  width: 100%;
  overflow: hidden;
  .content {
    @include flex-box(center, center);
    width: 100%;
    margin: px2rem(10) 0;
    label {
      margin-right: px2rem(15);
      font-size: px2rem(14);
    }
    .el-select {
      width: px2rem(150);
    }
    .el-button {
      margin-left: px2rem(15);
    }
  }
}
</style>
