import * as js from '@eslint/js'
console.log('namespace keys', Object.keys(js))
console.log('js default:', js.default)
console.log('js configs:', js.configs)
console.log('type of js.default', typeof js.default)
