<template>
  <button class="ti-button">
    <slot />
  </button>
</template>

<script setup name="TiButton">
</script>

<style lang="scss">
@import '@/static/global.scss';
.ti-button {
  height: 48rpx;
  margin: 0;
  padding: 0;
  font-size: var(--ti-font-size-sm);
  line-height: 48rpx;
  border-radius: 0;
  text-align: center;
  color: var(--ti-color-white);
  background: var(--ti-color-primary);
  border: none;
  border-radius: var(--ti-radius-xs);
  @include transition;
}
</style>
