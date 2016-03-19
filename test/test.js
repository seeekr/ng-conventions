import fs from 'fs'
import process from '../lib/process'
import path from 'path'

const FILE = __dirname + '/data/simple.js'
const content = fs.readFileSync(FILE, 'utf-8')
fs.writeFileSync(FILE.replace('.js', '.GENERATED.js'), process(path.relative(__dirname, FILE), content), 'utf-8')
