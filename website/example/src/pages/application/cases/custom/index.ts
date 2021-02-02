export const schema = {
  type: 'page',
  title: '测试自定义组件',
  body: {
    type: 'form',
    title: 'custom 组件',
    controls: [
      {
        type: 'text',
        name: 'test',
      },
      {
        type: 'custom',
        name: 'myName',
        label: '自定义组件',
        onMount: (dom, _, __, props) => {
          const button = document.createElement('button')
          button.innerText = '设置为123'
          button.onclick = (event) => {
            props.store.setValueByName('test', 123)
            event.preventDefault()
          }
          dom.appendChild(button)
        },
      },
    ],
  },
}
