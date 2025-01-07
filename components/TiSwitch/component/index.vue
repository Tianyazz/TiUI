<!-- 开关 2024-08-16 END -->
<template>
  <view
    :class="['switch', { active: modelValue }]"
    @click="toggle"
  >
    <view class="i"></view>
    <label>{{ modelValue ? onLabel : offLabel }}</label>
  </view>
</template>

<script setup name="Switch">
const props = defineProps({
  modelValue: {
    type: [Number, Boolean],
    default: false
  },
  onLabel: {
    type: String,
    default: '加急'
  },
  offLabel: {
    type: String,
    default: '普通'
  },
  type: {
    type: String,
    default: 'boolean'
  }
})

const emit = defineEmits(['update:modelValue'])
function toggle() {
  let val = props.modelValue
  if (typeof val === 'number') {
    val = val ? 0 : 1
  } else {
    val = !props.modelValue
  }
  emit('update:modelValue', val)
}
</script>

<style lang="scss" scoped>
@import '@/static/global.scss';
.switch {
  @include flexs;
  @include align-items;
  height: 80rpx;
  .i {
    @include flexs;
    @include align-items;
    width: 100rpx;
    height: 50rpx;
    margin-right: 20rpx;
    border-radius: 25rpx;
    background: var(--ti-color-primary);
    @include transition;
    &::before {
      content: "";
      display: block;
      width: 42rpx;
      height: 42rpx;
      @include translate(4rpx, 0);
      background: var(--ti-color-white);
      border-radius: 25rpx;
      @include transition(all, .3s, ease-out);
    }
  }
  &.active {
    .i {
      box-shadow: 2rpx 4rpx 10rpx 0 rgba(150, 116, 74, .4) inset;
      background: var(--ti-color-red);
      &:before {
        @include translate(54rpx, 0);
      }
    }
  }
}
</style>