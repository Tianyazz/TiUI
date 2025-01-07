<template>
  <view class="form">
    <slot />
  </view>
</template>

<script setup name="Form">
import { ref, reactive, provide, toRefs } from 'vue'
import { formContextKey, formItemValidateKey } from './tokens'
const props = defineProps({
  model: {
    type: Object,
    default: () => {}
  },
  rules: {
    type: Object,
    default: () => {}
  },
})

provide(
  formContextKey,
  reactive({
    ...toRefs(props)
  })
)

/// 添加子组件自定义校验规则验证函数
const formItemsValidate = ref([])
const registerValidate = (validateFn) => {
  if (typeof validateFn !== 'function') {
    return
  }
  formItemsValidate.value.push(validateFn)
}
provide(formItemValidateKey, registerValidate)

const emit = defineEmits(['update:rules'])

/// 对整个表单进行验证
const validate = () => {
  let flag = true
  const rules = Object.entries(props.rules).filter(item => item[1].required)
  for (let [key, rule] of rules) {
    const val = props.model[key]
    let errState = false
    let errorMsg = ''
    if (val === '' || (Array.isArray(val) && val.length === 0)) {
      flag = false
      errState = true
      errorMsg = rule.message
    } else if (rule.validator) {
      const { status, error } = rule.validator(val)
      if (!status) {
        flag = false
        errState = true
        errorMsg = error
      }
    }
    updateRulesError(key, errState, errorMsg)
  }

  /// 验证数组形式的表单规则
  formItemsValidate.value.forEach(validateFn => {
    const state = validateFn()
    if (!state) {
      flag = state
    }
  })
  return flag
}
/// 更新验证规则错误信息状态
const updateRulesError = (key, state, errorMsg) => {
  const rules = props.rules
  rules[key].showError = state
  rules[key].message = errorMsg
  emit('update:rules', rules)
}

defineExpose({
  validate
})
</script>

<style lang="scss" scoped>
.form {
  padding: 25rpx 25rpx 5rpx;
  background: var(--ti-color-white);
  border-radius: var(--ti-radius-md);
  box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, .08);
}
</style>