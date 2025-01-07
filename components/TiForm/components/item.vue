<template>
  <view :class="['form-item', { error: verifyStatus?.showError }]">
    <view :class="[arrange === 'row' ? 'cross-center' : '']">
      <view
        v-if="label"
        :class="['title', { 'required': verifyStatus?.required || isRequired }]"
        :style="labelWidthStyle"
      >{{ label }}</view>
      <view :class="[arrange === 'row' ? 'box-grow-1' : '']">
        <slot />
      </view>
    </view>
    <view v-if="remark" class="form-remark">{{ remark }}</view>
    <view :class="[isTip ? 'tip' : 'no-tip']">
      <text class="txt">{{ verifyStatus?.message }}</text>
    </view>
  </view>
</template>

<script setup name="Form">
import { ref, inject, computed, onMounted } from 'vue'
import { formContextKey, formItemValidateKey } from './tokens'
import _ from 'lodash'
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  labelWidth: {
    type: [String, Number],
    default: '140'
  },
  arrange: {
    type: String,
    default: 'column'
  },
  prop: {
    type: String,
    default: ''
  },
  remark: {
    type: Boolean,
    default: false
  },
  rule: {
    type: [Object, null],
    default: null
  },
  isTip: {
    type: Boolean,
    default: true
  },
  isRequired: { /// 当我不需要校验任然想要显示必填符号时的参数
    type: Boolean,
    default: false
  }
})

const formContext = inject(formContextKey, {})

const registerValidate = inject(formItemValidateKey)

const labelWidthStyle = computed(() => {
  if (!props.labelWidth || props.arrange === 'column') {
    return ''
  }
  return `width: ${props.labelWidth}rpx`
})

/// 校验规则
const itemRule = ref(props.rule)
const verifyStatus = computed(() => {
  if (itemRule.value) {
    return itemRule.value
  }
  const rule = formContext?.rules
  if (!rule || !props.prop) {
    return ''
  }
  return rule[props.prop]
})

function validate() {
  const rule = props.rule
  if (!rule || !props.prop || !rule.required) {
    return true
  }
  let flag = true
  let errState = false
  let errorMsg = ''
  const val = _.get({ ...formContext?.model }, props.prop)
  if (val === '' || !val || (Array.isArray(val) && val.length === 0)) {
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
  updateRulesError(errState, errorMsg)
  return flag
}

/// 更新验证规则错误信息状态
function updateRulesError(state, errorMsg) {
  const rule = props.rule
  rule.showError = state
  rule.message = errorMsg
  itemRule.value = { ...rule }
}

onMounted(() => {
  if (registerValidate && props.rule) {
    registerValidate(validate)
  }
})
</script>

<style lang="scss">
.form-item {
  margin-bottom: 10rpx;
  .title {
    margin-bottom: 10rpx;
    line-height: 40rpx;
    font-weight: 500;
    &.required {
      &::before {
        content: "*";
        margin-right: 8rpx;
        color: var(--ti-color-red);
      }
    }
  }
  .cross-center {
    .title {
      margin-bottom: 0;
      margin-right: 20rpx;
      text-align: right;
    }
  }
  .tip {
    margin-top: 10rpx;
    height: 30rpx;
    font-size: 24rpx;
    line-height: 30rpx;
    color: var(--ti-color-error);
    .txt {
      display: none;
    }
  }
  &.error {
    .tip {
      .txt {
        display: block;
      }
    }
  }
  .no-tip {
    height: 20rpx;
    .txt {
      display: none;
    }
  }
}
</style>