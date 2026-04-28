import { defineConfig } from 'tsup'

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        'next/plugin': 'src/next/plugin.ts'
    },
    format: ['cjs', 'esm'],
    outExtension({ format }) {
        return { js: format === 'cjs' ? '.cjs' : '.js' }
    },
    dts: true,
    clean: true,
    minify: true,
    sourcemap: true,
    external: ['axios', 'next'],
})
