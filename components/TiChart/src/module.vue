<template>
  <view class="device-statistics-module">
    <easy-chart
      ref="easyChart"
      id="easyChart"
      width="346"
      height="180"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import easyChart from './deviceStatisticsChart.vue'

const easyChart = ref()
function initChart() {
  const xData = [1, 2, 3, 4, 5, 6, 7]
  const yData = [10, 20, 30, 22, 43, 31, 24]
  const options = {
    colors: ['#2890FB'],
    grid: {
      top: 20,
      right: 20,
      bottom: 0,
      left: 0
    },
    /// x轴配置项
    xAxis: {
      show: true,
      axisText: {
        color: '',
        fontSize: 12,
      },
      axisLine: {
        width: 1,
      },
      grid: {
        show: false
      },
      position: {
        bottom: 30,
        left: 40,
      },
      data: xData
    },
    yAxis: {
      yxisText: {
        fontSize: 12,
      },
      yxisLine: {
        lineShow: false,
      },
      position: {
        bottom: 30,
        left: 40,
      },
    },
    series: {
      name: '',
      lineStyle: {
        width: 2
      },
      textStyle: {
        textShow: false,
      },
      data: yData
    }
  }
  easyChart.value.initChart(options)
}
</script>

<style lang="scss">
</style>
