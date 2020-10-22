/**
 * 历史记录相关
 *
 * TODO: 处理特殊情况的记录
 */

import { editorStore } from './editor'
import { rootStore } from './root'

export class History {
  currentFrame = -1

  stack = []

  setHistoryStatus() {
    rootStore.setHistoryStatus({
      prev: this.hasPreFrame(),
      next: this.hasNextFrame(),
    })
  }

  hasPreFrame() {
    return this.currentFrame > 0
  }

  hasNextFrame() {
    return this.currentFrame < this.stack.length - 1
  }

  currentState() {
    return this.stack[this.currentFrame]
  }

  addFrame(frame) {
    // 如果存在 未撤销 “重做” 直接覆盖
    if (this.hasNextFrame()) {
      this.stack.slice(this.currentFrame + 1, this.stack.length)
    }
    this.currentFrame += 1
    // console.log('@--->currentFrame', this.currentFrame, frame)

    this.stack.push(frame)
    this.setHistoryStatus()
  }

  // 根据存储的数据设置状态
  applyFrame(frame) {
    editorStore.rawUpdateSchema(frame)
    this.setHistoryStatus()
  }

  // 恢复初始化状态
  reset() {
    this.currentFrame = 0
    this.stack = []
  }

  goBack() {
    if (this.hasPreFrame()) {
      this.currentFrame -= 1
      this.applyFrame(this.currentState())
    }
  }

  goNext() {
    if (this.hasNextFrame()) {
      this.currentFrame += 1
      this.applyFrame(this.currentState())
    }
  }
}

export const history = new History()
