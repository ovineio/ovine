import React, { useEffect } from 'react'

export default () => {
  useEffect(() => {
    $('#tree').fancytree({
      checkbox: true,
      selectMode: 1,
      source: [
        { title: 'Node 1', key: '1' },
        {
          title: 'Folder 2',
          key: '2',
          folder: true,
          children: [
            { title: 'Node 2.1', key: '3' },
            { title: 'Node 2.2', key: '4' },
          ],
        },
        {
          title: 'Folder 2',
          key: '2',
          folder: true,
          children: [
            { title: 'Node 2.1', key: '3' },
            { title: 'Node 2.2', key: '4' },
          ],
        },
        {
          title: 'Folder 2',
          key: '2',
          folder: true,
          children: [
            { title: 'Node 2.1', key: '3' },
            { title: 'Node 2.2', key: '4' },
          ],
        },
        {
          title: 'Folder 2',
          key: '2',
          folder: true,
          children: [
            { title: 'Node 2.1', key: '3' },
            { title: 'Node 2.2', key: '4' },
          ],
        },
        {
          title: 'Folder 2',
          key: '2',
          folder: true,
          children: [
            { title: 'Node 2.1', key: '3' },
            { title: 'Node 2.2', key: '4' },
          ],
        },
        {
          title: 'Folder 2',
          key: '2',
          folder: true,
          children: [
            { title: 'Node 2.1', key: '3' },
            { title: 'Node 2.2', key: '4' },
          ],
        },
        {
          title: 'Folder 2',
          key: '2',
          folder: true,
          children: [
            { title: 'Node 2.1', key: '3' },
            { title: 'Node 2.2', key: '4' },
          ],
        },
        {
          title: 'Folder 2',
          key: '2',
          folder: true,
          children: [
            { title: 'Node 2.1', key: '3' },
            { title: 'Node 2.2', key: '4' },
          ],
        },
      ],
      // activate(event: any, data: any) {
      //   const { node } = data
      //   if (!$.isEmptyObject(node.data)) {
      //     alert(`custom node data: ${JSON.stringify(node.data)}`)
      //   }
      // },
    })
  }, [])

  return <div id="tree" data-type="json" />
}
