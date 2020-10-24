export function saveToFile(value: string, type: string, name: string) {
  const win: any = window
  let blob

  if (typeof win.Blob === 'function') {
    blob = new Blob([value], { type })
  } else {
    const BlobBuilder =
      win.BlobBuilder || win.MozBlobBuilder || win.WebKitBlobBuilder || win.MSBlobBuilder
    const bb = new BlobBuilder()
    bb.append(value)
    blob = bb.getBlob(type)
  }

  const URL = win.URL || win.webkitURL
  const bloburl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  if ('download' in anchor) {
    anchor.style.visibility = 'hidden'
    anchor.href = bloburl
    anchor.download = name
    document.body.appendChild(anchor)
    const evt = document.createEvent('MouseEvents')
    evt.initEvent('click', true, true)
    anchor.dispatchEvent(evt)
    document.body.removeChild(anchor)
  } else if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, name)
  } else {
    win.location.href = bloburl
  }
}
