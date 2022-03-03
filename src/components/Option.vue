<template>
  <div class="option-c">
    <div class="content">
      <el-tag size="small" @click="edit">{{ isEdit ? "完成编辑" : "编辑" }}</el-tag>
      <el-tag size="small" v-if="gate === 'false'">休市中</el-tag>
      <el-tag size="small" @click="toggleUpdate" v-else> {{ isUpdate ? "暂停更新" : "开始更新" }}</el-tag>
      <el-tag size="small" >设置</el-tag>
    </div>
    <div class="data">
      <el-tag type="success">持有收益：{{allGainSum}}</el-tag>
      <el-tag type="danger">估算收益：{{dayGainSum}}</el-tag>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
export default {
  props: {
    allGainSum: {
      type: Number,
      default: () => 0
    },
    dayGainSum: {
      type: Number,
      default: () => 0
    }
  },
  setup (props, context) {
    const isEdit = ref(false)
    const isUpdate = ref(true)
    const edit = () => {
      isEdit.value = !isEdit.value
      context.emit('edit', isEdit)
    }
    const gate = localStorage.getItem('gateState')
    const toggleUpdate = () => {
      isUpdate.value = !isUpdate.value
      context.emit('update', isUpdate)
    }
    return {
      isEdit,
      isUpdate,
      gate,
      edit,
      toggleUpdate
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/utils.scss";
.option-c {
  width: 100%;
  overflow: hidden;
  .content {
    @include flex-box(center, center);
    width: 100%;
    margin-top: px2rem(10);
    .el-tag {
      margin-right: px2rem(10);
    }
  }
  .data {
    @include flex-box(center, center);
    width: 100%;
    margin-top: px2rem(10);
    .el-tag {
      margin-right: px2rem(20);
    }
  }
}
</style>
