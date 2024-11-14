import { Router, Request, Response, NextFunction } from "express"
import fetch from "node-fetch"
import { getTemplate, insertData, renderToString } from "./utils/server"
import { ViteDevServer } from "vite"
import { FileCache } from "./utils/fileCache"
import {ICharacter} from "../types.ts";

export const createRouter = (vite: ViteDevServer) => {
    console.log('2222222222222')

    const router = Router()

    // Создаем отдельные кэши для разных групп URL
    const characterCache = new FileCache('characters')
    const homeCache = new FileCache('home')

    const getCache = (url: string) => {
        if (url === '/') return homeCache
        if (url.startsWith('/character/')) return characterCache
        return null
    }

    router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        console.log('main ============')
        const url = req.originalUrl
        const cache = getCache(url)

        if (cache && await cache.has(url)) {
            const html = await cache.get(url)
            if (html) {
                res.status(200).set({"Content-Type": "text/html"}).end(html)
                return
            }
        }

        try {
            const template = await getTemplate({ url, next, vite: vite })
            const render = await renderToString({ vite: vite, next })
            const response = await fetch(`https://rickandmortyapi.com/api/character`)
            const { results } = await response.json()

            const html = insertData<ICharacter[]>({ template, render, res, url, result: results, field: 'characters', meta: { title: 'f', description: 'f' } })

            if (cache) {
                await cache.set(url, html)
            }

            res.status(200).set({ "Content-Type": "text/html" }).end(html)
        } catch (error) {
            next(error)
        }
    })

    router.get("^/characters/:id([0-9]+)", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        console.log('second ============')

        const url = req.originalUrl
        const cache = getCache(url)

        if (cache && await cache.has(url)) {
            const html = await cache.get(url);
            if (html) {
                res.status(200).set({"Content-Type": "text/html"}).end(html)
                return
            }
        }

        try {
            const template = await getTemplate({ url, next, vite: vite })
            const render = await renderToString({ vite: vite, next })
            const response = await fetch(`https://rickandmortyapi.com/api/character/${req.params.id}`)
            const results = await response.json() as ICharacter;

            const html = insertData<ICharacter>({ template, field: 'character', render, res, result: results, url, meta: {title: 'f', description: 'f'} })

            if (cache) {
                await cache.set(url, html)
            }

            return;
        } catch (error) {
            next(error)
        }
    })

    router.get("/episodes", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const url = req.originalUrl

        const html = await getTemplate({ url, next, vite: vite });
        res.status(200).set({"Content-Type": "text/html"}).end(html)

        return;

    })

    return router
}
