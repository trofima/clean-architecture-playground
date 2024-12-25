import express from 'express'
import {fileURLToPath} from 'url'
import {dirname} from 'path'
import chalk from 'chalk'

process.chdir(dirname(fileURLToPath(import.meta.url)))

const app = express()

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('.'))

app.route('*').get((_, response) => response.render('index'))

app.listen(3000, () => console.info(chalk.blue('Playground app started at http://localhost:3000/')))
