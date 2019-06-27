// import React, { useEffect } from 'react'

// export default () => {
//   useEffect(() => {
//     layui.use(['table', 'layer'], function() {
//       const { layer, table } = layui
//       // 监听表格复选框选择
//       table.on('checkbox(demo)', function(obj) {
//         console.log(obj)
//       })
//       // 监听工具条
//       table.on('tool(demo)', function(obj) {
//         const data = obj.data
//         if (obj.event === 'detail') {
//           layer.msg('ID：' + data.id + ' 的查看操作')
//         } else if (obj.event === 'del') {
//           layer.confirm('真的删除行么', function(index) {
//             obj.del()
//             layer.close(index)
//           })
//         } else if (obj.event === 'edit') {
//           layer.alert('编辑行：<br>' + JSON.stringify(data))
//         }
//       })

//       const active: any = {
//         getCheckData() {
//           // 获取选中数据
//           const checkStatus = table.checkStatus('idTest'),
//             data = checkStatus.data
//           layer.alert(JSON.stringify(data))
//         },
//         getCheckLength() {
//           // 获取选中数目
//           const checkStatus = table.checkStatus('idTest'),
//             data = checkStatus.data
//           layer.msg('选中了：' + data.length + ' 个')
//         },
//         isAll() {
//           // 验证是否全选
//           const checkStatus = table.checkStatus('idTest')
//           layer.msg(checkStatus.isAll ? '全选' : '未全选')
//         },
//       }

//       $('.demoTable .layui-btn').on('click', function() {
//         const type = $(this).data('type')
//         active[type] ? active[type].call(this) : ''
//       })
//     })
//   })
//   return (
//     <div>
//       <div className="layui-btn-group demoTable">
//         <button className="layui-btn" data-type="getCheckData">
//           获取选中行数据
//         </button>
//         <button className="layui-btn" data-type="getCheckLength">
//           获取选中数目
//         </button>
//         <button className="layui-btn" data-type="isAll">
//           验证是否全选
//         </button>
//       </div>

//       <table
//         className="layui-table"
//         lay-data="{width: 892, height:330, url:'https://easy-mock.com/mock/5ccb7476e632d85da4a24269/api/v1/admin_user/list', page:true, id:'idTest'}"
//         lay-filter="demo"
//       >
//         <thead>
//           <tr>
//             <th lay-data="{type:'checkbox', fixed: 'left'}" />
//             <th lay-data="{field:'id', width:80, sort: true, fixed: true}">ID</th>
//             <th lay-data="{field:'username', width:80}">用户名</th>
//             <th lay-data="{field:'sex', width:80, sort: true}">性别</th>
//             <th lay-data="{field:'city', width:80}">城市</th>
//             <th lay-data="{field:'sign', width:160}">签名</th>
//             <th lay-data="{field:'experience', width:80, sort: true}">积分</th>
//             <th lay-data="{field:'classify', width:80}">职业</th>
//             <th lay-data="{field:'wealth', width:135, sort: true}">财富</th>
//             <th lay-data="{field:'score', width:80, sort: true, fixed: 'right'}">评分</th>
//             <th lay-data="{fixed: 'right', width:178, align:'center', toolbar: '#barDemo'}" />
//           </tr>
//         </thead>
//       </table>

//       <script type="text/html" id="barDemo">
//         <a className="layui-btn layui-btn-primary layui-btn-xs" lay-event="detail">
//           查看
//         </a>
//         <a className="layui-btn layui-btn-xs" lay-event="edit">
//           编辑
//         </a>
//         <a className="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">
//           删除
//         </a>
//       </script>
//     </div>
//   )
// }
