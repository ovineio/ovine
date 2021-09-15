import chalk from 'chalk'
import fs from 'fs'
import fse from 'fs-extra'
import _ from 'lodash'
import ora, { Ora } from 'ora'

let spinner: Ora = ora()

export function logOra(key: string, content: string) {
  const spinnerLog: any = (spinner as any)[key]
  if (spinnerLog) {
    spinnerLog.bind(spinner)(content)
  } else {
    console.log(content)
  }
}

export function logStartCreate(showSpinner: boolean) {
  const startStr = 'Creating new project...'
  console.log()
  if (showSpinner) {
    spinner = spinner.start(chalk.cyan(startStr))
  } else {
    console.log(chalk.cyan(startStr))
  }
  console.log()

  return spinner
}

export async function updatePkg(pkgPath: string, obj: any): Promise<void> {
  const content = await fse.readFile(pkgPath, 'utf-8')
  const pkg = JSON.parse(content)
  const newPkg = _.defaultsDeep(obj, pkg)

  await fse.outputFile(pkgPath, JSON.stringify(newPkg, null, 2))
}

type CopyDirSyncOpts = {
  src: string
  dest: string
  showLog?: boolean
  handle?: (currItem: string, parentPath: string) => string | boolean
}

export function copyDirSync(options: CopyDirSyncOpts) {
  const { src, dest, handle, showLog = false } = options
  fse.ensureDirSync(dest)
  fs.readdirSync(src).forEach((item) => {
    const itemPath = `${src}/${item}`
    const stat = fs.statSync(itemPath)

    const handleRes = handle ? handle(item, src) : item

    if (handleRes === false) {
      return
    }

    const destName = typeof handleRes === 'string' ? handleRes : item

    if (stat.isDirectory()) {
      copyDirSync({
        src: itemPath,
        dest: `${dest}/${destName}`,
        showLog,
        handle,
      })
    } else if (stat.isFile()) {
      const destFile = `${dest}/${destName}`
      if (showLog) {
        spinner.text = chalk.grey(`Created file: ${destFile}`)
      }
      fse.copySync(itemPath, destFile, {
        overwrite: true,
      })
    }
  })
}
