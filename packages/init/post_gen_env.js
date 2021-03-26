const fse = require('fs-extra')
const glob = require('glob')
const { execSync } = require('child_process')
const chalk = require('chalk')

const execPostGenEnv = () => {
  const fileName = 'dll_entry_manifest.json'
  const manifestFile = `${__dirname}/env/.ovine/${fileName}`
  execSync(`sed -i '' 's/\\\"\\.\\.\\/\\./\\\"/g' ${manifestFile}`)

  glob(`${__dirname}/env/.ovine/static/dll/*/${fileName}`, (err, files) => {
    if (err || !files.length) {
      console.error(`\npost gen env error.\n`, err)
      return
    }
    fse.copyFileSync(manifestFile, files[0])

    console.log(chalk.green(`\nPost gen env success.\n`))
  })
}

execPostGenEnv()
