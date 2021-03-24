import chalk from 'chalk'
import { execSync } from 'child_process'
import figlet from 'figlet'
import fs from 'fs'
import fse from 'fs-extra'
import inquirer from 'inquirer'
import ora, { Ora } from 'ora'
import path from 'path'
import shell from 'shelljs'

let spinner: Ora = ora()
const libName = 'ovine'
const templates = ['demo', 'basic']

export async function init(rootDir: string, siteName?: string): Promise<void> {
  const useYarn = hasYarn()
  const libDir = path.resolve(__dirname, '..')

  const templatesDir = `${libDir}/templates`
  const gitChoice = 'Git Repository'
  const templateChoices = templates.concat(gitChoice)

  let name = siteName

  logBanner()

  // Prompt if siteName is not passed from CLI.
  if (!name) {
    const { name: promptedName } = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'What should we name this site?',
      default: 'admin',
    })
    name = promptedName
  }

  if (!name) {
    throw new Error(chalk.red('A site name is required'))
  }

  const dest = path.resolve(rootDir, name)
  if (fse.existsSync(dest)) {
    throw new Error(`Directory already exists at ${dest} !`)
  }

  let template = ''

  // Prompt if template is not provided from CLI.
  if (!template) {
    const { template: promptedTemplate } = await inquirer.prompt({
      type: 'list',
      name: 'template',
      message: 'Select a template below...',
      choices: templateChoices,
    })
    template = promptedTemplate
  }

  // If user choose Git repository, we'll prompt for the url.
  if (template === gitChoice) {
    const { gitRepoUrl } = await inquirer.prompt({
      type: 'input',
      name: 'gitRepoUrl',
      validate: (url?: string) => {
        if (url && isValidGitRepoUrl(url)) {
          return true
        }
        return chalk.red('Invalid repository URL')
      },
      message:
        'Enter a repository URL from GitHub, BitBucket, GitLab, or any other public repo. \n(e.g: https://github.com/ownerName/repoName.git)',
    })
    template = gitRepoUrl
  }

  if (template && isValidGitRepoUrl(template)) {
    logStartCreate(false)
    console.log(`Cloning Git template: ${chalk.cyan(template)}`)
    if (shell.exec(`git clone --recursive ${template} ${dest}`, { silent: true }).code !== 0) {
      throw new Error(chalk.red(`Cloning Git template: ${template} failed!`))
    }
  }

  if (!template || !templates.includes(template)) {
    throw new Error('Invalid template')
  }

  const { useTs } = await inquirer.prompt({
    type: 'confirm',
    name: 'useTs',
    message: 'Whether to use typescript?',
    default: false,
  })

  const { useLint } = await inquirer.prompt({
    type: 'confirm',
    name: 'useLint',
    message: 'Do you need eslint?',
    default: true,
  })

  logStartCreate(true)

  try {
    // copy basic files
    copyDirSync(`${templatesDir}/${template}`, dest, (currItem: string) => {
      const reg = useTs ? /\.tsx?$/ : /\.jsx?$/
      const isDir = currItem.indexOf('.') === -1
      const esReg = /\.[j|t]sx?$/
      return isDir || reg.test(currItem) || !esReg.test(currItem)
    })

    fs.readdirSync(`${libDir}/env`)
      .sort((a, b) => a.localeCompare(b))
      .forEach((i) => {
        if (
          // ts not copy es_**/ files
          (useTs && /^es_/.test(i)) ||
          // es not copy ts_**/ files
          (!useTs && /^ts_/.test(i)) ||
          // without eslint not copy *_constraint/** files
          (!useLint && /_constraint$/.test(i))
        ) {
          return
        }

        const srcPath = `${libDir}/env/${i}`
        const srcStat = fs.statSync(srcPath)
        if (/(_constraint|_normal)$/.test(i)) {
          copyDirSync(srcPath, dest, (currItem: string) => {
            // fixed: ".gitignore" is omit by npm registry
            return currItem === 'gitignore' ? '.gitignore' : true
          })
        } else if (srcStat.isDirectory()) {
          copyDirSync(srcPath, `${dest}/${i}`)
        } else if (srcStat.isFile()) {
          fse.copySync(srcPath, `${dest}/${i}`, {
            overwrite: true,
          })
        }
      })
  } catch (err) {
    spinner.fail(chalk.red('Copying template files failed!'))
    throw err
  }

  // Update package.json info.
  try {
    await updatePkg(`${dest}/package.json`, {
      name,
      version: '0.0.1',
      private: true,
    })
  } catch (err) {
    spinner.fail(chalk.red('Failed to update package.json'))
    throw err
  }

  const pkgManager = useYarn ? 'yarn' : 'npm'
  // Display the most elegant way to cd.
  const cdPath = path.join(process.cwd(), name) === dest ? name : path.relative(process.cwd(), name)

  spinner.succeed(chalk.green(`Success! Created ${chalk.cyan(cdPath)}`))
  console.log()
  console.log()
  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(chalk.cyan(`  ${pkgManager} ${useYarn ? '' : 'run '}start`))
  console.log('    Starts the development server.')
  console.log()
  console.log(chalk.cyan(`  ${pkgManager} ${useYarn ? '' : 'run '}build`))
  console.log('    Bundles the app into static files for production.')
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd'), cdPath)
  console.log(`  ${chalk.cyan(`${pkgManager} install`)}`)
  console.log(`  ${chalk.cyan(`${pkgManager} ${useYarn ? '' : 'run '}start`)}`)

  console.log()
  console.log('Happy hacking!')
  console.log()
}

function hasYarn(): boolean {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function isValidGitRepoUrl(gitRepoUrl: string): boolean {
  return ['https://', 'git@'].some((item) => gitRepoUrl.startsWith(item))
}

function copyDirSync(
  src: string,
  dest: string,
  handle?: (currItem: string, parentPath: string) => string | boolean
) {
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
      copyDirSync(itemPath, `${dest}/${destName}`, handle)
    } else if (stat.isFile()) {
      const destFile = `${dest}/${destName}`
      spinner.text = chalk.grey(`Created file: ${destFile}`)
      fse.copySync(itemPath, destFile, {
        overwrite: true,
      })
    }
  })
}

function logStartCreate(showSpinner: boolean) {
  const startStr = 'Creating new project...'
  console.log()
  if (showSpinner) {
    spinner = spinner.start(chalk.cyan(startStr))
  } else {
    console.log(chalk.cyan(startStr))
  }
  console.log()
}

function logBanner() {
  console.log()
  console.log(figlet.textSync(libName.toLocaleUpperCase()))
  console.log()
  console.log(chalk.blue(`Welcome to use ${libName} template builder ~`))
  console.log()
}

async function updatePkg(pkgPath: string, obj: any): Promise<void> {
  const content = await fse.readFile(pkgPath, 'utf-8')
  const pkg = JSON.parse(content)
  const newPkg = Object.assign({}, pkg, obj)

  await fse.outputFile(pkgPath, JSON.stringify(newPkg, null, 2))
}
