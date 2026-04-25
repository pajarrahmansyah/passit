import { spawn } from 'node:child_process'
import path from 'node:path'

const command = process.execPath
const args = [
    path.resolve('node_modules/vitest/vitest.mjs'),
    'run',
    'tests/integration/passIt.public-url.test.ts',
]

const child = spawn(command, args, {
    stdio: 'inherit',
    env: {
        ...process.env,
        PASSIT_RUN_LIVE_TESTS: 'true',
    },
})

child.on('exit', (code) => {
    process.exit(code ?? 1)
})
