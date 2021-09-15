import chalk from 'chalk'
import { execSync } from 'child_process'
import figlet from 'figlet'
import fse from 'fs-extra'
import inquirer from 'inquirer'
import path from 'path'
import shell from 'shelljs'

import { createOvApp } from './create'
import { logStartCreate, logOra } from './utils'

const libName = 'ovine'
const templates = ['demo', 'basic']

export async function init(rootDir: string, siteName?: string): Promise<void> {
  const useYarn = hasYarn()
  const libDir = path.resolve(__dirname, '..')

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

  await createOvApp({
    libDir,
    template,
    name,
    useTs,
    useLint,
    dest,
    showLog: true,
  })

  const pkgManager = useYarn ? 'yarn' : 'npm'
  // Display the most elegant way to cd.
  const cdPath = path.join(process.cwd(), name) === dest ? name : path.relative(process.cwd(), name)

  logOra('succeed', chalk.green(`Success! Created ${chalk.cyan(cdPath)}`))
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

function logBanner() {
  console.log()
  console.log(figlet.textSync(libName.toLocaleUpperCase()))
  console.log()
  console.log(chalk.blue(`Welcome to use ${libName} template builder ~`))
  console.log()
}
