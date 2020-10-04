/**
 * 历史记录相关
 *
 * TODO: 处理特殊情况的记录
 */

import { decorate, observable, action, computed, toJS } from 'mobx'

import { previewStore, initialStore } from '@/components/preview/store'
import { referenceStore } from '@/components/reference/store'

class History {
  currentFrame = 0
  stack = [{ selectedId: '' }]

  get hasPreFrame() {
    return this.currentFrame > 0
  }

  get hasNextFrame() {
    return this.currentFrame < this.stack.length - 1
  }

  get currentState() {
    return this.stack[this.currentFrame]
  }

  addFrame(frame) {
    // 如果存在 未撤销 “重做” 直接覆盖
    if (this.hasNextFrame) {
      this.stack.slice(this.currentFrame + 1, this.stack.length)
    }
    this.currentFrame += 1
    // console.log('@--->currentFrame', this.currentFrame, frame)

    this.stack.push(frame)
  }

  // 根据存储的数据设置状态
  applyFrame(frame) {
    const { selectedId, schema } = frame
    previewStore.setRawSchema(toJS(schema))

    if (selectedId === previewStore.selectedId) {
      // 如果所选的内容相同，只更新属性面板
      referenceStore.setSchema(previewStore.selectedInfo.schema)
    } else {
      previewStore.setSelectedId(selectedId || '')
    }
  }

  // 恢复初始化状态
  reset() {
    this.currentFrame = 0
    this.stack = [{ selectedId: '' }]
  }

  goBack() {
    if (this.hasPreFrame) {
      this.currentFrame -= 1
      this.applyFrame(this.currentState)
    }
  }

  goNext() {
    if (this.hasNextFrame) {
      this.currentFrame += 1
      this.applyFrame(this.currentState)
    }
  }
}

decorate(History, {
  currentFrame: observable,
  stack: observable,
  hasPreFrame: computed,
  hasNextFrame: computed,
  currentState: computed,
  addFrame: action,
  reset: action,
  goBack: action,
  goNext: action,
})

const history = new History()

export default history

if (module.hot) {
  module.hot.accept(() => {
    history.reset()
  })
}
