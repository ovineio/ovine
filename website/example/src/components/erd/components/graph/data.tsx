// import React from 'react'
// import { Endpoint,Tips } from 'butterfly-dag';

import Node from './node'

// class BaseEndpoint extends Endpoint {
//   mounted() {
//     Tips.createTip({
//       targetDom: this.dom,
//       genTipDom: (data) => {
//         return $('<div>this is a tips</div>')[0];
//       },
//       placement: 'top'
//     });
//   }
//   draw(obj) {
//     let point = super.draw(obj);
//     $(point).addClass('purple-point');
//     return point;
//   }
// };

// const endpoints = [
//   {
//     id: 'right',
//     orientation: [1, 0],
//     pos: [0, 0.5],
//     render: () => {
//       return <div>123</div>
//     }
//   },
//   {
//     id: 'left',
//     orientation: [-1, 0],
//     pos: [0, 0.5],
//     // render: BaseEndpoint
//     render: () => {
//       return <div>123</div>
//     }
//   }
// ];

const mockData = {
  nodes: [
    {
      id: '0',
      name: 'Book--1',
      top: 264,
      left: 172,
      render: Node,
      data: {
        label: '表1',
        desc: '一堆表述',
        fields: [
          { id: '1', label: '手机号', type: '手机', sourceNodeId: '2', targetNodeId: '3' },
          { id: '4', label: '邮箱地址', type: '邮箱', sourceNodeId: '5', targetNodeId: '6' },
          { id: '7', label: '家庭住址', type: '地址', sourceNodeId: '8', targetNodeId: '9' },
        ],
      },
      // endpoints: endpoints,
    },
    {
      id: '1',
      name: 'BookPublisher',
      top: 488,
      left: 374,
      render: Node,
      data: {
        label: '表2',
        desc: '一堆表述2',
        fields: [
          {
            id: '10',
            label: '姓名',
            type: '短文本',
            sourceNodeId: '11',
            targetNodeId: '12',
          },
          {
            id: '13',
            label: '学号',
            type: '短文本',
            sourceNodeId: '14',
            targetNodeId: '15',
          },
        ],
      },
    },
  ],
  edges: [
    {
      source: '2',
      target: '12',
      sourceNode: '0',
      targetNode: '1',
      type: 'endpoint',
    },
    {
      source: '14',
      target: '18',
      sourceNode: '1',
      targetNode: '2',
      type: 'endpoint',
    },
    {
      source: '23',
      target: '9',
      sourceNode: '3',
      targetNode: '0',
      type: 'endpoint',
    },
    {
      source: '26',
      target: '18',
      sourceNode: '3',
      targetNode: '2',
      type: 'endpoint',
    },
  ],
}

export default mockData
