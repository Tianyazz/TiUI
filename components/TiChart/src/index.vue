<!-- 图表 2024-06-25 END -->
<template>
  <view class="chart">
    <canvas
      type="2d"
      :id="id"
      class="line-chart"
      :style="heightStyle"
    ></canvas>
  </view>
</template>

<script setup name="TiChart">
import { ref, computed, getCurrentInstance } from 'vue'
import Canvas from './canvas'

const props = defineProps({
  id: {
    type: String,
    default: 'line'
  },
  width: {
    type: Number,
    default: 710
  },
  height: {
    type: Number,
    default: 380
  },
})
/// 默认配置项
const defaultOptions = {
  id: '#line',
  /// 折线图颜色
  colors: ['#EB640A', '#2890FB'],
  /// 图例组件
  legend: {
    show: false,
    height: 65,
    iconWidth: 52,
    spaceBetween: 60,
    fontSize: 24,
  },
  /// 图表边缘
  grid: {
    top: 12,
    right: 12,
    bottom: 0,
    left: 0
  },
  /// x轴配置项
  xAxis: {
    show: true,
    axisText: {
      color: '',
      fontSize: 24,
    },
    axisLine: {
      width: 1,
      lineShow: true,
      lineColor: '#DADADA',
    },
    grid: {
      show: true
    },
    position: {
      top: 0,
      bottom: 40,
      left: 60,
    },
    data: []
  },
  /// y轴配置项
  yAxis: {
    yxisText: {
      color: '',
      fontSize: 24,
    },
    yxisLine: {
      width: 1,
      lineShow: false,
      lineColor: '#DADADA',
    },
    position: {
      top: 0,
      right: 0,
      bottom: 40,
      left: 60,
    },
    grid: {
      gridShow: true,
      gridWidth: 1,
      scale: 5,
      number: 5,
      lineStyle: 'line'
    },
  },
  /// 折线图配置项
  series: {
    name: '',
    lineStyle: {
      width: 2
    },
    textStyle: {
      textShow: true,
      color: '',
      fontSize: 24
    },
    data: []
  }
}

const cvs = ref(null)
const ctx = ref(null)
const canvas = ref(null)
/// 图表最大值
const maxYValue = ref(0)
/// 图表最小值
const minYValue = ref(0)
/// 动画配置项
const animateOption = ref([])
/// 图表配置项
const options = ref({})

const heightStyle = computed(() => {
  return `height: ${props.height}rpx`
})


function deepMerge(target, source) {
  if (typeof source !== 'object' || source === null) {
    return source
  }
  if (typeof target !== 'object' || target === null) {
    return source
  }
  const obj = {}
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      obj[key] = target[key]
    }
  }
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (key === 'series' && Array.isArray(source[key])) {
        const arr = []
        for (let i = 0; i < source[key].length; i++) {
          const targetObj = Array.isArray(target[key]) ? target[key][i] : target[key]
          arr.push(deepMerge(targetObj, source[key][i]))
        }
        obj[key] = arr
      } else {
        obj[key] = Array.isArray(source[key]) ? source[key] : deepMerge(target[key], source[key])
      }
    }
  }
  return obj
}

const internalInstance = getCurrentInstance()

function initChart(options) {
  options.value = deepMerge(defaultOptions, options)
  resetAnimate()

  const query = uni.createSelectorQuery().in(internalInstance)
  query.select(`#${props.id}`)
    .fields({
      node: true,
      size: true
    })
    .exec(async (res) => {
      const canvas = res[0].node
      if (!canvas) {
        return
      }
      canvas.value = canvas
      ctx.value = canvas.getContext('2d')
      cvs.value = new Canvas(ctx.value)
      const { width, height } = res[0]
      canvas.width = width * cvs.value.dpr
      canvas.height = height * cvs.value.dpr
      ctx.value.textAlign = 'center'
      ctx.value.scale(cvs.value.dpr, cvs.value.dpr)
      calcMaxAndMinYValue()
      drawLegend()
      drawXAxis()
      drawYAxis()
      drawLineChart()
    })
}

function drawLegend() {
  if (!options.value.legend.show) {
    return
  }
  const { colors, series } = options.value
  const { top, right, left } = options.value.grid
  const { height, iconWidth, spaceBetween, fontSize } = options.value.legend

  const seriesData = Array.isArray(series) ? series : [series]

  const legendWidths = seriesData.map(element => (Math.ceil(cvs.value.measureText(element.name)) + iconWidth + 8))
  const numLegendWidth = legendWidths.reduce((prev, cur) => (prev + cur))
  const xAxisWidth = props.width - left - right
  const legendLeft = (xAxisWidth - numLegendWidth - (seriesData.length - 1) * spaceBetween) / 2 + left
  seriesData.forEach((element, index) => {
    const y = top + height / 2
    ctx.value.textAlign = 'left'
    ctx.value.textBaseline = 'middle'
    const arr = legendWidths.slice(0, index)
    const l = index === 0 ? 0 : arr.reduce((prev, cur) => (prev + cur))
    const x = legendLeft + index * spaceBetween + l
    const textX = x + iconWidth + 8
    cvs.value.fillText(element.name, textX, y, fontSize)

    cvs.value.drawLine(x, y, x + iconWidth, y, colors[index])

    cvs.value.fillDots(x + iconWidth / 2, y, 7, 0, 2 * Math.PI, colors[index])
    cvs.value.fillDots(x + iconWidth / 2, y, 5, 0, 2 * Math.PI)
  })
}

/// 绘制X轴
function drawXAxis() {
  const { left, bottom } = options.value.xAxis.position
  const { lineColor, lineShow, width } = options.value.xAxis.axisLine
  const { fontSize } = options.value.xAxis.axisText
  const ex = props.width - options.value.grid.right
  const y = props.height - bottom
  lineShow && cvs.value.drawLine(left, y, ex, y, lineColor, width)

  const { data, grid } = options.value.xAxis
  ctx.value.textAlign = 'left'
  ctx.value.textBaseline = 'middle'
  const ty = y + fontSize / 2 + 6
  const firstXText = data[0] || 0
  cvs.value.fillText(firstXText, left, ty, fontSize)
  const lastXText = data[data.length - 1] || 0
  // const textEx = ex - cvs.value.measureText(lastXText)
  ctx.value.textAlign = 'right'
  cvs.value.fillText(lastXText, ex, ty, fontSize)

  if (!grid.show) {
    return
  }
  const xAxisWidth = ex - left
  const gridWidth = xAxisWidth / (data.length - 1)
  for(let i = 0; i < data.length; i++) {
    const x = parseInt(i * gridWidth + left)
    const ey = y + 6
    cvs.value.drawLine(x, y, x, ey, lineColor, width)
  }
}

function calcMaxAndMinYValue() {
  const { grid } = options.value.yAxis
  const { number } = grid
  const { series } = options.value
  const seriesData = Array.isArray(series) ? series : [series]
  const maxData = seriesData.map(element => Math.max(...element.data))
  const maxValue = Math.max(...maxData)

  const spaceMultiple = Math.ceil(maxValue / number)
  const scale = spaceMultiple < grid.scale ? spaceMultiple : grid.scale

  const minData = seriesData.map(element => Math.min(...element.data))
  const minValue = Math.min(...minData)
  if (!isFinite(maxValue) && maxValue === -Infinity) {
    maxYValue.value = 10 * number
    return 10 * number
  }

  const lcm = scale * number / gcd(scale, number)
  maxYValue.value = Math.ceil((maxValue + 1) / lcm) * lcm
  const minYValue = Math.floor((minValue - number) / lcm) * lcm 
  minYValue.value = isFinite(minValue) ?  (minYValue < 0 ? 0 : minYValue) : 0
  return maxYValue.value
}

/// 计算最大公约数
function gcd(a, b) {
  while (b !== 0) {
    let temp = b
    b = a % b
    a = temp
  }
  return a
}

/// 绘制Y轴
function drawYAxis() {
  const { left, top, bottom } = options.value.yAxis.position
  const { lineColor, lineShow, width } = options.value.yAxis.yxisLine
  const { fontSize } = options.value.yAxis.yxisText
  const legendHeight = options.value.legend.show ? options.value.legend.height : 0
  const sy = options.value.grid.top + legendHeight + top + fontSize / 2
  if (lineShow) {
    const ey = props.height - bottom
    cvs.value.drawLine(left, sy, left, ey, lineColor, width)
  }

  /// 绘制Y轴刻度值
  const { gridShow, number, gridWidth, lineStyle } = options.value.yAxis.grid

  ctx.value.textAlign = 'right'
  ctx.value.textBaseline = 'middle'
  const xAxisHeight = props.height - sy - bottom
  const gridHeight = xAxisHeight / number
  const scaleVal = (maxYValue.value - minYValue.value) / number
  for (let i = 0; i <= number; i++) {
    const y = parseInt(sy + gridHeight * (number - i))
    const ex = props.width - options.value.grid.right

    if (gridShow) {
      const dashOffset = lineStyle === 'dotted' ? 2 : 0
      cvs.value.drawLine(left, y, ex, y, lineColor, gridWidth, dashOffset)
    }
    cvs.value.fillText(scaleVal * i + minYValue.value, left - 10, y, fontSize)
  }
}

/// 绘制折线图
function drawLineChart() {
  const { colors, series } = options.value
  const seriesIsArray = Array.isArray(series)
  const seriesData = seriesIsArray ? series : [series]
  const dataArr = seriesData.map(item => {
    props.animateOption.push({
      prevCoordinateIndex: -1,
      coordinateIndex: 0,
      timer: null,
      step: 0
    })
    return item.data
  })
  const textAlignArr = seriesData.length === 1 ? [
    dataArr[0].map(() => 1)
  ] : [
    dataArr[0].map((v, i) => (v < dataArr[1][i]) ? 0 : 1),
    dataArr[1].map((v, i) => (v <= dataArr[0][i]) ? 0 : 1)
  ]
  seriesData.forEach((element, index) => {
    drawBrokenLine(element, index, colors[index], textAlignArr[index])
  })
}

function drawBrokenLine({ data, textStyle, lineStyle }, index, color, textAlign) {
  const { left } = options.value.xAxis.position
  const xAxisWidth = props.width - left - options.value.grid.right
  const gridWidth = xAxisWidth / (data.length - 1)
  
  const { top, bottom } = options.value.yAxis.position
  const { yxisText } = options.value.yAxis
  const legendHeight = options.value.legend.show ? options.value.legend.height : 0
  const chartTop = options.value.grid.top + legendHeight + top + yxisText.fontSize / 2
  const chartHeight = props.height - bottom - chartTop

  const coordinate = []
  ctx.value.textAlign = 'center'

  const { fontSize, textShow } = textStyle

  for (let i = 0; i < data.length; i++) {
    const x = parseInt(gridWidth * i + left)
    const diff = maxYValue.value - minYValue.value
    const y = parseInt(chartTop + chartHeight * (maxYValue.value - data[i]) / diff)
    const align = textAlign[i] ? 'bottom' : 'top'
    const textY = textAlign[i] ? y - 10 : y + 10
    coordinate.push({ x, y, align, textY, text: data[i] })
  }
  const { width } = lineStyle
  lineAnimate(coordinate, index, { fontSize, textShow, width, color })
}

/// 绘制动画
function lineAnimate(coordinate, index, { fontSize, textShow, width, color }) {
  if (coordinate.length === 0) {
    return
  }
  const { prevCoordinateIndex, coordinateIndex, step } = props.animateOption[index]
  const { x, y, align, textY, text } = coordinate[coordinateIndex]
  if (prevCoordinateIndex !== coordinateIndex) {
    props.animateOption[index].prevCoordinateIndex = coordinateIndex

    if (textShow && text !== 0) {
      ctx.value.textBaseline = align
      cvs.value.fillText(text, x, textY, fontSize, color)
    }
    cvs.value.fillDots(x, y, 3, 0, 2 * Math.PI, color)
  }

  const next = coordinateIndex + 1
  if (next === coordinate.length) {
    return canvas.value.cancelAnimationFrame(props.animateOption[index].timer)
  }
  const nextX = coordinate[next].x
  const nextY = coordinate[next].y
  let ex = x + step
  let ey = parseInt(y + (nextY - y) / (nextX - x) * step)
  if (ex >= nextX) {
    ex = nextX
    ey = nextY
    props.animateOption[index].step = 0
    props.animateOption[index].coordinateIndex = next
  }
  cvs.value.drawLine(x, y, ex, ey, color, width, 0)

  props.animateOption[index].timer = canvas.value.requestAnimationFrame(() => {
    props.animateOption[index].step = props.animateOption[index].step + 4
    lineAnimate.apply(null, arguments)
  })
}

function resetAnimate() {
  props.animateOption.forEach(element => {
    canvas.value.cancelAnimationFrame(element.timer)
  })
  props.animateOption = []
}

defineExpose({
  initChart
})
</script>

<style lang="scss" scoped>
.chart {
  .line-chart {
    width: 100%;
  }
}
</style>