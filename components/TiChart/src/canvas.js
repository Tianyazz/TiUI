/// Describe canvas定义基础方法
/// Author END
/// Datetime 2024/06/28
import store from '../store/index'

class Canvas {
  constructor(ctx) {
    this.ctx = ctx
    
    const { devicePixelRatio, windowWidth } = store.state.gConfig.systemInfo
    this.dpr = devicePixelRatio
    this.width = windowWidth
    this.scale = windowWidth / 750
  }

  /**
   * 绘制圆点
   */
  fillDots(x, y, r, s, e, color = '#FFFFFF') {
    const scale = this.scale
    this.ctx.beginPath()
    this.ctx.fillStyle = color
    this.ctx.arc(x * scale, y * scale, r * scale, s, e * scale * Math.PI)
    this.ctx.strokeStyle = color
    this.ctx.stroke()
    this.ctx.fill()
  }

  /**
   * 绘制线
   * @param { Number } dashOffset 虚线偏移量
   */
  drawLine(x, y, ex, ey, color = 'white', width = 2, dashOffset = 0) {
    const scale = this.scale

    /// setLineDash 从基础库 1.9.90 开始，本接口停止维护，请使用 CanvasContext.lineDashOffset 代替
    /// lineDashOffset设置无效
    const pattern = dashOffset ? [1, 1] : []
    this.ctx.setLineDash(pattern, dashOffset)
    this.ctx.lineDashOffset = dashOffset

    this.ctx.beginPath()
    this.ctx.lineWidth = width * scale
    this.ctx.strokeStyle = color
    this.ctx.moveTo(x * scale, y * scale)
    this.ctx.lineTo(ex * scale, ey * scale)
    this.ctx.stroke()
  }

  /**
   * 绘文字
   */
  fillText(text, x, y, size, color = '#333333') {
    const scale = this.scale
    this.ctx.font = `${size * scale}px oblique antialiased PingFangSC, 'PingFang SC`
    this.ctx.fillStyle = color
    this.ctx.fillText(text, x * scale, y * scale)
  }

  /**
   * 返回文本750比例的宽度
   */
  measureText(text) {
    return this.ctx.measureText(text).width / this.scale
  }
}

export default Canvas
