export function downloadURI(uri: string, name: string = '文件') {
  const link = document.createElement('a')
  link.download = name
  link.href = uri
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  link.remove()
}
