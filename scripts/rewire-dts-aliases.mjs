import { promises as fs } from 'node:fs'
import path from 'node:path'

const distRoot = path.resolve('dist')

async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(
        entries.map((entry) => {
            const fullPath = path.join(dir, entry.name)
            if (entry.isDirectory()) return walk(fullPath)
            return entry.name.endsWith('.d.ts') ? [fullPath] : []
        }),
    )

    return files.flat()
}

function toImportPath(fromFile, aliasPath) {
    const targetPath = path.join(distRoot, aliasPath)
    let relativePath = path.relative(path.dirname(fromFile), targetPath)
    relativePath = relativePath.replace(/\\/g, '/')

    if (!relativePath.startsWith('.')) {
        relativePath = `./${relativePath}`
    }

    return relativePath
}

async function rewriteFile(filePath) {
    const source = await fs.readFile(filePath, 'utf8')
    const rewritten = source.replace(/(['"])@\/([^'"]+)\1/g, (_, quote, aliasPath) => {
        return `${quote}${toImportPath(filePath, aliasPath)}${quote}`
    })

    if (rewritten !== source) {
        await fs.writeFile(filePath, rewritten, 'utf8')
    }
}

const files = await walk(distRoot)
await Promise.all(files.map(rewriteFile))
