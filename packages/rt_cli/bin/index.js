#!/usr/bin/env node

const chalk = require('chalk')
const semver = require('semver')
const path = require('path')
const cli = require('commander')

const { build, theme, dev, dll } = require('../lib')
const requiredVersion = require('../package.json').engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(
    chalk.red(`\nMinimum node version not met :)`) +
      chalk.yellow(
        `\nYou are using Node ${process.version}, Requirement: Node ${requiredVersion}.\n`
      )
  )
  process.exit(1)
}

function wrapCommand(fn) {
  return (...args) =>
    fn(...args).catch((err) => {
      console.error(chalk.red(err.stack))
      process.exitCode = 1
    })
}

cli.version(require('../package.json').version).usage('<command> [options]')

cli
  .command('build [siteDir]')
  .description('Build project')
  .option(
    '--bundle-analyzer',
    'Visualize size of webpack output files with an interactive zoomable treemap (default = false)'
  )
  .action((siteDir = '.', { bundleAnalyzer }) => {
    wrapCommand(build)(path.resolve(siteDir), {
      bundleAnalyzer,
    })
  })

cli
  .command('dll [siteDir]')
  .description('Build dll static files')
  .option(
    '--bundle-analyzer',
    'Visualize size of webpack output files with an interactive zoomable treemap (default = false)'
  )
  .action((siteDir = '.', { bundleAnalyzer }) => {
    wrapCommand(dll)(path.resolve(siteDir), {
      bundleAnalyzer,
    })
  })

cli
  .command('theme <themeName> [componentName] [siteDir]')
  .description('Copy the theme files into website folder for customization.')
  .action((themeName, componentName, siteDir = '.') => {
    wrapCommand(theme)(path.resolve(siteDir), themeName, componentName)
  })

cli
  .command('dev [siteDir]')
  .description('Start development server')
  .option('-p, --port <port>', 'use specified port (default: 3000)')
  .option('-h, --host <host>', 'use specified host (default: localhost')
  .option('--no-open', 'Do not open page in the browser (default: false)')
  .action((siteDir = '.', { port, host, open }) => {
    wrapCommand(dev)(path.resolve(siteDir), {
      port,
      host,
      open,
    })
  })

cli.arguments('<command>').action((cmd) => {
  cli.outputHelp()
  console.log(`  ${chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`)}`)
  console.log()
})

cli.parse(process.argv)

if (!process.argv.slice(2).length) {
  cli.outputHelp()
}
