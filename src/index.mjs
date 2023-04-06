import { resolve, dirname } from 'pathe'
import { readFileSync } from 'fs'
import { execSync } from 'child_process'
import fastGlob from 'fast-glob'

const currentFilePath = dirname(import.meta.url.replace('file://', ''))
const modulePath = resolve(currentFilePath, '..') // when-dependencies-installed module path
const packagePath = resolve(modulePath, '..', '..') // existing from node_modules to current package

// Resolving multiple package.json in monorepo
const packageJsonPaths = fastGlob.sync(`${packagePath}/**/package.json`, {
  ignore: ['**/node_modules/**'],
})

packageJsonPaths
  .forEach((packageJsonPath) => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

    const script = packageJson.scripts?.['dependenciesInstalled'] || packageJson.scripts?.['dependencies-installed']

    if (!script) { return }

    execSync(script, { cwd: dirname(packageJsonPath), stdio: 'inherit' })
  })
