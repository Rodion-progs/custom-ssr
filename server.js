import fs from "fs"
import path from "path"
import express from "express"
import fetch from "node-fetch"

const port = 5174;

const regexForCache = new RegExp('/character/[0-1]+');

const createServer = async (a) => {
    const app = express()
    let vite

    const cache = new Map();

    if (process.env.NODE_ENV === "development") {
        vite = await (
            await import("vite")
        ).createServer({
            server: { middlewareMode: true },
            appType: "custom",
        })
        app.use(vite.middlewares)
    } else {
        app.use((await import("compression")).default())
        app.use(
            (await import("serve-static")).default(path.resolve("dist/client"), {
                index: false,
            }),
        )
    }

    const shouldCache = (url) => {
        return regexForCache.test(url);
    }

    const getTemplate = async ({ url, next }) => {
        let template, render;

        try {
            if (process.env.NODE_ENV === "development") {
                template = fs.readFileSync(path.resolve("./index.html"), "utf-8")

                template = await vite.transformIndexHtml(url, template)

                render = (await vite.ssrLoadModule("/src/server.tsx")).render
            } else {
                template = fs.readFileSync(
                    path.resolve("dist/client/index.html"),
                    "utf-8"
                )

                render = (await import("./dist/server/server.js")).render

            }
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                vite.ssrFixStacktrace(error)
            }
            next(error)
        }

        return {
            template,
            render,
        }
    }

    const insertData = async ({ render, template, res, result, url, field }) => {

        const appHtml = await render({path: url, [field]: result});
        const data = `<script>window.__SSR_DATA__=${JSON.stringify(
            {[field]: result}
        )}</script>`

        const html = template
            .replace(`<!--ssr-outlet-->`, appHtml)
            .replace(`<!--ssr-data-->`, data)

        res.status(200).set({"Content-Type": "text/html"}).end(html);

        return html;
    }

    app.get("/", async (req, res, next) => {
        const url = req.originalUrl;

        if (cache.has(url)) {
            return res.status(200).set({"Content-Type": "text/html"}).end(cache.get(url));
        }

        try {
            const { template, render } = await getTemplate({ url, next });

            const response = await fetch(`https://rickandmortyapi.com/api/character`)
            const result = await response.json()

            const html = await insertData({ template, render, res, url, result: result.results, field: 'characters' })

            if (shouldCache(url)) {
                cache.set(url, html);
            }
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                vite.ssrFixStacktrace(error)
            }
            next(error)
        }
    })

    app.get("^/character/:id([0-9]+)", async (req, res, next) => {
        const url = req.originalUrl;

        if (cache.has(url)) {
            return res.status(200).set({"Content-Type": "text/html"}).end(cache.get(url));
        }

        try {
            const { template, render } = await getTemplate({ url, next });

            const response = await fetch(`https://rickandmortyapi.com/api/character/${req.params.id}`)
            const result = await response.json()

            const html = await insertData({ template, render, res, result, field: 'character', url });

            if (shouldCache(url)) {
                cache.set(url, html);
            }
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                vite.ssrFixStacktrace(error)
            }
            next(error)
        }
    })

    app.listen(port)
}

createServer().then(() => {
    console.log(`http://localhost:${port}`)
})
