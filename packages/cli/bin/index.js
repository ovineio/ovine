#!/usr/bin/env node

const chalk = require('chalk')
const cli = require('commander')
const path = require('path')
const semver = require('semver')

const { build, scss, dev, dll, info } = require('../lib')
const { defaultPort } = require('../lib/constants')

const requiredVersion = require('../package.json').engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(
    chalk.red('\nMinimum node version not met :)') +
      chalk.yellow(
        `\nYou are using Node ${process.version}, Requirement: Node ${requiredVersion}.\n`
      )
  )
  process.exit(1)
}

function wrapCommand(fn) {
  return (...args) => {
    fn(...args).catch((err) => {
      console.error(chalk.red(err.stack))
      process.exitCode = 1
    })
  }
}

cli.version(require('../package.json').version).usage('<command> [options]')

cli
  .command('dev [siteDir]')
  .description('Start development server')
  .option('-p, --port <port>', 'Use specified port (default: 7050)')
  .option('--host <host>', 'Use specified host (default: localhost)')
  .option('--env <env>', 'Set app environment mode (default: localhost)')
  .option('--mock', 'Use mock environment (default: false)')
  .option('--scss', 'Update when scss file changed (default: false)')
  .option('--local-ip', 'Use local ip as host (default: false)')
  .option('--no-hot', 'Do not use webpack hot reload (default: false)')
  .option('--no-open', 'Do not open page in the browser (default: false)')
  .option('--no-dll', 'Do not use dll reference files. (default: false)')
  .action((siteDir = '.', options) => {
    const {
      port = defaultPort,
      host = 'localhost',
      env = 'localhost',
      mock = false,
      localIp = false,
      scss: scssUpdate = false,
      open = true,
      hot = true,
      dll: useDll = true,
    } = options
    wrapCommand(dev)(path.resolve(siteDir), {
      port,
      host,
      env,
      open,
      mock,
      hot,
      localIp,
      scssUpdate,
      dll: useDll,
    })
  })

cli
  .command('build [siteDir]')
  .description('Build project for deploy')
  .option('--env <env>', 'Set app environment mode (default: production)')
  .option('--mock', 'Use mock environment (default: false)')
  .option(
    '--bundle-analyzer',
    'Visualize size of webpack output files with an interactive zoomable treemap (default: false)'
  )
  .action((siteDir = '.', options) => {
    const { env = 'production', mock = false, bundleAnalyzer = false } = options
    wrapCommand(build)(path.resolve(siteDir), {
      env,
      mock,
      bundleAnalyzer,
    })
  })

cli
  .command('dll [siteDir]')
  .description('Build dll static files')
  .option('--no-hash', 'Pack all static files without hash postfix (default: false)')
  .option(
    '--bundle-analyzer',
    'Visualize size of webpack output files with an interactive zoomable treemap (default: false)'
  )
  .option(
    '--embed-assets',
    'Convert all static assets to base64 embed style files (default: false)'
  )
  .action(
    (siteDir = '.', { bundleAnalyzer = false, embedAssets = false, hash: withHash = true }) => {
      wrapCommand(dll)(path.resolve(siteDir), {
        bundleAnalyzer,
        embedAssets,
        withHash,
      })
    }
  )

cli
  .command('scss [siteDir]')
  .option('-w, --watch', 'Watch folder realtime compile (default: false)')
  .option('--verbose', 'Show all build log (default: false)')
  .description('Build scss to css files. Because amis lib use scss for styles.')
  .action((siteDir = '.', { verbose = false, watch = false }) => {
    wrapCommand(scss)(path.resolve(siteDir), { verbose, watch })
  })

cli
  .command('info <type>')
  .description('get ovine info by type. optional type: version')
  .action((infoType = '') => {
    wrapCommand(info)(infoType, {
      siteDir: path.resolve('.'),
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
