import chalk from 'chalk'
import fse from 'fs-extra'
import { execSync } from 'child_process'
import semver from 'semver'

import { dllVer, libName, libVer, ovDocDomain } from '../constants'

type InfoType = 'version'
type InfoOptions = {
  siteDir: string
}

const types = ['version']

export async function info(type: InfoType, options: InfoOptions): Promise<void> {
  switch (type) {
    case types[0]:
      printVersionInfo(options)
      break
    default:
      console.log(`Please input info type. Optional Type: ${types.join(',')}`)
  }
}

function printVersionInfo(options: InfoOptions) {
  const { siteDir } = options
  const verInfo: any = {}
  const libModuleDir = `${siteDir}/node_modules/@${libName}`

  console.log(`\n${chalk.grey('loading version info...')}`)

  const getPkgName = (pkg: string) => `@${libName}/${pkg}`

  const latestVer = execSync(`npm view @${libName}/cli version`)
    .toString()
    .replace('\n', '')

  fse.readdir(libModuleDir).then((dirs) => {
    dirs.forEach((pkg) => {
      const pkgPath = `${libModuleDir}/${pkg}/package.json`
      const version = require(pkgPath).version
      const info = {
        version,
        remark: semver.eq(libVer, version) ? '--' : `"${pkg}" ver should same as "cli".`,
      }
      verInfo[getPkgName(pkg)] = info
    })

    verInfo[getPkgName('cli')] = {
      version: libVer,
      remark: `required dll version: ${dllVer}`,
    }

    console.log(`\n${chalk.cyan('Ovine verion info:')}\n`)
    console.table(verInfo)

    if (semver.eq(libVer, latestVer)) {
      console.log(`\n${chalk.green('Ovine already up-to-date.')}\n`)
    } else {
      console.log(`\nOvine latest version: ${chalk.green(latestVer)}\n`)
    }

    if (semver.lt(libVer, latestVer) && semver.eq(semver.coerce(latestVer) || '0.0.1', latestVer)) {
      console.log(
        `${chalk.yellowBright(
          'The installed Ovine is outdate.'
        )} Please install the latest version.\n`
      )
    }

    console.log(
      `Ovine version changelog doc: ${chalk.blueBright(`${ovDocDomain}org/blog/changelog/`)}\n`
    )
  })
}
