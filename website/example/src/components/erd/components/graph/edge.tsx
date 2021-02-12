import { Edge } from 'butterfly-dag'

export class PointEdge extends Edge {
  draw(this, obj) {
    const { id } = this.options
    const path = super.draw(obj)

    const handler = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const $handler = $(handler)
    $handler.addClass('butterflies-link-event-handler point-path-handler')
    $(path).addClass('point-path')

    handler.dataset.id = id

    this.eventHandlerDom = handler

    return path
  }

  drawLabel(this) {
    const div = document.createElement('div')

    if (!this.id) {
      this.id = String(Number(new Date()))
    }

    div.id = `edge_label_${this.id}`
    div.className = 'butterflies-label'

    return div
  }

  drawArrow(isShow) {
    const arrow = super.drawArrow(isShow)
    $(arrow).addClass('point-arrow')
    return arrow
  }
}
