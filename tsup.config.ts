import { defineConfig } from 'tsup'

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        'next/plugin': 'src/next/plugin.ts'
    },
    alias: {
        '@': './src',
    },
    format: ['cjs', 'esm'],
    outExtension({ format }) {
        return { js: format === 'cjs' ? '.cjs' : '.js' }
    },
    dts: false,
    clean: true,
    sourcemap: true,
    external: ['axios', 'next'],
})
