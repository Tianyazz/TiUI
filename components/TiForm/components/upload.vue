<!-- 上传组件 2024-08-16 END -->
<template>
  <view :class="[custom ? 'custom-upload' : 'upload']">
    <view
      v-for="(item, index) in imgList"
      :key="index"
      class="img"
    >
      <view
        v-if="!custom"
        class="icon"
        @click="delImg(index)"
      >&#xe679;</view>
      <picture :url="item" @click="handelClickImg(index)" mode="aspectFill" />
    </view>
    <view
      :class="[imgList.length === maxLength ? 'hide' : 'upload-icon']"
      @click="chooseImage"
    >
      <view v-if="!custom" :class="icon"></view>
      <slot name="icon" />
    </view>
  </view>
</template>

<script setup name="Upload">
import { computed } from 'vue'
import api from '@/api/base'

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => []
  },
  maxLength: {
    type: Number,
    default: 1
  },
  custom: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: 'icon-add'
  }
})

const imgList = computed(() => {
  if (props.modelValue === '') {
    return []
  }
  if (typeof props.modelValue === 'string' && props.maxLength === 1) {
    return [props.modelValue]
  }
  return props.modelValue
})

const emit = defineEmits('update:modelValue')

/// 只上传一张照片时
/// 可以点击图片上传
/// 多张是打开预览
const handelClickImg = (index) => {
  if (props.maxLength !== 1) {
    previewImg(index)
    return
  }
  chooseImage()
}

const chooseImage = () => {
  let images = props.maxLength === 1 ? props.modelValue : (props.modelValue === '' ? [] : [...props.modelValue])
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    success: async data => {
      uni.showLoading({ title: '上传中...' })
      const res = await api.upload(data.tempFiles[0].tempFilePath)
      console.log('res', res)
      uni.hideLoading()
      if (props.maxLength === 1) {
        images = res[0]
      } else {
        images.push(res[0])
      }
      emit('update:modelValue', images)
    },
    fail: err => {
      console.log('fail', err)
    }
  })
}

const delImg = (index) => {
  const imgList = [...props.modelValue]
  imgList.splice(index, 1)
  emit('update:modelValue', imgList)
}

/// 预览图片
const previewImg = (index) => {
  const list = props.modelValue
  uni.previewImage({
    current: list[index], // 当前显示图片的http链接
    urls: list // 需要预览的图片http链接列表
  })
}
</script>

<style lang="scss">
@import '@/static/css/global.scss';
.upload {
  @include flexs;
  @include flex-wrap;
  .img,
  .upload-icon {
    width: 150rpx;
    height: 150rpx;
    &:not(:nth-child(4n)) {
      margin-right: 20rpx;
    }
    &:nth-child(n + 5) {
      margin-top: 20rpx;
    }
  }
  .img {
    position: relative;
    overflow: hidden;
    .icon {
      position: absolute;
      top: 5rpx;
      right: 5rpx;
      width: 30rpx;
      height: 30rpx;
      color: $uni-color-white;
      font-size: 20rpx;
      line-height: 30rpx;
      text-align: center;
      background: $uni-mask-color;
      border-radius: 15rpx;
    }
  }
  .upload-icon {
    @include flexs;
    @include align-items;
    @include justify-content;
    background: $uni-bg-color-f5;
    border: 1rpx solid $uni-bg-color-f5;
    [class*="icon-"] {
      font-size: 60rpx;
      font-weight: lighter;
      line-height: 1;
      color: $uni-text-color-grey;
      &::before {
        font-family: "iconfont";
      }
    }
    .icon-add {
      &::before {
        content: "\e6dc";
      }
    }
    .icon-upload {
      &::before {
        content: "\e77f";
      }
    }
  }
}
</style>