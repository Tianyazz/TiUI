<template>
  <view class="picker">
    <picker
      :mode="mode"
      :range="range"
      :range-key="rangeKey"
      :value="index"
      @change="changePicker"
    >
      <text
        :class="{ 'col-8': !seletedVal }"
      >{{ seletedVal || '请选择' }}</text>
    </picker>
  </view>
</template>

<script setup name="TPicker">
import { computed } from 'vue'
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: 'selector'
  },
  range: {
    type: Array,
    default: () => []
  },
  rangeKey: {
    type: String,
    default: ''
  },
  codeKey: {
    type: String,
    default: 'id'
  }
})

/// 判断range是否为Object Array
const rangeType = computed(() => {
  if (!props.range.length) {
    return 'object'
  }
  const type = typeof props.range[0]
  return type
})
/// 计算当前选择的位置
const index = computed(() => {
  const val = props.modelValue
  if (!val || props.range.length === 0) {
    return 0
  }
  let index = 0
  if (rangeType.value === 'string') {
    index = props.range.findIndex(item => item === val)
    return index
  }
  index = props.range.findIndex(item => item[props.codeKey] === val)
  return index
})
/// 选中的值
const seletedVal = computed(() => {
  if (props.range.length === 0 || !props.modelValue) {
    return ''
  }
  if (rangeType.value === 'string') {
    return props.range[index.value]
  }
  return props.range[index.value][props.rangeKey]
})

const emit = defineEmits(['update:modelValue'])
function changePicker(e) {
  const v = +e.detail.value
  let val = ''
  if (rangeType.value === 'string') {
    val = props.range[v] ?? ''
  } else {
    val = props.range[v][props.codeKey] ?? ''
  }
  emit('update:modelValue', val)
}
</script>
