<template>
  <div class="index-p">
    <quotation :isUpdate="isUpdate"></quotation>
    <search-fund v-show="isEdit" @updateData="updateData"></search-fund>
    <fund-list
      :isEdit="isEdit"
      :isUpdate="isUpdate"
      :updateData="updateCode"
      @allGain="allGain"
      @dayGain="dayGain"
    ></fund-list>
    <Option
      @edit="edit"
      @update="update"
      :allGainSum="allGainSum"
      :dayGainSum="dayGainSum"
    ></Option>
  </div>
</template>
<script>
import Quotation from '@/components/Quotation.vue'
import FundList from '@/components/FundList.vue'
import Option from '@/components/Option.vue'
import SearchFund from '@/components/SearchFund.vue'
import { ref } from '@vue/reactivity'
export default {
  name: 'Index',
  components: {
    Quotation,
    FundList,
    Option,
    SearchFund
  },

  setup () {
    const isEdit = ref(false)
    const isUpdate = ref(true)
    const updateCode = ref('')
    const allGainSum = ref(0)
    const dayGainSum = ref(0)
    const edit = (e) => {
      isEdit.value = e.value
    }
    const update = (e) => {
      isUpdate.value = e.value
    }
    const updateData = (e) => {
      updateCode.value = e
    }
    const allGain = (e) => {
      allGainSum.value = e
    }
    const dayGain = (e) => {
      dayGainSum.value = e
    }
    return {
      isEdit,
      isUpdate,
      edit,
      update,
      dayGainSum,
      allGainSum,
      updateData,
      updateCode,
      allGain,
      dayGain
    }
  }
}
</script>

<style lang="scss">
</style>
