import express from 'express'
import {fileURLToPath} from 'url'
import {dirname} from 'path'
import {rollup} from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import chalk from 'chalk'

process.chdir(dirname(fileURLToPath(import.meta.url)))
const staticFilesRegExp = /.+\..+/

const app = express()

app.set('view engine', 'ejs')
app.set('views', './entrypoints')
app.use(express.static('.'))
app.use(async (request, __, next) => {
  if (!staticFilesRegExp.test(request.path)) {
    console.info(chalk.blue('\nbuilding client...'))

    try {
      const bundle = await rollup({
        input: './src/index.js',
        plugins: [commonjs(), nodeResolve()],
        treeshake: {
          moduleSideEffects: false,
        },
      })

      await bundle.write({
        format: 'es',
        name: 'bundle',
        file: 'dist/native-example-app.js',
        sourcemap: true,
      })
    } catch (e) {
      console.error(chalk.red(`\nbuilding client failed because of\n${e}`))
      return next()
    }

    console.info(chalk.green('built client successfully'))
  }

  return next()
})

app.route('*').get((_, response) => response.render('index'))

app.listen(3001, () => console.info(chalk.blue('Native Example app started on http://localhost:3001')))
