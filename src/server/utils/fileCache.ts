import fs from 'fs/promises'
import path from 'path'

export class FileCache {
    private basePath: string

    constructor(cacheDir: string) {
        this.basePath = path.resolve(process.cwd(), 'cache', cacheDir)
    }

    private getFilePath(key: string): string {
        // Создаем безопасное имя файла из URL
        const safeName = key.replace(/[^a-z0-9]/gi, '_')
        return path.join(this.basePath, `${safeName}.html`)
    }

    async has(key: string): Promise<boolean> {
        try {
            await fs.access(this.getFilePath(key))
            return true
        } catch {
            return false
        }
    }

    async get(key: string): Promise<string | null> {
        try {
            return await fs.readFile(this.getFilePath(key), 'utf-8')
        } catch {
            return null
        }
    }

    async set(key: string, value: string): Promise<void> {
        try {
            await fs.mkdir(this.basePath, { recursive: true })
            await fs.writeFile(this.getFilePath(key), value, 'utf-8')
        } catch (error) {
            console.error('Cache write error:', error)
        }
    }
} 