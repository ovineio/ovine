import saveAs from '@/assets/scripts/savefile'

export function saveLink(url: string, filename?: string) {
  const a: any = document.createElement('a')
  a.href = url
  a.target = '_blank'
  if (filename) {
    a.download = filename
  }
  a.click()
}

export function saveFile(
  data: Blob | string,
  filename?: string,
  options?: { autoBom: boolean }
): void
export function saveFile(data: Blob | string, filename?: string, disableAutoBOM?: boolean): void
export function saveFile(...args: any[]) {
  return saveAs(...args)
}

export function saveToFile(value: string, type: string, name?: string) {
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

  saveFile(blob, name)
}
